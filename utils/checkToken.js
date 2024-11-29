const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const checkToken = (req,res,next) =>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({error: 'Unauthorized'})
    }
    try{
        console.log(token)
        const decodedToken = jwt.verify(token,SECRET_KEY)
        next()
    }catch(error){
        return res.status(401).json({error: error.message})
    }
}
const checkAdmin = (req,res,next) => {
    const token = req.cookies.token
    console.log(token)
    if(!token){
        return res.status(401).json({error: 'Unauthorized'}) 
    }
    try{
        const decodedToken = jwt.verify(token,SECRET_KEY)
        const role = decodedToken.role
        if(role === "admin"){
            next()
        }else{
            return res.status(401).json({error: "Need admin role"})
        } 
    }catch(error){
        return res.status(500).json({error: error.message})
    }
}
module.exports = {
    checkAdmin,
    checkToken
}