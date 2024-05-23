const express = require('express')
const User = require('../models/user')
const Patient = require('../models/patient')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const {body,validationResult} = require('express-validator') //this is for the validation
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router()
// const fetchuser = require('../middleware/fetchuser')

//Route : 1 create a user using : post  '/api/auth/createuser' does not require auth
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 6 characters').isLength({ min: 5 })
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({  message: errors?.array()[0]?.msg,response:false }); 
    }
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password,salt);
    try{
    let user=await User.findOne({email:req.body.email});  
    if (user){
        res.status(400).json({message:'Sorry, User already registered.',response:false})
    }
    else{

    const user = await User.create({
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email,
          })
    const data ={
            id:user.id
    }
    const jwtData = jwt.sign(data, JWT_SECRET)
    res.json({message:`Account created Successfully`,response:true})}}
    catch(error){
        console.log(error.message)
        res.status(500).json({message:"Some error occured",response:false})
    }
})
router.post('/newpatient',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),

],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({  message: errors?.array()[0]?.msg,response:false }); 
    }

    try{
    let user=await Patient.findOne({name:req.body.name});  
    if (user){
        res.status(400).json({message:'Sorry, User already registered.',response:false})
    }
    else{

    const user = await Patient.create({
            name: req.body.name,
          })

    res.json({message:`Account created Successfully`,response:true})}}
    catch(error){
        console.log(error.message)
        res.status(500).json({message:"Some error occured",response:false})
    }
})

//Router : 2 end point for the login 
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blank').exists()
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg,response:false }); //agar empty nahi hain means error hain
    }
    else{
    const {email,password}=req.body;
    try{
        let user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password. Please try again.",response:false})
        }
        else{
            const passwordcompare = await bcrypt.compare(password,user.password)
            if (!passwordcompare){
                return res.status(400).json({message:"Invalid email or password. Please try again.",response:false})
            }
            else{
                const data ={id:user.id,}
                const jwtData = jwt.sign(data, JWT_SECRET)
                const cookieOptions = {
                    httpOnly: true, // prevents client-side JavaScript from accessing the cookie
                    secure: process.env.NODE_ENV === 'production', // ensures the cookie is sent only over HTTPS
                    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
                    sameSite: 'none'
                };
                
                // Set the cookie
                res.cookie('token', jwtData, cookieOptions);
            
            
            res.json({jwtData,succes:`${user.name} This is your jwt token for the today `,message:"Success,Redirecting...",response:true})
                
            }
        }
    }
    catch(error){
        console.log(error)
        console.log(error.message)
        res.status(500).send('Internal server error ')
    }
}
})
//Router : 3 end point for the get user details
// router.get('/getuser', fetchuser,  async (req, res) => {

//     try {
//       let userId = req.user;
//       const user = await User.findById(userId).select("-password")
//       let room_no =await Room.findOne({user:user._id});
      
//       res.json({user,room_no:room_no.room_no,response:true})
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).json({error:"Internal Server Error",response:false});
//     }
//   })


module.exports=router