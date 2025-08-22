const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/shopping_cart');

// Category Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
});

const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

// Session configuration
app.use(session({
    secret: 'shopping-cart-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// Middleware
const requireAdminAuth = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Initialize cart
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// User Routes
app.get('/', async (req, res) => {
    const categories = await Category.find({ parentId: null }).populate('parentId');
    const products = await Product.find().populate('categoryId');
    res.render('user/home', { categories, products, cart: req.session.cart });
});

app.post('/add-to-cart/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    const cartItem = req.session.cart.find(item => item.id === req.params.id);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        req.session.cart.push({
            id: product._id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    res.redirect('/');
});

app.get('/cart', (req, res) => {
    const total = req.session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render('user/cart', { cart: req.session.cart, total });
});

app.post('/remove-from-cart/:id', (req, res) => {
    req.session.cart = req.session.cart.filter(item => item.id !== req.params.id);
    res.redirect('/cart');
});

// Admin Routes
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.admin = { username };
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Invalid credentials' });
    }
});

app.get('/admin/dashboard', requireAdminAuth, async (req, res) => {
    const categories = await Category.find().populate('parentId');
    const products = await Product.find().populate('categoryId');
    res.render('admin/dashboard', { categories, products });
});

app.get('/admin/add-category', requireAdminAuth, async (req, res) => {
    const parentCategories = await Category.find({ parentId: null });
    res.render('admin/add-category', { parentCategories, error: null });
});

app.post('/admin/add-category', requireAdminAuth, async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const category = new Category({
            name,
            parentId: parentId || null
        });
        await category.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        const parentCategories = await Category.find({ parentId: null });
        res.render('admin/add-category', { parentCategories, error: error.message });
    }
});

app.get('/admin/add-product', requireAdminAuth, async (req, res) => {
    const categories = await Category.find();
    res.render('admin/add-product', { categories, error: null });
});

app.post('/admin/add-product', requireAdminAuth, async (req, res) => {
    try {
        const { name, price, categoryId, stock } = req.body;
        const product = new Product({
            name,
            price: Number(price),
            categoryId,
            stock: Number(stock)
        });
        await product.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        const categories = await Category.find();
        res.render('admin/add-product', { categories, error: error.message });
    }
});

app.post('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/admin/login');
    });
});

app.listen(3006, () => {
    console.log('Shopping Cart System running on http://localhost:3006');
});