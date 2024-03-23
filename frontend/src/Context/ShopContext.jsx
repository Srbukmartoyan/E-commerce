import { createContext, useState } from "react";
import all_product from '../Components/Assets/all_product';

export const ShopContext = createContext(null);
const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < all_product.length + 1; ++i) {
        cart[i] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {

    const [cartItems, setCartItems] = useState(getDefaultCart);

    const addToCart = (itemId) => {
        setCartItems((cartItems) => ({
            ...cartItems,
            [itemId] : cartItems[itemId] + 1
        }))
    }

    // console.log(cartItems);

    const removeFromCart = (itemId) => {
        setCartItems((cartItems) => ({
            ...cartItems,
            [itemId] : cartItems[itemId] - 1
        }))
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
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;