import { catchAsyncErrors } from "../middlerwares/cathAsyncErrors.js";
import ErrorHandler from "../middlerwares/errorMiddleware.js";
import User from "../models/User.model.js";
import bcryptjs from 'bcryptjs';

const updateUser = catchAsyncErrors(async (req,res,next) => {

    if(req.user.id !== req.params.userId ){
    return next(new ErrorHandler("you are not allowed to update this user",403))
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(new ErrorHandler('Password must be at least 6 characters',400));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // if (req.body.username) {
  //   if (req.body.username.length < 7 || req.body.username.length > 20) {
  //     return next(
  //       new ErrorHandler('Username must be between 7 and 20 characters',400)
  //     );
  //   }
  //   }

  //   if (req.body.username.includes(' ')) {
  //     return next(new ErrorHandler('Username cannot contain spaces',400));
  //   }

  //   if (req.body.username !== req.body.username.toLowerCase()) {
  //     return next(new ErrorHandler('Username must be lowercase',400));
  //   }

  //   if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
  //     return next(
  //      new  ErrorHandler( 'Username can only contain letters and numbers',400)
  //     );
  //   }

  //console.log(req.body.profilePicture ,req.body.password)


    try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.userId,
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              profilePicture: req.body.profilePicture,
              password:req.body.password,
            },
          },
          { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
      } catch (error) {
        next(error)
      }

})

const deleteUser = catchAsyncErrors(async (req,res,next) =>{
 
  if(!req.user.isAdmin && req.user.id !== req.params.userId ){
    return next(new ErrorHandler("you are not allowed to update this user",403))
  }
 
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
})

const signout = catchAsyncErrors(async (req,res,next)=>{
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
})

const getUsers = catchAsyncErrors(async(req,res,next) =>{
  if(!req.user.isAdmin ){
    return next(new ErrorHandler("you are not allowed to see all users",403))
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error)
  }
})

const getUser = catchAsyncErrors(async(req,res,next) =>{
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new ErrorHandler('User not found',404));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
})

export {
    updateUser,
    deleteUser,
    signout,
    getUsers,
    getUser

}