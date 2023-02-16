import express, { Request, Response } from 'express'
import { getRegisterList, login, register } from '../controller/logic'
const router = express.Router()
// const V =require('../middleware/validations')
const path = require('path')
const passport = require('passport')
require('../middleware/auth')(passport)
// const multer = require('multer')


router.post('/register',register)
router.post('/login',login)
router.get('/registerList',passport.authenticate('jwt',{session:false}),getRegisterList)


export default router
