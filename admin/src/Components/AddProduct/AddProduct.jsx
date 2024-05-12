import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../Assets/upload_area.svg'

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({...productDetails, [e.target.name]: e.target.value});
  }

  const Add_Product = async() => { //first get correct image url from back, then redefine product object and send post request to store it in database
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image); // to encode file properly

    await fetch('http://localhost:4000/upload', { //saving here image with new path - geting from back
      method: 'POST', 
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    }).then((resp) => resp.json()).then((data) => responseData = data)

    if (responseData.success) {
      product.image = responseData.image_url;
      await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        data.success ? alert('Product Added') : alert('Failed');
      })
    }
  }

  return (
    <div className='add-product'>
      <div className="addProduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here...' />
      </div>
      <div className="addProduct-price">
        <div className="addProduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here...' />
        </div>
        <div className="addProduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here...' />
        </div>
      </div>
      <div className="addProduct-itemfield">
        <p>Product category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>
      <div className="addProduct-itemField">
        <label htmlFor="file-input">
          <img src={image ?  URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumnail-img'/>
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
      </div>
      <button className='addProduct-btn' onClick={Add_Product}>ADD</button>
    </div>
  )
}

export default AddProduct;
