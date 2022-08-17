const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product',
isAuth,
[
    body("title", "Title must contain at least three characters")
    .isLength({min: 3})
    .trim(),

    // body("imageUrl", "Invalid image url")
    // .isURL(),

    body("price", "Price should be a number")
    .isFloat(),

    body("description", "The description should have at least five characters")
    .isLength({min: 5, max: 200})
    .trim()
],
adminController.postAddProduct
);

router.post('/edit-product', 
isAuth,
[
    body("title", "Title must contain at least three characters")
    .isLength({min: 3})
    .trim(),

    // body("imageUrl", "Invalid image url")
    // .isURL(),

    body("price", "Price should be a number")
    .isFloat(),

    body("description", "The description should have at least five characters")
    .isLength({min: 5})
    .trim()
],
adminController.postEditProduct
);

router.delete('/product/:productId',isAuth, adminController.deleteProduct)

module.exports = router;
