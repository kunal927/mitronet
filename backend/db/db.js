const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const URL =
      "mongodb+srv://kunalkumar30singh_db_user:15dvYa28TjW2vBGy@cluster0.j1ilnvm.mongodb.net"
    await mongoose.connect(URL, {dbName: "social"})
    console.log("MongoDB connected")
  } catch (error) {
    console.error(error)
  }
}

module.exports = connectDB
