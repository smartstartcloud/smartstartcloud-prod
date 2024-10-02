import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileData: { type: Buffer, required: true }  // To store binary data
});

const File = mongoose.model("File", fileSchema);

export default File;
