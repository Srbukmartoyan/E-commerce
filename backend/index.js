const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose'); //initialize enq anum
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path'); //express appic stanum enq access backend dir-in
const cors = require('cors');

app.use(express.json()); // inch response stananq pass karvi json
app.use(cors()); //reactjs a connect e anum express-in 4000porti vra

//database connection
mongoose.connect("mongodb://localhost:27017/Ecommerce");

//API connection

app.get('/', (req, res) => {
    res.send('Express app is running');
})

//image storage engine configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

//upload fn
const upload = multer({storage : storage});

app.use('/images', express.static('upload/images')); //sa miayn nra hamar e vor arden mer mot save exac imagei pathy tanq userin

// createing upload endpoint for images
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({ //res-i mijocov usery karoxanum e access anel tvyal imagein
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}` // can acess to that uploaded image
    })
})

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    available: {
        type: Boolean,
        default: true,
    },
})

app.post('/addproduct', async (req, res) => { // req-y post uxarkvac objectn e
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({ //cankacac ban database - um pahelu hamar petq e hamap modelic new anel poxancel hamap karucvacqov data (ete arandzin json-ov unem chisht karcvacqov dataner/data, el manually aystex karox em req-ic destruct chanel karucvacqy (qani vor vstah em vor fildery chisht destuct arvac sahmanvac ec)), save anel
        id : id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save(); //ays methodnery bolory asynxron en => await, isk methody dnel async (req, res)
    console.log('Saved');
    res.json({
        success: true,
        name: req.body.name,
    })
})

//createing api for deleting products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({id : req.body.id});
    console.log("removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

app.get('/allproducts', async(req, res) => {
    let products = await Product.find({});
    console.log("all productes fetched");
    res.send(products);
})

//schema creating for user model
const Users = mongoose.model('Users', {
    name : {
        type : String,
    },
    email: {
        type : String,
        unique: true,
    },
    password: {
        type : String,
    },
    cartData: {
        type : Object,  
    },
    date: {
        type: Date,
        default: Date.now(),
    }
})

// creating endpoint for registering the user
app.post('/signup', async(req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({success: false, errors: 'exisiting user is found with this email'});
    }
    let cart = {};
    for (let i = 0; i < 300; ++i) {
        cart[i] = 0;
    }
    const user = new Users({
        name : req.body.username,
        email: req.body.email,
        password : req.body.password,
        cartData : cart,
    })

    await user.save(); // userin stexcecinq save arecinq

    const data = { // for jwt authentication
        user : {
            id : user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom'); //token generation with jwt
    res.json({ success: true, token });
});

//creating endpoint for user login
app.post('/login', async(req, res) => {
    let user = await Users.findOne({ email : req.body.email });
    if (user) {
        const passCompare = user.password === req.body.password;
        if (passCompare) {
            const data = {
                user : {
                    id : user.id
                }
            }

            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success : false, errors : 'Wrong Password'});
        }
    } else {
        res.json({ success: false, errors: "Wrong email ID"});
    }
})

//createing endpoint for newCollection 
app.get ('/newCollections', async(req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    console.log('new collection fetched');
    res.send(newCollection);
})

//creating endpoint for popular in women
app.get('/popularinwomen', async(req, res) => {
    let products = await Product.find({category : 'women'});
    let popular_in_women = products.slice(0, 4);
    console.log('popular in women fetched');
    res.send(popular_in_women);
})

// creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors : 'Please authenticate using valid token'});
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch(err) {
            res.status(401).send({errors: "please authenticate using a valid token"});
        }
    }
}

//creating endpoint for adding products in cartData
app.post('/addtocart', fetchUser, async(req, res) => {
    console.log('added', req.body.itemId);
    let userData = await Users.findOne({ _id : req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id : req.user.id }, { cartData : userData.cartData });
    res.send('Added');
})

//creating endpoint form removing from datacart
app.post('/removefromcart', fetchUser, async(req, res) => {
    console.log('removed', req.body.itemId);
    let userData = await Users.findOne({ _id : req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id : req.user.id }, { cartData : userData.cartData });
        res.send('removed');
    }
})

//creating endpoint to get cartdata
app.post('/getcart', fetchUser, async(req, res) => {
    console.log('getCart');
    let userData = await Users.findOne({ _id : req.user.id });
    res.json(userData.cartData); 
})

app.listen(port, (err) => {
    if (!err) {
        console.log('app is running on the port ' + port);
    } else {
        console.log('Error: ' + err);
    }
});
