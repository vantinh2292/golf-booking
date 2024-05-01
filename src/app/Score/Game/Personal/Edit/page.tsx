'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer, useDisclosure, Divider, Checkbox, CheckboxGroup } from "@nextui-org/react";

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, onValue, child, get, set, remove, query, orderByChild } from "firebase/database";
import { toast } from 'react-toastify';
import my_styles from './page.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Database } from '../../../../../../firebase';
import My_divider from './my_divider';
import Form from 'react-bootstrap/Form';
import Confirm from '@/components/confirm';

import { SaveOutlined, DeleteOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { FloatButton, Space, Button, Select } from 'antd';

import Loading from './loading';
import { useAppSelector } from '@/redux/store';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/navigation'
import Image from 'next/image';


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

function Page() {
    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(6))
    dispatch(redux_page.setChoice('Score'))
    const router = useRouter()

    const [haveData, setHaveData] = useState<boolean>(false);
    const [correctPassword, setCorrectPassword] = useState<boolean>(false);
    const [showButtonAccess, setShowButtonAccess] = useState<boolean>(false);
    const [heightBoxLeft, setHeightBoxLeft] = useState<number>(0);

    const [nameGolfSelected, setNameGolfSelected] = useState<string>('');
    const [timestamp, setTimestamp] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [nameGroup, setNameGroup] = useState<string>('');

    const [nameCourse, setNameCourse] = useState<string>('')
    // const [selectedGolfName, setSelectGolfName] = useState<string>('')
    const [numberTeeBox, setNumberTeeBox] = useState<number>(1)
    const [listGolfSetupInformation, setListGolfSetupInformation] = useState<IGolfSetup[]>([])
    const [selectedHoles, setSelectedHoles] = useState<number>(9)
    const [listGolfSetupCourse, setListGolfSetupCourse] = useState<IGolfSetupCourse[]>([])
    const [selectedNameRound1, setSelectNameRound1] = useState<string>('')
    const [selectedNameRound2, setSelectNameRound2] = useState<string>('')
    const [selectedNameRound3, setSelectNameRound3] = useState<string>('')
    const [selectedNameRound4, setSelectNameRound4] = useState<string>('')
    const [selectedFormat, setSelectedFormat] = useState<string>('')
    const [selectedStartingHole, setselectedStartingHole] = useState<number>(1)
    const [selectedNumberOfPlayers, setSelectedNumberOfPlayers] = useState<number>(1)
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [listTeeBox, setListTeeBox] = useState<IGolfSetupTeeBox[]>([])
    const [listDataPlayer, setListDataPlayer] = useState<IGolf_Data_Player[]>([])
    // const [nameGroup, setNameGroup] = useState<string>('')
    // const [timeStamp, setTimeStamp] = useState<string>('')
    const [data, setData] = useState<object>({})
    const [listGroup, setListGroup] = useState<{
        Time: string,
        NameGroup: string
    }[]>([])
    const [game, setGame] = useState<string>('')
    const [typeScore, setTypeScore] = useState<string>('Total')

    const { isOpen, onOpen, onClose } = useDisclosure();

    const StartingHole = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const NumberOfPlayers = [0, 1, 2, 3, 4]

    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false)
    const [showCancel, setShowCancel] = useState<boolean>(true)

    const [selectedValue, setSelectedValue] = useState<string>('');
    const [enableSearch, setEnableSearch] = useState<boolean>(false);

    const divRef = useRef<HTMLDivElement | null>(null);

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
            setHeightBoxLeft(Math.round(rect.height))
        }
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth);
        }
    };

    useEffect(() => {
        setInterval(() => {
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                setHeightBoxLeft(Math.round(rect.height))
            }
        }, 500);
        // Check if the window object is defined (for server-side rendering)
        if (typeof window !== 'undefined') {
            // Update the width when the window is resized
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

    useEffect(
        () => {
            //Get Firebase GPS
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
                    setCorrectPassword(false)
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
                    setNameGolfSelected(temp_list[0]?.NameGolf)
                    // setSelectHoles(18)
                } else {
                    console.log('No data available');
                }
            }).catch((error) => {
                console.error
            })
            setPassword('')
            setNameGroup('')
        }
        , []
    );

    useEffect(
        () => {
            if (nameGolfSelected.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/Course')).then((snapshot) => {
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
        setListGolfSetupCourse(temp_list)
    }

    const getInitialGolfGame = () => {
        if (nameGolfSelected.length > 0) {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal')).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    generate_list_name_group(newData)
                    setSelectNameRound1('')
                    setSelectNameRound2('')
                    setSelectNameRound3('')
                    setSelectNameRound4('')
                    setSelectedFormat('')
                    setCurrentDate('')
                    setCurrentTime('')
                    setListDataPlayer([])
                    setPassword('')
                    setTimestamp('')
                    setShowCancel(true)
                    setSelectedValue('');

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
    //generate list name group
    useEffect(
        () => {
            getInitialGolfGame()
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

    const fnGetDataFirebaseGame = () => {
        if (nameGolfSelected.length > 0 && timestamp.length > 0) {
            get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp)).then((snapshot) => {
                if (snapshot.exists()) {
                    let newData = snapshot.val();
                    if (newData.Password == password) {
                        setCorrectPassword(true)
                        setShowButtonAccess(false)
                        setShowCancel(false)
                        setSelectedFormat(newData.Format)
                        setSelectNameRound1(newData.Round1)
                        setSelectNameRound2(newData.Round2)
                        setSelectNameRound3(newData.Round3)
                        setSelectNameRound4(newData.Round4)
                        setSelectedHoles(newData.Holes)
                        setselectedStartingHole(newData.StartingHole)
                        setSelectedNumberOfPlayers(newData.NumberOfPlayers)
                        setListDataPlayer(newData.DataPlayers)
                        setCurrentDate(newData.Date)
                        setCurrentTime(newData.Time)
                        setTypeScore(newData.TypeScore)
                    } else {
                        toast.warn('Incorrect Password')
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }
    const FnSetShowCancel = () => {
        setShowCancel(true)
        setTimestamp('')
        setCorrectPassword(false)
        setShowButtonAccess(true)
    }
    //generate data
    useEffect(
        () => {
            fnGetDataFirebaseGame()
        }
        , [timestamp]
    );



    useEffect(
        () => {
            //Get Firebase GPS
            get(child(dbRef, "TSN/Score/GolfSetup")).then((snapshot) => {
                if (snapshot.exists()) {
                    setHaveData(true)
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

    const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentDate(event.target.value);
    }
    const handleChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentTime(event.target.value);
    }

    useEffect(
        () => {
            if (selectedNameRound1.length > 0) {
                //Get Firebase GPS
                get(child(dbRef, "TSN/Score/GolfSetup/" + nameGolfSelected + '/Course/' + selectedNameRound1)).then((snapshot) => {
                    if (snapshot.exists()) {
                        let newData = snapshot.val();
                        generate_list_order_tee_box(newData)
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            } else {
                generate_list_order_tee_box(null)
            }
        }
        , [selectedNameRound1]
    );

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

    const generate_player_html = (numberPlayer: number) => {
        const gen_player = []
        for (let index = 0; index < numberPlayer; index++) {
            gen_player.push(
                <div style={{ width: '100%', justifyContent: 'center', display: 'grid' }}>
                    <div style={{ alignSelf: 'center', width: '100%', textAlign: 'center' }}>Player {index + 1}</div>
                    <div className='p-2 rounded-md border-1 border-solid border-slate-700'>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                Name Player:
                            </div>
                            <input
                                placeholder='Name Player'
                                className='text-center'
                                disabled={false}
                                onChange={(event) => setListDataPlayer((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        NamePlayer: event.target.value,
                                        Scores: new Array(36).fill(0)
                                    }
                                    return newArr
                                })}
                                value={listDataPlayer[index] ? listDataPlayer[index].NamePlayer : ''}
                                style={{
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                }} type="text"></input>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                HDC:
                            </div>
                            <div style={{ display: 'flex', width: 215, justifyContent: 'space-between' }}>
                                <input
                                    placeholder='HDC'
                                    className='text-center'
                                    disabled={false}
                                    onChange={(event) => setListDataPlayer((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            HDC: event.target.value
                                        }
                                        return newArr
                                    })}
                                    value={listDataPlayer[index] ? listDataPlayer[index].HDC : ''}
                                    style={{
                                        width: '100px',
                                        textAlign: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: 5,
                                        fontSize: 14,
                                        backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                    }} type="text"></input>
                                <input
                                    placeholder='VGA'
                                    className='text-center'
                                    disabled={false}
                                    onChange={(event) => setListDataPlayer((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            VGA: event.target.value
                                        }
                                        return newArr
                                    })}
                                    value={listDataPlayer[index] ? listDataPlayer[index].VGA : ''}
                                    style={{
                                        width: '100px',
                                        textAlign: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: 5,
                                        fontSize: 14,
                                        backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                    }} type="text"></input>
                            </div>

                        </div>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                Bag:
                            </div>
                            <input
                                placeholder='BAG'
                                className='text-center'
                                disabled={false}
                                onChange={(event) => setListDataPlayer((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Bag: (event.target.value)
                                    }
                                    return newArr
                                })}
                                value={listDataPlayer[index] ? listDataPlayer[index].Bag : ''}
                                style={{
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                }} type="text"></input>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                Caddie:
                            </div>
                            <input
                                placeholder='CADDIE'
                                className='text-center'
                                disabled={false}
                                onChange={(event) => setListDataPlayer((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Caddie: (event.target.value)
                                    }
                                    return newArr
                                })}
                                value={listDataPlayer[index] ? listDataPlayer[index].Caddie : ''}
                                style={{
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                }} type="text"></input>
                        </div>

                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                Cart Number:
                            </div>
                            <input
                                placeholder='CART No'
                                className='text-center'
                                disabled={false}
                                onChange={(event) => setListDataPlayer((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        CarNo: (event.target.value)
                                    }
                                    return newArr
                                })}
                                value={listDataPlayer[index] ? listDataPlayer[index].CarNo : ''}
                                style={{
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                }} type="text"></input>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                TEE Box:
                            </div>
                            <select
                                placeholder='TEE BOX'
                                style={{
                                    color: listDataPlayer[index] ? listDataPlayer[index].TextColor : '#949BA6',
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: listDataPlayer[index] ? listDataPlayer[index].Color : ''
                                }}
                                onChange={(e) => {
                                    const selectedOption = e.target.options[e.target.selectedIndex];
                                    const selectedColor = selectedOption.getAttribute('data-color');
                                    const selectedTextColor = selectedOption.getAttribute('data-text-color');
                                    setListDataPlayer((prevArray) => {
                                        const newArray = [...prevArray];
                                        newArray[index] = {
                                            ...newArray[index],
                                            TeeBox: e.target.value,
                                            Color: selectedColor ? selectedColor : '',
                                            TextColor: selectedTextColor ? selectedTextColor : ''
                                        }
                                        return newArray;
                                    });
                                }}
                                value={listDataPlayer[index] ? listDataPlayer[index].TeeBox : ''}
                            >
                                <option disabled selected value="" className="placeholder_select">
                                    TEE BOX
                                </option>
                                {listTeeBox.map((element, key) => (
                                    <option key={key} value={element.TeeBoxName} data-color={element.Color} data-text-color={element.TextColor} style={{
                                        backgroundColor: element.Color
                                    }}>
                                        <div style={{ backgroundColor: 'red' }}>
                                            {element.TeeBoxName}
                                        </div>
                                    </option>
                                ))
                                }
                            </select>
                        </div>
                    </div>


                </div>
            )
            gen_player.push(
                <>
                    <Spacer y={1} />
                </>
            )
        }
        return (gen_player)
    }

    const EditGamePersonal = () => {
        if (nameGolfSelected.length == 0) {
            toast.warning('Need choice Golf Name First');
        } else if (nameGroup.length == 0
        ) {
            toast.warning('Need Input Name Group');
        } else if (selectedFormat.length == 0
        ) {
            toast.warning('Need choice Format Game');
        } else if (selectedHoles >= 9 && selectedNameRound1.length == 0
        ) {
            toast.warning('Need choice Round In');
        } else if (selectedHoles >= 18 && selectedNameRound2.length == 0
        ) {
            toast.warning('Need choice Round Out');
        } else if (selectedHoles >= 27 && selectedNameRound3.length == 0
        ) {
            toast.warning('Need choice Round Add 1');
        } else if (selectedHoles >= 36 && selectedNameRound4.length == 0
        ) {
            toast.warning('Need choice Round Add 2');
        } else {
            const allPlayersHaveValidData = listDataPlayer.every(player => {
                try {
                    const isNamePlayerValid = player.NamePlayer.length > 0;
                    // const isHDCValid = player.HDC > 0;
                    const isTeeBoxValid = player.TeeBox.length > 0;
                    // const isBagValid = player.Bag.length > 0;
                    // const isCaddieValid = player.Caddie.length > 0;
                    // const isCarNoValid = player.CarNo.length > 0;

                    return isNamePlayerValid && isTeeBoxValid
                } catch (error) {
                    return 0
                }
                // Check HDC is greater than 0

            });

            if (!allPlayersHaveValidData || listDataPlayer.length == 0) {
                toast.warning('Need To Fill All Name Player And TeeBox');
            } else {

                const setRef = ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp);
                set(setRef,
                    {
                        NameGroup: nameGroup,
                        Password: password,
                        NameCourse: nameCourse,
                        TypeScore: typeScore,
                        Holes: selectedHoles,
                        Format: selectedFormat,
                        Round1: selectedNameRound1,
                        Round2: selectedNameRound2,
                        Round3: selectedNameRound3,
                        Round4: selectedNameRound4,
                        StartingHole: selectedStartingHole,
                        Date: currentDate,
                        Time: currentTime,
                        NumberOfPlayers: selectedNumberOfPlayers,
                        DataPlayers: listDataPlayer
                    })
                toast.success('Edit Game Personal Success');
                setNameGroup('');
                setTimestamp('')
                setGame('')
                setSelectNameRound1('')
                setSelectNameRound2('')
                setSelectNameRound3('')
                setSelectNameRound4('')
                setSelectedNumberOfPlayers(0)
                setListDataPlayer([])
                setSelectedValue('')
            }
        }
    }
    const DeleteGolfGame = () => {
        if (nameGolfSelected.length == 0) {
            toast.warning('Need choice golf name first');
        } else if (timestamp.length == 0
        ) {
            toast.warning('Need to choice game first');
        } else {
            const RemoveRef = ref(Database, "TSN/Score/GolfSetup/" + nameGolfSelected + '/GamePersonal/' + timestamp);
            remove(RemoveRef).then(() => {
                toast.error('Delete Game Success');
                getInitialGolfGame()
            })
        }
        setShowConfirmDelete(false)
    }
    var LimitWidthWindow = 800

    const generatePage = () => {
        if (haveData) {
            return (
                <>
                    {showCancel ?
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                < Image
                                    unoptimized
                                    width={150}
                                    height={150}
                                    // style={{ width: '100%', height: 'auto' }}
                                    src={require('./edit.ico')}
                                    alt="IMAGE"
                                // priority={true}
                                />
                            </div>

                            <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>EDIT NEW GAME PERSONAL</div>
                            <Spacer y={0.5} />
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                                <Select
                                    defaultValue={listGolfSetupInformation[0].NameGolf}
                                    placeholder="Select Golf Name"
                                    className='SelectTag'
                                    onChange={(item: string) => {
                                        // let currentOption = listGolfSetupInformation.find((option) => option.NameGolf === item)
                                        setSelectedValue('');
                                        setNameGolfSelected(item)
                                        setTimestamp('')
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
                                placeholder="Input password"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                value={password}
                                onChange={(event) => {
                                    setPassword(event?.target.value)
                                    setShowButtonAccess(true)
                                }
                                }
                            />
                            <My_divider />
                            <div style={{ justifyContent: 'center', display: 'flex', color: 'white' }}>
                                <Select
                                    showSearch={enableSearch}
                                    defaultValue={timestamp + '|' + nameGroup}
                                    placeholder="Select Group Name"
                                    className='SelectTag'
                                    value={selectedValue}
                                    onChange={(item: string) => {
                                        setSelectedValue(item)
                                        setSelectedHoles(0)
                                        const tempData: string[] = item.split('|');
                                        if (tempData.length == 2) {
                                            setTimestamp(tempData[0])
                                            setNameGroup(tempData[1])
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
                                        <Button type="primary" ghost onClick={fnGetDataFirebaseGame}>ACCESS</Button>
                                    </> : ''
                            }
                        </>
                        : ''}



                    <Spacer y={1} />

                    {(correctPassword && timestamp.length > 0) ?
                        <>
                            <div style={{ display: windowWidth < LimitWidthWindow ? 'flow' : 'flex' }}>
                                <div ref={divRef} className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700" style={{ maxWidth: 400, minWidth: 350, width: windowWidth < LimitWidthWindow ? '100%' : 400 }}>

                                    <div style={{ justifyContent: 'center', display: 'flex', backgroundColor: 'white', borderRadius: 5 }}>
                                        <Select
                                            defaultValue={listGolfSetupInformation[0].NameGolf}
                                            disabled={true}
                                            placeholder="Select Golf Name"
                                            className='SelectTag'
                                            onChange={(item: string) => {
                                                setNameGolfSelected(item)
                                                setSelectedValue('');
                                            }
                                            }
                                            options={
                                                listGolfSetupInformation.map(item => ({
                                                    label: item.NameGolf, value: item.NameGolf
                                                }))
                                            }
                                        />
                                    </div>
                                    <My_divider />
                                    <div style={{ justifyContent: 'center', display: 'flex', backgroundColor: 'white', borderRadius: 5 }}>
                                        <Select
                                            placeholder="Select Game"
                                            className='SelectTag'
                                            disabled={true}
                                            value={selectedValue}
                                            onChange={
                                                (item: string) => {
                                                    setSelectedValue(item)
                                                    setGame(item)
                                                    const tempData: string[] = item.split('|');
                                                    if (tempData.length == 2) {
                                                        setTimestamp(tempData[0])
                                                        setNameGroup(tempData[1])
                                                    }
                                                }
                                            }
                                            options={
                                                listGroup.map(item => ({
                                                    label: (new Date(parseInt(item.Time))).toLocaleString() + ' - ' + item.NameGroup, value: item.Time + '|' + item.NameGroup
                                                }))
                                            }
                                        />

                                    </div>
                                    <My_divider />
                                    <div key={`reverse-radio`} className="flex justify-around">
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="9 (holes)"
                                            name="group1"
                                            isValid={selectedHoles == 9}
                                            id={`reverse-radio-1`}
                                            onChange={() => setSelectedHoles(9)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="18 (holes)"
                                            name="group1"
                                            isValid={selectedHoles == 18}
                                            id={`reverse-radio-2`}
                                            onChange={() => setSelectedHoles(18)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center' }}
                                            type='radio'
                                            reverse
                                            label="27 (holes)"
                                            name="group1"
                                            isValid={selectedHoles == 27}
                                            id={`reverse-radio-3`}
                                            onChange={() => setSelectedHoles(27)}
                                        >
                                        </Form.Check>
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
                                            type='radio'
                                            reverse
                                            label="36 (holes)"
                                            name="group1"
                                            isValid={selectedHoles == 36}
                                            id={`reverse-radio-4`}
                                            onChange={() => setSelectedHoles(36)}
                                        >
                                        </Form.Check>
                                    </div>

                                    <My_divider />

                                    <div key={`reverse-radio`} className="flex gap-4 justify-center">
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
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
                                            style={{ textAlign: 'center', fontSize: 12 }}
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
                                    <My_divider />
                                    <div key={`reverse-radio`} className="flex gap-4 justify-center">
                                        <Form.Check
                                            style={{ textAlign: 'center', fontSize: 12 }}
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
                                            style={{ textAlign: 'center', fontSize: 12 }}
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

                                    <My_divider />
                                    {selectedHoles >= 9 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ fontSize: 12 }}>Round In:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                aria-label="Name Round 1"
                                                placeholder="Large text"
                                                value={selectedNameRound1}
                                                onChange={(data) => {
                                                    setSelectNameRound1(data.target.value)
                                                }}
                                            >
                                                <option>SELECT NAME ROUND 1</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectedHoles >= 18 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ fontSize: 12 }}>Round Out:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound2}
                                                onChange={(data) => {
                                                    setSelectNameRound2(data.target.value)
                                                }}
                                            >
                                                <option>SELECT NAME ROUND 2</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectedHoles >= 27 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ fontSize: 12 }}>Round Add 1:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound3}
                                                onChange={(data) => {
                                                    setSelectNameRound3(data.target.value)
                                                }}
                                            >
                                                <option>SELECT NAME ROUND 3</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    {selectedHoles >= 36 ?
                                        <div style={{ justifyContent: 'center', width: '100%' }}>
                                            <div style={{ fontSize: 12 }}>Round Add 2:</div>
                                            <Form.Select
                                                style={{
                                                    width: '100%', textAlign: 'center',
                                                    backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                    borderColor: '#ccc'
                                                }}
                                                size='sm'
                                                aria-label="CHOICE GOLF NAME"
                                                placeholder="Large text"
                                                value={selectedNameRound4}
                                                onChange={(data) => {
                                                    setSelectNameRound4(data.target.value)
                                                }}
                                            >
                                                <option>SELECT NAME ROUND 4</option>
                                                {listGolfSetupCourse.map((element, key) => (
                                                    <option key={element.NameCourse} value={element.NameCourse}>{element.NameCourse}</option>
                                                ))}
                                            </Form.Select>
                                            <Spacer y={1} />
                                        </div>
                                        :
                                        ''
                                    }
                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ fontSize: 12 }}>Starting Holes:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%', textAlign: 'center',
                                                backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            aria-label="Starting Holes"
                                            placeholder="Large text"
                                            value={selectedStartingHole}
                                            onChange={(data) => {
                                                setselectedStartingHole(parseInt(data.target.value))
                                            }}
                                        >
                                            {StartingHole.map((element, key) => (
                                                <option style={{ width: '100%' }} key={element} value={element}>{element.toString()}</option>
                                            ))}
                                        </Form.Select>
                                    </div>

                                    <div style={{ justifyContent: 'center', }}>
                                        <div style={{ fontSize: 12 }}>Date:</div>
                                        <input
                                            onChange={handleChangeDate}
                                            value={currentDate}
                                            disabled={nameGolfSelected == ''}
                                            style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                            type="date"
                                            placeholder='DATE' />
                                    </div>
                                    <div style={{ justifyContent: 'center', }}>
                                        <div style={{ fontSize: 12 }}>TEE Time:</div>
                                        <input
                                            onChange={handleChangeTime}
                                            value={currentTime}
                                            disabled={nameGolfSelected == ''}
                                            style={{ backgroundColor: 'rgb(59 59 59)', borderColor: '#ccc', width: '100%', textAlign: 'center', border: '1px solid #ccc', borderRadius: 5, fontSize: 18 }}
                                            type="time"
                                            placeholder='TIME' />
                                    </div>
                                    <div style={{ justifyContent: 'center', width: '100%' }}>
                                        <div style={{ fontSize: 12 }}>No of player:</div>
                                        <Form.Select
                                            style={{
                                                width: '100%', textAlign: 'center',
                                                backgroundColor: 'rgb(59 59 59)', color: 'beige',
                                                borderColor: '#ccc'
                                            }}
                                            size='sm'
                                            aria-label="CHOICE GOLF NAME"
                                            placeholder="Large text"
                                            value={selectedNumberOfPlayers}
                                            onChange={(data) => {
                                                setSelectedNumberOfPlayers(parseInt(data.target.value))
                                            }}
                                        >
                                            {NumberOfPlayers.map((element, key) => (
                                                <option key={element} value={element}>{element.toString()}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                    <Spacer y={5} />
                                </div>
                                <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700"
                                    style={{ maxWidth: 400, width: windowWidth < LimitWidthWindow ? '100%' : 400, flex: 'none', overflow: 'auto', height: windowWidth >= LimitWidthWindow ? '100%' : 'auto', maxHeight: windowWidth >= LimitWidthWindow ? heightBoxLeft : '100%' }}>
                                    {generate_player_html(selectedNumberOfPlayers)}
                                </div>
                            </div>

                            {/* {windowWidth >= LimitWidthWindow ? */}
                            <div style={{ display: 'flex', justifyContent: windowWidth >= LimitWidthWindow ? 'end' : 'center', height: 50 }}>
                                <div style={{ display: 'flex', width: 250, justifyContent: 'space-around' }}>
                                    <FloatButton
                                        icon={<SaveOutlined />}
                                        description="SAVE"
                                        shape="square"
                                        style={{
                                            right: '0px',
                                            position: 'relative',
                                            bottom: '0px',
                                            width: '70px',
                                        }}
                                        onClick={() => {
                                            EditGamePersonal()
                                            setShowCancel(true)
                                            setCorrectPassword(false)
                                            setTimestamp('')
                                            setPassword('')
                                            setSelectedValue('');
                                        }}
                                    />
                                    <FloatButton
                                        icon={<DeleteOutlined />}
                                        description="DELETE"
                                        shape="square"
                                        style={{
                                            right: '0px',
                                            position: 'relative',
                                            bottom: '0px',
                                            width: '70px',
                                        }}
                                        onClick={() => {
                                            setShowConfirmDelete(true)
                                        }}
                                    />
                                    <FloatButton
                                        icon={<CloseCircleOutlined />}
                                        description="CANCEL"
                                        shape="square"
                                        style={{
                                            right: '0px',
                                            position: 'relative',
                                            bottom: '0px',
                                            width: '70px',
                                        }}
                                        onClick={() => {
                                            setShowCancel(true)
                                            setCorrectPassword(false)
                                            setTimestamp('')
                                            setPassword('')
                                            setSelectedValue('');
                                        }
                                        }
                                    />
                                </div>

                            </div>
                        </>
                        : ''}

                    <Confirm show={showConfirmDelete} title='Confirm Delete:' content={`Do you sure to delete this course game: ${(new Date(timestamp)).toLocaleString() + ' - ' + nameGroup} ?`} setShowConfirm={setShowConfirmDelete} callCommand={DeleteGolfGame} />
                </>
            )
        } else {
            return (
                <Loading />
            )
        }
    }

    return (
        <div style={{ maxWidth: 1080, width: windowWidth, justifyContent: 'center', display: 'grid' }}>
            {generatePage()}
        </div>
    );

}

export default Page;
