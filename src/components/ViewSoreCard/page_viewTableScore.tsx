'use client'
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import { Card, CardBody, CardHeader, Input, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody } from "@nextui-org/react";
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import styles from './page.module.css'
import Button from 'react-bootstrap/Button';


interface Props {
    courseInformation: IGolfSetupCourse,
}
function Page_ViewTableScore(props: Props) {
    const [title, setTitle] = useState<string>('')
    const [data, setData] = useState<ConfigGolfDataOnce[]>([]);

    function calculateTotal(array: number[], startIndex: number, endIndex: number): number {
        let total: number = 0;
        if (endIndex == -1) endIndex = array.length - 1
        for (let i = startIndex; i <= endIndex; i++) {
            total += array[i];
        }
        return total;
    }
    useEffect(
        () => {
            setTitle(props.courseInformation.NameCourse)
        }
        , [props.courseInformation]
    );

    useEffect(
        () => {
            if (props.courseInformation) {
                let tempArr = []
                //Tee Begin
                if (props.courseInformation.NumberTeeBox >= 1) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee1.Color,
                            TextColor: props.courseInformation.Tee1.TextColor,
                            Name: props.courseInformation.Tee1.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee1.Value[0],
                            2: props.courseInformation.Tee1.Value[1],
                            3: props.courseInformation.Tee1.Value[2],
                            4: props.courseInformation.Tee1.Value[3],
                            5: props.courseInformation.Tee1.Value[4],
                            6: props.courseInformation.Tee1.Value[5],
                            7: props.courseInformation.Tee1.Value[6],
                            8: props.courseInformation.Tee1.Value[7],
                            9: props.courseInformation.Tee1.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee1.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                if (props.courseInformation.NumberTeeBox >= 2) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee2.Color,
                            TextColor: props.courseInformation.Tee2.TextColor,
                            Name: props.courseInformation.Tee2.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee2.Value[0],
                            2: props.courseInformation.Tee2.Value[1],
                            3: props.courseInformation.Tee2.Value[2],
                            4: props.courseInformation.Tee2.Value[3],
                            5: props.courseInformation.Tee2.Value[4],
                            6: props.courseInformation.Tee2.Value[5],
                            7: props.courseInformation.Tee2.Value[6],
                            8: props.courseInformation.Tee2.Value[7],
                            9: props.courseInformation.Tee2.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee2.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                if (props.courseInformation.NumberTeeBox >= 3) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee3.Color,
                            TextColor: props.courseInformation.Tee3.TextColor,
                            Name: props.courseInformation.Tee3.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee3.Value[0],
                            2: props.courseInformation.Tee3.Value[1],
                            3: props.courseInformation.Tee3.Value[2],
                            4: props.courseInformation.Tee3.Value[3],
                            5: props.courseInformation.Tee3.Value[4],
                            6: props.courseInformation.Tee3.Value[5],
                            7: props.courseInformation.Tee3.Value[6],
                            8: props.courseInformation.Tee3.Value[7],
                            9: props.courseInformation.Tee3.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee3.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                if (props.courseInformation.NumberTeeBox >= 4) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee4.Color,
                            TextColor: props.courseInformation.Tee4.TextColor,
                            Name: props.courseInformation.Tee4.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee4.Value[0],
                            2: props.courseInformation.Tee4.Value[1],
                            3: props.courseInformation.Tee4.Value[2],
                            4: props.courseInformation.Tee4.Value[3],
                            5: props.courseInformation.Tee4.Value[4],
                            6: props.courseInformation.Tee4.Value[5],
                            7: props.courseInformation.Tee4.Value[6],
                            8: props.courseInformation.Tee4.Value[7],
                            9: props.courseInformation.Tee4.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee4.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                if (props.courseInformation.NumberTeeBox >= 5) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee5.Color,
                            TextColor: props.courseInformation.Tee5.TextColor,
                            Name: props.courseInformation.Tee5.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee5.Value[0],
                            2: props.courseInformation.Tee5.Value[1],
                            3: props.courseInformation.Tee5.Value[2],
                            4: props.courseInformation.Tee5.Value[3],
                            5: props.courseInformation.Tee5.Value[4],
                            6: props.courseInformation.Tee5.Value[5],
                            7: props.courseInformation.Tee5.Value[6],
                            8: props.courseInformation.Tee5.Value[7],
                            9: props.courseInformation.Tee5.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee5.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                if (props.courseInformation.NumberTeeBox >= 5) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: props.courseInformation.Tee6.Color,
                            TextColor: props.courseInformation.Tee6.TextColor,
                            Name: props.courseInformation.Tee6.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: props.courseInformation.Tee6.Value[0],
                            2: props.courseInformation.Tee6.Value[1],
                            3: props.courseInformation.Tee6.Value[2],
                            4: props.courseInformation.Tee6.Value[3],
                            5: props.courseInformation.Tee6.Value[4],
                            6: props.courseInformation.Tee6.Value[5],
                            7: props.courseInformation.Tee6.Value[6],
                            8: props.courseInformation.Tee6.Value[7],
                            9: props.courseInformation.Tee6.Value[8],
                            TotalRound: calculateTotal(props.courseInformation.Tee6.Value, 0, 8),
                            Total: 0
                        }
                    )
                }
                //Tee End

                tempArr.push(
                    {
                        Index: 0,
                        Editable: false,
                        Color: '#6c757d',
                        TextColor: 'white',
                        Name: 'PAR',
                        HDC: '',
                        VGA: '',
                        1: props.courseInformation.PAR[0],
                        2: props.courseInformation.PAR[1],
                        3: props.courseInformation.PAR[2],
                        4: props.courseInformation.PAR[3],
                        5: props.courseInformation.PAR[4],
                        6: props.courseInformation.PAR[5],
                        7: props.courseInformation.PAR[6],
                        8: props.courseInformation.PAR[7],
                        9: props.courseInformation.PAR[8],
                        TotalRound: calculateTotal(props.courseInformation.PAR, 0, 8),
                        Total: 0
                    }
                )
                //HDC
                tempArr.push(
                    {
                        Index: 0,
                        Editable: false,
                        Color: '#6c757d',
                        TextColor: 'white',
                        Name: 'Index',
                        HDC: '',
                        VGA: '',
                        1: props.courseInformation.HDC[0],
                        2: props.courseInformation.HDC[1],
                        3: props.courseInformation.HDC[2],
                        4: props.courseInformation.HDC[3],
                        5: props.courseInformation.HDC[4],
                        6: props.courseInformation.HDC[5],
                        7: props.courseInformation.HDC[6],
                        8: props.courseInformation.HDC[7],
                        9: props.courseInformation.HDC[8],
                        TotalRound: 0,
                        Total: 0
                    }
                )
                setData(tempArr)
            }
        }
        , [props.courseInformation]
    );
    const generateHtmlTable = () => {
        return data.map((item, index) => (
            <tr
                key={'row' + index}
                style={{ backgroundColor: item.Color, color: item.TextColor }}
            >
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>{item.Name}</td>
                {/* <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 14 : 14 }}>{item.HDC}</td> */}
                {/* <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 14 : 14 }}>{item.VGA}</td> */}
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[1]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[2]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[3]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[4]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[5]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[6]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[7]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[8]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>
                    {item[9]}
                </td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>{item.Name == 'Index' ? '' : item.TotalRound}</td>
                {/* <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 20 : 14 }}>{item.Name == 'HDC' ? '' : item.Total}</td> */}
            </tr>
        ));
    };

    return (
        <div style={{
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table className="custom-table table-bordered table-responsive-md table-striped text-center overflow-x-auto w-full">
                    <thead>
                        <tr style={{}}>
                            <th className="text-center">HOLE</th>
                            {/* <th className="text-center">HDC</th> */}
                            {/* <th className="text-center">VGA</th> */}
                            <th className="text-center">1</th>
                            <th className="text-center">2</th>
                            <th className="text-center">3</th>
                            <th className="text-center">4</th>
                            <th className="text-center">5</th>
                            <th className="text-center">6</th>
                            <th className="text-center">7</th>
                            <th className="text-center">8</th>
                            <th className="text-center">9</th>
                            <th className="text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateHtmlTable()}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default Page_ViewTableScore;