import { Resizable } from 're-resizable';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';

import Header from '../../components/parser-components/header/Header'
import Sidebar from '../../components/parser-components/sidebar/Sidebar'
import HandleTables from '../../components/parser-components/handletables/HandleTables'
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Queryarea = dynamic(
    () => import('../../components/parser-components/queryarea/Queryarea'),
    { ssr: false }
)

const Query = ({ filteredTables }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        fetch("https://rickandmortyapi.com/api/episode/")
            .then(res => res.json())
            .then(data => {
                setData(data.results);

                const firstItem = data.results[0];
                const columnKeys = Object.keys(firstItem);

                const dynamicColumns = columnKeys.map(key => {
                    let width = 200; // Default width for other columns
                    let name = key.charAt(0).toUpperCase() + key.slice(1); // Default column name

                    if (key === 'id') {
                        width = 50;
                        name = ''; // Empty string to hide the heading of the 'ID' column
                    }

                    return {
                        key,
                        name,
                        width
                    };
                });

                setColumns(dynamicColumns);
            });
    }, []);

    return (
        <div className='container shadow-lg m-auto p-3 rounded-lg mt-3 bg-white '>
            {/* <Header /> */}
            <div className='flex'>
                <Sidebar tables={filteredTables} />
                <div className="w-4/6">
                    <Resizable>
                        <Queryarea />
                    </Resizable>
                    <HandleTables />
                    <Resizable lockAspectRatio>
                        <DataGrid columns={columns} rows={data} />
                    </Resizable>
                </div>
            </div>

        </div>
    )
}

export default Query;
