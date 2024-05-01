'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer, useDisclosure, Divider, Checkbox, SelectItem, Modal, ModalHeader, ModalContent, ModalBody, Tabs, Tab } from "@nextui-org/react";

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import * as redux_uiUser from '@/redux/features/UiUser'
import { getDatabase, ref, update, child, get, onValue, orderByChild, query, equalTo } from "firebase/database";
import { toast } from 'react-toastify';
import Page_ViewTableScore from './page_viewTableScore';
import styles from './page.module.css'
import { Database } from '../../../../../../firebase';
import My_divider from './my_divider';
import Form from 'react-bootstrap/Form';
import PrintCall from './PrintCall';
import Page_ViewTableScorePrint from './page_viewTableScorePrint';
import Loading from './loading';
import Confirm from '@/components/confirm';

import { SingleValue, PropsValue } from 'react-select';
import InfoPlayer from './InfoPLayer';
import { useAppSelector } from '@/redux/store';
import { Input, Select, Space, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, SearchOutlined } from '@ant-design/icons';
import { Timestamp } from 'firebase-admin/firestore';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'

const customStyles: CustomSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '2px solid #4a90e2' : '1px solid #435b7d',
        borderRadius: '4px',
        boxShadow: state.isFocused ? '0 0 0 2px rgba(74, 144, 226, 0.5)' : null,
        backgroundColor: '#669bbc',// '#2f3d57',
        color: 'white',
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

