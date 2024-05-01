'use client'
import React, { useEffect, useState, useRef } from 'react';
import ViewMap from '@/components/ViewMap';

import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'
function Page() {
    const GPS_Image = useAppSelector((state) => state.gpsImageReducer.value)
    const dispatch = useDispatch<AppDispatch>()
    dispatch(redux_page.setIndex(2))
    return (
        <ViewMap value={GPS_Image.MB_A}/>
    );
}

export default Page;
