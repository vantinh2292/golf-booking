'use client'
import './index.css'
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import { Button } from '@nextui-org/button'
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";

import styles from './page.module.css'
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';

interface Props {
    value: ConfigGolfDataOnce[],
    title: string
}

function Page_ViewTable(props: Props) {
    const configGolf = useAppSelector((state) => state.configGolfReducer.value)

    const [dataConfig, setdataConfig] = useState<ConfigGolfDataOnce[]>([])

    const columns = useMemo<MRT_ColumnDef<ConfigGolfDataOnce>[]>(
        () => [
            {
                size: 100,
                header: 'Hole',
                accessorKey: 'Name', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },

            },
            {
                size: 50,
                header: '1',
                accessorKey: '1', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '2',
                accessorKey: '2', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '3',
                accessorKey: '3', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '4',
                accessorKey: '4', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '5',
                accessorKey: '5', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '6',
                accessorKey: '6', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '7',
                accessorKey: '7', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '8',
                accessorKey: '8', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                size: 50,
                header: '9',
                accessorKey: '9', //simple accessorKey pointing to flat data
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                // Cell: ({ cell }) => (
                //     <span>${cell.getValue<number>().toLocaleString()}</span>
                // ),

            },
        ],
        [],
    );
    return (
        <div>
            <Card>
                <CardHeader className={styles.CardHeader}>
                    <p style={{ width: '100%', textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>{props.title}</p>
                </CardHeader>
                <CardBody className={styles.cardBody}>
                    <MaterialReactTable
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enablePagination={false}
                        enableSorting={false}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}

                        columns={columns}
                        data={props.value}
                        // enableRowSelection //enable some features
                        // enableColumnOrdering
                        // enableGlobalFilter={false} //turn off a feature
                        muiTableBodyRowProps={{ hover: false }}
                        muiTableHeadProps={{
                            sx: {
                                border: '3px solid rgba(81, 81, 81, 1)',
                                borderRadius: 0.2,
                                textAlign: 'center'
                            },
                        }}
                        muiTableContainerProps={{ sx: { maxHeight: '220px' } }}
                        muiTableBodyCellProps={{ sx: { height: '10px' } }}

                        muiTableBodyProps={{
                            sx: {
                                //stripe the rows, make odd rows a darker color
                                // '& tr:nth-of-type(odd)': { //:nth-child(n+6)
                                '& tr:nth-child(1)': {
                                    backgroundColor: 'yellow',
                                },
                                '& tr:nth-child(2)': {
                                    backgroundColor: 'blue',
                                },
                                '& tr:nth-child(3)': {
                                    backgroundColor: 'white',
                                },
                                '& tr:nth-child(4)': {
                                    backgroundColor: 'red',
                                },
                                '& tr:nth-child(5)': {
                                    backgroundColor: '#6c757d',
                                },
                                '& tr:nth-child(6)': {
                                    backgroundColor: '#00a6fb',
                                },



                            },
                        }}
                        enableEditing={(row) => row.index >= 6}
                        editingMode='cell'
                    />
                </CardBody>
            </Card>


        </div>

    );
}

export default Page_ViewTable;
