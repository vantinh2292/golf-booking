'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button } from "@nextui-org/react";

//Redux
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'

export default function Page() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  dispatch(redux_page.setIndex(0))
  dispatch(redux_page.setChoice('Score'))

  useEffect(() => {
  }, []);
  return (
    <div style={{
      height: 'calc(100% - 65px)',
      display: 'flex',
      paddingTop: 5
    }}>
    </div>
  )
}
