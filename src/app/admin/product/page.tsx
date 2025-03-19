"use client";

import { AgGridReact } from 'ag-grid-react';
import { use, useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Product, getMockProducts } from '@/mockData';
import { themeQuartz, iconSetQuartzBold } from 'ag-grid-community';
import EditIcon from '@mui/icons-material/Edit';

// to use myTheme in an application, pass it to the theme grid option
const myTheme = themeQuartz
    .withPart(iconSetQuartzBold)
    .withParams({
        browserColorScheme: "light",
        headerFontSize: 14
    });
// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
    const [rowData, setRowData] = useState<Product[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);

    useEffect(() => {
        const mockProducts = getMockProducts();
        setRowData(mockProducts);

        if (mockProducts.length > 0) {
            let columns = Object.keys(mockProducts[0]).map((key) => ({
                field: key,
                sortable: true,
                filter: true,
                resizable: true,
            }));

            columns = [{
                field: "Edit",
                header: "Edit",
                cellRenderer: (params) => {
                    return (
                        <EditIcon
                            style={{ color: 'gray', cursor: 'pointer' }}
                            onClick={() => handleEdit(params.data)}
                        />
                    );
                },
                sortable: false,
                filter: false,
                resizable: false,
                width: 120,
            }, ...columns]

            setColumnDefs(columns);
        }
    }, []);
    const handleEdit = (data: Product) => {
        window.open(`/admin/product/${data.id}`);
    };

    return (
        <div style={{ width: "100%", height: "100vh" }} className="ag-theme-alpine">
            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    resizable: true,
                }}
                onGridReady={(params) => {
                    params.api.sizeColumnsToFit();
                }}
                theme={myTheme}
                animateRows={true}
            />
        </div>
    );
};

export default GridComponent;