const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(cors()); // Permissive CORS
app.use(express.json());

// Ultra-Verbose Logger
app.use((req, res, next) => {
    console.log(`>>> [${new Date().toLocaleTimeString()}] RECEIVED: ${req.method} ${req.url}`);
    next();
});

// Add a root route for status verification
app.get('/', (req, res) => {
    res.send('<h1>NeoPulse Auth Server is Running!</h1><p>The API endpoints are active at /api/signup and /api/verify-otp</p>');
});

// --- DATABASE SETUP (With Fallback for Testing) ---
let isUsingMockDB = false;
let mockUsers = []; // Temporary in-memory storage if MongoDB is unavailable

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ SWITCHING TO MOCK DATABASE MODE (In-memory)');
        isUsingMockDB = true;
    });

// User Schema (Mongoose)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }
});
const User = mongoose.model('User', userSchema);

// --- NODEMAILER SETUP ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- HELPER: FIND USER ---
const findUserByEmail = async (email) => {
    if (isUsingMockDB) return mockUsers.find(u => u.email === email);
    return await User.findOne({ email });
};

// --- HELPER: SAVE USER ---
const saveUser = async (userData) => {
    if (isUsingMockDB) {
        const index = mockUsers.findIndex(u => u.email === userData.email);
        if (index > -1) mockUsers[index] = { ...mockUsers[index], ...userData };
        else mockUsers.push({ ...userData, _id: Date.now().toString() });
        return mockUsers.find(u => u.email === userData.email);
    }
    let user = await User.findOne({ email: userData.email });
    if (!user) user = new User(userData);
    else Object.assign(user, userData);
    return await user.save();
};

// --- SIGNUP API ---
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'User already exists and is verified. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await saveUser({
            email,
            password: hashedPassword,
            otp,
            otpExpires,
            isVerified: false
        });

        console.log(`\n-----------------------------------`);
        console.log(`📧 OTP for ${email}: ${otp}`);
        console.log(`-----------------------------------\n`);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'NeoPulse Verification Code',
            text: `Your OTP is: ${otp}. Valid for 5 minutes.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ EMAIL SENDING FAILED:', err.message);
                console.log('⚠️ Please use the OTP from console above if testing locally.');
            } else {
                console.log('✅ EMAIL SENT SUCCESSFULLY:', info.response);
            }
        });

        res.status(201).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup', error: error.message });
    }
});

// --- VERIFY OTP API ---
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please signup again.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (new Date(user.otpExpires) < new Date()) {
            return res.status(400).json({ message: 'Verification code has expired' });
        }

        const updatedData = {
            ...user.toObject ? user.toObject() : user, 
            isVerified: true, 
            otp: undefined, 
            otpExpires: undefined 
        };

        await saveUser(updatedData);

        res.status(200).json({ message: 'Account verified successfully! You can now login.' });
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ message: 'Server error during verification', error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

setInterval(() => {}, 1000 * 60 * 60);
