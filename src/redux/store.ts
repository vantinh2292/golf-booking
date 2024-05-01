import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/test'
import gpsImageReducer from './features/gpsImage'
import gpsDataReducer from './features/gpsData'
import configGolfReducer from './features/ConfigGolf'
import pageReducer from './features/page'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
export const store = configureStore({
    reducer: {
        authReducer,
        gpsImageReducer, gpsDataReducer, configGolfReducer,
        pageReducer
    },
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector