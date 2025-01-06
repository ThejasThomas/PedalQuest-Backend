const Category = require('../../model/categoryModel');
const path = require('path');
const cloudinary = require('../../config/cloudinary');
const mongoose = require('mongoose');

// Fetch all categories
const fetchCategory = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching categories"
    });
  }
};

// Add Category Controller
const addCategory = async (req, res) => {
  try {
    const { name, image,description } = req.body;
    console.log(req.body);
    

    // Validate required fields
    if (!name || !image||!description) {
      return res.status(400).json({
        success: false,
        message: 'Name and image are required'
      });
    }

    // Upload base64 image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: 'categories'
    });

    // Create new category with Cloudinary image URL
    const newCategory = new Category({
      name,
      images: [cloudinaryResponse.secure_url],
      cloudinaryId: cloudinaryResponse.public_id,
      description
    });

    // Save category to database
    const savedCategory = await newCategory.save();

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: savedCategory
    });
console.log(req.body);

  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

// Delete Category Controller (optional but recommended)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (category.cloudinaryId) {
      await cloudinary.uploader.destroy(category.cloudinaryId);
    }

    // Delete category from database
    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

// Update Category Controller (optional but recommended)

const editCategory = async (req, res) => {
  try {
      console.log('Request body:', req.body);
      const { categoryId } = req.params;
      
      if (!categoryId) {
          return res.status(400).json({
              success: false,
              message: 'Category ID is required'
          });
      }

      const existingCategory = await Category.findById(categoryId);
      
      if (!existingCategory) {
          return res.status(404).json({
              success: false,
              message: 'Category not found'
          });
      }

      const { name, description, image } = req.body;

      // Create update object
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (image) {
          // If the image is different from the current first image
          if (!existingCategory.images || !existingCategory.images.includes(image)) {
              updateData.images = [image]; // Store as array
          }
      }

      console.log('Update data being sent to MongoDB:', updateData);

      // Perform the update
      const updatedCategory = await Category.findByIdAndUpdate(
          categoryId,
          updateData,
          { 
              new: true, 
              runValidators: true 
          }
      );

      console.log('Updated category:', updatedCategory);

      if (!updatedCategory) {
          return res.status(404).json({
              success: false,
              message: 'Category update failed'
          });
      }

      return res.status(200).json({
          success: true,
          message: 'Category updated successfully',
          category: updatedCategory
      });

  } catch (error) {
      console.error('Edit category error:', error);
      return res.status(500).json({
          success: false,
          message: 'Error updating category',
          error: error.message
      });
  }
};


module.exports = {
  addCategory,
  fetchCategory,
  deleteCategory,
  editCategory
};