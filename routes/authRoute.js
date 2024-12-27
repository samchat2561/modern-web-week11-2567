import express from 'express'
import { getDataUser, loginUser, profileUser, registerUser } from '../controllers/authController.js'
import { authenticateToken } from '../middlewares/verifyToken.js'

const router = express.Router()

//1.Register new user: http://localhost:3000/api/auth/register
router.post('/register', registerUser)

//2.Login user: http://localhost:3000/api/auth/login
router.post('/login', loginUser)

//3.POST Profile uyser: http://localhost:3000/api/user/profile
router.post('/profile', profileUser)

//4.GET Profile user: http://localhost:3000/api/user/id
router.get('/:id', authenticateToken, getDataUser)

export default router