import { catchAsyncErrors } from "../middlerwares/cathAsyncErrors.js";
import ErrorHandler from "../middlerwares/errorMiddleware.js";
import Post from "../models/Post.model.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"

const createpost = catchAsyncErrors(async (req,res,next) =>{
  
    if(!req.user.isAdmin){
    return next(new ErrorHandler("you are not allowed to create post",403))
  }
  if (!req.body.title || !req.body.content) {
    return next(new ErrorHandler('Please provide all required fields',400));
  }

  const slug = req.body.title
  .split(' ')
  .join('-')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9-]/g, '');
const newPost = new Post({
  ...req.body,
  slug,
  userId: req.user.id,
});

try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
} catch (error) {
    next(error);
}
})

const getAllPost = catchAsyncErrors(async(req,res,next) =>{

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;
  
  const posts = await Post.find({
     ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
         $or :[
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
         ]
      }),
  })
  .sort({ updatedAt: sortDirection })
  .skip(startIndex)
  .limit(limit);


  const totalPosts = await Post.countDocuments();

  const now =new Date();

  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  })
  res.status(200).json({
    posts,
    totalPosts,
    lastMonthPosts,
  });

  } catch (err) {
    next(err)
  }
})

const deletepost = catchAsyncErrors(async (req,res,next)=>{
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(new ErrorHandler('You are not allowed to delete this post',403));
  }
    try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
   } catch (err) {
    next(err);
   }

})

const updatepost = catchAsyncErrors(async (req,res,next) =>{
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(new ErrorHandler('You are not allowed to delete this post',403));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    next(err);
  }
})

export{
    createpost,
    getAllPost,
    deletepost,
    updatepost

}