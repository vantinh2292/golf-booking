'use client'
import React, { useRef, useEffect, useState } from 'react';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { Card } from 'antd';
import { useAppSelector } from '@/redux/store';

// Define the type of reportData
interface ReportData {
  title: string;
  data: Array<{ [key: string]: string | number }>;
  headers: string[];
  titleHeaders: string[];
  columnWidth: number[];
}

// Add reportData to the component's props
interface DownloadExcelProps {
  reportData: ReportData;
}

const DownloadExcel: React.FC<DownloadExcelProps> = ({ reportData }) => {
  const [pageLoaded, setPageLoaded] = useState(true);
  interface User {
    _id?: string;
    key: string;
    name: string;
    password: string;
    levelUser: number;
  }
  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: User;
    index: number;
    children: React.ReactNode;
  }
  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber style={{ textAlign: 'center' }} /> : <Input style={{ textAlign: 'center' }} />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: User) => record.key === editingKey;

  const edit = (record: Partial<User> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  type ExcelData = {
    title: string;
    data: any[]; // You might want to replace 'any' with a more specific type
    headers: any[]; // You might want to replace 'any' with a more specific type
    titleHeaders: string[];
    columnWidth: number[];
  };

  const exportExcel = (excelData: ExcelData) => {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const titleHeader = excelData.titleHeaders;
    const data = excelData.data.map(item => header.map(header => item[header]));

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');

    //Add Row and formatting
    worksheet.mergeCells('A1', 'K4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Arial',
      size: 24,
      // underline: 'single',
      bold: true,
      color: { argb: 'f02c00' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    // worksheet.mergeCells('G1:H4');
    // let d = new Date();
    // let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    // let dateCell = worksheet.getCell('G1');
    // dateCell.value = date;
    // dateCell.font = {
    //   name: 'Calibri',
    //   size: 12,
    //   bold: true
    // }
    // dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    //Add Image
    // let myLogoImage = workbook.addImage({
    //   base64: logo.imgBase64,
    //   extension: 'png',
    // });
    // worksheet.mergeCells('A1:B4');
    // worksheet.addImage(myLogoImage, 'A1:B4');

    //Blank Row 
    // worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(titleHeader);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0a58c1' },
        bgColor: { argb: '' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      cell.font = {
        name: 'Arial',
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    })

    // Adding Data with Conditional Formatting
    data.forEach(d => {
      // let row = worksheet.addRow(d);
      let row = worksheet.addRow(d);

      row.font = {
        name: 'Arial',
        size: 12
      }
      // row.border = {
      //   top: { style: 'thin' },
      //   left: { style: 'thin' },
      //   bottom: { style: 'thin' },
      //   right: { style: 'thin' },
      // };
      row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

      row.eachCell((cell, colNumber) => {
        if (colNumber < excelData.title.length) {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });
      // let sales = row.getCell(10);
      // let color = 'FF99FF99';
      // if (+sales.value < 50) {
      //   color = 'f21f41'
      // }
      // else if(+sales.value >= 50 && +sales.value < 85){
      //   color = 'FFCC00'
      // }

      // else if(+sales.value >= 85 && +sales.value < 1000){
      //   color = '13df3b'
      // }

      // sales.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: color }
      // }
    }
    );

    // // Apply styles
    // worksheet.eachRow((row, rowIndex) => {
    //   if (rowIndex > 10) {
    //     console.log(row)
    //     row.eachCell((cell) => {
    //       cell.fill = {
    //         type: 'pattern',
    //         pattern: 'solid',
    //         fgColor: { argb: 'FFFF0000' } // Red color
    //       };
    //     });
    //   }
    // });

    excelData.columnWidth.forEach((width, index) => {
      let column = worksheet.getColumn(index + 1);
      column.width = width;
      column.eachCell(cell => {
        cell.numFmt = '@'; // This sets the cell format to text
      });
    })

    worksheet.addRow([]);

    // //Footer Row
    // let footerRow = worksheet.addRow(['Chi tiết xem tại địa chỉ! ']);
    // footerRow.getCell(1).value = {
    //   hyperlink: 'http://qtpc.cpc.vn/apps/dieudo1/ttdk',
    //   text: 'Chi tiết xem tại địa chỉ này!',

    // };
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFCCFFE5' },

    // };
    // footerRow.getCell(1).border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' },
    // };

    // //Merge Cells
    // worksheet.mergeCells(`A${footerRow.number}:K${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  const [cssContent, setCssContent] = useState({ color: 'red' });
  useEffect(() => {
    try {
      setCssContent(JSON.parse(''
        //   `{
        //   "color":"blue",
        //   "font-size":"30px"
        //   }
        // `
      ))
    }
    catch {

    }

  }, []);
  const divStyle = {
    // You can add additional inline styles here if needed
  };
  ``
  return (
    <button style={{ width: '100%', height: 50 }} onClick={() => exportExcel(reportData)}>DOWNDLOAD EXCEL</button>
  )
};

export default DownloadExcel;