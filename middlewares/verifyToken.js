import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1]
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
                if (err) {
                    return res.satus(403).json({ status: false, message: "Invalid Token" })
                }

                req.user = decoded
                console.log(req.user)
                next()
            })
        } else {
            return res.status(401).json({ status: false, message: "You are not authenticated" })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message })
    }
}