import { catchAsyncErrors } from "../middlerwares/cathAsyncErrors.js";
import Comment from "../models/Comment.model.js";
import ErrorHandler from "../middlerwares/errorMiddleware.js";



const createComment = catchAsyncErrors(async (req,res,next) =>{
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.id) {
          return next(
            new ErrorHandler('You are not allowed to create this comment',403)
          );
        }
    
        const newComment = new Comment({
          content,
          postId,
          userId,
        });
        await newComment.save();
    
        res.status(200).json(newComment);
      } catch (error) {
        next(error);
      }
});

const getPostComments = catchAsyncErrors(async(req,res,next) =>{
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
          createdAt: -1,
        });
        res.status(200).json(comments);
      } catch (error) {
        next(error);
      }
}) 

const likeComment = catchAsyncErrors(async(req,res,next) =>{
try {
  const comment = await Comment.findById(req.params.commentId)
  
  if(!comment){
    return next(new ErrorHandler("commnet not found",404))
  }

  const userIndex = comment.likes.indexOf(req.user.id);

  if(userIndex === -1){
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.id);
  }else{
    comment.numberOfLikes -=1; 
    comment.likes.splice(userIndex,1)
  }
 
  await comment.save();
  res.status(200).json(comment)
  

} catch (error) {
  next(error)
}
})

const editComment = catchAsyncErrors(async (req,res,next) =>{
 
  try {
    const comment =  await Comment.findById(req.params.commentId)
    if(!comment){
      return next(new ErrorHandler("Commwnt not found",404))
    }
    if(Comment.userId !== req.user.id && !req.user.isAdmin){
      return next(new ErrorHandler("You are not allowed to edit this comment"))
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,{
        content:req.body.content,
      },
      {new:true}
    )

    res.status(200).json(editedComment)
  } catch (error) {
    next(error)
  }

})

const deleteComment = catchAsyncErrors(async(req,res,next) =>{
try {
  const comment =  await Comment.findById(req.params.commentId)
  if(!comment){
    return next(new ErrorHandler("Comment not found",404))
  }
  if(Comment.userId !== req.user.id && !req.user.isAdmin){
    return next(new ErrorHandler("You are not allowed to delete this comment"))
  }
  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json('Comment has been deleted');
} catch (error) {
  next(error)
}
})

const getcomments = catchAsyncErrors(async(req,res,next) =>{
  if (!req.user.isAdmin){
    return next(new ErrorHandler('You are not allowed to get all comments'),403);
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }


})

export {
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment,
    getcomments
}