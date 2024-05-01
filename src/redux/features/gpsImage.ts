import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MapData {
    Height: number;
    Location1_lat: number;
    Location1_long: number;
    Location2_lat: number;
    Location2_long: number;
    Point1_pixel_left: number;
    Point1_pixel_top: number;
    Point2_pixel_left: number;
    Point2_pixel_top: number;
    Url: string;
    Width: number;
}
interface GolfCardData {
    Url: string;
    Url_Stop: string;
    Width: number;
    Height: number;
}

type MapDataState = {
    Golf_Car:GolfCardData,
    MB_A: MapData;
    MB_B: MapData;
    MB_C: MapData;
    MB_D: MapData;
    MB_Tong_The: MapData;
}

type InitialState = {
    value: MapDataState
}

const initialState = {
    value: {
        Golf_Car:{
            Url:'',
            Url_Stop:'',
            Width:0,
            Height:0
        },
        MB_A: {
            Height: 0,
            Location1_lat: 0,
            Location1_long: 0,
            Location2_lat: 0,
            Location2_long: 0,
            Point1_pixel_left: 0,
            Point1_pixel_top: 0,
            Point2_pixel_left: 0,
            Point2_pixel_top: 0,
            Url: '',
            Width: 0
        },
        MB_B: {
            Height: 0,
            Location1_lat: 0,
            Location1_long: 0,
            Location2_lat: 0,
            Location2_long: 0,
            Point1_pixel_left: 0,
            Point1_pixel_top: 0,
            Point2_pixel_left: 0,
            Point2_pixel_top: 0,
            Url: '',
            Width: 0
        },
        MB_C: {
            Height: 0,
            Location1_lat: 0,
            Location1_long: 0,
            Location2_lat: 0,
            Location2_long: 0,
            Point1_pixel_left: 0,
            Point1_pixel_top: 0,
            Point2_pixel_left: 0,
            Point2_pixel_top: 0,
            Url: '',
            Width: 0
        },
        MB_D: {
            Height: 0,
            Location1_lat: 0,
            Location1_long: 0,
            Location2_lat: 0,
            Location2_long: 0,
            Point1_pixel_left: 0,
            Point1_pixel_top: 0,
            Point2_pixel_left: 0,
            Point2_pixel_top: 0,
            Url: '',
            Width: 0
        },
        MB_Tong_The: {
            Height: 0,
            Location1_lat: 0,
            Location1_long: 0,
            Location2_lat: 0,
            Location2_long: 0,
            Point1_pixel_left: 0,
            Point1_pixel_top: 0,
            Point2_pixel_left: 0,
            Point2_pixel_top: 0,
            Url: '',
            Width: 0
        },
    } as MapDataState
} as InitialState

export const gpsImage = createSlice({
    name: 'gpsImage',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<MapDataState>) => {
            return {
                value: action.payload
            }
        }
    }
})
export const { setData } = gpsImage.actions
export default gpsImage.reducer