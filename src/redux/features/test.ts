import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
    isAuth: boolean;
    userName: string;
    uid: string;
}

type InitialState = {
    value: AuthState
}

const initialState = {
    value: {
        isAuth: false,
        userName: '111',
        uid: ''
    } as AuthState
} as InitialState

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            return initialState
        },
        logIn: (state, action: PayloadAction<string>) => {
            return {
                value: {
                    isAuth: true,
                    userName: action.payload,
                    uid: '123123'
                }
            }
        }
    }
})
export const { logIn, logOut } = auth.actions
export default auth.reducer