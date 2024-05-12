import { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300 + 1; ++i) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = ({children}) => {
    const [all_product, setAll_product] = useState([])
    const [cartItems, setCartItems] = useState(getDefaultCart);

    useEffect(() => {
        fetch('http://localhost:4000/allproducts')
        .then((data) => data.json())
        .then((res) => setAll_product(res));

        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-type': 'application/json',
                },
                body: "",
            }).then((response) => response.json())
            .then((data) => setCartItems(data));
        }
    }, [])

    const addToCart = (itemId) => {
        setCartItems((cartItems) => ({
            ...cartItems,
            [itemId] : cartItems[itemId] + 1
        }))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'itemId':itemId}),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    }

    // console.log(cartItems);

    const removeFromCart = (itemId) => {
        setCartItems((cartItems) => ({
            ...cartItems,
            [itemId] : cartItems[itemId] - 1
        }))
        if (localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'itemId':itemId}),
            })
            .then((response) => response.json())
            .then((data) => console.log(data));
        }
    } 

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (let i = 0; i < all_product.length; ++i) {
            if(cartItems[all_product[i].id]) {
                totalAmount += (all_product[i].new_price * cartItems[all_product[i].id]);
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        const values = Object.values(cartItems);
        return values.reduce((accum, value) => accum + value);
    }

    const contextValue = {all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems};

    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;