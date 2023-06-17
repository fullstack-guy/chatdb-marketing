import React, { useMemo } from 'react';
import ReactFlow, { useNodesState, useEdgesState, MiniMap, Controls } from 'reactflow';
import CustomNode from './CustomNode';
import dagre from 'dagre';
import 'reactflow/dist/base.css';

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
    foreignKeys?: ForeignKey[];
}

interface Database {
    [tableName: string]: Table;
}

interface Schema {
    [schemaName: string]: Database;
}

function DatabaseFlow({ dbSchema }) {

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 150; // assuming a node size, can be dynamic as well.
    const nodeHeight = 100;

    dagreGraph.setGraph({ rankdir: 'TB' });

    let nodes = [];
    let edges = [];

    for (const schema of Object.values<Database>(dbSchema)) {
        for (const [tableName, tableData] of Object.entries<Table>(schema)) {
            const columns = [];
            const foreignKeys = 'foreignKeys' in tableData ? tableData.foreignKeys : [];

            for (const [columnName, columnData] of Object.entries<TableColumn | ForeignKey[]>(tableData)) {
                if (columnName !== 'foreignKeys') {
                    columns.push({
                        name: columnName,
                        ...columnData as TableColumn
                    });
                }
            }

            nodes.push({
                id: tableName,
                type: 'custom',
                data: {
                    name: tableName,
                    columns,
                    foreignKeys
                }
            });
        }
    }

    nodes.forEach(node => {
        // Adjust these constants as necessary
        const baseNodeWidth = 300;  // The minimum width of a node
        const baseNodeHeight = 20;  // The minimum height of a node
        const columnHeight = 50;    // The height each column adds

        const columns = node.data.columns.length;

        const nodeWidth = baseNodeWidth;  // Adjust this if columns influence width
        const nodeHeight = baseNodeHeight + (columns * columnHeight);

        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });


    for (const schema of Object.values<Database>(dbSchema)) {
        for (const [tableName, tableData] of Object.entries<Table>(schema)) {
            if (tableData.foreignKeys) {
                tableData.foreignKeys.forEach((foreignKey, idx) => {
                    edges.push({
                        id: `${tableName}-${foreignKey.foreignTable}-${idx}`,
                        source: tableName,
                        target: foreignKey.foreignTable,
                    });

                    // set edge in dagre graph
                    dagreGraph.setEdge(tableName, foreignKey.foreignTable);
                });
            }
        }
    }

    dagre.layout(dagreGraph);

    nodes = nodes.map(node => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2
        };
        return node;
    });

    const [flowNodes, setNodes] = useNodesState(nodes);
    const [flowEdges, setEdges] = useEdgesState(edges);

    return (
        <div className="m-auto h-[80vh] w-full">
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                className="bg-teal-50"
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default DatabaseFlow;
