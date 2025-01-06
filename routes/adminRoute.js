const express=require('express')
const adminRoute=express.Router()
const {adminLogin}=require('../controller/admin/adminController')
const {addProduct,fetchproducts, editProduct, toggleProductListing}=require('../controller/admin/productController')
const {addCategory,fetchCategory, editCategory}=require('../controller/admin/categoryController')

adminRoute.post('/login',adminLogin)
adminRoute.post('/addproduct',addProduct)
adminRoute.put('/editproduct/:id',editProduct)
adminRoute.post('/addcategory',addCategory)
adminRoute.get('/product',fetchproducts)
adminRoute.get('/category',fetchCategory)
adminRoute.patch('/toggle-listing/:id',toggleProductListing)
adminRoute.patch('/editCategory/:categoryId',editCategory)

module.exports = adminRoute;


