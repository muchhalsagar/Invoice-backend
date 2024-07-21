const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { DBConnection } = require('./config/dbConnection');
require('dotenv').config();

DBConnection();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/products', require('./routes/product.routes'));
app.use('/api/invoices', require('./routes/invoice.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

console.log('Server Created');

app.get('/', async (req,res) => {
    res.send('Hello World....');
}).listen(process.env.PORT, () => {
    console.log('App Running on port 5000..')
});