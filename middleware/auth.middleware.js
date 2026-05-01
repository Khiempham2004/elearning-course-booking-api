import jwt from 'jsonwebtoken'

const verifytoken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json('Khong co token');
    }

    const tokenAuth = token.split(" ")[1];
    try {
        const verified = jwt.verify(tokenAuth, "your-secret-key");
        console.log(verified);

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json("Token khong hop le")
    }
}

export default verifytoken;