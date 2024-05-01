'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Button } from "@nextui-org/react";

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [windowType, setWindowType] = useState<string>('');
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const router = useRouter()
    useEffect(() => {
        // Check if the window object is defined (for server-side rendering)
        if (typeof window !== 'undefined') {
            // Update the width when the window is resized
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
                setWindowHeight(window.innerHeight)
            };
            handleResize()
            window.addEventListener('resize', handleResize);
            // Clean up the event listener when the component unmounts
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);
    return (
        < div style={{
            // height: 'calc(100% - 64px)',
            height: windowHeight - 64,
            alignItems: 'center',
            verticalAlign: 'center',
            justifyContent: 'center',
            width: '100%',
            display: windowType === 'Mobile' ? 'grid' : 'grid',
            overflow: 'auto',
        }}>
            {children}
        </ div >
    )
}
