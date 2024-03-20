import React, { useContext } from "react";
import './CSS/ShopCategory.css'
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);

    return (
        <div className="shop-category">
            <img src={props.banner} alt="" />
            <div className="shopCategory-indexSort">
                <p>
                    <span>showing 1 - 12 out of 54 Products</span>
                </p>
                <select name="sort" id="sort">
                    <option value="kids">kids</option>
                    <option value="men">men</option>
                    <option value="women">women</option>
                </select>
            </div>
            <div className="shopCategory-products">
                {all_product.map((item, i) => {
                    if (item.category === props.category) {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                    }
                })}
            </div>
        </div>
    )
}

export default ShopCategory;