export default function Page() {
    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(7))
    dispatch(redux_page.setChoice('Score'))
    const router = useRouter()
    const searchParams = useSearchParams();

    const [haveData, setHaveData] = useState<boolean>(false);
    const [correctPassword, setCorrectPassword] = useState<boolean>(false);
    const [showButtonAccess, setShowButtonAccess] = useState<boolean>(false);
    // const [selectedGolfName, setSelectGolfName] = useState<string>('')
    const [listGolfSetupInformation, setListGolfSetupInformation] = useState<IGolfSetup[]>([])
    const [selectedHoles, setSelectedHoles] = useState<number>(0)
    // const [timestamp, setTimestamp] = useState<string>('')
    // const [game, setGame] = useState<string>('')
    // const [choiceNameGroup, setChoiceNameGroup] = useState<string>('')
    const [fullMode, setFullMode] = useState<boolean>(false)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');
    const [addressCourse, setAddressCourse] = useState<string>('');
    const [nameGolfSelected, setNameGolfSelected] = useState<string>('');
    const [timestamp, setTimestamp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [nameGroup, setNameGroup] = useState<string>('');
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [enableSearch, setEnableSearch] = useState<boolean>(false);

    const [dataGame, setDataGame] = useState<GolfDataGame>({
        DataPlayers: [{
            Scores: [],
            Bag: '',
            Caddie: '',
            CarNo: '',
            Color: '',
            TextColor: '',
            HDC: 0,
            VGA: 0,
            NamePlayer: '',
            TeeBox: ''
        }],
        Data: '',
        Time: '',
        Format: '',
        Holes: 0,
        NameCourse: '',
        NumberOfPlayers: 0,
        Round1: '',
        Round2: '',
        Round3: '',
        Round4: '',
        StartingHole: 0
    })

    const [listGroup, setListGroup] = useState<{
        Time: string,
        NameGroup: string
    }[]>([])
    const [showScore, setShowScore] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<PropsValue<{ label: string; value: string; }>>(null);
    const [typeScore, setTypeScore] = useState<string>('Total')
    const [showConfirmCancel, setShowConfirmCancel] = useState<boolean>(false)
    const [showCancel, setShowCancel] = useState<boolean>(true)
    const [reloadData, setReloadData] = useState<boolean>(false)
    const [autoAccess, setAutoAccess] = useState<boolean>(false)

    useEffect(() => {
        try {
            const UrlPassWord = decodeURIComponent(searchParams?.get('password') || '')
            const UrlTimeStamp = decodeURIComponent(searchParams?.get('timestamp') || '')
            if (UrlPassWord && atob(UrlPassWord) != '_') {
                setPassword(atob(UrlPassWord))
            }
            if (UrlTimeStamp && atob(UrlTimeStamp) != '_') {
                setTimestamp(atob(UrlTimeStamp))
            }
            // if (atob(UrlPassWord).length > 0 && atob(UrlTimeStamp).length > 0) {
            //     setReloadData(true)
            // }
        } catch (error) {

        }

    }, []);

    useEffect(
        () => {
            if (nameGolfSelected.length > 0) {
                //Get Firebase GPS
                // setGame('')
                // setTimestamp('')
                // dispatch(redux_uiUser.setTimestamp(0))
                setListGroup([])
                get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/Course')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        setCorrectPassword(false)
                        if (timestamp.length > 0) {
                            setReloadData(true)
                        }
                        // setListGolfSetupCourse(newData)
                        generate_list_order_course(newData)
                    } else {
                        toast.warning("No Course available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                // setListGolfSetupCourse([])
                generate_list_order_course(null)
            }
        }
        , [nameGolfSelected]
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
        // setListGolfSetupCourse(temp_list)
    }

    //generate list name group
    useEffect(
        () => {
            if (nameGolfSelected.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        generate_list_name_group(newData)
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                generate_list_name_group(null)
            }
        }
        , [nameGolfSelected]
    );
    const generate_list_name_group = (data: IGhiDiem | null) => {
        let temp_list: { Time: string, NameGroup: string }[] = []
        for (const property in data) {
            temp_list.push({
                Time: property,
                NameGroup: data[property].NameGroup
            })
        }
        setListGroup(temp_list)
    }

    const fnAccess = () => {
        if (nameGolfSelected.length > 0 && timestamp.length > 0) {
            const orderedDbRef = query(ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp));
            get(orderedDbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (newData.Password == password) {
                        // router.push(`/Score/Game/Personal/Enter/${btoa(password == '' ? '_' : password)}/${btoa(timestamp)}`)
                        router.push(`/Score/Game/Personal/Enter?password=${btoa(password == '' ? '_' : password)}&timestamp=${btoa(timestamp)}`)
                        setCorrectPassword(true)
                        setReloadData(true)

                    } else {
                        toast.warn('Incorrect Password')
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    const fnGetDataFirebasegame = () => {
        if (nameGolfSelected.length > 0 && timestamp.length > 0 && reloadData) {
            setReloadData(false)
            const orderedDbRef = query(ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp));

            get(orderedDbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (newData.Password == password) {
                        setCorrectPassword(true)
                        setTypeScore(newData.TypeScore)
                        setShowCancel(false)
                        setShowButtonAccess(false)
                    } else {
                        toast.warn('Incorrect Password')
                    }
                }
            }).catch((error) => {
                console.error(error);
            });

            const dataGolfSetupGameRef = ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp);
            onValue(dataGolfSetupGameRef, (snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (newData.Password == password) {
                        setCorrectPassword(true)
                        setDataGame(newData)
                        setSelectedHoles(newData.Holes)
                        setShowButtonAccess(false)
                    }
                } else {
                    console.log("No data available");
                }
            });
        }
    }
    //generate data
    useEffect(
        () => {
            fnGetDataFirebasegame()
        }
        , [nameGolfSelected, timestamp, reloadData]
    );
    useEffect(
        () => {
            fnAccess()
        }
        , [autoAccess]
    );


    useEffect(
        () => {
            //Get List Name Game Personal
            const orderedDbRef = query(ref(Database, "TSN/Score/GolfSetup/"), orderByChild("time_create"));
            get(orderedDbRef).then((snapshot) => {
                if (snapshot.exists()) {
                    let results: IGolfSetupAll[] = [];
                    snapshot.forEach((child) => {
                        results.push({
                            id: child.key,
                            ...child.val()
                        });
                    })
                    setHaveData(true)
                    // generate_list_order_information(results)
                    let temp_list: IGolfSetup[] = []
                    results.forEach(item => {
                        temp_list.push({
                            NameGolf: item.Information.NameGolf,
                            AddressGolf: item.Information.AddressGolf,
                            ContactGolf: item.Information.ContactGolf,
                            TelGolf: item.Information.TelGolf,
                            NumberOfHolesGolf: item.Information.NumberOfHolesGolf,
                        })
                    })
                    setListGolfSetupInformation(temp_list)
                    setSelectedOption(null);
                    setNameGolfSelected(temp_list[0]?.NameGolf)
                    // setSelectedHoles(0)
                    setAddressCourse(temp_list[0]?.AddressGolf)
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error
            })

            // get(orderedDbRef).then((snapshot) => {
            //     if (snapshot.exists()) {
            //         setHaveData(true)
            //         let newData = snapshot.val();
            //         generate_list_order_information(newData)

            //     } else {
            //         console.log("No data available");
            //     }
            // }).catch((error) => {
            //     console.error(error);
            // });
        }
        , []
    );

    useEffect(() => {
        // Check if the window object is defined (for server-side rendering)
        if (typeof window !== 'undefined') {
            // Update the width when the window is resized
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
                if (window.innerWidth > 1000) {
                    setWindowWidth(1000);
                } else {
                    setWindowWidth(window.innerWidth);
                }

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
        }
    }, []); // Set Screen Measure



    const showTableDataRound1 = () => {
        return (
            <Page_ViewTableScore golfName={nameGolfSelected} luotChoi={1} dataConfig={dataGame} cellChange={(golfSetupCourse, typeScore, index, data, name, hole) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
        )
    }
    const showTableDataRound2 = () => {
        return (
            <Page_ViewTableScore golfName={nameGolfSelected} luotChoi={2} dataConfig={dataGame} cellChange={(golfSetupCourse, typeScore, index, data, name, hole) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
        )
    }
    const showTableDataRound3 = () => {
        return (
            <Page_ViewTableScore golfName={nameGolfSelected} luotChoi={3} dataConfig={dataGame} cellChange={(golfSetupCourse, typeScore, index, data, name, hole) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
        )
    }
    const showTableDataRound4 = () => {
        return (
            <Page_ViewTableScore golfName={nameGolfSelected} luotChoi={4} dataConfig={dataGame} cellChange={(golfSetupCourse, typeScore, index, data, name, hole) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
        )
    }
    const updateParameterPeople = (golfSetupCourse: IGolfSetupCourse, typeScore: string, index: number, data: string, name: string, hole: number) => {
        if (nameGolfSelected.length > 0 && timestamp.length > 0) {
            get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp + '/DataPlayers')).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (Array.isArray(newData)) {
                        if (newData.length > index) {
                            if (newData[index].NamePlayer == name) {

                                if (typeScore === 'Over') {
                                    if (data === 'CLEAR') {
                                        newData[index].Scores[hole] = golfSetupCourse.PAR[hole]
                                    } else if (data === '-' && parseInt(newData[index].Scores[hole]) !== 0) {
                                        newData[index].Scores[hole] = (-1) * (parseInt(newData[index].Scores[hole]) - golfSetupCourse.PAR[hole]) + golfSetupCourse.PAR[hole]
                                    } else {
                                        newData[index].Scores[hole] = newData[index].Scores[hole] !== 0 ?
                                            (10 * (parseInt(newData[index].Scores[hole]) - golfSetupCourse.PAR[hole]) + parseInt(data)) + golfSetupCourse.PAR[hole]
                                            :
                                            parseInt(data) + golfSetupCourse.PAR[hole]
                                    }
                                } else {
                                    if (data === 'CLEAR') {
                                        newData[index].Scores[hole] = 0
                                    } else if (data === '-') {
                                        newData[index].Scores[hole] = (-1) * parseInt(newData[index].Scores[hole])
                                    } else {
                                        newData[index].Scores[hole] = 10 * parseInt(newData[index].Scores[hole]) + parseInt(data)
                                    }
                                }

                                const updateRef = ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp + '/DataPlayers');
                                let temp_obj: { [key: string]: number } = {}
                                temp_obj[index] = newData[index]
                                update(updateRef, temp_obj)
                            }
                        }
                    }
                } else {
                    toast.warning("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });


        }
    }
    function calculateTotal(array: number[], startIndex: number, endIndex: number): number {
        let total: number = 0;
        if (endIndex == -1) endIndex = array.length - 1
        for (let i = startIndex; i <= endIndex; i++) {
            total += array[i];
        }
        return total;
    }
    const FnSetShowCancel = () => {
        setShowCancel(true)
        setTimestamp('')
        setCorrectPassword(false)
        setShowButtonAccess(true)
        setPassword('')
        setSelectedValue('')
        router.push(`/Score/Game/Personal/Enter?password=${btoa('_')}&timestamp=${btoa('_')}`)
    }
    const fnScoreCard_View = () => {
        return (
            <>
                {selectedHoles >= 9 ?
                    <div>
                        <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={1} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                    </div>
                    :
                    ''
                }
                {
                    selectedHoles >= 18 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={2} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                        </div>
                        :
                        ''
                }
                {
                    selectedHoles >= 27 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={3} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                        </div>
                        :
                        ''
                }
                {
                    selectedHoles >= 36 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={4} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                        </div>
                        :
                        ''
                }
            </>

        )
    }
    const fnScoreCard_Print = () => {
        return (
            <div style={{
                height: selectedHoles == 9 ? 544 : 800,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}
                className="p-2 rounded-md border-5 border-double border-slate-700">
                <div style={{ width: '100%', color: 'black', fontSize: 24, justifyContent: 'space-around', fontWeight: 'bold', display: 'flex' }}>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {nameGolfSelected}
                        </div>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {addressCourse}
                        </div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {nameGroup}
                        </div>
                        <div style={{ width: '100%', color: 'black', justifyContent: 'center', }}>
                            {(new Date(timestamp)).toLocaleString()}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: selectedHoles > 9 ? 'space-around' : 'center' }}>
                    {selectedHoles >= 9 ?
                        <div style={{ width: selectedHoles > 9 ? 500 : 700, paddingRight: 2 }}>
                            <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={1} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                        </div>
                        :
                        ''
                    }
                    {
                        selectedHoles >= 18 ?
                            <div style={{ width: selectedHoles > 9 ? 500 : 700, paddingLeft: 2 }}>
                                <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={2} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                            </div>
                            :
                            ''
                    }
                </div>
                <div style={{ display: 'flex', justifyContent: selectedHoles > 9 ? 'space-around' : 'center' }}>
                    {
                        selectedHoles >= 27 ?
                            <div style={{ width: selectedHoles > 9 ? 500 : 700 }}>
                                <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={3} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                            </div>
                            :
                            ''
                    }
                    {
                        selectedHoles >= 36 ?
                            <div style={{ width: selectedHoles > 9 ? 500 : 700 }}>
                                <Page_ViewTableScorePrint golfName={nameGolfSelected} luotChoi={4} dataConfig={dataGame} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={selectedHoles} />
                            </div>
                            :
                            ''
                    }
                </div>
                {selectedHoles === 9 &&
                    <div style={{ display: 'flex', justifyContent: 'space-around', height: 130, width: '100%' }}>
                        {dataGame.DataPlayers.map((item, key) => (
                            <div key={key}>
                                <InfoPlayer
                                    width={180}
                                    fontSize={14}
                                    namePlayer={item?.NamePlayer}
                                    HDC={item?.HDC}
                                    VGA={item?.VGA}
                                    score={calculateTotal(item.Scores, 0, -1)} />
                            </div>
                        ))}
                        {/* Display default InfoPlayer for remaining slots */}
                        {[...Array(Math.max(0, 4 - dataGame.DataPlayers.length))].map((_, index) => (
                            <div key={`default-${index}`}>
                                <InfoPlayer
                                    width={180}
                                    fontSize={14}
                                    namePlayer="---"
                                    HDC={0}
                                    VGA={0}
                                    score={0}
                                />
                            </div>
                        ))}
                    </div>
                }
                {selectedHoles === 18 &&
                    <div style={{ display: 'flex', justifyContent: 'space-around', height: 160, width: '100%', }}>
                        {dataGame.DataPlayers.map((item, key) => (
                            <div key={key}>
                                <InfoPlayer
                                    width={240}
                                    fontSize={18}
                                    namePlayer={item?.NamePlayer}
                                    HDC={item?.HDC}
                                    VGA={item?.VGA}
                                    score={calculateTotal(item.Scores, 0, -1)} />
                            </div>
                        ))}
                        {/* Display default InfoPlayer for remaining slots */}
                        {[...Array(Math.max(0, 4 - dataGame.DataPlayers.length))].map((_, index) => (
                            <div key={`default-${index}`}>
                                <InfoPlayer
                                    width={240}
                                    fontSize={18}
                                    namePlayer="---"
                                    HDC={0}
                                    VGA={0}
                                    score={0}
                                />
                            </div>
                        ))}
                    </div>
                }

            </div>
        )
    }

    const generatePage = () => {
        if (haveData) {
            return (
                <>
                    {showCancel ? <>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            < Image
                                unoptimized
                                width={150}
                                height={150}
                                // style={{ width: '100%', height: 'auto' }}
                                src={require('./icon.png')}
                                alt="IMAGE"
                            // priority={true}
                            />
                        </div>
                        <div className={styles.EnterGamePersonal}>ENTER GAME PERSONAL</div>

                        <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                            <Select
                                defaultValue={listGolfSetupInformation[0].NameGolf}
                                // styles={customStyles}
                                placeholder="Select Golf Name"
                                className='SelectTag'
                                onChange={
                                    (item: string) => {
                                        let currentOption = listGolfSetupInformation.find((option) => option.NameGolf === item)
                                        setSelectedValue('');
                                        setNameGolfSelected(item)
                                        setTimestamp('')
                                        setAddressCourse(currentOption?.AddressGolf || '')
                                    }
                                }
                                options={
                                    listGolfSetupInformation.map(item => ({
                                        label: item.NameGolf, value: item.NameGolf, address: item.AddressGolf
                                    }))
                                }
                            />
                        </div>
                        <My_divider />
                        <Input.Password
                            // style={{ backgroundColor: 'rgb(185 217 237)' }}
                            placeholder="Input password"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            value={password}
                            onChange={(event) => {
                                setPassword(event?.target.value)
                                setShowButtonAccess(true)
                            }}
                        />
                        <My_divider />
                        <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                            <Select
                                showSearch={enableSearch}
                                defaultValue={timestamp + '|' + nameGroup}
                                // styles={customStyles}
                                placeholder="Select Group Name"
                                className='SelectTag'
                                // value={selectedOption}
                                value={selectedValue}
                                onChange={(item: string) => {
                                    setSelectedHoles(0)
                                    setSelectedValue(item)
                                    const tempData: string[] = item.split('|');
                                    if (tempData.length == 2) {
                                        setTimestamp(tempData[0])
                                        setNameGroup(tempData[1])
                                        setAutoAccess(true)
                                    }
                                }}
                                dropdownRender={(menu) => (
                                    <>
                                        <Space style={{ justifyContent: 'center', display: 'flex' }}>
                                            <Button type="primary" ghost icon={<SearchOutlined />} onClick={() => setEnableSearch(!enableSearch)}>
                                                Enable Search
                                            </Button>
                                        </Space>
                                        <Divider style={{ margin: '2px 0' }} />
                                        {menu}

                                    </>
                                )}
                                options={
                                    listGroup.map(item => ({
                                        label: (new Date(parseInt(item.Time))).toLocaleString() + ' - ' + item.NameGroup, value: item.Time + '|' + item.NameGroup
                                    }))
                                }
                            />
                        </div>
                        {
                            showButtonAccess && timestamp.length != 0 ?
                                <>
                                    <My_divider />
                                    <Spacer y={2} />
                                    <Button type="primary" ghost onClick={fnAccess}>ACCESS</Button>
                                </> : ''
                        }
                    </> : ''}

                    {/* <br />
                    {
                        'Show Cancal: ' + JSON.stringify(showCancel)
                    }
                    <br />
                    {
                        timestamp
                    }
                    <br />
                    {
                        'correctPassword ' + JSON.stringify(correctPassword)
                    }
                    <br />
                    {
                        nameGolfSelected
                    }
                    <br />
                    {
                        'reloadData ' + JSON.stringify(reloadData)
                    }
                    <br /> */}


                    <div style={{ display: (timestamp.length == 0 || !correctPassword) ? 'none' : '' }}>
                        <div className={` ${fullMode ? styles.click_full_screen : styles.click_normal}`}>
                            {/* <div style={{ height: '100%' }}> */}
                            <div style={{
                                right: '25px',
                                fontWeight: 'bold',
                                fontSize: '33px', justifyContent: 'end',
                                display: 'flex', height: '41px', marginBottom: 4,
                                width: windowType == 'Mobile' ? windowWidth : '100%',
                                alignSelf: 'center'
                            }}>
                                <div
                                    key={`reverse-radio`}
                                    className="flex gap-4 justify-center"
                                    style={{
                                        fontWeight: 'normal',
                                        fontSize: '20px',
                                        width: '255px',
                                        alignSelf: 'center'
                                    }}>
                                    <Form.Check
                                        style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                        type='radio'
                                        reverse
                                        label="TOTAL"
                                        name="group3"
                                        isValid={typeScore == 'Total'}
                                        id={`reverse-radio3-1`}
                                        onChange={() => setTypeScore('Total')}
                                    >
                                    </Form.Check>
                                    <Form.Check
                                        style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                        type='radio'
                                        reverse
                                        label="OVER"
                                        name="group3"
                                        isValid={typeScore == 'Over'}
                                        id={`reverse-radio3-2`}
                                        onChange={() => setTypeScore('Over')}
                                    >
                                    </Form.Check>
                                </div>
                                <div style={{ width: '100%' }}></div>

                                <PrintCall selectedHoles={selectedHoles} nameFile={(new Date(timestamp)).toLocaleString() + ' - ' + nameGroup} />

                                <div style={{
                                    fontSize: '20px',
                                    color: 'red',
                                    marginLeft: '15px',
                                    marginRight: '15px',
                                    alignSelf: 'center',
                                    cursor: 'pointer'
                                }} onClick={() => { setShowScore(true) }}>👁</div>
                                <div style={{
                                    fontSize: '20px',
                                    color: 'red',
                                    marginLeft: '15px',
                                    marginRight: '15px',
                                    alignSelf: 'center',
                                    cursor: 'pointer'
                                }} onClick={() => { setShowConfirmCancel(true) }}>✕</div>
                                <div style={{
                                    fontSize: '30px',
                                    color: 'red',
                                    marginLeft: '15px',
                                    marginRight: '15px',
                                    alignSelf: 'center',
                                    cursor: 'pointer'
                                }} onClick={() => { setFullMode(!fullMode) }}>{fullMode ? '⎆' : '⛶'}</div>
                            </div>
                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', width: '100%', textAlign: 'center' }}>{currentTitle}</div>

                            <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700 overflow-auto" style={{ width: fullMode ? '100%' : windowWidth }}>
                                {/* <div style={{ overflow: 'auto', width: '100%' }}> */}
                                <Tabs aria-label="Tabs sizes" size='sm' className='w-full'>
                                    {selectedHoles >= 9 ?
                                        <Tab key="Round1" title="ROUND 1">
                                            {showTableDataRound1()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {selectedHoles >= 18 ?
                                        <Tab key="Round2" title="ROUND 2">
                                            {showTableDataRound2()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {selectedHoles >= 27 ?
                                        <Tab key="Round3" title="ROUND 3">
                                            {showTableDataRound3()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {selectedHoles >= 36 ?
                                        <Tab key="Round4" title="ROUND 4">
                                            {showTableDataRound4()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                </Tabs>

                            </div>
                            <div style={{ display: 'none' }}>
                                <div id='component_print'>
                                    {fnScoreCard_Print()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Confirm show={showConfirmCancel} title='Confirm Cancel:' content={`Do you sure to close this score card?`} setShowConfirm={setShowConfirmCancel} callCommand={FnSetShowCancel} />

                </>
            )
        } else {
            return (
                <Loading />
            )
        }
    }

    return (
        <div className={`${styles.PagePanel}`} style={{ width: windowWidth }}>
            {generatePage()}
            <Modal
                // data-bs-theme="dark"
                isOpen={showScore}
                // backdrop="static"
                // keyboard={false}
                placement={'center'}
                size="lg"
                backdrop='opaque'
                // fullscreen={true}
                scrollBehavior={'inside'}
                classNames={{
                    // backdrop: 'bg-neutral-100',
                    body: 'bg-teal-600',
                    // wrapper: 'bg-cyan-500',
                    header: 'bg-teal-800'
                }}
                onClose={() => setShowScore(false)}
            >
                <ModalContent>
                    <ModalHeader style={{ backgroundColor: '#343a40' }}>
                        <div style={{ color: 'azure', fontSize: 18, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                            {nameGolfSelected}
                        </div>
                        <div style={{ color: 'azure', fontSize: 18, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                            {(new Date(timestamp)).toLocaleString() + ' - ' + nameGroup}
                        </div>
                    </ModalHeader>
                    <ModalBody style={{ fontSize: 24, color: 'azure', backgroundColor: 'darkgray' }}>
                        {fnScoreCard_View()}
                    </ModalBody>
                </ModalContent>
            </Modal >

        </div >
    );

}