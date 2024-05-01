'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

//Redux
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
import * as redux_page from '@/redux/features/page'

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  dispatch(redux_page.setChoice(''))
  const Page_Data = useAppSelector((state) => state.pageReducer.value)

  return (
    <div style={{
      height: 'calc(100% - 65px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {
        // Page_Data.level > 0 &&
        <Card className="max-w-[500px] bg-slate-700 w-full">
          <Card.Body>
            {/* <Card.Title>CHỌN THAO TÁC:</Card.Title> */}
            <div style={{ justifyContent: 'center', display: 'grid' }}>
              {/* <Button onClick={() => {
              dispatch(redux_page.setChoice('Monitor'))
              router.push('/MonitorCar/TongThe')
            }} variant="primary">GIÁM SÁT</Button> */}

              <Button onClick={() => {
                dispatch(redux_page.setChoice('Monitor'))
                router.push('/Booking/TeeTime')
              }} variant="primary"
                style={{ width: 250 }}
              >BOOKING TEE TIME</Button>
            </div>
          </Card.Body>
        </Card>

      }
      {/* {Page_Data.level <= 0 &&
        <Card className="max-w-[500px] bg-slate-700 w-full">
          <Card.Body>
            <div style={{ justifyContent: 'center', display: 'grid' }}>
              NEED LOGIN
            </div>
          </Card.Body>
        </Card>
      } */}
    </div >
  )
}
