import mongoose from 'mongoose';

interface IUser {

    username:string;
    email:string;
    password:string;

}

const userSchema = new mongoose.Schema<IUser> ({

    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;