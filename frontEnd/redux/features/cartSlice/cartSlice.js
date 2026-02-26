import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: getInitialCart(),
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
    },

    setDirectCheckout: (state, action) => {
      // للدفع المباشر لمنتج واحد فقط
      state.checkoutItems = [{ ...action.payload }];
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
  updateQuantity, 
  removeFromCart 
} = cartSlice.actions;

export default cartSlice.reducer;