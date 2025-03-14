import { MongoClient } from 'mongodb';
const url = process.env.MONGODB_URI;
let db = null;

export async function connectDB(){
    if (db) return db;
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    db = client.db();
    return db;
}