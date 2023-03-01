import axios from 'axios'

const API_URL = '/api/users/'

const getScene = async(getReq) => {
  const response = await axios.get(API_URL + 'getscene',{ params:getReq  })
  if (response.data) {
    localStorage.setItem('sceneObjs', JSON.stringify(response.data))
  }
  return response.data
}

const sceneNames = async(userId) => {
  const response = await axios.get(API_URL + 'scenenames',{ params: { userId } })
  if (response.data) {
  localStorage.setItem('sceneTitles', JSON.stringify(response.data))
  }
  return response.data
}

const saveScene = async(objs) => {
  const response = await axios.post(API_URL + 'savescene',objs)
  return response.data
}

//Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}
// Log User Out
const logout = () => {
  localStorage.clear()
}
// Login User In
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const authService = {
  getScene,
  sceneNames,
  saveScene,
  register,
  logout,
  login,
}

export default authService
