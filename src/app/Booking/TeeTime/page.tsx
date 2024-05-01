'use client'
import React, { useMemo, useEffect, useState, useRef, ChangeEvent } from 'react';
// import { useAppSelector } from '@/redux/store';
import { Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/store';

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'

import { getDatabase, ref, onValue, child, get, set } from "firebase/database";
import { Database } from '../../../../firebase';
import { toast } from 'react-toastify';
import styles from './page.module.css'
import Loading from './loading';
import type { DatePickerProps, SliderSingleProps } from 'antd';
import { ConfigProvider, Button, message, Steps, theme, DatePicker, Slider, Input } from 'antd';
import Steps_1 from '@/components/Booking/Steps_1';
import Steps_2 from '@/components/Booking/Steps_2';
import Steps_3 from '@/components/Booking/Steps_3';
import { DownloadDone } from '@mui/icons-material';

function Page() {
    const router = useRouter();
    const Page_Data = useAppSelector((state) => state.pageReducer.value)

    const dbRef = ref(Database);
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(2))

    const [haveData, setHaveData] = useState<boolean>(false);
    const [listBookingData, setListBookingData] = useState<IListBookingData[]>([]);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const divRef = useRef<HTMLDivElement | null>(null);
    const [widthScreen, setWidthScreen] = useState(0)
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const [datePicker, setDatePicker] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        if (current == 1) {
            setSelectedTime('')
        }
    }, [current]);

    const next = () => {
        setCurrent(current + 1)
    };

    const prev = () => {
        setCurrent(current - 1);
    };

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
        if (datePicker.length > 0) {
            const dbRef = ref(Database, "Booking/Data/" + datePicker);
            onValue(dbRef, (snapshot) => {
                if (snapshot.exists()) {
                    setHaveData(true)
                    updateDimensions();
                    let newData = snapshot.val();
                    generate_list_data(newData)
                } else {
                    setHaveData(true)
                    generate_list_data(null)
                    console.log("No data available");
                }
            })
        }
    }, [datePicker]);
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

    const generate_list_data = (data: { [key: string]: IListBookingData } | null) => {

        let temp_list: IListBookingData[] = []
        if (data) {
            for (const property in data) {
                if (data.hasOwnProperty(property) && typeof data[property] === 'object') {
                    temp_list.push(data[property])
                }
            }
        }
        setListBookingData(temp_list)
    }
    useEffect(() => {
        //Permistion Access Page
        if (Page_Data.level > 0 && Page_Data.level < 10) {
            toast.warning("You do not have permission to access this page")
            router.push('/');
        }
    }, [Page_Data, router]);


    useEffect(() => {
        updateDimensions();
        return () => {
        };
    }, []);


    const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
        if (typeof dateString === 'string') {
            setDatePicker(dateString);
            setSelectedTime('')
            setHaveData(false)
        } else {
            // Handle the case where dateString is an array of strings
            // For example, you might want to join the strings with a separator
            setDatePicker(dateString.join(' - '));
        }
        next()
    };

    const selectTime = (time: string) => {
        setSelectedTime(time)
        if (time.length > 0) next()
    }
    const steps = [
        {
            title: 'Select Date',
            content: (
                <Steps_1
                    datePicker={datePicker}
                    onChangeDatePicker={onChangeDatePicker}
                />
            ),
        },
        {
            title: 'Select Time Section',
            content: (
                haveData &&
                <Steps_2
                    listBookingData={listBookingData}
                    selectTime={selectTime}
                />
            ),
        },
        {
            title: 'Input Information Order',
            content: (
                <Steps_3
                    datePicker={datePicker}
                    selectedTime={selectedTime}
                    listBookingData={listBookingData}
                    next={next}
                />),
        },
        {
            title: 'Booking Done',
            content: (
                <div>DONE</div>),
        },
    ];
    const items = steps.map((item) => ({ key: item.title, title: item.title }));

    const contentStyle: React.CSSProperties = {
        lineHeight: '100%',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `2px dashed ${token.colorBorder}`,
        // margin: 10,
        height: 'calc(100% - 172px)',
        padding: 10,
        overflow: 'auto',
        // display: 'grid',
    };

    const generatePage = () => {
        // if (Page_Data.level !== -1) {
        return (
            <>
                <div
                    style={{ color: 'white', fontSize: 25, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>BOOKING TEE TIME{datePicker.length > 0 ? ': ' + datePicker : ''}{selectedTime.length > 0 ? ' / ' + selectedTime : ''}</div>
                <ConfigProvider
                    theme={{
                        components: {
                            Steps: {
                                navArrowColor: '#2f3d57',
                            },
                        },
                    }}
                >
                    <Steps progressDot className={styles.steps} current={current} items={items} />
                </ConfigProvider>
                <div style={{ marginTop: 15, width: '100%', justifyContent: 'center', display: 'flex' }}>
                    {current > 0 && (
                        <Button style={{ margin: '0 8px', width: 100 }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <>
                            <Button style={{ width: 100 }} onClick={() => {
                                if (datePicker.length > 0 && current == 0) {
                                    next()
                                } else {
                                    if (selectedTime.length > 0 && current == 1) {
                                        next()
                                    }
                                }
                            }}>
                                Next
                            </Button>

                        </>
                    )}
                    {current === steps.length - 1 && (
                        <Button style={{ width: 100 }} onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    )}

                </div>
                <Spacer y={1} />
                <div style={contentStyle}>
                    {steps[current].content}
                </div>
            </>
        )
        // } else {
        //     return (
        //         <Loading />
        //     )
        // }
    }


    return (
        <div style={{
            maxWidth: 1200,
            height: 'calc(100vh - 80px)',
            width: windowWidth,
            justifyContent: 'center',
            backgroundColor: '#4c956c',//'rgb(65 103 109)',
            padding: '0px 10px 0px 10px',
            margin: 10,
            borderRadius: 10,
        }} ref={divRef}>
            {generatePage()}
        </div >
    );
}

export default Page;
