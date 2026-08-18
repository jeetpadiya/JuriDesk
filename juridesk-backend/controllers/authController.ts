import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/UserSchema.js';
import generateToken from "../lib/generateToken.js";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const registerUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, email, password } = req.body;

        // 1. Validate input presence
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 3. Hash the password correctly
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Create user with hashed password
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 5. Send success response (excluding password from output)
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill out the required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "the User Does not exist" })
        }

        const isPasswordValidator = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValidator) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = generateToken({
            userId: existingUser._id.toString(),
            email: existingUser.email
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });

        return res.status(200).json({ success: true, message: "User logged successfully", user: { id: existingUser._id, email: existingUser.email,token } })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internel Server Error" });
    }

}

const UserProfile = async(req:AuthenticatedRequest,res:Response)=>{
    try {
        const userId = req.userId; 

        if(!userId){
            return res.status(401).json({success:false,message:"UnAuthorized"})
        }
        console.log("User ID:", req.userId);
        const user = await User.findOne({_id:userId}).select("-password");
        console.log("Found user:", user);


        if(!user){
            return res.status(404).json({success:false,message:"User Does not exist"});
        }

        return res.status(200).json({
            success:true,
            user
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({success:false,message:"Internel server Error"})
    }
}


export { registerUser, loginUser,UserProfile }