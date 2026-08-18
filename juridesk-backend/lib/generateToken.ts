import jwt from "jsonwebtoken";

interface TokenPayload {
    userId: string;
    email: string;
}

const generateToken = ({ userId, email }: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        {
            userId,
            email,
        },
        secret,
        {
            expiresIn: "7d",
        }
    );
};

export default generateToken;
