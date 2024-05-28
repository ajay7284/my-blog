import { catchAsyncErrors } from "../middlerwares/cathAsyncErrors.js";
import ErrorHandler from "../middlerwares/errorMiddleware.js";
import User from "../models/User.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"

const signup = catchAsyncErrors(async (req,res,next) =>{
 
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username === '' ||
      email === '' ||
      password === ''
    ) {
        return next(new ErrorHandler("All Fields are required!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return next(new ErrorHandler("User already Registered!", 400));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
    

    try {
        await newUser.save();
        res.json('Signup successful');
      } catch (error) {
        next(error);
      }
    


})


const signin = catchAsyncErrors(async (req,res,next) =>{
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
   return next(new ErrorHandler("All fields are required",400));
  }

    try {
      const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(new ErrorHandler('User not found',404));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw new ErrorHandler("Invalid Email Or Password!", 400);
    }
    
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES
    }
    );

    const { password: pass, ...rest } = validUser._doc;
    
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json(rest);
    } catch (error) {
      next(error);

    }
    
    
})

const google = catchAsyncErrors(async (req,res,next) =>{
     
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } else{
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);



    }
} catch(error){
  next(error)
} 

})

export {
    signin,
    signup,
    google
}

