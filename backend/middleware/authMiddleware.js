import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

//Protect routes 
const protect = asyncHandler(async(req,res,next)=>{
    let token;

    //Read jwt from cookie
    token =req.cookies.jwt;
    
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

//Admin function 
const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

//Instractor function 
const instructor = (req,res,next) => {
    if(req.user && req.user.role === 'instructor') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as instractor');
    }

};

const allowedToUpload = (req,res,next) => {
    if(req.user && (req.user.isAdmin || req.user.role === 'instructor')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized to Upload');
    }
};

export { protect, admin, instructor, allowedToUpload };