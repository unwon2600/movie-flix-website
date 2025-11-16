// api/auth/register.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../_utils/mongo');

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'});
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({message:'Missing fields'});

  try {
    const { db } = await connectToDatabase(process.env.MONGO_URI);
    const existing = await db.collection('admins').findOne({email});
    if(existing) return res.status(400).json({message:'Admin exists'});

    const hash = await bcrypt.hash(password, 10);
    const newAdmin = { email, password: hash, createdAt: new Date() };
    const r = await db.collection('admins').insertOne(newAdmin);

    const token = jwt.sign({id: String(r.insertedId), email}, process.env.JWT_SECRET, {expiresIn:'7d'});
    return res.json({ ok:true, token });
  } catch(err){
    console.error(err);
    return res.status(500).json({message:'Server error'});
  }
}
