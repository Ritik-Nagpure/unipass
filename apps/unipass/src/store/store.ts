import { configureStore } from '@reduxjs/toolkit'
import authReducer, { AuthState } from './auth/authSlice'
import themeReducer, { ThemeState } from './theme/themeSlice'

interface RootStateShape {
    auth: AuthState,
    theme: ThemeState
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
        theme: themeReducer,
    },
})

export type RootState = RootStateShape
export type AppDispatch = typeof store.dispatch