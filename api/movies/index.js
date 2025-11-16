// api/movies/index.js
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../_utils/mongo');
const fetch = require('node-fetch');

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

  if(req.method === 'GET'){
    const movies = await db.collection('movies').find({}).toArray();
    return res.json({ movies, adminEmail: user.email });
  }

  if(req.method === 'POST'){
    const { title, direct, telegram } = req.body || {};
    if(!title) return res.status(400).json({message:'Missing title'});
    // fetch OMDb
    const omdb = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${process.env.OMDB_API_KEY}`);
    const data = await omdb.json();
    const movie = {
      title: data.Title || title,
      poster: (data.Poster && data.Poster !== 'N/A') ? data.Poster : '',
      year: data.Year || '',
      plot: data.Plot || '',
      genre: data.Genre || '',
      direct: direct || '',
      telegram: telegram || '',
      createdAt: new Date()
    };
    const r = await db.collection('movies').insertOne(movie);
    return res.json({ ok:true, id: String(r.insertedId) });
  }

  return res.status(405).json({message:'Method not allowed'});
};
