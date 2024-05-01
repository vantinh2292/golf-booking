'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/store';
import ViewMap from '@/components/ViewMap';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
function MyComponent() {
    const GPS_Image = useAppSelector((state) => state.gpsImageReducer.value)
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(1))
    return (
        <ViewMap value={GPS_Image.MB_Tong_The}/>
    );
}

export default MyComponent;
