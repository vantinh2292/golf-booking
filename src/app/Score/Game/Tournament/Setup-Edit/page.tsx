'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation'

import { Spacer, Input, Divider, SelectItem, } from "@nextui-org/react";
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, remove, child, get, set } from "firebase/database";
import { toast } from 'react-toastify';
import { list } from 'postcss';
import { Database } from '../../../../../../firebase';
import { IM_Fell_French_Canon } from 'next/font/google';
import Loading from './loading';
import styles from './page.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import My_divider from './my_divider';
import Confirm from '@/components/confirm';

import Select, { SingleValue, PropsValue } from 'react-select';

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

    const [haveData, setHaveData] = useState<boolean>(false);
    const [heightBoxLeft, setHeightBoxLeft] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');

    const dbRef = ref(Database);
    // const checkboxRef18 = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(11))
    dispatch(redux_page.setChoice('Score'))
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const [organizationName, setOrganizationName] = useState<string>('');
    const [tournamentName, setTournamentName] = useState<string>('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [address, setAddress] = useState<string>('');
    const [selectHoles, setSelectHoles] = useState<number>(18)
    const [selectedFormat, setSelectedFormat] = useState<string>('STROKE')
    const [backgroundColorForMen, setBackgroundColorForMen] = useState('');
    const [backgroundColorForWomen, setBackgroundColorForWomen] = useState('');

    const [listGolfSetupInformation, setListGolfSetupInformation] = useState<IGolfSetup[]>([])
    const [listGolfSetupTournament, setListGolfSetupTournament] = useState<string[]>([])
    const [listGolfSetupCourse, setListGolfSetupCourse] = useState<IGolfSetupCourse[]>([])
    const [selectedNameRound1, setSelectNameRound1] = useState<string>('')
    const [selectedNameRound2, setSelectNameRound2] = useState<string>('')
    const [selectedNameRound3, setSelectNameRound3] = useState<string>('')
    const [selectedNameRound4, setSelectNameRound4] = useState<string>('')
    const [selectedGolfName, setSelectGolfName] = useState<string>('')
    const [listTeeBox, setListTeeBox] = useState<IGolfSetupTeeBox[]>([])
    const [selectedTeeForMen, setSelectedTeeForMen] = useState<string>('')
    const [selectedTeeForMomen, setSelectedTeeForWomen] = useState<string>('')
    const ListNumberOfDivision = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const ListResult = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [numberOfDivision, setNumberOfDivision] = useState<string>('1')
    const [choiceResult, setChoiceResult] = useState<string>('1')
    const [choiceCountBack, setChoiceCountBack] = useState<string>('CountBack1')

    const [hdcMin, setHdcMin] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [hdcMax, setHdcMax] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
    const [nameDivision, setNameDivision] = useState<string[]>(['', '', '', '', '', '', '', '', '', ''])
    const [noneCut, setNoneCut] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false])
    const [cut, setCut] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const [noneHDC, setNoneHDC] = useState<boolean[]>([false, false, false, false, false, false, false, false, false, false])

    const [selectedOption, setSelectedOption] = useState<PropsValue<{ label: string; value: string; }>>(null);

    const handleChangeNameDivision = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        setNameDivision(prevState => {
            const newState = [...prevState];
            newState[index] = event.target.value;
            return newState;
        });
    }
    const handleChangeCut = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        setCut(prevState => {
            const newState = [...prevState];
            newState[index] = parseInt(event.target.value);
            return newState;
        });
    }

    const handleChangeHdcMin = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        setHdcMin(prevState => {
            const newState = [...prevState];
            newState[index] = parseInt(event.target.value);
            return newState;
        });
    }
    const handleChangeHdcMax = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        setHdcMax(prevState => {
            const newState = [...prevState];
            newState[index] = parseInt(event.target.value);
            return newState;
        });
    }
    const handleChangeNoneCut = (event: boolean, index: number) => {
        setNoneCut(prevState => {
            const newState = [...prevState];
            newState[index] = !event;
            return newState;
        });
    }
    const handleChangeNoneHDC = (event: boolean, index: number) => {
        // alert(event.target.value)
        setNoneHDC(prevState => {
            const newState = [...prevState];
            newState[index] = !event;
            return newState;
        });
    }

    const Page_Index = useAppSelector((state) => state.pageReducer.value)
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleChangeTournamentName = (event: ChangeEvent<HTMLInputElement>) => {
        setTournamentName(event.target.value);
    }
    const handleChangeOrganizationName = (event: ChangeEvent<HTMLInputElement>) => {
        setOrganizationName(event.target.value);
    }
    const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentDate(event.target.value);
    }
    const handleChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(event.target.value);
    }
    const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    }

    const updateDimensions = () => {
        if (window.innerWidth > 1200) {
            setWindowWidth(1200);
        } else {
            setWindowWidth(window.innerWidth - 4);
        }
    };

    useEffect(() => {
        //Permistion Access Page
        if (Page_Data.level > 0 && Page_Data.level < 10) {
            toast.warning("You do not have permission to access this page")
            router.push('/');
        }
    }, [Page_Data, router]);

    useEffect(() => {
        setInterval(() => {
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                if (Math.round(rect.height) < 1800) {
                    setHeightBoxLeft(1800)
                } else {
                    setHeightBoxLeft(Math.round(rect.height))
                }
            }
        }, 500);

        const handleResize = () => {
            // Check if the user agent contains the word "Mobile"
            const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                // The browser is on a mobile device
                setWindowType('Mobile')
            } else {
                // The browser is on a desktop or larger screen device
                setWindowType('Desktop')
            }
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                if (Math.round(rect.height) < 1800) {
                    setHeightBoxLeft(1800)
                } else {
                    setHeightBoxLeft(Math.round(rect.height))
                }
            }
            if (typeof window !== 'undefined') {
                setWindowWidth(window.innerWidth);
            }
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
            getInitialTournament()
        }
        , []
    );
    const getInitialTournament = () => {
        //Get Name Tournament
        get(child(dbRef, "TSN/Score/Tournament")).then((snapshot) => {
            if (snapshot.exists()) {
                setHaveData(true)
                let newData = snapshot.val();
                // setListGolfSetupTournament(newData)
                generate_list_order_tournament(newData)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    const generate_list_order_tournament = (data: IGolfTournamentSetupArr) => {
        let temp_list: string[] = []
        for (const property in data) {
            temp_list.push(property)
        }
        setListGolfSetupTournament(temp_list)
    }

    useEffect(
        () => {
            if (tournamentName.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/Tournament/" + tournamentName + '/Setup')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        setCurrentDate(newData.Date)
                        setCurrentTime(newData.TeeTime)
                        setAddress(newData.Address)
                        setOrganizationName(newData.OrganizationName)
                        setNameDivision(newData.NameDivision)
                        setSelectGolfName(newData.GolfName)
                        setSelectHoles(newData.Hole)
                        // setSelectNameRound1(newData.Round1)
                        // setSelectNameRound2(newData.Round2)
                        // setSelectNameRound3(newData.Round3)
                        // setSelectNameRound4(newData.Round4)
                        setSelectedTeeForMen(newData.TeeForMen)
                        setSelectedTeeForWomen(newData.TeeForWomen)
                        setBackgroundColorForMen(newData.BackgroundColorForMen)
                        setBackgroundColorForWomen(newData.BackgroundColorForWomen)
                        setSelectedFormat(newData.Format)
                        setNumberOfDivision(newData.NumberOfDivision)
                        setHdcMin(newData.HdcMin)
                        setHdcMax(newData.HdcMax)
                        setChoiceResult(newData.ChoiceResult)
                        setCut(newData.Cut)
                        setChoiceCountBack(newData.CountBack)
                        setNoneCut(newData.NoneCut)
                        setNoneHDC(newData.NoneHDC)
                    } else {
                        toast.warning("No Tournament available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        }
        , [tournamentName]
    );


    useEffect(
        () => {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/GolfSetup")).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    setHaveData(true)
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
    const generate_list_order_information = (data: IListGolfSetup) => {
        let temp_list: IGolfSetup[] = []
        for (const property in data) {
            temp_list.push({
                NameGolf: property,
                AddressGolf: data[property].Information.AddressGolf,
                ContactGolf: data[property].Information.ContactGolf,
                TelGolf: data[property].Information.TelGolf,
                NumberOfHolesGolf: data[property].Information.NumberOfHolesGolf,
            })
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
                        toast.warning("No Course available");
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
                generate_list_order_tee_box(data[property])
            }
        }
        setListGolfSetupCourse(temp_list)
    }



    // useEffect(
    //     () => {
    //         if (selectedNameRound1.length > 0) {
    //             //Get Firebase GPS
    //             get(child(dbRef, "TSN/Score/GolfSetup/" + selectedGolfName + '/Course/' + selectedNameRound1)).then((snapshot) => {
    //                 if (snapshot.exists()) {
    //                     let newData = snapshot.val();
    //                     generate_list_order_tee_box(newData)
    //                 } else {
    //                     console.log("No data available");
    //                 }
    //             }).catch((error) => {
    //                 console.error(error);
    //             });
    //         } else {
    //             generate_list_order_tee_box(null)
    //         }
    //     }
    //     , [selectedNameRound1]
    // );

    const generate_list_order_tee_box = (data: IGolfSetupCourse | null) => {
        let temp_list: IGolfSetupTeeBox[] = []
        if (data !== null) {
            for (let i = 1; i <= data?.NumberTeeBox; i++) {
                if (i == 1) {
                    temp_list.push({
                        TeeBoxName: data.Tee1.TeeBoxName,
                        Color: data.Tee1.Color,
                        TextColor: data.Tee1.TextColor
                    })
                }
                if (i == 2) {
                    temp_list.push({
                        TeeBoxName: data.Tee2.TeeBoxName,
                        Color: data.Tee2.Color,
                        TextColor: data.Tee2.TextColor
                    })
                }
                if (i == 3) {
                    temp_list.push({
                        TeeBoxName: data.Tee3.TeeBoxName,
                        Color: data.Tee3.Color,
                        TextColor: data.Tee3.TextColor
                    })
                }
                if (i == 4) {
                    temp_list.push({
                        TeeBoxName: data.Tee4.TeeBoxName,
                        Color: data.Tee4.Color,
                        TextColor: data.Tee4.TextColor
                    })
                }
                if (i == 5) {
                    temp_list.push({
                        TeeBoxName: data.Tee5.TeeBoxName,
                        Color: data.Tee5.Color,
                        TextColor: data.Tee5.TextColor
                    })
                }
                if (i == 6) {
                    temp_list.push({
                        TeeBoxName: data.Tee6.TeeBoxName,
                        Color: data.Tee6.Color,
                        TextColor: data.Tee6.TextColor
                    })
                }
            }
        }
        setListTeeBox(temp_list)
    }

    const EditNewGolfSetupTournament = () => {
        let check = false
        if (tournamentName.length == 0) {
            toast.warning('Need to choice Tournament Name');
            check = true
        }
        if (currentDate.length == 0) {
            toast.warning('Date can not empty');
            check = true
        }
        if (currentTime.length == 0) {
            toast.warning('Tee Time can not empty');
            check = true
        }
        if (selectedGolfName.length == 0) {
            toast.warning('Golf Name can not empty');
            check = true
        }
        // if (selectHoles == 9 && selectedNameRound1.length == 0) {
        //     toast.warning('Round can not empty');
        //     check = true
        // }
        // if (selectHoles == 18 && (selectedNameRound2.length == 0 || selectedNameRound1.length == 0)) {
        //     toast.warning('Round can not empty');
        //     check = true
        // }
        // if (selectHoles == 27 && (selectedNameRound3.length == 0 || selectedNameRound2.length == 0 || selectedNameRound1.length == 0)) {
        //     toast.warning('Round can not empty');
        //     check = true
        // }
        // if (selectHoles == 36 && (selectedNameRound4.length == 0 || selectedNameRound3.length == 0 || selectedNameRound2.length == 0 || selectedNameRound1.length == 0)) {
        //     toast.warning('Round can not empty');
        //     check = true
        // }
        if (selectedTeeForMen.length == 0) {
            toast.warning('Tee For Men can not empty');
            check = true
        }
        if (selectedTeeForMomen.length == 0) {
            toast.warning('Tee For Women can not empty');
            check = true
        }

        if (!check) {
            const setRef = ref(Database, "TSN/Score/Tournament/" + tournamentName + '/Setup');
            set(setRef,
                {
                    TournamentName: tournamentName,
                    Date: currentDate,
                    TeeTime: currentTime,
                    Address: address,
                    OrganizationName: organizationName,
                    NameDivision: nameDivision,
                    GolfName: selectedGolfName,
                    Hole: selectHoles,
                    // Round1: selectedNameRound1,
                    // Round2: selectedNameRound2,
                    // Round3: selectedNameRound3,
                    // Round4: selectedNameRound4,
                    TeeForMen: selectedTeeForMen,
                    TeeForWomen: selectedTeeForMomen,
                    BackgroundColorForMen: backgroundColorForMen,
                    BackgroundColorForWomen: backgroundColorForWomen,
                    Format: selectedFormat,
                    NumberOfDivision: numberOfDivision,
                    HdcMin: hdcMin,
                    HdcMax: hdcMax,
                    ChoiceResult: choiceResult,
                    Cut: cut,
                    CountBack: choiceCountBack,
                    NoneCut: noneCut,
                    NoneHDC: noneHDC
                })
            toast.success('Edit Tournament Success');

            setTournamentName('')
            setCurrentDate('')
            setCurrentTime('')
            setAddress('')
            setOrganizationName('')
            setSelectGolfName('')
            setSelectHoles(18)
            setSelectNameRound1('')
            setSelectNameRound2('')
            setSelectNameRound3('')
            setSelectNameRound4('')
            setSelectedTeeForMen('')
            setSelectedTeeForWomen('')
            setBackgroundColorForMen('')
            setBackgroundColorForWomen('')
            setSelectedFormat('STROKE')
            setNumberOfDivision('None')
            setChoiceCountBack('CountBack1')
            setSelectedOption(null)
        }
    }

    const DeleteTournament = () => {
        if (tournamentName.length == 0) {
            toast.warning('Need choice tournement name first');
        } else {
            const RemoveRef = ref(Database, "TSN/Score/Tournament/" + tournamentName);
            remove(RemoveRef).then(() => {
                toast.error('Delete Tournement Success');
                getInitialTournament()
                setTournamentName('')
                setCurrentDate('')
                setCurrentTime('')
                setAddress('')
                setOrganizationName('')
                setSelectGolfName('')
                setSelectHoles(18)
                setSelectNameRound1('')
                setSelectNameRound2('')
                setSelectNameRound3('')
                setSelectNameRound4('')
                setSelectedTeeForMen('')
                setSelectedTeeForWomen('')
                setBackgroundColorForMen('')
                setBackgroundColorForWomen('')
                setSelectedFormat('STROKE')
                setNumberOfDivision('None')
                setChoiceCountBack('CountBack1')
                setSelectedOption(null)
            })
        }
        setShowConfirmDelete(false)
    }
    var LimitWidthWindow = 1200

    const generatePage = () => {
        if (windowWidth > 0 && Page_Data.level !== -1) {
            return (
                <>
                    <div style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>EDIT SET-UP TOURNAMENT</div>
                    <Spacer y={1} />
                    <div style={{ display: windowWidth < LimitWidthWindow ? 'flow' : 'flex' }}>
                        <div ref={divRef} className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700"
                            style={{ maxWidth: 400, minWidth: windowWidth < LimitWidthWindow ? 350 : 400, width: '100%' }}>
                            <div style={{ color: 'white', fontSize: 20, fontWeight: 'normal', width: '100%', textAlign: 'center' }}>INFO</div>

                            <Spacer y={1} />
                            <My_divider />
                            <Spacer y={1} />

                            <div style={{ width: '100%', overflow: 'auto', height: 'calc(100% - 40px)' }}>
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <Select
                                        styles={customStyles}
                                        placeholder="Select Golf Name"
                                        className='SelectTag'
                                        onChange={
                                            (selectedOption: SingleValue<{ label: string, value: string }>) => {
                                                if (selectedOption) {
                                                    const { label, value } = selectedOption;
                                                    setSelectGolfName(value)
                                                    setSelectedOption(null)
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

                                <Spacer y={1} />

                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <Select
                                        styles={customStyles}
                                        placeholder="Select Tournament Name"
                                        className='SelectTag'
                                        value={selectedOption}
                                        onChange={
                                            (selectedOption: PropsValue<{ label: string, value: string }>) => {
                                                setSelectedOption(selectedOption);
                                                if (selectedOption) {
                                                    if (Array.isArray(selectedOption)) {
                                                        // Handle multi-select
                                                        const values = selectedOption.map(option => option.value);
                                                        console.log('Selected Golf Names:', values);
                                                    } else {
                                                        // Handle single-select
                                                        const value = (selectedOption as { label: string; value: string }).value;
                                                        setTournamentName(value)
                                                        const tempData: string[] = value.split('|');

                                                    }
                                                }
                                            }
                                        }

                                        options={
                                            listGolfSetupTournament.map(item => ({
                                                label: item, value: item
                                            }))
                                        }
                                    />
                                </div>
                                <Spacer y={1} />
                                <div style={{ justifyContent: 'center', }}>
                                    <div style={{}}>Date:</div>
                                    <input
                                        onChange={handleChangeDate}
                                        value={currentDate}
                                        // disabled={selectedGolfName == ''}
                                        style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                        type="date"
                                        placeholder='DATE' />
                                </div>
                                <Spacer y={1} />
                                <div style={{ justifyContent: 'center', }}>
                                    <div style={{}}>TEE Time:</div>
                                    <input
                                        onChange={handleChangeTime}
                                        value={currentTime}
                                        // disabled={selectedGolfName == ''}
                                        style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                        type="time"
                                        placeholder='TIME' />
                                </div>
                                <Spacer y={1} />
                                <div style={{ justifyContent: 'center', }}>
                                    <div style={{}}>Address:</div>
                                    <input
                                        onChange={handleChangeAddress}
                                        value={address}
                                        // disabled={selectedGolfName == ''}
                                        style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                        type="text"
                                        placeholder='Address' />
                                </div>
                                <Spacer y={1} />
                                <div style={{ justifyContent: 'center', }}>
                                    <div style={{}}>Organization Name:</div>
                                    <input
                                        onChange={handleChangeOrganizationName}
                                        value={organizationName}
                                        // disabled={selectedGolfName == ''}
                                        style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                        type="text"
                                        placeholder='Organization Name' />
                                </div>
                                <Spacer y={1} />
                                <Spacer y={1} />
                                <My_divider />
                                <Spacer y={1} />




                                {/* <div className='basis-1/4 align-middle bg-red-700'>
                                    <div style={{ width: 150 }}>
                                        < Image
                                            unoptimized
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ width: '100%', height: 'auto' }}
                                            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIMpAXv5-HjzJvvw7M51zSg9H2eBHa68rAPaq2hVAdqSdqPWqJhG7KYS7c32jhRuEaRAY&usqp=CAU'}
                                            alt="IMAGE"
                                        // priority={true}
                                        />
                                    </div>

                                </div> */}
                            </div>
                        </div>

                        <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700"
                            style={{ maxWidth: 400, minWidth: windowWidth < LimitWidthWindow ? 350 : 400, width: '100%', flex: 'none', height: windowWidth >= LimitWidthWindow ? '100%' : 'auto', maxHeight: heightBoxLeft }}>
                            <div style={{ color: 'white', fontSize: 20, fontWeight: 'normal', width: '100%', textAlign: 'center' }}>PARAMETER</div>

                            <Spacer y={1} />
                            <My_divider />
                            <Spacer y={1} />
                            <div style={{ width: '100%', overflow: 'auto', height: 'calc(100% - 40px)' }}>
                                <div className='basis-3/4'>

                                    <div key={`reverse-radio`} className="flex justify-around">
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="9 (holes)"
                                            name="group1"
                                            isValid={selectHoles == 9}
                                            id={`reverse-radio-1`}
                                            onChange={() => setSelectHoles(9)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            // ref={checkboxRef18}
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="18 (holes)"
                                            name="group1"
                                            isValid={selectHoles == 18}
                                            id={`reverse-radio-2`}
                                            onChange={() => setSelectHoles(18)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="27 (holes)"
                                            name="group1"
                                            isValid={selectHoles == 27}
                                            id={`reverse-radio-3`}
                                            onChange={() => setSelectHoles(27)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="36 (holes)"
                                            name="group1"
                                            isValid={selectHoles == 36}
                                            id={`reverse-radio-4`}
                                            onChange={() => setSelectHoles(36)}
                                        >
                                        </Form.Check>
                                    </div>


                                    {/* {selectHoles >= 9 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ paddingTop: 5 }}>Round In:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                disabled={selectedGolfName == ''}
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound1}
                                                onChange={(data) => {
                                                    setSelectNameRound1(data.target.value)
                                                }}
                                            >
                                                <option>Select Name Round 1</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectHoles >= 18 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ paddingTop: 5 }}>Round Out:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                disabled={selectedGolfName == ''}
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound2}
                                                onChange={(data) => {
                                                    setSelectNameRound2(data.target.value)
                                                }}
                                            >
                                                <option>Select Name Round 2</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectHoles >= 27 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ paddingTop: 5 }}>Round Add 1:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                disabled={selectedGolfName == ''}
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound3}
                                                onChange={(data) => {
                                                    setSelectNameRound3(data.target.value)
                                                }}
                                            >
                                                <option>Select Name Round 3</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectHoles >= 36 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ paddingTop: 5 }}>Round Add 2:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                disabled={selectedGolfName == ''}
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound4}
                                                onChange={(data) => {
                                                    setSelectNameRound4(data.target.value)
                                                }}
                                            >
                                                <option>Select Name Round 4</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    } */}

                                    <Spacer y={1} />

                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ paddingTop: 5 }}>Tee For Men:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                backgroundColor: backgroundColorForMen === '' ? 'rgb(59 59 59)' : backgroundColorForMen,
                                                color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            disabled={selectedGolfName == ''}
                                            value={selectedTeeForMen}
                                            onChange={(e) => {
                                                const selectedOption = e.target.options[e.target.selectedIndex];
                                                const selectedColor = selectedOption.getAttribute('data-color');
                                                setSelectedTeeForMen(e.target.value)
                                                setBackgroundColorForMen(selectedColor || '')
                                            }}
                                        >
                                            <option>Select TEE</option>
                                            {listTeeBox.map((element, key) => (
                                                <option key={element.TeeBoxName} value={element.TeeBoxName} data-color={element.Color}
                                                    style={{
                                                        backgroundColor: element.Color
                                                    }}>{element.TeeBoxName}</option>
                                            ))}
                                        </Form.Select>
                                    </div>

                                    <Spacer y={1} />

                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ paddingTop: 5 }}>Tee For Women:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%',
                                                textAlign: 'center',
                                                backgroundColor: backgroundColorForWomen === '' ? 'rgb(59 59 59)' : backgroundColorForWomen,
                                                color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            disabled={selectedGolfName == ''}
                                            value={selectedTeeForMomen}
                                            onChange={(e) => {
                                                const selectedOption = e.target.options[e.target.selectedIndex];
                                                const selectedColor = selectedOption.getAttribute('data-color');
                                                setSelectedTeeForWomen(e.target.value)
                                                setBackgroundColorForWomen(selectedColor || '')
                                            }}
                                        >
                                            <option>Select TEE</option>
                                            {listTeeBox.map((element, key) => (
                                                <option key={element.TeeBoxName} value={element.TeeBoxName} data-color={element.Color}
                                                    style={{
                                                        backgroundColor: element.Color
                                                    }}>{element.TeeBoxName}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700"
                            style={{ maxWidth: 400, minWidth: windowWidth < LimitWidthWindow ? 350 : 400, flex: 'none', height: windowWidth >= LimitWidthWindow ? '100%' : 'auto', maxHeight: windowWidth < LimitWidthWindow ? 'auto' : heightBoxLeft }}>
                            <div style={{ color: 'white', fontSize: 20, fontWeight: 'normal', width: '100%', textAlign: 'center' }}>FORMAT</div>

                            <Spacer y={1} />
                            <My_divider />
                            <Spacer y={1} />
                            <div style={{ width: '100%', overflow: 'auto', height: windowWidth < LimitWidthWindow ? 'auto' : 'calc(100% - 40px)', maxHeight: windowWidth < LimitWidthWindow ? 'none' : heightBoxLeft - 100 }}>
                                <div className='basis-3/4'>
                                    <div key={`reverse-radio`} className="flex gap-4 justify-center">
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 14 }}
                                            type='radio'
                                            reverse
                                            label="STROKE PLAY"
                                            name="group2"
                                            isValid={selectedFormat == 'STROKE'}
                                            id={`reverse-radio-1`}
                                            onChange={() => setSelectedFormat('STROKE')}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 14 }}
                                            type='radio'
                                            reverse
                                            label="MATCH PLAY"
                                            name="group2"
                                            isValid={selectedFormat == 'MATCH'}
                                            id={`reverse-radio-2`}
                                            onChange={() => setSelectedFormat('MATCH')}
                                        >
                                        </Form.Check>
                                    </div>

                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ paddingTop: 5 }}>Number Of Divisions:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%', textAlign: 'center',
                                                backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            value={numberOfDivision}
                                            onChange={(data) => {
                                                setNumberOfDivision(data.target.value)
                                            }}
                                        >
                                            {ListNumberOfDivision.map((element, key) => (
                                                <option style={{ width: '100%' }} key={element} value={element}>{element.toString()}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <Spacer y={1} />
                                    {
                                        ListNumberOfDivision.map((element, key) => {
                                            if (parseInt(numberOfDivision) >= key + 1 && parseInt(numberOfDivision) > 0) {
                                                return (
                                                    <div key={key}>
                                                        <div style={{ justifyContent: 'space-around', display: 'flex' }} className='p-1 rounded-md border-1 border-solid border-slate-700'>
                                                            <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                                                                <input
                                                                    onChange={(event) => handleChangeNameDivision(event, key)}
                                                                    value={nameDivision[key]}
                                                                    // disabled={selectedGolfName == ''}
                                                                    style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: 100, textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 12 }}
                                                                    type="text"
                                                                    placeholder='Name' />
                                                            </div>
                                                            <div style={{ display: 'flex', width: 150, justifyContent: 'space-between' }} className='p-1 rounded-md border-1 border-solid border-slate-700'>
                                                                <div style={{ justifyContent: 'center', width: 40, display: 'flex' }}>
                                                                    <Form.Check // prettier-ignore
                                                                        style={{
                                                                            textAlign: 'center', fontSize: 10, display: 'flex', alignItems: 'center'
                                                                        }}
                                                                        type='checkbox'
                                                                        label='None HDC'
                                                                        isValid={noneHDC[key]}
                                                                        onChange={() => handleChangeNoneHDC(noneHDC[key], key)}
                                                                    />
                                                                </div>
                                                                {
                                                                    !noneHDC[key] &&
                                                                    <div >
                                                                        <div style={{ textAlign: 'center', fontSize: 10 }}>HDC-Min:</div>
                                                                        <input
                                                                            onChange={(event) => handleChangeHdcMin(event, key)}
                                                                            value={hdcMin[key]}
                                                                            // disabled={selectedGolfName == ''}
                                                                            style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: 45, textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 12 }}
                                                                            type="number"
                                                                            placeholder='Min' />
                                                                    </div>
                                                                }
                                                                {
                                                                    !noneHDC[key] &&
                                                                    <div style={{ justifyContent: 'center', }}>
                                                                        <div style={{ textAlign: 'center', fontSize: 10 }}>HDC-Max:</div>
                                                                        <input
                                                                            onChange={(event) => handleChangeHdcMax(event, key)}
                                                                            value={hdcMax[key]}
                                                                            // disabled={selectedGolfName == ''}
                                                                            style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: 45, textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 12 }}
                                                                            type="number"
                                                                            placeholder='Max' />
                                                                    </div>
                                                                }
                                                            </div>
                                                            <div style={{ display: 'flex', width: 90, justifyContent: 'space-between' }} className='p-1 rounded-md border-1 border-solid border-slate-700'>
                                                                <div style={{ justifyContent: 'center', width: 40, }}>
                                                                    <Form.Check // prettier-ignore
                                                                        style={{
                                                                            textAlign: 'center', fontSize: 12, display: 'flex', alignItems: 'center'
                                                                        }}
                                                                        type='checkbox'
                                                                        label='None Cut'

                                                                        isValid={noneCut[key]}
                                                                        onChange={() => handleChangeNoneCut(noneCut[key], key)}
                                                                    />
                                                                </div>
                                                                {
                                                                    !noneCut[key] &&
                                                                    <div style={{ justifyContent: 'center', }}>
                                                                        <div style={{ textAlign: 'center', fontSize: 10 }}>Cut:</div>
                                                                        <input
                                                                            className=''
                                                                            onChange={(event) => handleChangeCut(event, key)}
                                                                            value={cut[key]}
                                                                            // disabled={selectedGolfName == ''}
                                                                            style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: 40, textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 12 }}
                                                                            type="number"
                                                                            min="-10" step="1"
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                    <Spacer y={1} />
                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ paddingTop: 5 }}>Select Award:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%', textAlign: 'center',
                                                backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            value={choiceResult}
                                            onChange={(data) => {
                                                setChoiceResult(data.target.value)
                                            }}

                                        >
                                            {ListResult.map((element, key) => (
                                                <option style={{ width: '100%' }} key={element} value={element}>{element.toString()}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <Spacer y={1} />
                                    <div style={{ justifyContent: 'center', }}>
                                        <div style={{}}>Select Tie:</div>
                                        <div key={`reverse-radio`} className="gap-4 justify-center p-2">
                                            <Form.Check
                                                style={{ textAlign: 'center', fontSize: 14 }}
                                                type='radio'
                                                // reverse
                                                inline
                                                label="Count Back 1"
                                                name="group3"
                                                isValid={choiceCountBack == 'CountBack1'}
                                                id={`reverse-radio-1`}
                                                onChange={() => setChoiceCountBack('CountBack1')}
                                            >
                                            </Form.Check>
                                            <Form.Check
                                                style={{ textAlign: 'center', fontSize: 14 }}
                                                type='radio'
                                                // reverse
                                                inline
                                                label="Count Back 2"
                                                name="group3"
                                                isValid={choiceCountBack == 'CountBack2'}
                                                id={`reverse-radio-2`}
                                                onChange={() => setChoiceCountBack('CountBack2')}
                                            >
                                            </Form.Check>
                                            <Form.Check
                                                style={{ textAlign: 'center', fontSize: 14 }}
                                                type='radio'
                                                // reverse
                                                inline
                                                label="Count Back 3"
                                                name="group3"
                                                isValid={choiceCountBack == 'CountBack3'}
                                                id={`reverse-radio-2`}
                                                onChange={() => setChoiceCountBack('CountBack3')}
                                            >
                                            </Form.Check>
                                            <Form.Check
                                                style={{ textAlign: 'center', fontSize: 14 }}
                                                type='radio'
                                                // reverse
                                                inline
                                                label="Count Back 4"
                                                name="group3"
                                                isValid={choiceCountBack == 'CountBack4'}
                                                id={`reverse-radio-2`}
                                                onChange={() => setChoiceCountBack('CountBack4')}
                                            >
                                            </Form.Check>
                                            <Form.Check
                                                style={{ textAlign: 'center', fontSize: 14 }}
                                                type='radio'
                                                // reverse
                                                inline
                                                label="Count Back 5"
                                                name="group3"
                                                isValid={choiceCountBack == 'CountBack5'}
                                                id={`reverse-radio-2`}
                                                onChange={() => setChoiceCountBack('CountBack5')}
                                            >
                                            </Form.Check>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Spacer y={1} />
                    <Button
                        onClick={EditNewGolfSetupTournament}
                        style={{ width: '100%' }} variant="primary">EDIT SET-UP TOURNAMENT
                    </Button>

                    <Spacer y={1} />
                    <My_divider />
                    <Spacer y={1} />

                    <Button onClick={() => setShowConfirmDelete(true)} style={{ width: '100%' }} variant="danger" disabled={selectedGolfName == ''}>DELETE SET-UP TOURNAMENT</Button>

                    <Confirm show={showConfirmDelete} title='Confirm Delete:' content={`Do you sure to delete this tournament: ${tournamentName} ?`} setShowConfirm={setShowConfirmDelete} callCommand={DeleteTournament} />
                </>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
    return (

        <div style={{ maxWidth: 1200, width: windowWidth, justifyContent: 'center', display: 'grid', padding: 2 }}>
            {generatePage()}

        </div>
    );
}

export default Page;
