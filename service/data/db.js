import { MongoClient } from 'mongodb'
import { DB_NAME, DB_URL } from '../constant/dbConfig.js'

const client = new MongoClient(DB_URL)

let dbInstance = null
export async function connectToDatabase() {
  if (!dbInstance) {
    await client.connect()
    dbInstance = client.db(DB_NAME)
  }
  return dbInstance
}
