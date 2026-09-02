import { configureStore } from '@reduxjs/toolkit';


export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;