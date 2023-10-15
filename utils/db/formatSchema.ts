import { find } from "lodash";

type DbType = "postgres" | "mysql";

export function formatSchema(dbType: DbType, schema: any) {
  if (dbType === "postgres") {
    return schema;
  } else if (dbType === "mysql") {
    return find(schema);
  }
}
