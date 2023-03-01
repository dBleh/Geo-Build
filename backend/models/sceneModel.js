const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
var db = mongoose.createConnection(process.env.MONGO_URI)
const schema = mongoose.Schema(
  {
    userId:{
      type:ObjectId,
      required: [true, 'Please add a userID'],
    },
    sceneName:{
      type: String,
      required: [true, 'Please add a scene name'],
    },
    objs:{
      type: Array,
    }
  },
  {
    timestamps: true,
  }
)
const sceneModel = db.model('Scene', schema)
module.exports = sceneModel
