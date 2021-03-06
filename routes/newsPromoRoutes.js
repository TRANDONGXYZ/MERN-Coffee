var express = require('express');
const { rmdirSync } = require('fs-extra');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isEmployee = auth.isEmployee;
var isAdmin = auth.isAdmin;
var isUser = auth.isUser;
var hasLogin = auth.hasLogin;

// const News = require('../models/newsModel');
const promotionController = require('../component/promotion/promotionController')

/*
 * GET all products
 */


router.get('/', promotionController.getAllPromotionsCustomer);

router.post('/apply/', async (req, res) => {
    const user = await User.findById(req.user);
    const promotion = await Promotion.findOne({
        code: req.body.code
    });
    const ship = 20000;
    products = [];
    let total = 0;
    let subtotal = 0;

    for (let i = 0; i < user.cart.length; i++) {
        let product = await Product.findById(user.cart[i]._id);
        product['quantity'] = user.cart[i].quantity;
        products.push(product);
        subtotal += product.price;
    }

    total = Math.max(subtotal - promotion.value + ship, 0);

    res.render('checkout', {
        title: 'Checkout',
        cart: products,
        user: user,
        code: req.body.code,
        promoValue: promotion.value,
        ship: ship,
        subtotal: subtotal,
        total: total,
    });
});


// Exports
module.exports = router;