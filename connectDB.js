import mongoose from "mongoose";
// connecting with the database
export const connectDB = async (url) => {
    await mongoose.connect(url).then((result) => {
         console.log('Database Connected');
    }).catch((err) => {
        console.log('There is an error caused', err)
        process.exit(1);
    });
}

