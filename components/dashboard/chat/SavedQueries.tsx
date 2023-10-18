import React, { useEffect, useState } from 'react';
import useSupabase from "../../../hooks/useSupabaseClient.js";

interface Query {
    id: number;
    database_uuid: string;
    query: string;
    sql: string;
}

interface SavedQueriesProps {
    database_uuid: string;
    runQuery: (query: string) => void;
}

const SavedQueries: React.FC = ({ database_uuid, runQuery }) => {
    const [queries, setQueries] = useState<Query[]>([]);
    const supabase = useSupabase();

    useEffect(() => {
        const fetchQueries = async () => {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('favorite_queries')
                .select('*')
                .eq("database_uuid", database_uuid)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching queries:', error);
            } else if (data) {
                setQueries(data);
            }
        };

        fetchQueries();
    }, [supabase]);

    return (
        <div className="flex flex-col mt-5 items-center">
            {queries.map((query) => (
                <div
                    className="relative hover:scale-105 transform transition-all duration-300 inline-flex"
                    key={query.id}
                    onClick={() => runQuery(query.sql)}
                >
                    <div className="absolute w-full h-full opacity-0 hover:opacity-100 rounded-lg transition-all duration-300 z-0"></div>
                    <div
                        className="flex-none w-full p-3 m-2 border cursor-pointer rounded-lg shadow-md relative z-10"
                        style={{ whiteSpace: 'normal', overflowWrap: 'break-word' }}
                    >
                        <h4 className="text-sm text-black text-center">{query.query}</h4>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedQueries;
