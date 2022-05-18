import mongoose from "mongoose";

export const createMongoId = () => new mongoose.Types.ObjectId().toHexString()
