import jwt from 'jsonwebtoken'

export  function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(404).json({success: false, message: "Token not found!"})

    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err) return res.status(500).json({success: false, messgae: "Invalid Token"})

        req.user = user
        next()
    })
}