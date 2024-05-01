'use client'
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const pageReducer = useAppSelector((state) => state.pageReducer)
    const dispatch = useDispatch<AppDispatch>()
    return (
        <>
            {children}
        </>
    )
}
