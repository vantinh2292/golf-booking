import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type IGpsData = {
    [key: string]: {
        GPS_Lat: number;
        GPS_Lng: number;
        createAt: number;
        currentTime: string;
    };
};

type GpsState = IGpsData[]

type InitialState = {
    value: GpsState
}

const initialState = {
    value:
        [{
            'Test': {
                GPS_Lat: 0,
                GPS_Lng: 0,
                createAt: 0,
                currentTime: '0'

            }
        }] as GpsState
} as InitialState

export const gpsData = createSlice({
    name: 'gpsData',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<GpsState>) => {
            return {
                value: action.payload
            }
        }
    }
})
export const { setData } = gpsData.actions
export default gpsData.reducer