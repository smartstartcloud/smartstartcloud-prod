import mongoose from "mongoose";
import { infoDB } from "../db/connectMongoDB.js";

const fileSchema = new mongoose.Schema({
  fileName: { 
    type: String, 
    required: true },

  fileType: { 
    type: String, 
    required: true },
    
  fileData: { 
    type: Buffer, 
    required: true },  // To store binary data
    
  orderID:{
    type: String,
    // unique:true,
    required: true
},
});

const File = infoDB.model("File", fileSchema);

export default File;
