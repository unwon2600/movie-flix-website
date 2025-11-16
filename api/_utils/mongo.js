// api/_utils/mongo.js
const { MongoClient } = require('mongodb');
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase(uri, dbName='movieflix') {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };
  const client = new MongoClient(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  await client.connect();
  const db = client.db(dbName);
  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

module.exports = { connectToDatabase };
