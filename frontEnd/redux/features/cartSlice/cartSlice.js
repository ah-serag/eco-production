import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    checkoutItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    prepareCartCheckout: (state) => {
      state.checkoutItems = [...state.cartItems];
      localStorage.setItem("checkoutItems", JSON.stringify(state.checkoutItems));
    },

    setDirectCheckout: (state, action) => {
      state.checkoutItems = [{ ...action.payload }];
      localStorage.setItem("checkoutItems", JSON.stringify(state.checkoutItems));
    },

    clearCheckoutItems: (state) => {
      state.checkoutItems = [];
      localStorage.removeItem("checkoutItems");
    },

    loadCartFromStorage: (state) => {
      const saved = localStorage.getItem("cart");
      if (saved) state.cartItems = JSON.parse(saved);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
  },
});

export const {
  addToCart,
  prepareCartCheckout,
  setDirectCheckout,
  clearCheckoutItems,
  loadCartFromStorage,
  updateQuantity,
  removeFromCart
} = cartSlice.actions;

export default cartSlice.reducer;