const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const TaskController = require('../controllers/TaskController')
const AuthVerification = require('../middlewares/AuthVerification')

//User API
router.post('/UserRegistration', UserController.UserRegistration)
router.post('/UserLogin', UserController.UserLogin)
router.post('/UserUpdate', AuthVerification,UserController.UserUpdate)
router.get('/UserRead', AuthVerification,UserController.UserRead)
router.get('/UserDelete', AuthVerification,UserController.UserDelete)
router.get('/UserSendOTP/:email',UserController.UserSendOTP)
router.get('/UserVerifyOTP/:email/:otp',UserController.UserVerifyOTP)
router.get('/UserResetPass/:email/:otp/:password',UserController.UserResetPass)

//Task API
router.post('/CreateTask',AuthVerification, TaskController.CreateTask)
router.get('/UpdateTask/:taskID/:status',AuthVerification, TaskController.UpdateTask)
router.get('/DeleteTask/:taskID',AuthVerification, TaskController.DeleteTask)
router.get('/ListTaskByStatus/:status',AuthVerification, TaskController.ListTaskByStatus)
router.get('/CountTaskStatus',AuthVerification, TaskController.CountTaskStatus)

module.exports = router;