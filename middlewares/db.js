const mongoose = require('mongoose');

// Replace the URI string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1); // Exit the process with failure
    }

    // Handling connection errors after initial connection
    mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
    });

    // Handling disconnection events
    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB connection lost. Trying to reconnect...');
        // Optionally, you can try to reconnect here
    });
};


module.exports=connectDB