const mongoose = require('mongoose');

function DBConnection() {
    try {
        mongoose.connect(process.env.DB_URL,{  
            useNewUrlParser: true,
            useUnifiedTopology: true,  
        });
        console.log('Connected to the Database...');
        return mongoose.connections;
    } catch (error) {
        console.log('Error', error);
    }
}

module.exports = { DBConnection };