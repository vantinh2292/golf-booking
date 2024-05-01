import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialStateType = {
    NameGolfSelected: string;
    NameGroup: string;
    Password: string;
    TimeStamp: number;
}

const initialState: InitialStateType = {
    NameGolfSelected: '',
    NameGroup: '',
    Password: '',
    TimeStamp: 0
}

export const uiUser = createSlice({
    name: 'UiUser',
    initialState,
    reducers: {
        setNameGolfSelected: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                NameGolfSelected: action.payload
            };
        },
        setNameGroup: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                NameGroup: action.payload
            };
        },
        setPassword: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                Password: action.payload
            };
        },
        setTimeStamp: (state, action: PayloadAction<number>) => {
            return {
                ...state,
                TimeStamp: action.payload
            };
        },
    }
})
export const { setNameGolfSelected, setNameGroup, setPassword, setTimeStamp } = uiUser.actions
export default uiUser.reducer