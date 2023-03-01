const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const sceneModel = require('../models/sceneModel')
const sceneNamesModel =require('../models/sceneNamesModel')

const getScene = asyncHandler(async (req, res) => {
  const name = req.query.sName;
  const userId = req.query.userId;
  const scene = await sceneModel.findOne({ sceneName: name, userId: userId });
  if (!scene) {
    res.status(404).json({ message: "Scene not found" });
    return;
  }

  res.json(scene);
});
const sceneNames = asyncHandler(async (req, res) => {
  const userId = req.query.userId
  const scenes = await sceneModel.find({userId: userId})
  const sceneNames = scenes.map(scene => scene.sceneName)
  res.json(sceneNames)
})
const saveScene = asyncHandler(async (req, res) => {
  const { userId, objs, sceneName } = req.body
  const scene = await sceneModel.findOne({ sceneName: sceneName, userId: userId });
  
  if(!scene){
    const newScene = await sceneModel.create({
      userId,
      sceneName,
      objs: [objs],
    });
    res.status(200).json(newScene);
  }
  else{
    res.status(200).json("scene with this name already exists");
  }
})

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }
  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, userType } = req.body
  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }

})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  getScene,
  sceneNames,
  saveScene,
  registerUser,
  loginUser,
  getMe,
}
