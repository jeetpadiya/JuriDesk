import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest } from '../controllers/authController.js'

interface JwtPayload {
    userId: string;
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.headers.cookie) {
            const cookies = Object.fromEntries(
                req.headers.cookie.split('; ').map((c) => {
                    const [key, ...v] = c.split('=');
                    return [key, v.join('=')];
                })
            );
            token = cookies.token;
        }

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        console.log("Decoded JWT:", decoded);

        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}