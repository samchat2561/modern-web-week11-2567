import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import connectMongoDB from './config/db.js'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/authRoute.js'

const app = express()

const PORT = process.env.PORT || 8000

connectMongoDB()
app.use(cors({ origin: true, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    return res.status(200).json({ status: true, message: 'Server is running' })
})

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.listen(PORT, () => {
    console.log(`SERVER is running on http://localhost:${PORT}`)
})