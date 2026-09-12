import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState { isDark: boolean }

const initialState: ThemeState = { isDark: true }

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        turnOn(state) {
            state.isDark = true
        },
        turnOff(state) {
            state.isDark = false
        },
    }

})

export const { turnOn, turnOff } = themeSlice.actions
export default themeSlice.reducer