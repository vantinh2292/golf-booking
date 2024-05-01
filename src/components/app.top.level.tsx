// VersionLogger.tsx, client component
'use client';

import { getDatabase, ref, get, set, onValue, child } from "firebase/database";
// import { Database } from '../../firebase'
import { FC, ReactNode, useEffect, useState } from 'react';

import * as redux_gpsImage from '@/redux/features/gpsImage'
import * as redux_gpsData from '@/redux/features/gpsData'
import * as redux_configGolf from '@/redux/features/ConfigGolf'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';

import { useAppSelector } from '@/redux/store';

export const AppTopLevel: FC<{ children: ReactNode }> = ({ children }) => {
    // // const [DataImage, setDataImage] = useState(null);

    // const dispatch = useDispatch<AppDispatch>()
    // const dataRedux = useAppSelector((state) => state.gpsImageReducer.value)
    // const db = getDatabase();
    // const dbRef = ref(getDatabase());

    // useEffect(
    //     () => {


    //         get(child(dbRef, "TSN/Image")).then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 let newData = snapshot.val();
    //                 dispatch(redux_gpsImage.setData(newData))
    //             } else {
    //                 console.log("No data available");
    //             }
    //         }).catch((error) => {
    //             console.error(error);
    //         });

    //         //Get Firebase GPS
    //         const dataGpsRef = ref(db, "TSN/GPS");
    //         onValue(dataGpsRef, (snapshot) => {
    //             let newData = snapshot.val();
    //             let arrayOfObjects = Object.keys(newData).map((key) => ({
    //                 [key]: newData[key],
    //             }));

    //             dispatch(redux_gpsData.setData(arrayOfObjects))
    //         });

    //         //Get Firebase Config
    //         get(child(dbRef, "TSN/Score/Config")).then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 let newData = snapshot.val();
    //                 let arrayOfObjects = Object.keys(newData).map((key) => ({
    //                     [key]: newData[key],
    //                 }));

    //                 dispatch(redux_configGolf.setData(arrayOfObjects))
    //             } else {
    //                 console.log("No data available");
    //             }
    //         }).catch((error) => {
    //             console.error(error);
    //         });

    //         return () => {
    //             // Unsubscribe from the database when the component unmounts

    //         };
    //     }
    //     , []
    // );

    return (
        <>
            {children}
        </>
    )
};