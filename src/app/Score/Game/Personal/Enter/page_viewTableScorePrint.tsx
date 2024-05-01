'use client'
import './index.css'
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import { Card, CardBody, CardHeader, Input, useDisclosure, Modal, ModalHeader, ModalContent, ModalBody } from "@nextui-org/react";
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import styles from './page.module.css'
import Button from 'react-bootstrap/Button';

import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { CellTowerRounded } from '@mui/icons-material';
import { Database } from '../../../../../../firebase';

interface Props {
    //value: ConfigGolfDataOnce[],
    luotChoi: number,
    dataConfig: GolfDataGame,
    setTitleChange: (title: string) => void,
    golfName: string,
    typeScore: string,
    numberHoles: number
}
function Page_ViewTableScorePrint(props: Props) {
    const dbRef = ref(Database);

    const [title, setTitle] = useState<string>('')
    const [data, setData] = useState<ConfigGolfDataOnce[]>([]);
    const [golfSetupCourse, setGolfSetupCourse] = useState<IGolfSetupCourse | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputCurrentHole, setInputCurrentHole] = useState<number>(0)

    const [totalRound1_Tee1, setTotalRound1_Tee1] = useState<number>(0)
    const [totalRound1_Tee2, setTotalRound1_Tee2] = useState<number>(0)
    const [totalRound1_Tee3, setTotalRound1_Tee3] = useState<number>(0)
    const [totalRound1_Tee4, setTotalRound1_Tee4] = useState<number>(0)
    const [totalRound1_Tee5, setTotalRound1_Tee5] = useState<number>(0)
    const [totalRound1_Tee6, setTotalRound1_Tee6] = useState<number>(0)
    const [totalRound1_PAR, setTotalRound1_PAR] = useState<number>(0)

    const [totalRound2_Tee1, setTotalRound2_Tee1] = useState<number>(0)
    const [totalRound2_Tee2, setTotalRound2_Tee2] = useState<number>(0)
    const [totalRound2_Tee3, setTotalRound2_Tee3] = useState<number>(0)
    const [totalRound2_Tee4, setTotalRound2_Tee4] = useState<number>(0)
    const [totalRound2_Tee5, setTotalRound2_Tee5] = useState<number>(0)
    const [totalRound2_Tee6, setTotalRound2_Tee6] = useState<number>(0)
    const [totalRound2_PAR, setTotalRound2_PAR] = useState<number>(0)

    const [totalRound3_Tee1, setTotalRound3_Tee1] = useState<number>(0)
    const [totalRound3_Tee2, setTotalRound3_Tee2] = useState<number>(0)
    const [totalRound3_Tee3, setTotalRound3_Tee3] = useState<number>(0)
    const [totalRound3_Tee4, setTotalRound3_Tee4] = useState<number>(0)
    const [totalRound3_Tee5, setTotalRound3_Tee5] = useState<number>(0)
    const [totalRound3_Tee6, setTotalRound3_Tee6] = useState<number>(0)
    const [totalRound3_PAR, setTotalRound3_PAR] = useState<number>(0)

    const [totalRound4_Tee1, setTotalRound4_Tee1] = useState<number>(0)
    const [totalRound4_Tee2, setTotalRound4_Tee2] = useState<number>(0)
    const [totalRound4_Tee3, setTotalRound4_Tee3] = useState<number>(0)
    const [totalRound4_Tee4, setTotalRound4_Tee4] = useState<number>(0)
    const [totalRound4_Tee5, setTotalRound4_Tee5] = useState<number>(0)
    const [totalRound4_Tee6, setTotalRound4_Tee6] = useState<number>(0)
    const [totalRound4_PAR, setTotalRound4_PAR] = useState<number>(0)

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
            let tempTitle = ''
            if (props.luotChoi === 1) {
                setTitle(props.dataConfig.Round1)
                tempTitle = props.dataConfig.Round1
                props.setTitleChange(tempTitle)
            }
            if (props.luotChoi === 2) {
                setTitle(props.dataConfig.Round2)
                tempTitle = props.dataConfig.Round2
                props.setTitleChange(tempTitle)
            }
            if (props.luotChoi === 3) {
                setTitle(props.dataConfig.Round3)
                tempTitle = props.dataConfig.Round3
                props.setTitleChange(tempTitle)
            }
            if (props.luotChoi === 4) {
                setTitle(props.dataConfig.Round4)
                tempTitle = props.dataConfig.Round4
                props.setTitleChange(tempTitle)
            }
            //Get Data Course
            if (tempTitle && props.golfName.length > 0) {
                if (props.dataConfig.Round1.length > 0) {
                    get(child(dbRef, "TSN/Score/GolfSetup/" + props.golfName + '/Course/' + props.dataConfig.Round1)).then((snapshot) => {
                        if (snapshot.exists()) {
                            let newData = snapshot.val();
                            setTotalRound1_Tee1(calculateTotal(newData.Tee1.Value, 0, 8))
                            setTotalRound1_Tee2(calculateTotal(newData.Tee2.Value, 0, 8))
                            setTotalRound1_Tee3(calculateTotal(newData.Tee3.Value, 0, 8))
                            setTotalRound1_Tee4(calculateTotal(newData.Tee4.Value, 0, 8))
                            setTotalRound1_Tee5(calculateTotal(newData.Tee5.Value, 0, 8))
                            setTotalRound1_Tee6(calculateTotal(newData.Tee6.Value, 0, 8))
                            setTotalRound1_PAR(calculateTotal(newData.PAR, 0, 8))
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                if (props.dataConfig.Round2.length > 0) {
                    get(child(dbRef, "TSN/Score/GolfSetup/" + props.golfName + '/Course/' + props.dataConfig.Round2)).then((snapshot) => {
                        if (snapshot.exists()) {
                            let newData = snapshot.val();
                            setTotalRound2_Tee1(calculateTotal(newData.Tee1.Value, 0, 8))
                            setTotalRound2_Tee2(calculateTotal(newData.Tee2.Value, 0, 8))
                            setTotalRound2_Tee3(calculateTotal(newData.Tee3.Value, 0, 8))
                            setTotalRound2_Tee4(calculateTotal(newData.Tee4.Value, 0, 8))
                            setTotalRound2_Tee5(calculateTotal(newData.Tee5.Value, 0, 8))
                            setTotalRound2_Tee6(calculateTotal(newData.Tee6.Value, 0, 8))
                            setTotalRound2_PAR(calculateTotal(newData.PAR, 0, 8))
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                if (props.dataConfig.Round3.length > 0) {
                    get(child(dbRef, "TSN/Score/GolfSetup/" + props.golfName + '/Course/' + props.dataConfig.Round3)).then((snapshot) => {
                        if (snapshot.exists()) {
                            let newData = snapshot.val();
                            setTotalRound3_Tee1(calculateTotal(newData.Tee1.Value, 0, 8))
                            setTotalRound3_Tee2(calculateTotal(newData.Tee2.Value, 0, 8))
                            setTotalRound3_Tee3(calculateTotal(newData.Tee3.Value, 0, 8))
                            setTotalRound3_Tee4(calculateTotal(newData.Tee4.Value, 0, 8))
                            setTotalRound3_Tee5(calculateTotal(newData.Tee5.Value, 0, 8))
                            setTotalRound3_Tee6(calculateTotal(newData.Tee6.Value, 0, 8))
                            setTotalRound3_PAR(calculateTotal(newData.PAR, 0, 8))
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }
                if (props.dataConfig.Round4.length > 0) {
                    get(child(dbRef, "TSN/Score/GolfSetup/" + props.golfName + '/Course/' + props.dataConfig.Round4)).then((snapshot) => {
                        if (snapshot.exists()) {
                            let newData = snapshot.val();
                            setTotalRound4_Tee1(calculateTotal(newData.Tee1.Value, 0, 8))
                            setTotalRound4_Tee2(calculateTotal(newData.Tee2.Value, 0, 8))
                            setTotalRound4_Tee3(calculateTotal(newData.Tee3.Value, 0, 8))
                            setTotalRound4_Tee4(calculateTotal(newData.Tee4.Value, 0, 8))
                            setTotalRound4_Tee5(calculateTotal(newData.Tee5.Value, 0, 8))
                            setTotalRound4_Tee6(calculateTotal(newData.Tee6.Value, 0, 8))
                            setTotalRound4_PAR(calculateTotal(newData.PAR, 0, 8))
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                }

                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + props.golfName + '/Course/' + tempTitle)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        setGolfSetupCourse(newData)
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
        , [props.luotChoi, props.golfName]
    );

    useEffect(
        () => {
            if (props.dataConfig.DataPlayers.length > 0 && golfSetupCourse !== null) {
                let tempArr = []
                //Tee Begin
                let isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee1.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 1 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee1.Color,
                            TextColor: golfSetupCourse.Tee1.TextColor,
                            Name: golfSetupCourse.Tee1.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee1.Value[0],
                            2: golfSetupCourse.Tee1.Value[1],
                            3: golfSetupCourse.Tee1.Value[2],
                            4: golfSetupCourse.Tee1.Value[3],
                            5: golfSetupCourse.Tee1.Value[4],
                            6: golfSetupCourse.Tee1.Value[5],
                            7: golfSetupCourse.Tee1.Value[6],
                            8: golfSetupCourse.Tee1.Value[7],
                            9: golfSetupCourse.Tee1.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee1.Value, 0, 8),
                            Total: totalRound1_Tee1 + totalRound2_Tee1 + totalRound3_Tee1 + totalRound4_Tee1
                        }
                    )
                }

                isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee2.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 2 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee2.Color,
                            TextColor: golfSetupCourse.Tee2.TextColor,
                            Name: golfSetupCourse.Tee2.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee2.Value[0],
                            2: golfSetupCourse.Tee2.Value[1],
                            3: golfSetupCourse.Tee2.Value[2],
                            4: golfSetupCourse.Tee2.Value[3],
                            5: golfSetupCourse.Tee2.Value[4],
                            6: golfSetupCourse.Tee2.Value[5],
                            7: golfSetupCourse.Tee2.Value[6],
                            8: golfSetupCourse.Tee2.Value[7],
                            9: golfSetupCourse.Tee2.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee2.Value, 0, 8),
                            Total: totalRound1_Tee2 + totalRound2_Tee2 + totalRound3_Tee2 + totalRound4_Tee2
                        }
                    )
                }

                isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee3.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 3 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee3.Color,
                            TextColor: golfSetupCourse.Tee3.TextColor,
                            Name: golfSetupCourse.Tee3.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee3.Value[0],
                            2: golfSetupCourse.Tee3.Value[1],
                            3: golfSetupCourse.Tee3.Value[2],
                            4: golfSetupCourse.Tee3.Value[3],
                            5: golfSetupCourse.Tee3.Value[4],
                            6: golfSetupCourse.Tee3.Value[5],
                            7: golfSetupCourse.Tee3.Value[6],
                            8: golfSetupCourse.Tee3.Value[7],
                            9: golfSetupCourse.Tee3.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee3.Value, 0, 8),
                            Total: totalRound1_Tee3 + totalRound2_Tee3 + totalRound3_Tee3 + totalRound4_Tee3
                        }
                    )
                }

                isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee4.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 4 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee4.Color,
                            TextColor: golfSetupCourse.Tee4.TextColor,
                            Name: golfSetupCourse.Tee4.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee4.Value[0],
                            2: golfSetupCourse.Tee4.Value[1],
                            3: golfSetupCourse.Tee4.Value[2],
                            4: golfSetupCourse.Tee4.Value[3],
                            5: golfSetupCourse.Tee4.Value[4],
                            6: golfSetupCourse.Tee4.Value[5],
                            7: golfSetupCourse.Tee4.Value[6],
                            8: golfSetupCourse.Tee4.Value[7],
                            9: golfSetupCourse.Tee4.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee4.Value, 0, 8),
                            Total: totalRound1_Tee4 + totalRound2_Tee4 + totalRound3_Tee4 + totalRound4_Tee4
                        }
                    )
                }

                isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee5.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 5 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee5.Color,
                            TextColor: golfSetupCourse.Tee5.TextColor,
                            Name: golfSetupCourse.Tee5.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee5.Value[0],
                            2: golfSetupCourse.Tee5.Value[1],
                            3: golfSetupCourse.Tee5.Value[2],
                            4: golfSetupCourse.Tee5.Value[3],
                            5: golfSetupCourse.Tee5.Value[4],
                            6: golfSetupCourse.Tee5.Value[5],
                            7: golfSetupCourse.Tee5.Value[6],
                            8: golfSetupCourse.Tee5.Value[7],
                            9: golfSetupCourse.Tee5.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee5.Value, 0, 8),
                            Total: totalRound1_Tee5 + totalRound2_Tee5 + totalRound3_Tee5 + totalRound4_Tee5
                        }
                    )
                }

                isValueInArray = props.dataConfig.DataPlayers.some(obj => obj.TeeBox === golfSetupCourse.Tee6.TeeBoxName);
                if (golfSetupCourse.NumberTeeBox >= 6 && isValueInArray) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: golfSetupCourse.Tee6.Color,
                            TextColor: golfSetupCourse.Tee6.TextColor,
                            Name: golfSetupCourse.Tee6.TeeBoxName,
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.Tee6.Value[0],
                            2: golfSetupCourse.Tee6.Value[1],
                            3: golfSetupCourse.Tee6.Value[2],
                            4: golfSetupCourse.Tee6.Value[3],
                            5: golfSetupCourse.Tee6.Value[4],
                            6: golfSetupCourse.Tee6.Value[5],
                            7: golfSetupCourse.Tee6.Value[6],
                            8: golfSetupCourse.Tee6.Value[7],
                            9: golfSetupCourse.Tee6.Value[8],
                            TotalRound: calculateTotal(golfSetupCourse.Tee6.Value, 0, 8),
                            Total: totalRound1_Tee6 + totalRound2_Tee6 + totalRound3_Tee6 + totalRound4_Tee6
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
                        1: golfSetupCourse.PAR[0],
                        2: golfSetupCourse.PAR[1],
                        3: golfSetupCourse.PAR[2],
                        4: golfSetupCourse.PAR[3],
                        5: golfSetupCourse.PAR[4],
                        6: golfSetupCourse.PAR[5],
                        7: golfSetupCourse.PAR[6],
                        8: golfSetupCourse.PAR[7],
                        9: golfSetupCourse.PAR[8],
                        TotalRound: calculateTotal(golfSetupCourse.PAR, 0, 8),
                        Total: totalRound1_PAR + totalRound2_PAR + totalRound3_PAR + totalRound4_PAR
                    }
                )

                props.dataConfig.DataPlayers.forEach((element, index) => {
                    tempArr.push(
                        {
                            Index: index,
                            Editable: true,
                            Color: 'white',
                            TextColor: 'black',
                            Name: element.NamePlayer,
                            HDC: element.HDC?.toString(),
                            VGA: element.VGA?.toString(),
                            1: element.Scores[0 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[0 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[0] : element.Scores[0 + (props.luotChoi - 1) * 9] : '',
                            2: element.Scores[1 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[1 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[1] : element.Scores[1 + (props.luotChoi - 1) * 9] : '',
                            3: element.Scores[2 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[2 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[2] : element.Scores[2 + (props.luotChoi - 1) * 9] : '',
                            4: element.Scores[3 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[3 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[3] : element.Scores[3 + (props.luotChoi - 1) * 9] : '',
                            5: element.Scores[4 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[4 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[4] : element.Scores[4 + (props.luotChoi - 1) * 9] : '',
                            6: element.Scores[5 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[5 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[5] : element.Scores[5 + (props.luotChoi - 1) * 9] : '',
                            7: element.Scores[6 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[6 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[6] : element.Scores[6 + (props.luotChoi - 1) * 9] : '',
                            8: element.Scores[7 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[7 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[7] : element.Scores[7 + (props.luotChoi - 1) * 9] : '',
                            9: element.Scores[8 + (props.luotChoi - 1) * 9] !== 0 ? props.typeScore === 'Over' ? element.Scores[8 + (props.luotChoi - 1) * 9] - golfSetupCourse.PAR[8] : element.Scores[8 + (props.luotChoi - 1) * 9] : '',
                            TotalRound: calculateTotal(element.Scores, 0 + (props.luotChoi - 1) * 9, 8 + (props.luotChoi - 1) * 9),
                            Total: calculateTotal(element.Scores, 0, -1)
                        }
                    )
                });
                for (let index = props.dataConfig.DataPlayers.length; index < 4; index++) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: true,
                            Color: 'white',
                            TextColor: 'back',
                            Name: '---',
                            HDC: '',
                            VGA: '',
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            TotalRound: 0,
                            Total: 0,
                        }
                    )
                }

                //HDC
                if (props.numberHoles == 9) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: '#6c757d',
                            TextColor: 'white',
                            Name: 'Index',
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.HDC[0],
                            2: golfSetupCourse.HDC[1],
                            3: golfSetupCourse.HDC[2],
                            4: golfSetupCourse.HDC[3],
                            5: golfSetupCourse.HDC[4],
                            6: golfSetupCourse.HDC[5],
                            7: golfSetupCourse.HDC[6],
                            8: golfSetupCourse.HDC[7],
                            9: golfSetupCourse.HDC[8],
                            TotalRound: 0,
                            Total: 0
                        }
                    )
                }
                if (props.numberHoles > 9 && props.luotChoi % 2 == 1) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: '#6c757d',
                            TextColor: 'white',
                            Name: 'Index',
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.HDC[0] * 2 - 1,
                            2: golfSetupCourse.HDC[1] * 2 - 1,
                            3: golfSetupCourse.HDC[2] * 2 - 1,
                            4: golfSetupCourse.HDC[3] * 2 - 1,
                            5: golfSetupCourse.HDC[4] * 2 - 1,
                            6: golfSetupCourse.HDC[5] * 2 - 1,
                            7: golfSetupCourse.HDC[6] * 2 - 1,
                            8: golfSetupCourse.HDC[7] * 2 - 1,
                            9: golfSetupCourse.HDC[8] * 2 - 1,
                            TotalRound: 0,
                            Total: 0
                        }
                    )
                }
                if (props.numberHoles > 9 && props.luotChoi % 2 == 0) {
                    tempArr.push(
                        {
                            Index: 0,
                            Editable: false,
                            Color: '#6c757d',
                            TextColor: 'white',
                            Name: 'Index',
                            HDC: '',
                            VGA: '',
                            1: golfSetupCourse.HDC[0] * 2,
                            2: golfSetupCourse.HDC[1] * 2,
                            3: golfSetupCourse.HDC[2] * 2,
                            4: golfSetupCourse.HDC[3] * 2,
                            5: golfSetupCourse.HDC[4] * 2,
                            6: golfSetupCourse.HDC[5] * 2,
                            7: golfSetupCourse.HDC[6] * 2,
                            8: golfSetupCourse.HDC[7] * 2,
                            9: golfSetupCourse.HDC[8] * 2,
                            TotalRound: 0,
                            Total: 0
                        }
                    )
                }
                setData(tempArr)
            }
        }
        , [golfSetupCourse, props.dataConfig, props.typeScore]
    );
    const generateHtmlTable = () => {
        return data.map((item, index) => (
            <tr
                key={'row' + index}
                // className="custom-row"
                style={{ backgroundColor: item.Color, color: item.TextColor }}
            >
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Name}</td>
                {/* <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 14 : 14 }}>{item.HDC}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 14 : 14 }}>{item.VGA}</td> */}
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[1]}</div>
                    : item[1] === 0 ? '' : item[1]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[2]}</div>
                    : item[2] === 0 ? '' : item[2]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[3]}</div>
                    : item[3] === 0 ? '' : item[3]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[4]}</div>
                    : item[4] === 0 ? '' : item[4]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[5]}</div>
                    : item[5] === 0 ? '' : item[5]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[6]}</div>
                    : item[6] === 0 ? '' : item[6]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[7]}</div>
                    : item[7] === 0 ? '' : item[7]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[8]}</div>
                    : item[8] === 0 ? '' : item[8]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Editable ?
                    <div style={{ fontSize: 16 }}
                    >{item[9]}</div>
                    : item[9] === 0 ? '' : item[9]}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Name == 'HDC' ? '' : item.TotalRound === 0 ? '' : item.TotalRound}</td>
                <td className="pt-3-half text-black" style={{ fontSize: item.Editable ? 16 : 14 }}>{item.Name == 'HDC' ? '' : item.Total === 0 ? '' : item.Total}</td>
            </tr>
        ));
    };

    return (
        <div style={{
            justifyContent: 'center'
        }}>
            <div style={{ width: '100%', overflowX: 'auto', marginTop: 2 }}>
                <div
                    style={{
                        fontSize: 35,
                        textAlign: 'center',
                        color: 'black',
                        fontWeight: 'bold'
                    }}
                >{title}</div>

                <table className="custom-table table-bordered table-responsive-md table-striped text-center overflow-x-auto w-full">
                    <thead>
                        <tr style={{ color: 'black', fontWeight: 'bold' }}>
                            <th className="text-center" style={{ fontSize: 14 }}>HOLE</th>
                            {/* <th className="text-center" style={{ fontSize: 14 }}>HDC</th>
                            <th className="text-center" style={{ fontSize: 14 }}>VGA</th> */}
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>1</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>2</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>3</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>4</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>5</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>6</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>7</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>8</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 30 }}>9</th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 35 }}>
                                {props.luotChoi == 1 ? 'IN' : ''}
                                {props.luotChoi == 2 ? 'OUT' : ''}
                                {props.luotChoi == 3 ? 'ADD 1' : ''}
                                {props.luotChoi == 4 ? 'ADD 2' : ''}
                            </th>
                            <th className="text-center" style={{ fontSize: 14, minWidth: 35 }}>Total</th>
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

export default Page_ViewTableScorePrint;