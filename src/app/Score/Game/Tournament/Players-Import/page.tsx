'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer, Input, Divider, Checkbox, Button, CheckboxGroup } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store';

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { toast } from 'react-toastify';

import { Database } from '../../../../../../firebase';
import My_divider from './my_divider';
import Form from 'react-bootstrap/Form';
import Loading from './loading';
import * as XLSX from 'xlsx';

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

    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(12))
    dispatch(redux_page.setChoice('Score'))

    const [haveData, setHaveData] = useState<boolean>(false);
    const [heightBoxLeft, setHeightBoxLeft] = useState<number>(0);

    const [listTeeBox, setListTeeBox] = useState<IGolfSetupTeeBox[]>([])
    const [listDataPlayer, setListDataPlayer] = useState<IGolf_Data_Player[]>([])
    const [nameGroup, setNameGroup] = useState<string>('')

    const [listGolfDataPlayerTournament, setListGolfDataPlayerTournament] = useState<IGolfDataPlayerTournament[]>([])
    const [tournamentName, setTournamentName] = useState<string>('');
    const [listGolfSetupTournament, setListGolfSetupTournament] = useState<string[]>([])

    const [setupTournament, setSetupTournament] = useState<IGolfDataSetupTournament>()

    const StartingHole = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const NumberOfPlayers = [1, 2, 3, 4]

    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');

    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        //Permistion Access Page
        if (Page_Data.level > 0 && Page_Data.level < 10) {
            toast.warning("You do not have permission to access this page")
            router.push('/');
        }
    }, [Page_Data, router]);

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
                        setSetupTournament(newData)
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

    const generate_player_html = (ArrListDataPlayer: IGolfDataPlayerTournament[]) => {
        const gen_player = []
        for (let index = 0; index < ArrListDataPlayer.length; index++) {
            gen_player.push(
                <div style={{ width: '100%', justifyContent: 'center', display: 'grid' }}>
                    <div style={{ alignSelf: 'center', width: '100%', textAlign: 'center' }}>Player {index + 1}</div>
                    <div className='p-2 rounded-md border-1 border-solid border-slate-700'>
                        <div style={{ display: 'flex', marginBottom: 3 }}>
                            <div style={{ width: 130 }}>
                                ID:
                            </div>
                            <input
                                placeholder='ID'
                                className='text-center'
                                disabled={false}
                                value={ArrListDataPlayer[index].Id}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Id: event.target.value,
                                    }
                                    return newArr
                                })}
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
                                HOLE:
                            </div>
                            <input
                                placeholder='HOLE'
                                className='text-center'
                                disabled={false}
                                value={ArrListDataPlayer[index].Hole}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Hole: event.target.value,
                                    }
                                    return newArr
                                })}
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
                                Name Player:
                            </div>
                            <input
                                placeholder='Name Player'
                                className='text-center'
                                disabled={false}
                                value={ArrListDataPlayer[index].NamePlayer}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        NamePlayer: event.target.value,
                                        Scores: new Array(36).fill(0)
                                    }
                                    return newArr
                                })}
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
                                Gender:
                            </div>
                            <input
                                placeholder='Gender'
                                className='text-center'
                                disabled={false}
                                value={ArrListDataPlayer[index].Gender}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Gender: event.target.value,
                                    }
                                    return newArr
                                })}
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
                                    value={ArrListDataPlayer[index].HDC}
                                    onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            HDC: event.target.value
                                        }
                                        return newArr
                                    })}
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
                                    value={ArrListDataPlayer[index].VGA}
                                    onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            VGA: event.target.value
                                        }
                                        return newArr
                                    })}
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
                                Round:
                            </div>
                            <div style={{ display: 'flex', width: 215, justifyContent: 'space-between' }}>
                                <input
                                    placeholder='Round In'
                                    className='text-center'
                                    disabled={false}
                                    value={ArrListDataPlayer[index].RoundIn}
                                    onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            RoundIn: event.target.value
                                        }
                                        return newArr
                                    })}
                                    style={{
                                        width: '100px',
                                        textAlign: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: 5,
                                        fontSize: 14,
                                        backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                    }} type="text"></input>
                                <input
                                    placeholder='Round Out'
                                    className='text-center'
                                    disabled={false}
                                    value={ArrListDataPlayer[index].RoundOut}
                                    onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                        const newArr = [...prevArray]
                                        newArr[index] = {
                                            ...newArr[index],
                                            RoundOut: event.target.value
                                        }
                                        return newArr
                                    })}
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
                                value={ArrListDataPlayer[index].Bag}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Bag: (event.target.value)
                                    }
                                    return newArr
                                })}
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
                                value={ArrListDataPlayer[index].Caddie}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        Caddie: (event.target.value)
                                    }
                                    return newArr
                                })}
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
                                value={ArrListDataPlayer[index].CarNo}
                                onChange={(event) => setListGolfDataPlayerTournament((prevArray) => {
                                    const newArr = [...prevArray]
                                    newArr[index] = {
                                        ...newArr[index],
                                        CarNo: (event.target.value)
                                    }
                                    return newArr
                                })}
                                style={{
                                    width: '215px',
                                    textAlign: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 5,
                                    fontSize: 14,
                                    backgroundColor: '#3B3B3B', color: 'E5E5E5'
                                }} type="text"></input>
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

    const AddPlayersTournament = () => {
        if (tournamentName.length == 0) {
            toast.warning('Need Choice Tournament Name First');
        } else if (listGolfDataPlayerTournament.length == 0
        ) {
            toast.warning('Need To Import Excel File');
        } else {
            let tempObj: any = {}
            if (setupTournament !== null) {
                listGolfDataPlayerTournament.forEach((element, key) => {
                    tempObj[element.Id] = element
                })
                const setRef = ref(Database, "TSN/Score/Tournament/" + tournamentName + "/Players");
                set(setRef, tempObj)
                toast.success('Add Players Success');
                window.location.reload();
            }
        }
    }
    var LimitWidthWindow = 800

    const EXTENSIONS = ['xlsx', 'xls', 'csv']
    const getExention = (file: File) => {
        const parts = file.name.split('.')
        const extension = parts[parts.length - 1]
        return EXTENSIONS.includes(extension) // return boolean
    }
    const importExcel = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = (event) => {
                //parse data
                if (event.target) {
                    const bstr = event.target.result
                    const workBook = XLSX.read(bstr, { type: "binary" })

                    //get first sheet
                    var workSheetName = ''
                    workBook.SheetNames.forEach((element, key) => {
                        if (element.toLocaleLowerCase() === 'import') {
                            workSheetName = workBook.SheetNames[key]
                        }
                    })
                    const workSheet = workBook.Sheets[workSheetName]
                    //convert to array
                    const fileData: string[][] = XLSX.utils.sheet_to_json(workSheet, { header: 1, range: 4 })
                    let ArrListDataPlayer: IGolfDataPlayerTournament[] = []
                    fileData.forEach((element: string[], index) => {
                        ArrListDataPlayer.push({
                            Id: element[0]?.toString() || index.toString(),
                            Hole: element[1]?.toString() || '',
                            Gender: element[2]?.toString() || '',
                            NamePlayer: element[3]?.toString() || '',
                            HDC: element[4]?.toString() || '',
                            VGA: element[5]?.toString() || '',
                            RoundIn: element[6]?.toString() || '',
                            RoundOut: element[7]?.toString() || '',
                            Bag: element[8]?.toString() || '',
                            Caddie: element[9]?.toString() || '',
                            CarNo: element[10]?.toString() || '',
                            Scores: new Array(36).fill(0),
                            Color: "blue",
                            TextColor: "black",
                            TeeBox: ""
                        })
                    })
                    toast.info(`Import ${ArrListDataPlayer.length} players`)
                    setListGolfDataPlayerTournament(ArrListDataPlayer)
                }
            }
            if (file) {
                if (getExention(file)) {
                    reader.readAsBinaryString(file)
                }
                else {
                    alert("Invalid file input, Select Excel, CSV file")
                }
            }
        }
    }

    const generatePage = () => {
        if (haveData && Page_Data.level !== -1) {
            return (
                <>
                    <div style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>IMPORT LIST PLAYERS</div>
                    <Spacer y={1} />

                    <div style={{ justifyContent: 'center', display: 'flex' }}>
                        <Select
                            styles={customStyles}
                            placeholder="Select Tournament Name"
                            className='SelectTag'
                            onChange={
                                (selectedOption: SingleValue<{ label: string, value: string }>) => {
                                    if (selectedOption) {
                                        const { label, value } = selectedOption;
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

                    <Spacer y={1} />

                    <div style={{ display: windowWidth < LimitWidthWindow ? 'flow' : 'flex' }}>
                        <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700"
                            style={{ maxWidth: 400, width: '100%', flex: 'none', overflow: 'auto', height: 'calc(100vh - 200px)' }}>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Import Excel File:</Form.Label>
                                <Form.Control type="file" onChange={importExcel} />
                            </Form.Group>

                            {generate_player_html(listGolfDataPlayerTournament)}
                        </div>
                    </div>

                    <Spacer y={1} />

                    <Button
                        size={'sm'}
                        radius={'sm'}
                        color="primary"
                        variant="ghost"
                        className='flex-none w-full'
                        onPress={AddPlayersTournament}
                    >
                        ADD DATA PLAYERS
                    </Button>
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
            {
                generatePage()
            }
        </div>
    );

}

export default Page;
