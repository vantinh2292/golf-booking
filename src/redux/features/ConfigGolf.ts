import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type HoldData = {
    Blue: number;
    Gold: number;
    Index: number;
    Par: number;
    Red: number;
    White: number;
};
type YardData = {
    [key: string]: {
        1: HoldData,
        2: HoldData,
        3: HoldData,
        4: HoldData,
        5: HoldData,
        6: HoldData,
        7: HoldData,
        8: HoldData,
        9: HoldData
    }
};

type ConfigGolfData = {
    [key: string]: {
        Blue: ConfigGolfDataOnce;
        Gold: ConfigGolfDataOnce;
        Index: ConfigGolfDataOnce;
        Par: ConfigGolfDataOnce;
        Red: ConfigGolfDataOnce;
        White: ConfigGolfDataOnce;
    }
};

type ConfigGolfState = ConfigGolfData[]

type InitialState = {
    value: ConfigGolfState
}

const initialState = {
    value: [] as ConfigGolfState
} as InitialState

export const configGolf = createSlice({
    name: 'configGolf',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<ConfigGolfState>) => {
            return {
                value: action.payload
            }
        }
    }
})
export const { setData } = configGolf.actions
export default configGolf.reducer