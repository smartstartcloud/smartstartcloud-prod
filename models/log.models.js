import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Object }, // Optional: Store detailed changes
  },
  { collection: 'logs' } // Use a separate collection for logs
);

const Log = mongoose.model('Log', logSchema);
export default Log;
