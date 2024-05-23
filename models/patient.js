const mongoose = require('mongoose')
// import mongoose from 'mongoose';
const { Schema } = mongoose;
const PatientSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});
mongoose.pluralize(null);
module.exports = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);