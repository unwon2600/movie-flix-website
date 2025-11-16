// api/auth/login.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../_utils/mongo');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({message:'Missing fields'});
  try {
    const { db } = await connectToDatabase(process.env.MONGO_URI);
    const admin = await db.collection('admins').findOne({email});
    if(!admin) return res.status(401).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, admin.password);
    if(!ok) return res.status(401).json({message:'Invalid credentials'});
    const token = jwt.sign({id: String(admin._id), email}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return res.json({ ok:true, token });
  } catch(err){
    console.error(err);
    return res.status(500).json({message:'Server error'});
  }
}
