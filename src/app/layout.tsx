import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head';
const inter = Inter({ subsets: ['latin'] })
import 'bootstrap/dist/css/bootstrap.min.css';

import AppHeader from '@/app/layout.header';
import Container from 'react-bootstrap/Container';
import { AppTopLevel } from '@/components/app.top.level';
import { ReduxProvider } from '@/redux/provider';

import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from './toast.provider';
import SessionProvider from './SessionProvider'
import { Providers } from "./providers";
import { AuthContextProvider } from "./context/AuthContext";

import backgroundImage from '../components/Images/background.jpg'
export const metadata: Metadata = {
  title: 'Golf',
  description: 'Manage Golf',
  manifest: '/manifest.json',
  icons: { apple: '/icon.png' },
  themeColor: '#fff'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-bs-theme="dark" style={{ height: '100%' }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=no" />
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script> */}
      </Head>
      <body style={{
        overflow: 'auto', justifyContent: 'center', display: 'flex'
      }}>
        <Providers>
          <ReduxProvider>
            <ToastProvider>
              <AuthContextProvider>
                <SessionProvider>
                  <div style={{
                    height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
                    background: 'linear-gradient(0deg, #70e000 0%, #007200 100%)',
                    // height: '100vh', // This ensures the div takes up the full height of the viewport
                    width: '100vw',
                    justifyContent: 'center',
                  }}>
                    <AppHeader />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                      <AppTopLevel>
                        {children}
                      </AppTopLevel>
                    </div>

                  </div>
                </SessionProvider>
              </AuthContextProvider>
            </ToastProvider>
          </ReduxProvider>
        </Providers>
      </body>
    </html>
  )
}
