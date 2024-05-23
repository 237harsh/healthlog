var jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = async(req, res, next) => {
    // const token = req.cookies.token;
    // console.log(token)
    const token = req.header('auth-token');
    console.log(token)
    if (!token) {
        return res.status(401).json({ error: "Please login",response:false })
    }
    try {const data =  jwt.verify(token, JWT_SECRET);
        
        // if (data.id && !data.room){
        //     const usera = await User.findById(data.id)
        //     console.log(usera.room)
        //     res.json({ error: "Please book room ",userkaname:usera.name,response:false })
        // }
        if(!data.id){
            res.json({ error: "invalid Session",response:false})
        }
        else{
            const user = await User.findById(data.id)
            if(!user){
                res.json({ error: "User error ",response:false })
            }else{
                let id=data.id
                req.user = id;
                next();
            }
           
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: "invalid Session",response:false })
    }

}
module.exports = fetchuser;