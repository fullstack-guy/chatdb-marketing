
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgtap" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."delete_secret_by_id"("secret_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM vault.decrypted_secrets WHERE id = secret_id;
END;
$$;

ALTER FUNCTION "public"."delete_secret_by_id"("secret_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."insert_schema_data"("name" "text", "secret" "text", "description" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  return vault.create_secret(secret, name, description);
end;
$$;

ALTER FUNCTION "public"."insert_schema_data"("name" "text", "secret" "text", "description" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."read_schema_data"("secret_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  secret_text text;
BEGIN
  SELECT decrypted_secret INTO secret_text 
  FROM vault.decrypted_secrets 
  WHERE id = secret_id;

  RETURN secret_text;
END;
$$;

ALTER FUNCTION "public"."read_schema_data"("secret_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."requesting_user_id"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$;

ALTER FUNCTION "public"."requesting_user_id"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."update_schema_data"("secret_id" "uuid", "new_schema" "text", "new_name" "text", "new_desc" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    result BOOLEAN;
BEGIN
    result := vault.update_secret(secret_id, new_schema, new_name, new_desc);
    RETURN result;
END;
$$;

ALTER FUNCTION "public"."update_schema_data"("secret_id" "uuid", "new_schema" "text", "new_name" "text", "new_desc" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."user_databases_tce_encrypt_secret_database_string"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
		BEGIN
		        new.database_string = CASE WHEN new.database_string IS NULL THEN NULL ELSE
			CASE WHEN new.uuid IS NULL THEN NULL ELSE pg_catalog.encode(
			  pgsodium.crypto_aead_det_encrypt(
				pg_catalog.convert_to(new.database_string, 'utf8'),
				pg_catalog.convert_to(('')::text, 'utf8'),
				new.uuid::uuid,
				NULL
			  ),
				'base64') END END;
		RETURN new;
		END;
		$$;

ALTER FUNCTION "public"."user_databases_tce_encrypt_secret_database_string"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."ask_queries" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "database_uuid" "uuid" NOT NULL,
    "user_id" "text" DEFAULT "public"."requesting_user_id"() NOT NULL,
    "total_tokens" bigint,
    "completion_tokens" integer,
    "prompt_tokens" integer,
    "total_cost" double precision
);

ALTER TABLE "public"."ask_queries" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "full_name" "text",
    "image_url" "text",
    "last_sign_in_at" "date",
    "created_at" "date",
    "updated_at" "date",
    "email_address" "text",
    "request_deleted" boolean DEFAULT false
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."clerk_users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."clerk_users_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."clerk_users_id_seq" OWNED BY "public"."users"."id";

CREATE TABLE IF NOT EXISTS "public"."paddle_subscriptions" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_active" boolean DEFAULT false,
    "next_billed_at" timestamp with time zone,
    "customer_id" "text",
    "user_id" "text",
    "plan" "text",
    "paddle_subscription_id" "text",
    "billing_cycle" "json",
    "address_id" "text",
    "canceled _at" timestamp with time zone
);

ALTER TABLE "public"."paddle_subscriptions" OWNER TO "postgres";

ALTER TABLE "public"."paddle_subscriptions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."paddle_subscriptions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE FOREIGN TABLE "public"."stripe_balance" (
    "balance_type" "text",
    "amount" bigint,
    "currency" "text",
    "attrs" "jsonb"
)
SERVER "wordbase_server"
OPTIONS (
    "object" 'balance',
    "schema" 'public'
);

ALTER FOREIGN TABLE "public"."stripe_balance" OWNER TO "postgres";

CREATE FOREIGN TABLE "public"."stripe_customers" (
    "id" "text",
    "name" "text",
    "description" "text",
    "created" timestamp without time zone,
    "attrs" "jsonb",
    "email" "text"
)
SERVER "wordbase_server"
OPTIONS (
    "object" 'customers',
    "schema" 'public'
);

ALTER FOREIGN TABLE "public"."stripe_customers" OWNER TO "postgres";

CREATE FOREIGN TABLE "public"."stripe_invoices" (
    "id" "text",
    "customer" "text",
    "subscription" "text",
    "status" "text",
    "total" bigint,
    "currency" "text",
    "period_start" timestamp without time zone,
    "period_end" timestamp without time zone,
    "attrs" "jsonb"
)
SERVER "wordbase_server"
OPTIONS (
    "object" 'invoices',
    "schema" 'public'
);

ALTER FOREIGN TABLE "public"."stripe_invoices" OWNER TO "postgres";

CREATE FOREIGN TABLE "public"."stripe_products" (
    "id" "text",
    "name" "text",
    "active" boolean,
    "default_price" "text",
    "description" "text",
    "created" timestamp without time zone,
    "updated" timestamp without time zone,
    "attrs" "jsonb"
)
SERVER "wordbase_server"
OPTIONS (
    "object" 'products',
    "schema" 'public'
);

ALTER FOREIGN TABLE "public"."stripe_products" OWNER TO "postgres";

CREATE FOREIGN TABLE "public"."stripe_subscriptions" (
    "id" "text",
    "customer" "text",
    "currency" "text",
    "current_period_start" timestamp without time zone,
    "current_period_end" timestamp without time zone,
    "attrs" "jsonb"
)
SERVER "wordbase_server"
OPTIONS (
    "object" 'subscriptions',
    "schema" 'public'
);

ALTER FOREIGN TABLE "public"."stripe_subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user_databases" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "database_string" "text",
    "user_id" "text" DEFAULT "public"."requesting_user_id"(),
    "uuid" "uuid" NOT NULL,
    "show_sample" boolean DEFAULT false
);

ALTER TABLE "public"."user_databases" OWNER TO "postgres";

ALTER TABLE "public"."user_databases" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_databases_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

ALTER TABLE "public"."ask_queries" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_queries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."user_schemas" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "text" DEFAULT "public"."requesting_user_id"(),
    "schema_data" "text",
    "title" "text" NOT NULL,
    "uuid" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL
);

ALTER TABLE "public"."user_schemas" OWNER TO "postgres";

ALTER TABLE "public"."user_schemas" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_schemas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."waitlist_email" (
    "date" timestamp with time zone DEFAULT "now"(),
    "email" "text" NOT NULL,
    "sent_email" boolean
);

ALTER TABLE "public"."waitlist_email" OWNER TO "postgres";

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "clerk_users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."paddle_subscriptions"
    ADD CONSTRAINT "paddle_subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_databases"
    ADD CONSTRAINT "user_databases_pkey" PRIMARY KEY ("id", "uuid");

ALTER TABLE ONLY "public"."user_databases"
    ADD CONSTRAINT "user_databases_uuid_key" UNIQUE ("uuid");

ALTER TABLE ONLY "public"."ask_queries"
    ADD CONSTRAINT "user_queries_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user_schemas"
    ADD CONSTRAINT "user_schemas_pkey" PRIMARY KEY ("id", "uuid");

ALTER TABLE ONLY "public"."user_schemas"
    ADD CONSTRAINT "user_schemas_uuid_key" UNIQUE ("uuid");

ALTER TABLE ONLY "public"."waitlist_email"
    ADD CONSTRAINT "waitlist_email_pkey" PRIMARY KEY ("email");

CREATE INDEX "idx_user_id" ON "public"."user_databases" USING "btree" ("user_id");

CREATE INDEX "user_id_index" ON "public"."user_schemas" USING "btree" ("user_id");

CREATE INDEX "user_queries_index_id" ON "public"."ask_queries" USING "btree" ("user_id");

ALTER TABLE ONLY "public"."ask_queries"
    ADD CONSTRAINT "ask_queries_database_uuid_fkey" FOREIGN KEY ("database_uuid") REFERENCES "public"."user_databases"("uuid") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."paddle_subscriptions"
    ADD CONSTRAINT "paddle_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."user_databases"
    ADD CONSTRAINT "user_databases_uuid_fkey" FOREIGN KEY ("uuid") REFERENCES "public"."user_schemas"("uuid") ON DELETE CASCADE;

CREATE POLICY "Authenticated Users can crud their own data" ON "public"."ask_queries" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("public"."requesting_user_id"() = "user_id"));

CREATE POLICY "Authenticated Users can crud their own data" ON "public"."user_schemas" USING (("public"."requesting_user_id"() = "user_id")) WITH CHECK (("public"."requesting_user_id"() = "user_id"));

CREATE POLICY "Authenticated users can crud their own data" ON "public"."user_databases" USING (("public"."requesting_user_id"() = "user_id")) WITH CHECK (("public"."requesting_user_id"() = "user_id"));

CREATE POLICY "Nobody can read it" ON "public"."waitlist_email" FOR SELECT USING (false);

CREATE POLICY "anyone can write" ON "public"."waitlist_email" FOR INSERT WITH CHECK (true);

ALTER TABLE "public"."ask_queries" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nobody can delete" ON "public"."waitlist_email" FOR DELETE USING (false);

ALTER TABLE "public"."user_databases" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user_schemas" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_secret_by_id"("secret_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_secret_by_id"("secret_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_secret_by_id"("secret_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."insert_schema_data"("name" "text", "secret" "text", "description" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_schema_data"("name" "text", "secret" "text", "description" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_schema_data"("name" "text", "secret" "text", "description" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."read_schema_data"("secret_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."read_schema_data"("secret_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."read_schema_data"("secret_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."requesting_user_id"() TO "service_role";

GRANT ALL ON FUNCTION "public"."update_schema_data"("secret_id" "uuid", "new_schema" "text", "new_name" "text", "new_desc" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_schema_data"("secret_id" "uuid", "new_schema" "text", "new_name" "text", "new_desc" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_schema_data"("secret_id" "uuid", "new_schema" "text", "new_name" "text", "new_desc" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."user_databases_tce_encrypt_secret_database_string"() TO "anon";
GRANT ALL ON FUNCTION "public"."user_databases_tce_encrypt_secret_database_string"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_databases_tce_encrypt_secret_database_string"() TO "service_role";

GRANT ALL ON TABLE "public"."ask_queries" TO "anon";
GRANT ALL ON TABLE "public"."ask_queries" TO "authenticated";
GRANT ALL ON TABLE "public"."ask_queries" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

GRANT ALL ON SEQUENCE "public"."clerk_users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clerk_users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clerk_users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."paddle_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."paddle_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."paddle_subscriptions" TO "service_role";

GRANT ALL ON SEQUENCE "public"."paddle_subscriptions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."paddle_subscriptions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."paddle_subscriptions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_balance" TO "anon";
GRANT ALL ON TABLE "public"."stripe_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_balance" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_customers" TO "anon";
GRANT ALL ON TABLE "public"."stripe_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_customers" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_invoices" TO "anon";
GRANT ALL ON TABLE "public"."stripe_invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_invoices" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_products" TO "anon";
GRANT ALL ON TABLE "public"."stripe_products" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_products" TO "service_role";

GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."stripe_subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."user_databases" TO "anon";
GRANT ALL ON TABLE "public"."user_databases" TO "authenticated";
GRANT ALL ON TABLE "public"."user_databases" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_databases_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_databases_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_databases_id_seq" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_queries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_queries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_queries_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_schemas" TO "anon";
GRANT ALL ON TABLE "public"."user_schemas" TO "authenticated";
GRANT ALL ON TABLE "public"."user_schemas" TO "service_role";

GRANT ALL ON SEQUENCE "public"."user_schemas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_schemas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_schemas_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."waitlist_email" TO "anon";
GRANT ALL ON TABLE "public"."waitlist_email" TO "authenticated";
GRANT ALL ON TABLE "public"."waitlist_email" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
