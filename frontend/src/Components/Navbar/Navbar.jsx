import { Link } from "react-router-dom";
import { useContext, useRef, useState } from "react";

import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import nav_dropDown_icon from '../Assets/nav-dropdown.webp'
import { ShopContext } from "../../Context/ShopContext";


const Navbar = () => {
    const[menu, setMenu] = useState('shop');
    const { getTotalCartItems } = useContext(ShopContext);
    const menuRef = useRef();

    const dropDown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    return (
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="logo" />
                <Link style={{ textDecoration : 'none',  color: '#626262' }} to='/'><p>SHOPPER</p></Link>
            </div>
            <img className='nav-dropdown' onClick={dropDown_toggle} src={nav_dropDown_icon} alt="" />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={() => setMenu('shop')}><Link style={{ textDecoration : 'none',  color: '#626262' }} to='/'>Shop</Link>{menu==='shop'?<hr/>:<></>}</li>
                <li onClick={() => setMenu('men')}><Link style={{ textDecoration : 'none', color: '#626262'  }} to='/men'>Men</Link>{menu==='men'?<hr/>:<></>}</li>
                <li onClick={() => setMenu('women')}><Link style={{ textDecoration : 'none', color: '#626262'  }} to='women'>Women</Link>{menu==='women'?<hr/>:<></>}</li>
                <li onClick={() => setMenu('kids')}><Link style={{ textDecoration : 'none', color: '#626262'  }} to='kids'>Kids</Link>{menu==='kids'?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token') 
                ? <button onClick={() => {localStorage.removeItem('auth-token'); window.location.replace('/')}}>Logout</button>
                : <Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'><img src={cart_icon} alt="cart icon"/></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar;