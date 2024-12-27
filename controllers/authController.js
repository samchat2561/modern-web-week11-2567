import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Generate JWT Token
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_KEY })
}

//1.Register new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name, !email, !password) {
            return res.status(400).json({ status: false, message: "All files are require" })
        }
        //Create new user
        const userExist = await User.findOne({ email })
        if (userExist) {
            return res.status(400).json({ status: false, message: "Email alredy registered" })
        }

        //Create hashPassword users
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = await User.create({ name, email, password: hashPassword })
        const data = {
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        }
        console.log("API Mern", req.body)
        return res.status(201).json({
            status: true,
            message: "Registered successfully!",
            data: data
        })
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message })
    }
}

//2.Login user: http://localhost:3000/api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email, !password) {
            return res.status(400).json({ status: false, message: "All files are require" })
        }

        const user = await User.findOne({ email })
        if (!user && !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: false, message: "Invalid Credential" })
        }

        //Generate JWT Token
        const payload = { id: user._id, email: user.email }
        const token = generateToken(payload)
        console.log("token:", token)
        return res.status(200).json({ status: true, message: "Login successfully!", token, id: payload.id })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message })
    }
}

//3.POST Profile user :http://localhost:3000/api/user/profile
export const profileUser = async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.satus(403).json({ status: false, message: "Invalid Token" })
                }
                const user = await User.findById(decoded?.id)
                const userData = { _id: user?.id, name: user?.name, email: user?.email }
                return res.status(200).json({ status: true, message: "Profile Data", data: userData })

            })
        } else {
            return res.status(401).json({ status: false, message: "You are not authenticated" })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message })
    }
}

//4.GET Profile user:http://localhost:3000/api/user/profile
export const getDataUser = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)
        const data = { _id: user.id, name: user.name, email: user.email }
        return res.status(200).json({ status: true, message: "Profile Data",success:user, data: data })
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message })
    }
}
