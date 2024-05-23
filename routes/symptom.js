const express = require('express')
const fetchuser=require("../middlewares/fetchuser")
const router = express.Router()
const {body,validationResult} = require('express-validator') //this is for the validation

const User = require('../models/user')
const Patient = require('../models/patient')
const HealthRecord = require('../models/symptoms')
router.post('/newsm',fetchuser,[

    body('symptoms', 'Symptoms required') .isArray()
    .withMessage('arrayKey must be an array')
    .custom((arr) => arr.length > 0)
    .withMessage('arrayKey cannot be empty')
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg,response:false }); 
    }
    else{
    const {user,symptoms,date,notes}=req.body;
    try{
        let userId=req.user;
        const user = await User.findById(userId)
        if(!user){
          return res.status(401).json({message:'No user found',response:false})
        }
        let entry = await HealthRecord.findOne({  userId: userId });

        if (entry) {
          // If the entry exists, update it
          entry.symptoms.push(...symptoms.map(symptom => ({
            name: symptom,
            description: notes // Use notes as description for each new symptom
        })));
          entry.date = date;
          entry.notes = notes;
          await entry.save(); // Save the updated entry
          console.log('Health record updated:', entry);
        } else {
          // If the entry does not exist, create a new one
          entry = await HealthRecord.create({
            userId: userId,
            symptoms: symptoms.map(symptom => ({
              name: symptom,
              description: notes // Use notes as description for each new symptom
          })),
            date: date,
            notes: notes
          });
        }
       
        
        return res.status(200).json({message:'Added Success',response:true})

    }
    catch(error){
        console.log(error)
        console.log(error.message)
        res.status(500).send({message:'Internal server error ',response:false})
    }
}
})
router.post('/editsm',fetchuser,[

    body('symptom', 'Symptoms required').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg,response:false }); 
    }
    else{
    const {user,symptom,date,notes}=req.body;
    try{

        let userId=req.user;
        const user = await User.findById(userId)
        if(!user){
          return res.status(401).json({message:'No user found',response:false})
        }
        let entry = await HealthRecord.findOne({  userId: userId });

        if (entry) {
          // Find the index of the symptom to update
        const index = entry.symptoms.findIndex(sym => sym.name == symptom);

        if (index === -1) {
            return res.status(404).json({ message: `Symptom '${symptom}' not found in health record`, response: false });
        }

        // Update the description of the symptom
        entry.symptoms[index].description = notes;
        if(date)
        {console.log(date);entry.symptoms[index].date = date;}
        await entry.save(); 
        } else {
          return res.status(400).json({message:'no entry found',response:false})
        }
       
        
        return res.status(200).json({message:'Added Success',response:true})

    }
    catch(error){
        console.log(error)
        console.log(error.message)
        res.status(500).send({message:'Internal server error ',response:false})
    }
}
})
router.post('/deletesm',fetchuser,[

    body('symptom', 'Symptoms required').exists()
   
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg,response:false }); 
    }
    else{
    const {user,symptom,date,notes}=req.body;
    console.log(symptom)
    try{
        let userId=req.user;
        
        const user = await User.findById(userId)
        if(!user){
          return res.status(401).json({message:'No user found',response:false})
        }
        let entry = await HealthRecord.findOne({  userId: userId });

        if (entry) {
          const updatedEntry = await HealthRecord.findOneAndUpdate(
            { userId: userId },
            { $pull: { symptoms: { name: symptom } } },
            { new: true }
        );

        if (updatedEntry) {
            console.log(`Symptom '${symptom}' removed successfully`);
            console.log('Updated health record:', updatedEntry);
            return res.status(200).json({ message: `Symptom '${symptom}' removed successfully`, entry: updatedEntry });
        } else {
            console.log('Health record not found for userId:', userId);
            return res.status(404).json({ message: 'Health record not found', response: false });
        }
        } else {
          return res.status(400).json({message:'no entry found',response:false})
        }
       
        
        return res.status(200).json({message:'okay',response:true})

    }
    catch(error){
        console.log(error)
        console.log(error.message)
        res.status(500).send('Internal server error ')
    }
}
})
router.get('/allsm',fetchuser,async (req,res)=>{
  
    const {user}=req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    console.log(limit)
    try{
        let userId=req.user;
        userId=userId.toString()
        console.log(userId)
        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json({message:'No user found',response:false})

        }
        const entry = await HealthRecord.findOne({ userId: userId });
        if (!entry) {
            return res.status(404).json({ message: 'Health record not found', response: false });
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedSymptoms = entry.symptoms.slice(startIndex, endIndex);
        const totalSymptoms = entry.symptoms.length;
        let totalPages = Math.ceil(totalSymptoms/limit);
       
        // entry?.symptoms=paginatedSymptoms
        

        
        return res.status(200).json({message:'okay',entries:entry,symptoms:paginatedSymptoms,totalPages: totalPages,
        currentPage: page,response:true})

    }
    catch(error){
        console.log(error)
        console.log(error.message)
        res.status(500).send('Internal server error ')
    }

})


module.exports=router