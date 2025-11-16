// api/movies/[id].js
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../_utils/mongo');

function verifyAuth(req){
  const auth = req.headers.authorization || '';
  if(!auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try { return jwt.verify(token, process.env.JWT_SECRET); } catch(e){ return null; }
}

module.exports = async (req, res) => {
  const user = verifyAuth(req);
  if(!user) return res.status(401).json({message:'Unauthorized'});
  const { db } = await connectToDatabase(process.env.MONGO_URI);

  const id = req.query.id || (req.url && req.url.split('/').pop());
  if(!id) return res.status(400).json({message:'Missing id'});

  if(req.method === 'GET'){
    const m = await db.collection('movies').findOne({_id: new ObjectId(id)});
    return res.json({ movie: m });
  }

  if(req.method === 'PUT'){
    const body = req.body || {};
    await db.collection('movies').updateOne({_id: new ObjectId(id)}, { $set: body });
    return res.json({ ok:true });
  }

  if(req.method === 'DELETE'){
    await db.collection('movies').deleteOne({_id: new ObjectId(id)});
    return res.json({ ok:true });
  }

  return res.status(405).json({message:'Method not allowed'});
}

