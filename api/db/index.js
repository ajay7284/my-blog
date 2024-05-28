import mongoose from "mongoose";


const connectDB = async () => {
    mongoose.connect(`${process.env.MONGODB_URI}`);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB connected...');
    });
}

export default connectDB;