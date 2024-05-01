import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type pageType = {
    index: number,
    choice: string,
    level: number
};

type PageState = pageType

type InitialState = {
    value: PageState
}

const initialState = {
    value: { index: 0, choice: '', level: -1 } as pageType
} as InitialState

export const pageData = createSlice({
    name: 'page',
    initialState,
    reducers: {
        setIndex: (state, action: PayloadAction<number>) => {
            state.value.index = action.payload
        },
        setChoice: (state, action: PayloadAction<string>) => {
            state.value.choice = action.payload
        },
        setLevel: (state, action: PayloadAction<number>) => {
            state.value.level = action.payload
        }
    }
})
export const { setIndex, setChoice, setLevel } = pageData.actions
export default pageData.reducer