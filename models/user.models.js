import mongo from 'mongoose';
import {authDB} from '../db/connectMongoDB.js';
import { getNextSequence } from './counter.models.js';

const userSchema = new mongo.Schema({
  userID: { type: String, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    // required: true
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  role: {
    type: String,
    required: true,
    enum: ["superAdmin", "admin", "hr", "finance", "agent", "edu", "pen"],
  },
  passRenew: {
    type: Boolean,
  },
  metadata: {
    type: Object,
    default: {},
  }, // Extra data (optional)
});

// Pre-save hook to generate the userID before saving the document
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const currentYear = new Date().getFullYear();
    // Construct a unique counter key based on role and year
    const counterKey = `user-${this.role.toLowerCase()}-${currentYear}`;
    const seq = await getNextSequence(counterKey);
    // Format the userID as ROLE-YYYY-NNNN, e.g., ADMIN-2025-0001
    this.userID = `${this.role.toUpperCase()}-${currentYear}-${seq.toString().padStart(4, '0')}`;
  }
  next();
});

const User = authDB.model("users", userSchema);

export default User;