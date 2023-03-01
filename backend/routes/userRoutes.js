const express = require('express')
const router = express.Router()

const {
  getScene,
  sceneNames,
  saveScene,
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
router.get('/getScene',getScene)
router.get('/scenenames',sceneNames)
router.post('/savescene', saveScene)
router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router
