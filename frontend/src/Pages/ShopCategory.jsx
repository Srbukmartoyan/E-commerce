import React, { useContext } from "react";
import './CSS/ShopCategory.css'
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
    const { all_product } = useContext(ShopContext);

    return (
        <div className="shop-category">
            <img className="shopcategory-banner" src={props.banner} alt="" />
            <div className="shopcategory-indexSort">
                <p>
                    <span>showing 1 - 12 </span> out of 54 Products
                </p>
                <div className="shopcategory-sort">
                    <select name="shopcategory-sort" id="sort">
                        <option value="">sort by</option>
                        <option value="kids">kids</option>
                        <option value="men">men</option>
                        <option value="women">women</option>
                    </select>
                </div>
            </div>
            <div className="shopCategory-products">
                {all_product.map((item, i) => {
                    if (item.category === props.category) {
                        return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                    }
                })}
            </div>
            <div className="shopcategory-exploremore">
                Explore More
            </div>
        </div>
    )
}

export default ShopCategory;