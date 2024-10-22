const express = require('express');
const router = express.Router();
const Invoice = require('../model/invoice.model');
const Product = require('../model/product.model');
const verifyToken = require('../middleware/auth');

/********************************************** 
*@AddInvoice
*@route http://localhost:5000/api/invoices
*@Description API for Create a invoices
*@return Success Message
**********************************************/
router.post('/', verifyToken, async (req, res) => {
  const { customerName, date, items } = req.body;
  try {
    let totalAmount = 0;
    const invoiceItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        const price = product.price;
        totalAmount += item.quantity * price;
        return {
          product: item.product,
          quantity: item.quantity,
        };
      })
    );
    const newInvoice = new Invoice({
      customerName,
      date,
      items: invoiceItems,
      totalAmount,
    });
    const invoice = await newInvoice.save();
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/********************************************** 
*@getInvoice
*@route http://localhost:5000/api/invoices
*@Description API for get All Invoices
*@return Invoice Object
**********************************************/
router.get('/', verifyToken, async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('items.product');
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/********************************************** 
*@search
*@route http://localhost:5000/api/invoices/search
*@Description API for Search Invoice By Name
*@return Invoice object
**********************************************/
router.get('/search', async (req, res) => {
  const term = req.query.term || '';
  try {
    const invoices = await Invoice.find({
      customerName: { $regex: term, $options: 'i' }
    }).populate('items.product');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/********************************************** 
*@DeleteInvoices
*@route http://localhost:5000/api/invoices/:id
*@Description API for Delete a Specific Invoices
*@return Success Message for Delete
**********************************************/
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ msg: 'Invoice not found' });
    res.json({ msg: 'Invoice deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*************************************************
 * @getInvoiceById
 * @route http://localhost:5000/api/invoices/:id
 * @description API to get a single invoice by ID
 * @param {string} id - Invoice ID
 * @return Invoice Object
 ************************************************/
router.get('/edit/:id', verifyToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('items.product');
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*********************************8*******************
 * @updateInvoiceById
 * @route http://localhost:5000/api/invoices/:id
 * @description API to update an invoice by ID
 * @param {string} id - Invoice ID
 * @body {Object} invoiceData - Invoice data to update
 * @return Updated Invoice Object
 ****************************************************/
router.put('/:id', verifyToken, async (req, res) => {
  const { customerName, date, items } = req.body;
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }
    invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: { customerName, date, items } },
      { new: true }
    ).populate('items.product');

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
