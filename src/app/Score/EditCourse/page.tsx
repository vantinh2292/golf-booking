'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer, Input, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store';

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, onValue, child, get, set, remove } from "firebase/database";
import { toast } from 'react-toastify';
import { Database } from '../../../../firebase';
import Form from 'react-bootstrap/Form';
import
styles from './page.module.css'
import My_divider from './my_divider';
import Button from 'react-bootstrap/Button';
import Confirm from '@/components/confirm';
import Loading from './loading';
import ViewAllScoreCard from '@/components/ViewSoreCard/view_all_score_card';

import Select, { SingleValue } from 'react-select';
const customStyles: CustomSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '2px solid #4a90e2' : '1px solid #435b7d',
        borderRadius: '4px',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(74, 144, 226, 0.5)' : null,
        backgroundColor: '#2f3d57',
        fontWeight: 'bold'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'white' : 'white',
        color: state.isSelected ? 'blue' : 'black',
        ':hover': {
            backgroundColor: '#2f3d57',
            color: 'white',
        },
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: 'white',
    }),
};

function Page() {
    const router = useRouter();
    const Page_Data = useAppSelector((state) => state.pageReducer.value)

    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(3))
    dispatch(redux_page.setChoice('Score'))

    const [haveData, setHaveData] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const divRef = useRef<HTMLDivElement | null>(null);
    const [widthScreen, setWidthScreen] = useState(0)
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const [inputTee1, setInputTee1] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [inputTee2, setInputTee2] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [inputTee3, setInputTee3] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [inputTee4, setInputTee4] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [inputTee5, setInputTee5] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
    const [inputTee6, setInputTee6] = useState<IStickInput>({
        TeeBoxName: '',
        Sloping: 0,
        Rating: 0,
        Color: '#000000',
        TextColor: '#FFFFFF',
        Value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })

    const [inputHDC, setInputHDC] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [inputPAR, setInputPAR] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

    const [selectedGolfName, setSelectGolfName] = useState<string>('')
    const [selectedCourseName, setSelectCourseName] = useState<string>('')
    const [numberTeeBox, setNumberTeeBox] = useState<number>(1)
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
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
    const [showConfirmSaveOther, setShowConfirmSaveOther] = useState<boolean>(false)
    const [showViewAllScoreCard, setShowViewAllScoreCard] = useState<boolean>(false)

    useEffect(() => {
        //Permistion Access Page
        if (Page_Data.level > 0 && Page_Data.level < 10) {
            toast.warning("You do not have permission to access this page")
            router.push('/');
        }
    }, [Page_Data, router]);

    function calculateTotal(arr: number[]) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total;
    }
    useEffect(() => {
        setTotalHDC(calculateTotal(inputHDC))
        setTotalPAR(calculateTotal(inputPAR))
        setTotalTee1(calculateTotal(inputTee1.Value))
        setTotalTee2(calculateTotal(inputTee2.Value))
        setTotalTee3(calculateTotal(inputTee3.Value))
        setTotalTee4(calculateTotal(inputTee4.Value))
        setTotalTee5(calculateTotal(inputTee5.Value))
        setTotalTee6(calculateTotal(inputTee6.Value))
        return () => {
        };
    }, [inputHDC, inputPAR, inputTee1.Value, inputTee2.Value, inputTee3.Value, inputTee4.Value, inputTee5.Value, inputTee6.Value]);

    const updateDimensions = () => {
        if (window.innerWidth > 1200) {
            setWindowWidth(1200);
        } else {
            setWindowWidth(window.innerWidth - 4);
        }
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

        handleResize()

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    useEffect(
        () => {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/GolfSetup")).then((snapshot) => {
                if (snapshot.exists()) {
                    setHaveData(true)
                    updateDimensions();
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

    const getInitialGolfCourse = () => {
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
    useEffect(
        () => {
            getInitialGolfCourse()
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

    useEffect(
        () => {
            if (selectedCourseName.length > 0 && selectedGolfName.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData: IGolfSetupCourse = snapshot.val();
                        setGolfSetupCourse(newData)

                        setSelectCourseName(newData.NameCourse)
                        setNumberTeeBox(newData.NumberTeeBox)
                        setInputHDC(newData.HDC)
                        setInputPAR(newData.PAR)
                        setInputTee1(newData.Tee1)
                        setInputTee2(newData.Tee2)
                        setInputTee3(newData.Tee3)
                        setInputTee4(newData.Tee4)
                        setInputTee5(newData.Tee5)
                        setInputTee6(newData.Tee6)
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
        , [selectedCourseName]
    );

    const handleChangeNameCourse = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectCourseName(event.target.value)
    }

    const handleChangePAR = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputPAR(
            prevObject => prevObject.map((item, index) => (index === key ? parseInt(event.target.value) : item))
        )
        document.body.style.transform = 'scale(1)';
    }

    const handleChangeHDC = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputHDC(
            prevObject => prevObject.map((item, index) => (index === key ? parseInt(event.target.value) : item))
        )
    }

    const handleChangeColorTee1 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee1(
            {
                ...inputTee1,
                Color: event.target.value.trim()
            })
    }
    const handleChangeColorTee2 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee2(
            {
                ...inputTee2,
                Color: event.target.value.trim()
            })
    }
    const handleChangeColorTee3 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee3(
            {
                ...inputTee3,
                Color: event.target.value.trim()
            })
    }
    const handleChangeColorTee4 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee4(
            {
                ...inputTee4,
                Color: event.target.value.trim()
            })
    }
    const handleChangeColorTee5 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee5(
            {
                ...inputTee5,
                Color: event.target.value.trim()
            })
    }
    const handleChangeColorTee6 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee6(
            {
                ...inputTee6,
                Color: event.target.value.trim()
            })
    }
    //////////////////////////////////////////////////////////////////////////////
    const handleChangeDistanceTee1 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee1(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    const handleChangeDistanceTee2 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee2(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    const handleChangeDistanceTee3 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee3(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    const handleChangeDistanceTee4 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee4(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    const handleChangeDistanceTee5 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee5(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    const handleChangeDistanceTee6 = (event: ChangeEvent<HTMLInputElement>, key: number) => {
        setInputTee6(
            prevObject => ({
                ...prevObject,
                Value: prevObject.Value.map((item, index) => (index === key ? parseInt(event.target.value) : item))
            })
        )
    }
    //////////////////////////////////////////////////////////////////////////////
    const handleChangeTextColorTee1 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee1(
            {
                ...inputTee1,
                TextColor: event.target.value.trim()
            })
    }
    const handleChangeTextColorTee2 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee2(
            {
                ...inputTee2,
                TextColor: event.target.value.trim()
            })
    }
    const handleChangeTextColorTee3 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee3(
            {
                ...inputTee3,
                TextColor: event.target.value.trim()
            })
    }
    const handleChangeTextColorTee4 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee4(
            {
                ...inputTee4,
                TextColor: event.target.value.trim()
            })
    }
    const handleChangeTextColorTee5 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee5(
            {
                ...inputTee5,
                TextColor: event.target.value.trim()
            })
    }
    const handleChangeTextColorTee6 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee6(
            {
                ...inputTee6,
                TextColor: event.target.value.trim()
            })
    }
    //////////////////////////////////////////////////////////////////////////////
    const handleChangeTeeBoxNameTee1 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee1(
            {
                ...inputTee1,
                TeeBoxName: (event.target.value).trim()
            })
    }
    const handleChangeTeeBoxNameTee2 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee2(
            {
                ...inputTee2,
                TeeBoxName: (event.target.value).trim()
            })
    }
    const handleChangeTeeBoxNameTee3 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee3(
            {
                ...inputTee3,
                TeeBoxName: (event.target.value).trim()
            })
    }
    const handleChangeTeeBoxNameTee4 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee4(
            {
                ...inputTee4,
                TeeBoxName: (event.target.value).trim()
            })
    }
    const handleChangeTeeBoxNameTee5 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee5(
            {
                ...inputTee5,
                TeeBoxName: (event.target.value).trim()
            })
    }
    const handleChangeTeeBoxNameTee6 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee6(
            {
                ...inputTee6,
                TeeBoxName: (event.target.value).trim()
            })
    }

    //////////////////////////////////////////////////////////////////////////////

    const handleChangeSlopingTee1 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee1(
            {
                ...inputTee1,
                Sloping: parseFloat(event.target.value)
            })
    }
    const handleChangeSlopingTee2 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee2(
            {
                ...inputTee2,
                Sloping: parseFloat(event.target.value)
            })
    }
    const handleChangeSlopingTee3 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee3(
            {
                ...inputTee3,
                Sloping: parseFloat(event.target.value)
            })
    }
    const handleChangeSlopingTee4 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee4(
            {
                ...inputTee4,
                Sloping: parseFloat(event.target.value)
            })
    }
    const handleChangeSlopingTee5 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee5(
            {
                ...inputTee5,
                Sloping: parseFloat(event.target.value)
            })
    }
    const handleChangeSlopingTee6 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee6(
            {
                ...inputTee6,
                Sloping: parseFloat(event.target.value)
            })
    }
    ///////////////////////////////////////////////////////////////////////////////
    const handleChangeRatingTee1 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee1(
            {
                ...inputTee1,
                Rating: parseFloat(event.target.value)
            })
    }
    const handleChangeRatingTee2 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee2(
            {
                ...inputTee2,
                Rating: parseFloat(event.target.value)
            })
    }
    const handleChangeRatingTee3 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee3(
            {
                ...inputTee3,
                Rating: parseFloat(event.target.value)
            })
    }
    const handleChangeRatingTee4 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee4(
            {
                ...inputTee4,
                Rating: parseFloat(event.target.value)
            })
    }
    const handleChangeRatingTee5 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee5(
            {
                ...inputTee5,
                Rating: parseFloat(event.target.value)
            })
    }
    const handleChangeRatingTee6 = (event: ChangeEvent<HTMLInputElement>) => {
        setInputTee6(
            {
                ...inputTee6,
                Rating: parseFloat(event.target.value)
            })
    }

    const CopyOtherCourseName = () => {
        if (selectedGolfName.length == 0) {
            toast.warning('Need choice Golf Name First');
        } else if (selectedCourseName.length == 0
        ) {
            toast.warning('Name Course can not empty');
        } else {
            get(child(dbRef, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course')).then((snapshot) => {
                if (snapshot.hasChild(selectedCourseName)) {
                    toast.warning('THIS COURSE NAME ALREADY HAVE IN SYSTEM');
                } else {
                    const setRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName);
                    set(setRef,
                        {
                            NameCourse: selectedCourseName,
                            NumberTeeBox: numberTeeBox,
                            PAR: inputPAR,
                            HDC: inputHDC,
                            Tee1: {
                                TeeBoxName: inputTee1.TeeBoxName,
                                Sloping: inputTee1.Sloping,
                                Rating: inputTee1.Rating,
                                Color: inputTee1.Color,
                                TextColor: inputTee1.TextColor,
                                Value: inputTee1.Value
                            },
                            Tee2: {
                                TeeBoxName: inputTee2.TeeBoxName,
                                Sloping: inputTee2.Sloping,
                                Rating: inputTee2.Rating,
                                Color: inputTee2.Color,
                                TextColor: inputTee2.TextColor,
                                Value: inputTee2.Value
                            },
                            Tee3: {
                                TeeBoxName: inputTee3.TeeBoxName,
                                Sloping: inputTee3.Sloping,
                                Rating: inputTee3.Rating,
                                Color: inputTee3.Color,
                                TextColor: inputTee3.TextColor,
                                Value: inputTee3.Value
                            },
                            Tee4: {
                                TeeBoxName: inputTee4.TeeBoxName,
                                Sloping: inputTee4.Sloping,
                                Rating: inputTee4.Rating,
                                Color: inputTee4.Color,
                                TextColor: inputTee4.TextColor,
                                Value: inputTee4.Value
                            },
                            Tee5: {
                                TeeBoxName: inputTee5.TeeBoxName,
                                Sloping: inputTee5.Sloping,
                                Rating: inputTee5.Rating,
                                Color: inputTee5.Color,
                                TextColor: inputTee5.TextColor,
                                Value: inputTee5.Value
                            },
                            Tee6: {
                                TeeBoxName: inputTee6.TeeBoxName,
                                Sloping: inputTee6.Sloping,
                                Rating: inputTee6.Rating,
                                Color: inputTee6.Color,
                                TextColor: inputTee6.TextColor,
                                Value: inputTee6.Value
                            },

                        })
                    toast.success('Create New Course Success');
                    getInitialGolfCourse()
                }
            })
        }
        setSelectGolfName('')
    }

    const EditGolfCourse = () => {
        if (selectedGolfName.length == 0) {
            toast.warning('Need choice Golf Name First');
        } else if (selectedCourseName.length == 0
        ) {
            toast.warning('Name Course can not empty');
        } else {
            const setRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName);
            if (golfSetupCourse) {
                set(setRef,
                    {
                        NameCourse: selectedCourseName,
                        NumberTeeBox: numberTeeBox,
                        PAR: inputPAR,
                        HDC: inputHDC,
                        Tee1: {
                            TeeBoxName: inputTee1.TeeBoxName,
                            Sloping: inputTee1.Sloping,
                            Rating: inputTee1.Rating,
                            Color: inputTee1.Color,
                            TextColor: inputTee1.TextColor,
                            Value: inputTee1.Value
                        },
                        Tee2: {
                            TeeBoxName: inputTee2.TeeBoxName,
                            Sloping: inputTee2.Sloping,
                            Rating: inputTee2.Rating,
                            Color: inputTee2.Color,
                            TextColor: inputTee2.TextColor,
                            Value: inputTee2.Value
                        },
                        Tee3: {
                            TeeBoxName: inputTee3.TeeBoxName,
                            Sloping: inputTee3.Sloping,
                            Rating: inputTee3.Rating,
                            Color: inputTee3.Color,
                            TextColor: inputTee3.TextColor,
                            Value: inputTee3.Value
                        },
                        Tee4: {
                            TeeBoxName: inputTee4.TeeBoxName,
                            Sloping: inputTee4.Sloping,
                            Rating: inputTee4.Rating,
                            Color: inputTee4.Color,
                            TextColor: inputTee4.TextColor,
                            Value: inputTee4.Value
                        },
                        Tee5: {
                            TeeBoxName: inputTee5.TeeBoxName,
                            Sloping: inputTee5.Sloping,
                            Rating: inputTee5.Rating,
                            Color: inputTee5.Color,
                            TextColor: inputTee5.TextColor,
                            Value: inputTee5.Value
                        },
                        Tee6: {
                            TeeBoxName: inputTee6.TeeBoxName,
                            Sloping: inputTee6.Sloping,
                            Rating: inputTee6.Rating,
                            Color: inputTee6.Color,
                            TextColor: inputTee6.TextColor,
                            Value: inputTee6.Value
                        },

                    })
                toast.success('Edit Course Success');
            }
        }
    }
    const DeleteGolfCourse = () => {
        if (selectedGolfName.length == 0) {
            toast.warning('Need choice Golf Name First');
        } else if (selectedCourseName.length == 0
        ) {
            toast.warning('Name Course can not empty');
        } else {
            const RemoveRef = ref(Database, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedCourseName);
            remove(RemoveRef).then(() => {
                toast.error('Delete Course Success');
                getInitialGolfCourse()
            })
        }
        setShowConfirmDelete(false)
    }

    const generatePage = () => {
        if (haveData && Page_Data.level !== -1) {
            return (
                <>
                    <div
                        style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>EDIT COURSE</div>
                    <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700 inline-block auto"
                        style={{ height: 'calc(100vh-138px)' }}>
                        <div
                            style={{ justifyContent: 'center', display: 'flex' }}>
                            <div style={{ width: '70%', textAlign: 'center' }}>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select Golf Name"
                                    onChange={
                                        (selectedOption: SingleValue<{ label: string, value: string }>) => {
                                            if (selectedOption) {
                                                const { label, value } = selectedOption;
                                                setSelectGolfName(value)
                                            }
                                        }
                                    }
                                    options={
                                        listGolfSetupInformation.map(item => ({
                                            label: item.NameGolf, value: item.NameGolf
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <Spacer y={1} />

                        <div
                            style={{ justifyContent: 'center', display: 'flex' }}>
                            <div style={{ width: '70%', textAlign: 'center' }}>
                                <Select
                                    styles={customStyles}
                                    placeholder="Select Course Name"
                                    onChange={
                                        (selectedOption: SingleValue<{ label: string, value: string }>) => {
                                            if (selectedOption) {
                                                const { label, value } = selectedOption;
                                                setSelectCourseName(value)
                                            }
                                        }
                                    }
                                    options={
                                        listGolfSetupCourse.map(item => ({
                                            label: item.NameCourse, value: item.NameCourse
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <Spacer y={1} />

                        <div
                            style={{ justifyContent: 'center', display: 'grid' }}>
                            <div
                                style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Tee Box:</div>
                            <div
                                style={{ justifyContent: 'center', display: 'flex' }}>
                                <Form.Control
                                    style={{ textAlign: 'center', color: 'beige' }}
                                    className={styles.FormInput}
                                    type="text"
                                    placeholder="Number Of Tee Box"
                                    value={numberTeeBox.toString()}
                                    disabled={selectedCourseName === ''}
                                />
                            </div>
                        </div>

                        <Spacer y={2} />
                        <div
                            style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Please Stick (✓)</div>
                        <div className="mt-px flex gap-2 text-white p-1 rounded-md border-5 border-slate-700 overflow-auto"
                            style={{ width: numberTeeBox > 0 ? widthScreen - 50 : 0, justifyContent: ((numberTeeBox + 1) * 140) > widthScreen ? 'normal' : 'center' }}>
                            <div
                                style={{ width: (numberTeeBox + 1) * 140, justifyContent: 'space-between', display: 'flex' }}>
                                {
                                    numberTeeBox >= 0 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Field</div>
                                                <My_divider />
                                                <div className='text-center'>Tee Box Name</div>
                                                <My_divider />
                                                <div className='text-center'>Sloping</div>
                                                <My_divider />
                                                <div className='text-center'>Rating</div>
                                                <My_divider />
                                                <div className='text-center'>Color</div>
                                                <My_divider />
                                                <div className='text-center'>Text Color</div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 1 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 1</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee1}
                                                    value={inputTee1.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder='Tee Pro'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee1}
                                                    value={inputTee1.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee1}
                                                    value={inputTee1.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee1}
                                                    value={inputTee1.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee1}
                                                    value={inputTee1.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 2 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 2</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee2}
                                                    value={inputTee2.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder={numberTeeBox < 5 ? 'Tee Semi Pro' : 'Tee Semi Pro 1'} ></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee2}
                                                    value={inputTee2.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee2}
                                                    value={inputTee2.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee2}
                                                    value={inputTee2.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee2}
                                                    value={inputTee2.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 3 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 3</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee3}
                                                    value={inputTee3.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder={numberTeeBox < 5 ? 'Tee Amatuer' : 'Tee Semi Pro 2'} ></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee3}
                                                    value={inputTee3.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee3}
                                                    value={inputTee3.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee3}
                                                    value={inputTee3.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee3}
                                                    value={inputTee3.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 4 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 4</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee4}
                                                    value={inputTee4.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder={numberTeeBox < 5 ? 'Tee Ladies' : 'Tee Semi Amatuer'} ></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee4}
                                                    value={inputTee4.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee4}
                                                    value={inputTee4.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee4}
                                                    value={inputTee4.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee4}
                                                    value={inputTee4.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 5 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 5</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee5}
                                                    value={inputTee5.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder={numberTeeBox < 6 ? 'Tee Ladies ' : 'Tee Ladies 1'} ></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee5}
                                                    value={inputTee5.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee5}
                                                    value={inputTee5.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee5}
                                                    value={inputTee5.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee5}
                                                    value={inputTee5.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    numberTeeBox >= 6 ?
                                        <div
                                            style={{ width: 140 }}>
                                            <div className='h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>Tee 6</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeTeeBoxNameTee6}
                                                    value={inputTee6.TeeBoxName}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="text" placeholder='Tee Ladies 2' ></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeSlopingTee6}
                                                    value={inputTee6.Sloping}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Sloping'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeRatingTee6}
                                                    value={inputTee6.Rating}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='Rating'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={handleChangeColorTee6}
                                                    value={inputTee6.Color}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                                <My_divider />
                                                <input
                                                    disabled={selectedGolfName == ''}
                                                    onChange={handleChangeTextColorTee6}
                                                    value={inputTee6.TextColor}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="color" />
                                            </div>
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>

                        <Spacer y={1} />
                        <div
                            style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Parameter</div>
                        <div className="mt-px flex gap-2 text-white p-1 rounded-md border-5 border-slate-700"
                            style={{ width: numberTeeBox > 0 ? widthScreen - 50 : 0, overflow: 'auto', justifyContent: (12 * 60) > widthScreen ? 'normal' : 'center' }}>
                            <div
                                style={{ width: 12 * 60, justifyContent: 'space-between', display: 'flex' }}>
                                {
                                    numberTeeBox >= 0 ?
                                        <div
                                            style={{ width: 120 }}>
                                            <div className='h-full grid p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                {/* // 
style={{ width: numberTeeBox > 0 ? widthScreen - 50 : 0, justifyContent: ((numberTeeBox + 1) * 140) > widthScreen ? 'normal' : 'center' }}> */}
                                                <div className='text-center'>Holes</div>
                                                <My_divider />
                                                <div className='text-center'>PAR</div>
                                                <My_divider />
                                                <div className='text-center'>HDC</div>
                                                {numberTeeBox >= 1 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee1.Color, color: inputTee1.TextColor, minHeight: 23 }}>
                                                            {inputTee1.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                                {numberTeeBox >= 2 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee2.Color, color: inputTee2.TextColor, minHeight: 23 }}>
                                                            {inputTee2.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                                {numberTeeBox >= 3 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee3.Color, color: inputTee3.TextColor, minHeight: 23 }}>
                                                            {inputTee3.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                                {numberTeeBox >= 4 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee4.Color, color: inputTee4.TextColor, minHeight: 23 }}>
                                                            {inputTee4.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                                {numberTeeBox >= 5 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee5.Color, color: inputTee5.TextColor, minHeight: 23 }}>
                                                            {inputTee5.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                                {numberTeeBox >= 6 ?
                                                    <>
                                                        <My_divider />
                                                        <div className='text-center'
                                                            style={{ border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee6.Color, color: inputTee6.TextColor, minHeight: 23 }}>
                                                            {inputTee6.TeeBoxName}</div>
                                                    </>
                                                    : ''}
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    ListHoles.map((data, key) => (
                                        <div key={key}
                                            style={{ width: 60 }}>
                                            <div className='grid h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                                <div className='text-center'>{data}</div>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={(event) => handleChangePAR(event, key)}
                                                    value={inputPAR[key]}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='PAR'></input>
                                                <My_divider />
                                                <input
                                                    disabled={selectedCourseName == ''}
                                                    onChange={(event) => handleChangeHDC(event, key)}
                                                    value={inputHDC[key]}
                                                    style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                                    type="number"
                                                    className='none_button'
                                                    placeholder='HDC'></input>
                                                {
                                                    numberTeeBox >= 1 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee1(event, key)}
                                                                value={inputTee1.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee1.Color, color: inputTee1.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                                pattern="^[1-9]\d*$"></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                                {
                                                    numberTeeBox >= 2 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee2(event, key)}
                                                                value={inputTee2.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee2.Color, color: inputTee2.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                                pattern="^[1-9]\d*$"></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                                {
                                                    numberTeeBox >= 3 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee3(event, key)}
                                                                value={inputTee3.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee3.Color, color: inputTee3.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                            ></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                                {
                                                    numberTeeBox >= 4 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee4(event, key)}
                                                                value={inputTee4.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee4.Color, color: inputTee4.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                            ></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                                {
                                                    numberTeeBox >= 5 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee5(event, key)}
                                                                value={inputTee5.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee5.Color, color: inputTee5.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                            ></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                                {
                                                    numberTeeBox >= 6 ?
                                                        <>
                                                            <My_divider />
                                                            <input
                                                                disabled={selectedCourseName == ''}
                                                                onChange={(event) => handleChangeDistanceTee6(event, key)}
                                                                value={inputTee6.Value[key]}
                                                                style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee6.Color, color: inputTee6.TextColor }}
                                                                type="number"
                                                                className='none_button'
                                                            ></input>

                                                        </>
                                                        :
                                                        ''
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                                <div
                                    style={{ width: 60 }}>
                                    <div className='grid h-full p-2 rounded-md border-1 border-dashed border-slate-700'>
                                        <div className='text-center'>Total</div>
                                        <My_divider />
                                        <input
                                            disabled
                                            value={totalPAR}
                                            style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                            type="number"
                                            className='none_button'
                                        ></input>
                                        <My_divider />
                                        <input
                                            disabled
                                            value={totalHDC}
                                            style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: '#3B3B3B', color: 'E5E5E5' }}
                                            type="number"
                                            className='none_button'
                                        ></input>
                                        {
                                            numberTeeBox >= 1 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee1}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee1.Color, color: inputTee1.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 2 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee2}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee2.Color, color: inputTee2.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 3 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee3}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee3.Color, color: inputTee3.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 4 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee4}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee4.Color, color: inputTee4.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 5 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee5}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee5.Color, color: inputTee5.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                        {
                                            numberTeeBox >= 6 ?
                                                <>
                                                    <My_divider />
                                                    <input
                                                        disabled
                                                        value={totalTee6}
                                                        style={{ width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 14, backgroundColor: inputTee6.Color, color: inputTee6.TextColor }}
                                                        type="text"></input>
                                                </>
                                                :
                                                ''
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Spacer y={1} />
                        <My_divider />
                        <Spacer y={1} />

                        <Button
                            onClick={EditGolfCourse}
                            style={{ width: '100%' }} variant="primary"
                            disabled={selectedCourseName == ''}>EDIT COURSE</Button>
                        <Spacer y={1} />
                        <My_divider />
                        <Spacer y={1} />
                        <Button
                            onClick={() => setShowConfirmDelete(true)}
                            style={{ width: '100%' }} variant="danger"
                            disabled={selectedCourseName == ''}>DELETE COURSE</Button>
                        <Spacer y={1} />
                        <My_divider />
                        <Spacer y={1} />
                        <Button onClick={() => setShowViewAllScoreCard(true)} style={{ width: '100%' }} variant="primary" disabled={selectedGolfName == ''}>VIEW ALL SCORE CARD</Button>
                        <Spacer y={2} />

                        <div
                            style={{ justifyContent: 'center', display: 'grid', width: '100%' }}>
                            <div className='p-1 rounded-md border-2 border-slate-900' >
                                <div
                                    style={{ justifyContent: 'center', display: 'flex' }}>
                                    <Form.Control

                                        style={{ textAlign: 'center', color: 'beige' }}
                                        className={styles.FormInput}

                                        type="text"
                                        placeholder="Course Name"

                                        value={selectedCourseName.toString()}

                                        disabled={selectedCourseName === ''}

                                        onChange={(event) => setSelectCourseName(event.target.value)}
                                    />
                                </div>
                                <Spacer y={1} />
                                <Button
                                    onClick={() => setShowConfirmSaveOther(true)} className='w-full' variant="primary"
                                    disabled={selectedCourseName == ''}>Save Other Course Name
                                </Button>

                            </div>
                        </div>
                    </div>
                    <Confirm show={showConfirmDelete} title='Confirm Delete:' content={`Do you sure to delete this course name: ${selectedCourseName} ?`} setShowConfirm={setShowConfirmDelete} callCommand={DeleteGolfCourse} />
                    <Confirm show={showConfirmSaveOther} title='Confirm Save Other Course:' content={`Do you sure to save with different course name as: ${selectedCourseName} ?`} setShowConfirm={setShowConfirmSaveOther} callCommand={CopyOtherCourseName} />
                    <Spacer y={1} />
                    {showViewAllScoreCard ?
                        <ViewAllScoreCard show={showViewAllScoreCard} course_name={selectedGolfName} setShowConfirm={setShowViewAllScoreCard} />
                        :
                        ''
                    }
                </>
            )

        } else {
            return (
                <Loading />
            )
        }
    }
    return (
        <div style={{ maxWidth: 1200, width: windowWidth, justifyContent: 'center', display: 'grid' }} ref={divRef}>
            {generatePage()}
        </div>
    );

}

export default Page;
