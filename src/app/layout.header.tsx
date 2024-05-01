'use client'
import React, { useEffect, useState } from 'react';
import {
    Tooltip,
    // Dropdown, DropdownMenu, DropdownItem, DropdownTrigger
} from "@nextui-org/react";
// import Navbar from 'react-bootstrap/Navbar';
import Image from 'next/image';
import Link from 'next/link'
import { UserAuth } from './context/AuthContext'
import styles from './layout.module.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { useAppSelector } from '@/redux/store';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/navigation'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { toast } from 'react-toastify';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { Database } from '../../firebase';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
function AppHeader() {
    const dispatch = useDispatch<AppDispatch>()
    const dbRef = ref(Database);
    const version = 'v1.1.2'
    const { user, googleSignIn, logOut } = UserAuth()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const Page_Data = useAppSelector((state) => state.pageReducer.value)
    const router = useRouter()
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [windowType, setWindowType] = useState<string>('');
    const [listUser, setListUser] = useState<IUser[]>([])
    const [currentLevelUser, setCurrentLevelUser] = useState<number>(-1);
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        //Get Firebase GPS
        get(child(dbRef, "Booking/User")).then((snapshot) => {
            if (snapshot.exists()) {
                let newData = snapshot.val();
                generate_list_user(newData)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

        if (typeof window !== 'undefined') {
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
                setWindowWidth(window.innerWidth);
            };

            handleResize()

            // Add event listener for window resize
            window.addEventListener('resize', handleResize);
            // Clean up the event listener when the component unmounts
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }

    }, []); // Empty dependency array means this effect runs once after the initial render

    const generate_list_user = (data: IListUser) => {
        let temp_list: IUser[] = []
        for (const property in data) {
            temp_list.push({
                Email: data[property].Email,
                Level: data[property].Level,
            })
        }
        setListUser(temp_list)
    }

    useEffect(() => {
        if (user && listUser.length > 0) {
            listUser.forEach((element, index) => {
                if (element.Email.toLowerCase() === user.email.toLowerCase()) {
                    setCurrentLevelUser(element.Level)
                    dispatch(redux_page.setLevel(element.Level))
                }
            })
        }
    }, [user, listUser]); // Empty dependency array means this effect runs once after the initial render


    const handleSignIn = async () => {
        try {
            await googleSignIn()
        } catch (error) {
            console.log(error)
        }
    }
    const handleSignOut = async () => {
        setCurrentLevelUser(0)
        try {
            await logOut()
        } catch (error) {
            console.log(error)
        }
    }
    const menuItemsMonitor = [
        {
            title: 'HOME',
            link: '/',
            index: 1
        },
        {
            title: 'TỔNG THỂ',
            link: '/MonitorCar/TongThe',
            index: 2
        },
        {
            title: 'Sân A',
            link: '/MonitorCar/A',
            index: 3
        },
        {
            title: 'Sân B',
            link: '/MonitorCar/B',
            index: 4
        },
        {
            title: 'Sân C',
            link: '/MonitorCar/C',
            index: 5
        },
        {
            title: 'Sân D',
            link: '/MonitorCar/D',
            index: 6
        }
    ];
    const menuItemsSetupCourse = [
        {
            title: 'NEW GOLF COURSE SET-UP',
            link: '/Score/SetUp',
            index: 1
        },
        {},
        {
            title: 'ADD COURSE',
            link: '/Score/AddCourse',
            index: 2
        },
        {
            title: 'EDIT COURSE',
            link: '/Score/EditCourse',
            index: 3
        }
    ];
    const menuItemsSetupGamePersonal = [
        {
            title: 'NEW GAME PERSONAL',
            link: '/Score/Game/Personal/Add',
            index: 5
        },
        {
            title: 'EDIT GAME PERSONAL',
            link: '/Score/Game/Personal/Edit',
            index: 6
        },
        {},
        {
            title: 'ENTER GAME PERSONAL',
            link: `/Score/Game/Personal/Enter?password=${btoa('_')}&timestamp=${btoa('_')}`,
            index: 7
        },
    ];
    const menuItemsSetupGameTournament = [
        {
            title: 'ADD SET-UP TOURNAMENT',
            link: '/Score/Game/Tournament/Setup-Add',
            index: 10,
            level: 10
        },
        {
            title: 'EDIT SET-UP TOURNAMENT',
            link: '/Score/Game/Tournament/Setup-Edit',
            index: 11,
            level: 10
        },
        {},
        {
            title: 'IMPORT PLAYERS TOURNAMENT',
            link: '/Score/Game/Tournament/Players-Import',
            index: 12,
            level: 10
        },
        {
            title: 'EDIT PLAYERS TOURNAMENT',
            link: '/Score/Game/Tournament/Players-Edit',
            index: 13,
            level: 10
        },
        {},
        {
            title: 'Enter Tournament Group',
            link: '/Score/Game/Tournament/Enter-Group',
            index: 14,
            level: -1
        },
    ];
    const handleToggle = () => {
        setExpanded(!expanded);
    };
    return (
        // <Navbar collapseOnSelect expand="lg" className={styles.Navbar}>
        <Navbar expanded={expanded} onToggle={handleToggle} collapseOnSelect expand="lg" className="" style={{ width: '100vw', backgroundColor: '#007200' }}>
            <Container>
                <Tooltip className={styles.Tooltip} content={version}>
                    <Navbar.Brand style={{ fontWeight: 'bold', fontSize: 25 }} onClick={() => { toast.info(version) }}>GOLF</Navbar.Brand>
                </Tooltip>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {false && <Nav
                        className="me-auto my-2 my-lg-0"
                        // style={{ maxHeight: '200px' }}
                        navbarScroll
                    >
                        {/* <Nav.Link
                            href={'/'}
                            style={{
                                textAlign: 'center',
                                color: 0 == Page_Data.index ? "#73d2de" : "",
                                fontWeight: 0 == Page_Data.index ? "bold" : ""
                            }}
                        >
                            HOME
                            <div style={{ display: 'none' }}>{Page_Data.index}</div>
                        </Nav.Link> */}
                        {currentLevelUser >= 10 ?
                            <NavDropdown title="Setup Course" style={{
                                textAlign: 'center',
                                color: (1 <= Page_Data.index && Page_Data.index <= 3) ? "white !important" : "",
                                fontWeight: (1 <= Page_Data.index && Page_Data.index <= 3) ? "bold" : ""
                            }}>
                                {/* <NavDropdown.Divider /> */}
                                {
                                    menuItemsSetupCourse.map((item, key) => (
                                        Object.keys(item).length !== 0 ?
                                            <NavDropdown.Item
                                                key={key}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                                onClick={() => { setExpanded(false) }}
                                                href={item.link}
                                            >
                                                <Link style={{
                                                    textAlign: 'center',
                                                    color: item.index == Page_Data.index ? "#73d2de" : "#adb5bd",
                                                    fontWeight: item.index == Page_Data.index ? "bold" : "",
                                                    textDecoration: 'none'
                                                }}
                                                    href={item.link || ''}>{item.title}</Link>

                                                <div style={{ display: 'none' }}>{Page_Data.index}</div>
                                            </NavDropdown.Item>
                                            :
                                            <NavDropdown.Divider key={key} />
                                    ))
                                }
                                {/* <NavDropdown.Divider /> */}
                            </NavDropdown>
                            : ''}


                        <NavDropdown title="Game Personal" style={{
                            textAlign: 'center',
                            color: (5 <= Page_Data.index && Page_Data.index <= 7) ? "white !important" : "white",
                            fontWeight: (5 <= Page_Data.index && Page_Data.index <= 7) ? "bold" : ""
                        }}>
                            {/* <NavDropdown.Divider /> */}
                            {
                                menuItemsSetupGamePersonal.map((item, key) => (
                                    Object.keys(item).length !== 0 ?
                                        <NavDropdown.Item
                                            key={key}
                                            style={{
                                                textAlign: 'center',
                                            }}
                                            onClick={() => { setExpanded(false) }}
                                            href={item.link}
                                        >
                                            <Link style={{
                                                textAlign: 'center',
                                                color: item.index == Page_Data.index ? "#73d2de" : "#adb5bd",
                                                fontWeight: item.index == Page_Data.index ? "bold" : "",
                                                textDecoration: 'none'
                                            }}
                                                href={item.link || ''}>{item.title}</Link>
                                            <div style={{ display: 'none' }}>{Page_Data.index}</div>
                                        </NavDropdown.Item>
                                        :
                                        <NavDropdown.Divider key={key} />
                                ))
                            }
                            {/* <NavDropdown.Divider /> */}
                        </NavDropdown>
                        <NavDropdown title="Game Tournament" style={{
                            textAlign: 'center',
                            color: (10 <= Page_Data.index && Page_Data.index <= 16) ? "#73d2de !important" : "",
                            fontWeight: (10 <= Page_Data.index && Page_Data.index <= 16) ? "bold" : ""
                        }}>
                            {/* <NavDropdown.Divider /> */}
                            {
                                menuItemsSetupGameTournament.map((item, key) => (
                                    (item && parseInt(String(item.level || 0)) <= currentLevelUser) ?
                                        Object.keys(item).length !== 0 ?
                                            <NavDropdown.Item
                                                key={key}
                                                href={item.link}
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                                onClick={() => { setExpanded(false) }}
                                            >
                                                <Link style={{
                                                    textAlign: 'center',
                                                    color: item.index == Page_Data.index ? "#73d2de" : "#adb5bd",
                                                    fontWeight: item.index == Page_Data.index ? "bold" : "",
                                                    textDecoration: 'none'
                                                }}
                                                    href={item.link || ''}>{item.title}</Link>
                                                <div style={{ display: 'none' }}>{Page_Data.index}</div>
                                            </NavDropdown.Item>
                                            :
                                            <NavDropdown.Divider key={key} />
                                        :
                                        ''
                                ))
                            }
                            {/* <NavDropdown.Divider /> */}
                        </NavDropdown>
                    </Nav>}
                    <Navbar.Collapse className="justify-content-end">
                        {user ?
                            <>
                                <Navbar.Text style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'center', display: 'block', fontSize: 20, color: 'white' }} onClick={() => { toast.info('Level Account: ' + Page_Data.level) }}>
                                    {(user.displayName)}
                                </Navbar.Text>

                                <Nav.Link
                                    // href={'/Auth/Signin'}
                                    onClick={handleSignOut}
                                    style={{
                                        paddingLeft: 10, paddingRight: 10,
                                        textAlign: 'center',
                                        color: 'white',
                                        fontWeight: 0 == Page_Data.index ? "bold" : ""
                                    }}
                                >
                                    Sign Out
                                </Nav.Link>
                            </>
                            :
                            <Nav.Link
                                // href={'/Auth/Signin'}
                                onClick={handleSignIn}
                                style={{
                                    textAlign: 'center',
                                    color: 'white',
                                    fontWeight: 0 == Page_Data.index ? "bold" : ""
                                }}
                            >
                                Sign in
                            </Nav.Link>
                        }
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppHeader;
