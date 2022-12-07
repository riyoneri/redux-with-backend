import { cartActions } from './cart-slice';
import { uiActions } from './ui-slice';

export const sendCartData = cart => {
    // console.log(cart)
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

export const fetchCartData = () => {
    return dispatch => {
        fetch('/cart')
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not fetch data")
                }
                return res.json()
            })
            .then(data => {
                dispatch(cartActions.replaceCart(data.cart))
            })
            .catch(err => {
                dispatch(uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Fetching cart data failed!',
                }))
            })
    }
}