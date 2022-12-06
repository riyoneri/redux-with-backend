import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
  },
  reducers: {
    replaceCart(state, action) {
      state.totalQuantity = action.payload.totalQuantity;
      state.items = action.payload.items
    },
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        existingItem.quantity--;
      }
    },
    initialiseCart(state, action) {
      state.items = action.payload.items
      state.totalQuantity = action.payload.totalQuantity
    }
  },
});

export const getCartData = (cart) => {
  return dispatch => {
    fetch('/cart')
      .then(res => {
        if (!res.ok) {
          throw new Error("Getting Cart Data Failed")
        }
        return res.json()
      })
      .then(data => {
        dispatch(cartActions.initialiseCart(data.cartData))
      })
      .catch(err => {
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: err.message,
        }))
      })
  }
}

export const sendCartData = cart => {
  return dispatch => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!',
    }))

    fetch('/add-to-cart', {
      method: 'POST',
      body: JSON.stringify(cart),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Sending cart data failed.")
        }
        dispatch(uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sent cart data successfully!',
        }))
      })
      .catch(err => {
        dispatch(uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        }))
      })

  }
}

export const cartActions = cartSlice.actions;

export default cartSlice;