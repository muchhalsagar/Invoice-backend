const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Product = require('../model/product.model');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

/********************************************** 
*@AddProducts
*@route http://localhost:5000/api/products/upload
*@Description API for Add new Products by CSV file
*@return Success Message
**********************************************/
router.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const products = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      products.push({
        name: row.name,
        category: row.category,
        price: parseFloat(row.price)  // Ensure price is a number
      });
    })
    .on('end', async () => {
      try {
        const result = await Product.insertMany(products);
        fs.unlinkSync(filePath); // Delete the file after processing
        res.json(result);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });
});

/********************************************** 
*@GetAllProducts
*@route http://localhost:5000/api/products/
*@Description API for Get All Products
*@return Products objects
**********************************************/
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
