'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '@/app/loading';

interface Props {
    value: IMapData
}
function ViewMap(props: Props) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [data_Car, setdata_Car] = useState({});
    const [SetWidthMap, setSetWidthMap] = useState(0);
    const [SetHeightMap, setSetHeightMap] = useState(0);
    const GPS_Data = useAppSelector((state) => state.gpsDataReducer.value)
    const Golf_Car = useAppSelector((state) => state.gpsImageReducer.value.Golf_Car)

    // Create a ref to the div element whose dimensions you want to track
    const divRef = useRef<HTMLDivElement | null>(null);

    // Create a ref to hold the latest value of GPS_Image
    const latestGPSImage = useRef(props.value);


    const CalXY_PositionElement = (x: number, y: number) => {
        let DisImageX = Math.abs(latestGPSImage.current.Point2_pixel_left - latestGPSImage.current.Point1_pixel_left)
        let DisImageY = Math.abs(props.value.Point2_pixel_top - props.value.Point1_pixel_top)
        let DisMapX = Math.abs(props.value.Location2_long - props.value.Location1_long)
        let DisMapY = Math.abs(props.value.Location2_lat - props.value.Location1_lat)
        let RatialX = DisMapX / (DisImageX != 0 ? DisImageX : 1)
        let RatialY = DisMapY / (DisImageY != 0 ? DisImageY : 1)

        let realDisMapX = (x - props.value.Location1_long);
        let realDisMapY = (y - props.value.Location1_lat);
        let currentElementX = 0;
        let currentElementY = 0;
        if ((props.value.Point2_pixel_left - props.value.Point1_pixel_left) * (props.value.Location2_long - props.value.Location1_long) > 0) {
            currentElementX = props.value.Point1_pixel_left + realDisMapX / RatialX;
        } else {
            currentElementX = props.value.Point1_pixel_left - realDisMapX / RatialX;
        }

        if ((props.value.Point2_pixel_top - props.value.Point1_pixel_top) * (props.value.Location2_lat - props.value.Location1_lat) > 0) {
            currentElementY = props.value.Point1_pixel_top + realDisMapY / RatialY;
        } else {
            currentElementY = props.value.Point1_pixel_top - realDisMapY / RatialY;
        }

        let newElement = { x: currentElementX, y: currentElementY }
        return (newElement)
    }

    const calDimention = (in_width: number, in_height: number) => {
        let temp_calWidthMap = in_width
        let temp_calHeightMap = in_height
        let temp_setWidthMap = 0
        let temp_setHeightMap = 0
        if (temp_calHeightMap != 0 && latestGPSImage.current.Height != 0) {
            if (temp_calWidthMap / temp_calHeightMap > latestGPSImage.current.Width / latestGPSImage.current.Height) {
                temp_setWidthMap = temp_calHeightMap * latestGPSImage.current.Width / latestGPSImage.current.Height
                temp_setHeightMap = temp_calHeightMap
            } else {
                temp_setWidthMap = temp_calWidthMap
                temp_setHeightMap = temp_calWidthMap * latestGPSImage.current.Height / latestGPSImage.current.Width
            }
        }
        setSetWidthMap(Math.round(temp_setWidthMap))
        setSetHeightMap(Math.round(temp_setHeightMap))
    }

    const updateDimensions = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            setDimensions({
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            });
            calDimention(Math.round(rect.width), Math.round(rect.height));
        }
        // setPageHeight(window.innerHeight);
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
    }, []); // Empty dependency array to run only once on mount

    useEffect(() => {
        latestGPSImage.current = props.value;
        updateDimensions(); // Run when the state changes
    }, [props.value]);

    useEffect(() => {
        calculator_car()
    }, [GPS_Data]);

    useEffect(() => {
        calculator_car()
    }, [props.value]);

    const calculator_car = () => {
        let data_temp: {
            [key: string]: {
                x: number;
                y: number;
                nameCar: string;
                createAt: number;
                currentTime: string
            };
        } = {}
        if (Array.isArray(GPS_Data)) {
            GPS_Data.forEach(element => {
                for (const property in element) {
                    let tempData: {
                        x: number;
                        y: number;
                    } = CalXY_PositionElement(element[property].GPS_Lng, element[property].GPS_Lat)
                    if (tempData && typeof tempData === 'object') {
                        let updatedObject = {
                            ...tempData,
                            nameCar: property,
                            createAt: element[property].createAt,
                            currentTime: element[property].currentTime
                        };
                        data_temp[property] = updatedObject
                    }
                }
            });
            setdata_Car(data_temp)
        }
    }


    const carNotify = ({ x, y, nameCar, createAt, currentTime }: { x: number, y: number, nameCar: string, createAt: number, currentTime: string }) =>
        toast.success(nameCar + ': Last update GPS ' + currentTime);

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            height: 'calc(100% - 66px)',
            display: 'flex',
            flexDirection: 'column',
        }} ref={divRef}>
            <div style={{
                position: 'absolute',
                left: (dimensions.width - SetWidthMap) / 2,
                top: (dimensions.height - SetHeightMap) / 2,
                width: '100%',
                height: '100%',
            }}>
                {props.value.Url.length > 0 ?
                    < Image
                        unoptimized
                        width={SetWidthMap}
                        height={SetHeightMap}
                        src={props.value.Url}
                        alt="IMAGE"
                    // priority={true}
                    />
                    :
                    <Loading />
                }

            </div>

            {
                Object.values(data_Car as Record<string, {
                    x: number;
                    y: number;
                    nameCar: string;
                    createAt: number;
                    currentTime: string
                }>)?.map((value, key) => {
                    let calLeft = (dimensions.width - SetWidthMap) / 2 + value.x * SetWidthMap / (props.value.Width != 0 ? props.value.Width : 1) - Golf_Car.Width / 2
                    let calTop = (dimensions.height - SetHeightMap) / 2 + value.y * SetWidthMap / (props.value.Width != 0 ? props.value.Width : 1) - Golf_Car.Height / 2
                    if (calLeft && calTop && calLeft > 0 && calTop > 0) {
                        return (
                            <Image
                                onClick={() => { carNotify(value) }}
                                key={key}
                                style={{
                                    position: 'absolute',
                                    left: calLeft,
                                    top: calTop,
                                    zIndex: 5000,
                                }}
                                unoptimized
                                src={(Math.abs(new Date().getTime() - value.createAt)) < 10000 ? Golf_Car.Url : Golf_Car.Url_Stop}
                                // src={require('./Images/golf_car_stop.gif')}
                                alt="Golf_Car"
                                height={Golf_Car.Height * 2 / 3}
                                width={Golf_Car.Width * 2 / 3}
                            />
                        )
                    }

                })
            }
        </div >
    );
}

export default ViewMap;
