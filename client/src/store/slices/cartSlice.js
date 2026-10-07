import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  tableNumber: localStorage.getItem('tableNumber') || null,
  totalAmount: 0,
}

// Calculate total helper
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const customizationsTotal = item.customizations?.reduce((sum, c) => sum + (c.priceModifier || 0), 0) || 0;
    return total + ((item.price + customizationsTotal) * item.quantity);
  }, 0);
}

// Initial total calculation
initialState.totalAmount = calculateTotal(initialState.items);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setTableNumber: (state, action) => {
      state.tableNumber = action.payload
      localStorage.setItem('tableNumber', action.payload)
    },
    addToCart: (state, action) => {
      const item = action.payload
      // Check if exact same item with same customizations exists
      const existingIndex = state.items.findIndex(
        (i) => i.menuItem === item.menuItem && JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
      )

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += item.quantity
      } else {
        state.items.push(item)
      }
      
      state.totalAmount = calculateTotal(state.items)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    removeFromCart: (state, action) => {
      const index = action.payload
      state.items.splice(index, 1)
      state.totalAmount = calculateTotal(state.items)
      localStorage.setItem('cartItems', JSON.stringify(state.items))
    },
    updateQuantity: (state, action) => {
      const { index, quantity } = action.payload
      if (quantity > 0) {
        state.items[index].quantity = quantity
        state.totalAmount = calculateTotal(state.items)
        localStorage.setItem('cartItems', JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      localStorage.removeItem('cartItems')
    },
  },
})

export const { setTableNumber, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
