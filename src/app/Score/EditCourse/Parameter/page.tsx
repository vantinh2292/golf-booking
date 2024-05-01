'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer } from "@nextui-org/react";

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, update, child, get, set, onValue } from "firebase/database";
import { toast } from 'react-toastify';
import { Database } from '../../../../../firebase';
import Form from 'react-bootstrap/Form';
import styles from './page.module.css'
import My_divider from './my_divider';
import Button from 'react-bootstrap/Button';

function Page() {
    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(4))
    dispatch(redux_page.setChoice('Score'))

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const divRef = useRef<HTMLDivElement | null>(null);
    const [widthScreen, setWidthScreen] = useState(0)

    const updateDimensions = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            setWidthScreen(window.innerWidth > Math.round(rect.width) ? Math.round(rect.width) : window.innerWidth)
            setDimensions({
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            });
        }
    };
    useEffect(() => {
        const handleResize = () => {
            updateDimensions();
        };

        window.addEventListener('resize', handleResize);
        updateDimensions();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [selectedGolfName, setSelectGolfName] = useState<string>('')
    const [selectedCourseName, setSelectCourseName] = useState<string>('')
    const [numberTeeBox, setNumberTeeBox] = useState<number>(0)
    const [listGolfSetupInformation, setListGolfSetupInformation] = useState<IGolfSetupInformation[]>([])
    const [listGolfSetupCourse, setListGolfSetupCourse] = useState<IGolfSetupCourse[]>([])
    const [golfSetupCourse, setGolfSetupCourse] = useState<IGolfSetupCourse | null>(null)
    const ListHoles = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [totalPAR, setTotalPAR] = useState<number>(0)
    const [totalHDC, setTotalHDC] = useState<number>(0)
    const [totalTee1, setTotalTee1] = useState<number>(0)
    const [totalTee2, setTotalTee2] = useState<number>(0)
    const [totalTee3, setTotalTee3] = useState<number>(0)
    const [totalTee4, setTotalTee4] = useState<number>(0)
    const [totalTee5, setTotalTee5] = useState<number>(0)
    const [totalTee6, setTotalTee6] = useState<number>(0)

    var temp_obj: { [key: string]: number } = {}

    useEffect(
        () => {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/GolfSetup")).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    setListGolfSetupInformation(newData)
                    generate_list_order_information(newData)
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        , []
    );
    const generate_list_order_information = (data: IListGolfSetupInformation) => {
        let temp_list: IGolfSetupInformation[] = []
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
                temp_list.push({
                    NameGolf: property,
                    AddressGolf: data[property].AddressGolf,
                    ContactGolf: data[property].ContactGolf,
                    TelGolf: data[property].TelGolf,
                    NumberOfHolesGolf: data[property].NumberOfHolesGolf,
                })
            }
        }
        setListGolfSetupInformation(temp_list)
    }

    useEffect(
        () => {
            if (selectedGolfName.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        setListGolfSetupCourse(newData)
                        generate_list_order_course(newData)
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                setListGolfSetupCourse([])
                generate_list_order_course(null)
            }
        }
        , [selectedGolfName]
    );

    const generate_list_order_course = (data: IListGolfSetupCourse | null) => {
        let temp_list: IGolfSetupCourse[] = []
        for (const property in data) {
            if (data.hasOwnProperty(property)) {
                temp_list.push({
                    NameCourse: property,
                    NumberTeeBox: data[property].NumberTeeBox,
                    HDC: data[property].HDC,
                    PAR: data[property].PAR,
                    Tee1: data[property].Tee1,
                    Tee2: data[property].Tee2,
                    Tee3: data[property].Tee3,
                    Tee4: data[property].Tee4,
                    Tee5: data[property].Tee5,
                    Tee6: data[property].Tee6
                })
            }
        }
        setListGolfSetupCourse(temp_list)
    }

    function calculateTotal(arr: number[]) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total;
    }

    useEffect(
        () => {
            if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
                //Get Firebase GPS
                const dataGolfSetupCourseRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName);
                onValue(dataGolfSetupCourseRef, (snapshot) => {
                    if (snapshot.exists()) {
                        let newData: IGolfSetupCourse = snapshot.val();
                        console.log(newData)
                        setGolfSetupCourse(newData)
                        setNumberTeeBox(newData.NumberTeeBox)
                        setTotalHDC(calculateTotal(newData ? newData.HDC : []))
                        setTotalPAR(calculateTotal(newData ? newData.PAR : []))
                        setTotalTee1(calculateTotal(newData ? newData.Tee1.Value : []))
                        setTotalTee2(calculateTotal(newData ? newData.Tee2.Value : []))
                        setTotalTee3(calculateTotal(newData ? newData.Tee3.Value : []))
                        setTotalTee4(calculateTotal(newData ? newData.Tee4.Value : []))
                        setTotalTee5(calculateTotal(newData ? newData.Tee5.Value : []))
                        setTotalTee6(calculateTotal(newData ? newData.Tee6.Value : []))
                    } else {
                        console.log("No data available");
                    }
                });
            } else {
                setListGolfSetupCourse([])
                generate_list_order_course(null)
            }
        }
        , [selectedCourseName]
    );

    //////////////////////////////////////////////////////////////////////////////

    const handleChangePAR = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/PAR');
            temp_obj = {}
            temp_obj[key] = parseInt(event.target.value.replace(/^0+/, ''))
            if (!isNaN(parseInt(event.target.value.replace(/^0+/, '')))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeHDC = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/HDC');
            temp_obj = {}
            temp_obj[key] = parseInt(event.target.value)
            if (!isNaN(parseInt(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee1 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee1/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee2 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee2/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee3 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee3/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee4 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee4/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee5 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee5/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }
    const handleChangeDistanceTee6 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
            const updateRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName + '/Tee6/Value');
            temp_obj = {}
            temp_obj[key] = parseFloat(event.target.value);
            if (!isNaN(parseFloat(event.target.value))) {
                update(updateRef, temp_obj)
            } else {
                temp_obj[key] = 0
                update(updateRef, temp_obj)
            }
        }
    }

    const formatNumber = (event: ChangeEvent<HTMLInputElement>) => {
        const formattedValue = event.target.value.replace(/^0+/, '');
    };

    return (

        <div className='bg-sky-950 p-2' style={{ width: 1200, justifyContent: 'center', display: 'grid' }} ref={divRef}>
            <div style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>EDIT COURSE PARAMETER</div>
            <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700 inline-block">
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    {/* <div style={{ color: 'white', fontSize: 18, paddingLeft: 4, alignItems: 'center', display: 'flex' }}>COURSE PARAMETER FOR:</div> */}
                    <Form.Select
                        style={{ width: '70%', textAlign: 'center' }}
                        className={styles.FormInput}
                        aria-label="CHOICE GOLF NAME"
                        placeholder="Large text"
                        value={selectedGolfName}
                        onChange={(data) => {
                            setSelectGolfName(data.target.value)
                        }}
                    >
                        <option>SELECT GOLF NAME</option>
                        {listGolfSetupInformation.map((element, key) => (
                            <option key={element.NameGolf} value={element.NameGolf}>{element.NameGolf}</option>
                        ))}
                    </Form.Select>
                </div>
                <Spacer y={2} />

                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    {/* <div style={{ color: 'white', fontSize: 18, paddingLeft: 4, alignItems: 'center', display: 'flex' }}>COURSE PARAMETER FOR:</div> */}
                    <Form.Select
                        style={{ width: '70%', textAlign: 'center' }}
                        className={styles.FormInput}
                        aria-label="CHOICE COURSE NAME"
                        placeholder="Large text"
                        value={selectedCourseName}
                        onChange={(data) => {
                            setSelectCourseName(data.target.value)
                        }}
                    >
                        <option>SELECT COURSE NAME</option>
                        {listGolfSetupCourse.map((element, key) => (
                            <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                        ))}
                    </Form.Select>
                </div>
                <Spacer y={2} />

                <div className="mt-px flex gap-2 text-white p-1 rounded-md border-5 border-slate-700" style={{ width: 12 * 60 + 20 < widthScreen ? 12 * 60 + 20 : widthScreen - 50, overflow: 'auto' }}>
                    <div style={{ width: 12 * 60, justifyContent: 'space-between', display: 'flex' }}>
                        {
                            numberTeeBox >= 0 ?
                                <div style={{ width: 120 }}>
                                    <div className='h-full grid p-2 rounded-md border-1 border-dashed border-slate-700'>
                                        {/* // style={{ width: numberTeeBox > 0 ? widthScreen - 50 : 0, justifyContent: ((numberTeeBox + 1) * 140) > widthScreen ? 'normal' : 'center' }}> */}
                                        <div className='text-center'>Holes</div>
                                        <My_divider />
                                        <div className='text-center'>PAR</div>
                                        <My_divider />
                                        <div className='text-center'>HDC</div>
                                        {numberTeeBox >= 1 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee1.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee1.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee1.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                        {numberTeeBox >= 2 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee2.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee2.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee2.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                        {numberTeeBox >= 3 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee3.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee3.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee3.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                        {numberTeeBox >= 4 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee4.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee4.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee4.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                        {numberTeeBox >= 5 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee5.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee5.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee5.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                        {numberTeeBox >= 6 ?
                                            <>
                                                <My_divider />
                                                <div className='text-center' style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee6.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee6.TextColor : '' }}>{golfSetupCourse ? golfSetupCourse.Tee6.TeeBoxName : ''}</div>
                                            </>
                                            : ''}
                                    </div>
                                </div>
                                : ''
                        }
                        {
                            ListHoles.map((data, key) => (
                                <div key={key} style={{ width: 60 }}>
                                    <div className='grid h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                        <div className='text-center'>{data}</div>
                                        <My_divider />
                                        <input onInput={formatNumber} className='text-center' disabled={selectedCourseName == ''} onChange={(event) => handleChangePAR(event, key)} onBlur={(event) => handleChangePAR(event, key)} value={golfSetupCourse ? golfSetupCourse.PAR[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14 }} type="number" placeholder='PAR'></input>
                                        <My_divider />
                                        <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeHDC(event, key)} value={golfSetupCourse ? golfSetupCourse.HDC[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14 }} type="number" placeholder='HDC'></input>
                                        {
                                            numberTeeBox >= 1 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee1(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee1.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee1.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee1.TextColor : '' }} type="number" pattern="^[1-9]\d*$"></input>

                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 2 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee2(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee2.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee2.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee2.TextColor : '' }} type="number" pattern="^[1-9]\d*$"></input>

                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 3 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee3(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee3.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee3.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee3.TextColor : '' }} type="number"></input>

                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 4 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee4(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee4.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee4.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee4.TextColor : '' }} type="number"></input>

                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 5 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee5(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee5.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee5.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee5.TextColor : '' }} type="number"></input>

                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 6 ?
                                                <>
                                                    <My_divider />
                                                    <input disabled={selectedCourseName == ''} onChange={(event) => handleChangeDistanceTee6(event, key)} value={golfSetupCourse ? golfSetupCourse.Tee6.Value[key] : 0} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee6.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee6.TextColor : '' }} type="number"></input>

                                                </>
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <div style={{ width: 60 }}>
                            <div className='grid h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                <div className='text-center'>Total</div>
                                <My_divider />
                                <input disabled value={totalPAR} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14 }} type="number"></input>
                                <My_divider />
                                <input disabled value={totalHDC} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14 }} type="number"></input>
                                {
                                    numberTeeBox >= 1 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee1} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee1.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee1.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    numberTeeBox >= 2 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee2} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee2.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee2.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    numberTeeBox >= 3 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee3} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee3.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee3.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    numberTeeBox >= 4 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee4} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee4.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee4.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    numberTeeBox >= 5 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee5} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee5.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee5.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    numberTeeBox >= 6 ?
                                        <>
                                            <My_divider />
                                            <input disabled value={totalTee6} style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: golfSetupCourse ? golfSetupCourse.Tee6.Color : '', color: golfSetupCourse ? golfSetupCourse.Tee6.TextColor : '' }} type="text"></input>
                                        </>
                                        :
                                        ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Page;
