import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash('password123', 12);
console.log(hashedPassword);
