const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const fileHelper = require("../util/file");
const Product = require("../models/product");
const cloudinary = require("../util/cloudinary");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = async (req, res, next) => {
  const { title, price, description } = req.body;
  const errors = validationResult(req);
  const image = req.file;
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: req.body,
      errorMessage: "Only accepts jpg, png and jpeg file formats",
      validationErrors: [],
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: req.body,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  try {
    const imageLocal = "/" + req.file.path.replace("\\", "/");
    const product = new Product({
      title,
      imageLocal,
      price,
      description,
      userId: req.user,
    });
    await product.save();
    res.redirect("/admin/products");

    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;
    const imageId = result.public_id;
    product.imageUrl = imageUrl;
    product.imageId = imageId;
    product.save();
  } catch (err) {
    const error = new Error("The product, e no validate");
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
        hasError: false,
        errorMessage: false,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, description, price } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let { productId, ...bodyDestructured } = req.body;
    bodyDestructured._id = productId;
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: bodyDestructured,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const product = await Product.findById(productId);
    product.title = title;
    product.price = price;
    product.description = description;

    if (image) {
      product.imageLocal = "/" + image.path.replace("\\", "/");
      fileHelper.deleteFile(product.imageId);
    }
    await product.save();
    console.log(111);
    res.redirect("/admin/products");

    if (image) {
      const result = await cloudinary.uploader.upload(req.file.path);
      const imageUrl = result.secure_url;
      const imageId = result.public_id;
      product.imageUrl = imageUrl;
      product.imageId = imageId;
      console.log("UPDATE COMPLETE!");
      product.save();
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteProduct = (req, res) => {
  const prodId = req.params.productId;
  req.user.removeFromCart(prodId);
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageId);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((result) => {
      console.log("Product DELETED");
      res.status(200).json({ message: "Success" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Product could not be deleted" });
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((prods) => {
      const products = prods.map((product) => {
        const fileExists = fs.existsSync(product.imageLocal.substring(1));
        console.log(fileExists);
        const image = fileExists ? product.imageLocal : product.imageUrl;
        return { ...product._doc, image };
      });
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
