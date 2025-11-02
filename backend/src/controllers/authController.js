import jwt from 'jsonwebtoken'
import 'dotenv/config.js'
import User from '../models/User.js'

export const signup = async(req, res)=>{
    try {
        const {email, password, name} = req.body
        if(!email || !password || !name){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const isUser = await User.findOne({email});
        if(isUser){
            return res.status(409).json({
                success: false,
                message: "User already exists!"
            })
        }
        const user = new User({
            email, password, name
        })
        await user.save();
        const accessToken = jwt.sign({_id: user._id, email: user.email, name: user.name}, process.env.SECRET_KEY, {
            expiresIn: '3600m'
        })
        res.status(201).json({
            success: true,
            user,
            accessToken,
            message: "Successfully registered!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const login = async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(300).json({
            success: false,
            message: "All fields are required!"
        })
    }
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
        if(password != user.password){
            return res.status(300).json({
                success: false,
                message: "Invalid credentials!"
            })
        }
        const accessToken = jwt.sign(
            {_id: user._id, email: user.email},
            process.env.SECRET_KEY,
            { expiresIn: "3600m"}
        )
        res.status(200).json({
            success: true,
            user,
            accessToken,
            message: "Successfully LoggedIn!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}