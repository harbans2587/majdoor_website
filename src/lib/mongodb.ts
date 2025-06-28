import mongoose from 'mongoose'

const connection: { isConnected?: number } = {}

async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState
    if (connection.isConnected === 1) {
      return
    }
    await mongoose.disconnect()
  }

  const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/majdoor_db')
  connection.isConnected = db.connections[0].readyState
}

export default dbConnect