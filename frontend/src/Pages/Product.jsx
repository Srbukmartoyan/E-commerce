import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
    const { all_product } = useContext(ShopContext);
    const { productId } = useParams();
    const product = all_product.find(el => el.id === Number(productId));

    return (
        <div className="product">
            <Breadcrum product={product}/>
            <ProductDisplay product={product}/>
        </div>
    )
}

export default Product;