import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log('✅ Mongoose connected to DB');

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose error:', err);
        });

    } catch (err) {
        console.error('❌ Initial Mongoose connection error:', err);
    }
};

export default connectToMongo;
