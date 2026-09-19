import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

        // If placeholder is not replaced, try local MongoDB or inform developer
        if (!uri || uri.includes('<db_password>')) {
            console.warn('⚠️ MONGODB_URI contains <db_password> placeholder. Attempting local MongoDB connection (mongodb://127.0.0.1:27017/hms)...');
            uri = 'mongodb://127.0.0.1:27017/hms';
        }

        mongoose.set('bufferTimeoutMS', 3000);

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`⚠️ MongoDB Connection notice: ${error.message}`);
        console.warn('💡 Tip: Update your backend/.env with your real MongoDB Atlas password to enable cloud persistence.');
        return null;
    }
};
