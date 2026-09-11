import { configureStore } from '@reduxjs/toolkit'
import authReducer, { AuthState } from './auth/authSlice'

interface RootStateShape {
  auth: AuthState
}

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})

export type RootState = RootStateShape
export type AppDispatch = typeof store.dispatch