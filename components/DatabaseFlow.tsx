import React, { useCallback, useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MiniMap, Controls } from 'reactflow';
import 'reactflow/dist/base.css';
import CustomNode from './CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

interface TableColumn {
    type: string;
    nullable: boolean;
}

interface ForeignKey {
    column: string;
    foreignTableSchema: string;
    foreignTable: string;
    foreignColumn: string;
}

interface Table {
    [columnName: string]: TableColumn | ForeignKey[];
}

interface Database {
    [tableName: string]: Table;
}

interface Schema {
    [schemaName: string]: Database;
}

function DatabaseFlow({ dbSchema }) {
    const initialNodes = useMemo(() => {
        let nodePos = 0;
        const nodes = [];
        for (const schema of Object.values(dbSchema)) {
            for (const [tableName] of Object.entries(schema)) {
                nodes.push({
                    id: tableName,
                    type: 'custom',
                    data: { name: tableName },
                    position: { x: nodePos * 200, y: nodePos * 100 },
                });
                nodePos += 1;
            }
        }
        return nodes;
    }, [dbSchema]);

    const initialEdges = useMemo(() => {
        const edges = [];
        for (const schema of Object.values(dbSchema)) {
            for (const [tableName, tableData] of Object.entries(schema)) {
                tableData.foreignKeys?.forEach((foreignKey, idx) => {
                    edges.push({
                        id: `${tableName}-${foreignKey.foreignTable}-${idx}`,
                        source: tableName,
                        target: foreignKey.foreignTable,
                    });
                });
            }
        }
        return edges;
    }, [dbSchema]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    return (
        <div className="m-auto h-[20rem] w-full xl:w-[75%]">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-teal-50"
            >
                <Controls />
            </ReactFlow>
        </div >
    );
}

export default DatabaseFlow;