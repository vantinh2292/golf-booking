'use client'
import React, { useEffect, useState } from 'react';
import Script from "next/script";

interface Props {
  width: number,
  fontSize: number,
  namePlayer: string,
  HDC: string,
  VGA: string,
  score: number,
}

export default function InfoPlayer(props: Props) {
  return (
    <div style={{ width: props.width, justifyContent: 'center', fontSize: props.fontSize, color: 'black', height: '100%' }} className='p-1 rounded-md border-1 border-solid border-slate-700'>
      <div style={{ display: 'flex', fontWeight: 'bold' }}>{`Name: ${props.namePlayer}`}</div>
      <div style={{ display: 'flex', fontWeight: 'bold' }}>{`Score: ${props.score}`}</div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>HDC: {' ' + props.HDC}</div>
        <div>VGA: {' ' + props.VGA}</div>
      </div>
      <div style={{ borderBottom: '1px solid #3D4658', width: '80%', margin: 'auto', paddingTop: '2px', paddingBottom: '2px' }}></div>
      <div>Sign: </div>
    </div >
  );
}