const mongoose = require('mongoose')

const healthRecordSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    
    symptoms: [{
        name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: false
        },
        description: {
            type: String,
            required: false
        }
        // Add more properties as needed
    }],
    notes: {
        type: String,
        required: false
    }
});

// Create the model from the schema
// const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);
module.exports = mongoose.models.HealthRecord || mongoose.model('HealthRecord', healthRecordSchema);
