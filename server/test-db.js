const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing connection to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log('✅ Connection successful!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Connection failed:');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
        console.log('\n💡 SUGGESTION: This error usually means your network is blocking the connection or the DNS cannot resolve the MongoDB host.');
        console.log('Try these steps:');
        console.log('1. Ensure your IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> Allow Access From Anywhere).');
        console.log('2. Check if you are behind a corporate firewall or VPN.');
        console.log('3. Double-check the connection string for typos.');
    }
    process.exit(1);
});
