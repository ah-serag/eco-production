import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {apiSlice} from "./api/apiSlice"
import cartReducer from "./../features/cartSlice/cartSlice"; 


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NEXT_PUBLIC_ENV ,
  serializableCheck: false,
});




setupListeners(store.dispatch);
