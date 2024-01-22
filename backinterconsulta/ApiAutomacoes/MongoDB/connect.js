import mongoose from "mongoose"

const connect = () =>{
  mongoose.connect('mongodb+srv://matheusfff02:030503Aa@cluster0.qoa8un4.mongodb.net/')

  const db = mongoose.connection

  db.once('open', () =>{
    console.log('MongoDB on')
  })

  db.on('error', console.error.bind(console, 'Error Connection in MongoDB'))
}

export default {
  connect
}