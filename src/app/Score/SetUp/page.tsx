'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation'

import { Spacer, Input, Divider, Select, SelectItem, } from "@nextui-org/react";
import Image from 'next/image';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { toast } from 'react-toastify';
import { list } from 'postcss';
import { Database } from '../../../../firebase';
import { IM_Fell_French_Canon } from 'next/font/google';
import Loading from './loading';
import styles from './page.module.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Page() {
    const router = useRouter();
    const Page_Data = useAppSelector((state) => state.pageReducer.value)

    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(1))
    dispatch(redux_page.setChoice('Score'))
    const [nameGolf, setNameGolf] = useState<string>('')
    const [addressGolf, setAddressGolf] = useState<string>('')
    const [telGolf, setTelGolf] = useState<string>('')
    const [contactGolf, setContactGolf] = useState<string>('')
    const [numberOfHolesGolf, setNumberOfHolesGolf] = useState<number>(9)
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const Page_Index = useAppSelector((state) => state.pageReducer.value)

    const handleChangeNameGolf = (event: ChangeEvent<HTMLInputElement>) => {
        setNameGolf(event.target.value);
    }
    const handleChangeAddressGolf = (event: ChangeEvent<HTMLInputElement>) => {
        setAddressGolf(event.target.value);
    }
    const handleChangeContactGolf = (event: ChangeEvent<HTMLInputElement>) => {
        setContactGolf(event.target.value);
    }
    const handleChangeTelGolf = (event: ChangeEvent<HTMLInputElement>) => {
        setTelGolf(event.target.value);
    }
    const handleChangeNumberOfHolesGolf = (value: number) => {
        setNumberOfHolesGolf(value);
    }

    const updateDimensions = () => {
        if (window.innerWidth > 1000) {
            setWindowWidth(1000);
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

    const AddNewGolfSetup = () => {
        let check = false
        if (nameGolf.length == 0) {
            toast.warning('Name Golf can not empty');
            check = true
        }
        if (numberOfHolesGolf == 0) {
            toast.warning('Number of holes can not empty');
            check = true
        }

        if (!check) {
            get(child(dbRef, "TSN/Score/GolfSetup")).then((snapshot) => {
                if (snapshot.hasChild(nameGolf)) {
                    toast.warning('THIS GOLF NAME ALREADY HAVE IN SYSTEM');
                } else {
                    const setRef = ref(Database, "TSN/Score/GolfSetup/" + nameGolf);
                    set(setRef, {
                        Information: {
                            NameGolf: nameGolf,
                            AddressGolf: addressGolf,
                            TelGolf: telGolf,
                            ContactGolf: contactGolf,
                            NumberOfHolesGolf: numberOfHolesGolf
                        },
                        time_create: Date.now()
                    }
                    )
                    setNameGolf('')
                    setAddressGolf('')
                    setTelGolf('')
                    setContactGolf('')
                    setNumberOfHolesGolf(0)

                    toast.success('Create new Golf success');
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    const generatePage = () => {
        if (windowWidth > 0 && Page_Data.level !== -1) {
            return (
                <>
                    <div style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>COURSE SET-UP</div>
                    <div className="mt-px gap-2 text-white p-2 rounded-md border-5 border-double border-slate-700">
                        {/* <div style={{ color: 'white', fontSize: 18, paddingLeft: 4 }}>COURSE INFORMATION</div> */}
                        <div className="mt-px flex flex-row gap-2 text-white p-1 ">
                            <div className='basis-3/4'>
                                <Form.Control
                                    style={{ textAlign: 'center', color: 'beige' }}
                                    className={styles.FormInput}
                                    type="text"
                                    placeholder="Name"
                                    value={nameGolf}
                                    onChange={handleChangeNameGolf}
                                />
                                <Spacer y={1} />
                                <Form.Control
                                    style={{ textAlign: 'center', color: 'beige' }}
                                    className={styles.FormInput}
                                    type="text"
                                    placeholder="Address"
                                    value={addressGolf}
                                    onChange={handleChangeAddressGolf}
                                />
                                <Spacer y={1} />
                                <Form.Control
                                    style={{ textAlign: 'center', color: 'beige' }}
                                    className={styles.FormInput}
                                    type="text"
                                    placeholder="Tel"
                                    value={telGolf}
                                    onChange={handleChangeTelGolf}
                                />
                                <Spacer y={1} />
                                <Form.Control
                                    style={{ textAlign: 'center', color: 'beige' }}
                                    className={styles.FormInput}
                                    type="text"
                                    placeholder="Contact"
                                    value={contactGolf}
                                    onChange={handleChangeContactGolf}
                                />
                                <Spacer y={1} />
                                <Form.Select
                                    style={{
                                        width: '100%', textAlign: 'center',
                                    }}
                                    className={styles.FormInput}
                                    aria-label="Number of holes"
                                    placeholder="Number of holes"
                                    value={numberOfHolesGolf}
                                    onChange={(data) => {
                                        handleChangeNumberOfHolesGolf(parseInt(data.target.value))
                                    }}
                                >
                                    <option key={9} value={9}>9</option>
                                    <option key={18} value={18}>18</option>
                                    <option key={27} value={27}>27</option>
                                    <option key={36} value={36}>36</option>
                                    <option key={45} value={45}>45</option>
                                    <option key={54} value={54}>54</option>
                                </Form.Select>
                            </div>
                            <div className='basis-1/4 align-middle bg-red-700'>
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

                            </div>
                        </div>

                        <Spacer y={1} />

                        <Button onClick={AddNewGolfSetup}
                            style={{ width: '100%' }} variant="primary">ADD NEW GOLF SET-UP
                        </Button>
                    </div>
                </>
            )
        } else {
            return (
                <Loading />
            )
        }
    }
    return (

        <div style={{ maxWidth: 700, width: windowWidth }}>
            {generatePage()}
        </div>
    );
}

export default Page;
