'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer, Modal, ModalHeader, ModalContent, ModalBody, Divider, Checkbox, SelectItem, CheckboxGroup, Tabs, Tab } from "@nextui-org/react";

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, update, child, get, onValue } from "firebase/database";
import { toast } from 'react-toastify';
import Page_ViewTableScore from './page_viewTableScore';
import styles from './page.module.css'
import { Database } from '../../../../../../firebase';
import My_divider from './my_divider';
import Form from 'react-bootstrap/Form';
import PrintCall from './PrintCall';
import Page_ViewTableScorePrint from './page_viewTableScorePrint';
import Button from 'react-bootstrap/Button';
import Loading from './loading';
import Select, { SingleValue, PropsValue } from 'react-select';
import InfoPlayer from './InfoPLayer';
import { My_Soul } from 'next/font/google';

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
    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(14))
    dispatch(redux_page.setChoice('Score'))

    const [haveData, setHaveData] = useState<boolean>(false);
    const [golfName, setGolfName] = useState<string>('')
    const [listGolfSetupInformation, setListGolfSetupInformation] = useState<IGolfSetup[]>([])
    const [holes, setHoles] = useState<number>(0)
    const [groupName, setGroupName] = useState<string>('')
    const [choiceNameGroup, setChoiceNameGroup] = useState<string>('')
    const [fullMode, setFullMode] = useState<boolean>(false)
    const [currentTitle, setCurrentTitle] = useState<string>('')
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');

    const [listGolfSetupTournament, setListGolfSetupTournament] = useState<string[]>([])
    const [tournamentName, setTournamentName] = useState<string>('');
    const [listGolfDataPlayerTournament, setListGolfDataPlayerTournament] = useState<IGolfDataPlayerTournament[]>([])
    const [nameRound1, setNameRound1] = useState<string>('');
    const [nameRound2, setNameRound2] = useState<string>('');
    const [nameRound3, setNameRound3] = useState<string>('');
    const [nameRound4, setNameRound4] = useState<string>('');
    const [teeForMen, setTeeForMen] = useState<string>('');
    const [teeForWomen, setTeeForWomen] = useState<string>('');
    const [addressCourse, setAddressCourse] = useState<string>('');
    const [organizationName, setOrganizationName] = useState<string>('');

    const [dataSetup, setDataSetup] = useState<IGolfDataSetupTournament>({
        Address: '',
        ChoiceResult: '',
        CountBack: '',
        Cut: new Array(10).fill(0),
        Date: '',
        Format: '',
        GolfName: '',
        HdcMax: new Array(36).fill(0),
        HdcMin: new Array(36).fill(0),
        Hole: 0,
        NameDivision: new Array(36).fill(''),
        NoneCut: new Array(36).fill(0),
        NoneDHC: new Array(36).fill(0),
        NumberOfDivision: '',
        OrganizationName: '',
        TeeForMen: '',
        TeeForWomen: '',
        TeeTime: '',
        TournamentName: '',
        BackgroundColorForMen: '',
        BackgroundColorForWomen: '',
    })
    const [dataPlayers, setDataPlayers] = useState<IGolfDataPlayersTournament[]>([])

    const [listGroup, setListGroup] = useState<string[]>([])
    const [showScore, setShowScore] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<PropsValue<{ label: string; value: string; }>>(null);
    const [typeScore, setTypeScore] = useState<string>('Total')

    useEffect(
        () => {
            if (tournamentName.length > 0) {
                //Get Firebase GPS
                const dataPlayersDatabase = ref(Database, "TSN/Score/Tournament/" + tournamentName + '/Players');
                onValue(dataPlayersDatabase, (snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        let ArrListDataPlayer: IGolfDataPlayerTournament[] = []
                        for (const property in newData) {
                            ArrListDataPlayer.push(newData[property])
                        }
                        setListGolfDataPlayerTournament(ArrListDataPlayer)
                        const holeList = Array.from(new Set(Object.values(ArrListDataPlayer).map(item => item.Hole)));
                        setListGroup(holeList);

                    } else {
                        toast.warning("No Tournament available");
                    }
                })

                get(child(dbRef, "TSN/Score/Tournament/" + tournamentName + '/Setup')).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        setDataSetup(newData)
                        setGolfName(newData.GolfName)
                        setHoles(newData.Hole)
                        setTeeForMen(newData.TeeForMen)
                        setTeeForWomen(newData.TeeForWomen)
                        setAddressCourse(newData.Address)
                        setOrganizationName(newData.OrganizationName)
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
            if (listGolfDataPlayerTournament.length > 0) {
                const elementsWithGroupName = Object.values(listGolfDataPlayerTournament).filter(element => element.Hole === groupName);
                setDataPlayers(elementsWithGroupName)
            }
        }
        , [listGolfDataPlayerTournament]
    );

    useEffect(
        () => {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/Tournament")).then((snapshot) => {
                if (snapshot.exists()) {
                    setHaveData(true)
                    let newData = snapshot.val();
                    generate_list_order_tournament(newData)
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
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
    }, []); // Empty dependency array means this effect runs once after the initial render



    const generate_list_order_tournament = (data: IGolfTournamentSetupArr) => {
        let temp_list: string[] = []
        for (const property in data) {
            temp_list.push(property)
        }
        setListGolfSetupTournament(temp_list)
    }

    const showTableDataRound1 = () => {
        return (
            <Page_ViewTableScore golfName={golfName} luotChoi={1} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} cellChange={(golfSetupCourse, typeScore, index, data, name, hole, id) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole, id)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
        )
    }
    const showTableDataRound2 = () => {
        return (
            <Page_ViewTableScore golfName={golfName} luotChoi={2} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} cellChange={(golfSetupCourse, typeScore, index, data, name, hole, id) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole, id)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
        )
    }
    const showTableDataRound3 = () => {
        return (
            <Page_ViewTableScore golfName={golfName} luotChoi={3} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} cellChange={(golfSetupCourse, typeScore, index, data, name, hole, id) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole, id)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
        )
    }
    const showTableDataRound4 = () => {
        return (
            <Page_ViewTableScore golfName={golfName} luotChoi={4} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} cellChange={(golfSetupCourse, typeScore, index, data, name, hole, id) => updateParameterPeople(golfSetupCourse, typeScore, index, data, name, hole, id)} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
        )
    }
    const updateParameterPeople = (golfSetupCourse: IGolfSetupCourse, typeScore: string, index: number, data: string, name: string, hole: number, id: string) => {
        if (tournamentName.length > 0) {
            get(child(dbRef, "TSN/Score/Tournament/" + tournamentName + '/Players/' + id)).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (newData.NamePlayer == name) {
                        if (typeScore === 'Over') {
                            if (data === 'CLEAR') {
                                newData.Scores[hole] = golfSetupCourse.PAR[hole]
                            } else if (data === '-' && parseInt(newData.Scores[hole]) !== 0) {
                                newData.Scores[hole] = (-1) * (parseInt(newData.Scores[hole]) - golfSetupCourse.PAR[hole]) + golfSetupCourse.PAR[hole]
                            } else {
                                newData.Scores[hole] = newData.Scores[hole] !== 0 ?
                                    (10 * (parseInt(newData.Scores[hole]) - golfSetupCourse.PAR[hole]) + parseInt(data)) + golfSetupCourse.PAR[hole]
                                    :
                                    parseInt(data) + golfSetupCourse.PAR[hole]
                            }
                        } else {
                            if (data === 'CLEAR') {
                                newData.Scores[hole] = 0
                            } else if (data === '-') {
                                newData.Scores[hole] = (-1) * parseInt(newData.Scores[hole])
                            } else {
                                newData.Scores[hole] = 10 * parseInt(newData.Scores[hole]) + parseInt(data)
                            }
                        }

                        const updateRef = ref(Database, "TSN/Score/Tournament/" + tournamentName + '/Players/' + id);
                        update(updateRef, newData)
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
    const fnScoreCard_View = () => {
        return (
            <>
                {holes >= 9 ?
                    <div>
                        <Page_ViewTableScorePrint golfName={golfName} luotChoi={1} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                    </div>
                    :
                    ''
                }
                {
                    holes >= 18 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={golfName} luotChoi={2} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                        </div>
                        :
                        ''
                }
                {
                    holes >= 27 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={golfName} luotChoi={3} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                        </div>
                        :
                        ''
                }
                {
                    holes >= 36 ?
                        <div>
                            <Page_ViewTableScorePrint golfName={golfName} luotChoi={4} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
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
                height: holes == 9 ? 544 : 800,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}
                className="p-2 rounded-md border-5 border-double border-slate-700">
                <div style={{ width: '100%', color: 'black', fontSize: 24, justifyContent: 'space-around', fontWeight: 'bold', display: 'flex' }}>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            Golf Name: {golfName}
                        </div>
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            Address: {addressCourse}
                        </div>
                    </div>
                    <div style={{ margin: 'auto' }}>
                        <div style={{ width: '100%', textAlign: 'center', fontSize: 24 }}>
                            Tournament Name: {tournamentName}
                        </div>
                        <div style={{ width: '100%', color: 'black', justifyContent: 'center', textAlign: 'center', }}>
                            Organization Name: {organizationName}
                        </div>
                        <div style={{ width: '100%', color: 'black', justifyContent: 'center', textAlign: 'center', }}>
                            Group Name: {groupName}
                        </div>
                    </div>

                </div>
                <div style={{ display: 'flex', justifyContent: holes > 9 ? 'space-around' : 'center', }}>
                    {holes >= 9 ?
                        <div style={{ width: holes > 9 ? 500 : 700, paddingRight: 2 }}>
                            <Page_ViewTableScorePrint golfName={golfName} luotChoi={1} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                        </div>
                        :
                        ''
                    }
                    {
                        holes >= 18 ?
                            <div style={{ width: holes > 9 ? 500 : 700, paddingLeft: 2 }}>
                                <Page_ViewTableScorePrint golfName={golfName} luotChoi={2} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                            </div>
                            :
                            ''
                    }
                </div>
                <div style={{ display: 'flex', justifyContent: holes > 9 ? 'space-around' : 'center' }}>
                    {
                        holes >= 27 ?
                            <div style={{ width: holes > 9 ? 500 : 700 }}>
                                <Page_ViewTableScorePrint golfName={golfName} luotChoi={3} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                            </div>
                            :
                            ''
                    }
                    {
                        holes >= 36 ?
                            <div style={{ width: holes > 9 ? 500 : 700 }}>
                                <Page_ViewTableScorePrint golfName={golfName} luotChoi={4} groupName={groupName} dataConfig={dataSetup} dataPlayers={listGolfDataPlayerTournament} setTitleChange={(title) => { setCurrentTitle(title) }} typeScore={typeScore} numberHoles={holes} />
                            </div>
                            :
                            ''
                    }
                </div>
                {holes === 9 &&
                    <div style={{ display: 'flex', justifyContent: 'space-around', height: 130, position: 'absolute', width: '100%', bottom: 5, paddingRight: 15 }}>
                        {dataPlayers.map((item, key) => (
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
                        {[...Array(Math.max(0, 4 - dataPlayers.length))].map((_, index) => (
                            <div key={`default-${index}`}>
                                <InfoPlayer
                                    width={180}
                                    fontSize={14}
                                    namePlayer="---"
                                    HDC=''
                                    VGA=''
                                    score={0}
                                />
                            </div>
                        ))}
                    </div>
                }
                {holes === 18 &&
                    <div style={{ display: 'flex', justifyContent: 'space-around', height: 160, width: '100%' }}>
                        {dataPlayers.map((item, key) => (
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
                        {[...Array(Math.max(0, 4 - dataPlayers.length))].map((_, index) => (
                            <div key={`default-${index}`}>
                                <InfoPlayer
                                    width={240}
                                    fontSize={18}
                                    namePlayer="---"
                                    HDC=''
                                    VGA=''
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
                    <div className={styles.EnterGamePersonal}>ENTER TOURNAMENT GROUP</div>

                    <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                        <Select
                            styles={customStyles}
                            placeholder="Select Tournament Name"
                            className='SelectTag'
                            onChange={
                                (selectedOption: SingleValue<{ label: string, value: string }>) => {
                                    if (selectedOption) {
                                        const { label, value } = selectedOption;
                                        setSelectedOption(null);
                                        setTournamentName(value)
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
                    <My_divider />
                    <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                        <Select
                            styles={customStyles}
                            placeholder="Select Group Name"
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
                                            setGroupName(value)
                                            // const tempData: string[] = value.split('|');
                                            // if (tempData.length == 2) {
                                            //     setTimeStamp(tempData[0])
                                            //     setChoiceNameGroup(tempData[1])
                                            // }
                                        }
                                    }
                                }
                            }
                            options={
                                listGroup.map(item => ({
                                    label: item, value: item
                                }))
                            }
                        />
                    </div>

                    <Spacer y={2} />

                    <div style={{ display: groupName === '' ? 'none' : '' }}>
                        <div className={` ${fullMode ? styles.click_full_screen : styles.click_normal}`}>
                            {/* <div style={{ height: '100%' }}> */}
                            <div style={{
                                right: '25px',
                                fontWeight: 'bold',
                                fontSize: '33px', justifyContent: 'end',
                                display: 'flex', height: '41px', marginBottom: 4,
                                width: windowType == 'Mobile' ? windowWidth : '100%'
                            }}>
                                <div key={`reverse-radio`} className="flex gap-4 justify-center" style={{ fontWeight: 'normal', fontSize: '20px', margin: 'auto' }}>
                                    <Form.Check
                                        style={{ textAlign: 'center' }}
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
                                        style={{ textAlign: 'center' }}
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
                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '33px', width: '100%', textAlign: 'center' }}>{currentTitle}</div>
                                <div style={{
                                    margin: '3px',
                                    width: '53px',
                                    fontSize: '50px',
                                    color: 'red',
                                    paddingTop: '-38px',
                                    marginTop: '-18px'
                                }} onClick={() => { setFullMode(!fullMode) }}>{fullMode ? '⎆' : '⛶'}</div>
                            </div>
                            <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700 overflow-auto" style={{ width: fullMode ? '100%' : windowWidth }}>
                                {/* <div style={{ overflow: 'auto', width: '100%' }}> */}
                                <Tabs aria-label="Tabs sizes" size='sm' className='w-full'>
                                    {holes >= 9 ?
                                        <Tab key="Round1" title="ROUND 1">
                                            {showTableDataRound1()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {holes >= 18 ?
                                        <Tab key="Round2" title="ROUND 2">
                                            {showTableDataRound2()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {holes >= 27 ?
                                        <Tab key="Round3" title="ROUND 3">
                                            {showTableDataRound3()}
                                        </Tab>
                                        :
                                        ''
                                    }

                                    {holes >= 36 ?
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

                    {groupName !== '' ?
                        <>
                            <My_divider />
                            <div style={{ display: windowWidth < 450 ? '' : 'flex', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
                                <PrintCall selectedHoles={holes} nameFile={tournamentName + ' - ' + choiceNameGroup} />
                                {
                                    windowWidth < 450 ?
                                        <My_divider />
                                        :
                                        ''
                                }

                                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                    <Button
                                        style={{ width: '200px', fontSize: 14, fontWeight: 'bold', color: 'white' }}
                                        onClick={
                                            () => {
                                                setShowScore(true)
                                            }
                                        }
                                        variant="info">VIEW SCORE CARD
                                    </Button>
                                </div>
                            </div>
                        </>
                        : ''
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
                        <div style={{ color: '#adb5bd', fontSize: 18, fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                            <div>{"Tournament: " + tournamentName}</div>
                            <div>{'Group Name: ' + groupName}</div>
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

export default Page;
