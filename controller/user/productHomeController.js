const express = require('express');
const Product = require('../../model/productModel');

const fetchProductsForUser = async (req, res) => {
  try {
    const products = await Product.find({status:'Published'});
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "products not found"
      });
    }
    return res.status(200).json({
      success: true,
      message: "products fetched",
      products
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error fetching products"
    });
  }
};

module.exports = { fetchProductsForUser };