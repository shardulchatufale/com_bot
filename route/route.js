const express = require('express');
const router = express.Router();

const MiddleWare=require("../auth/auth")
const UserController=require("../controller/UserController")
const FieldController=require("../controller/FieldController")


//...............................TASK ONE........................................................


router.post('/login',UserController.login)
router.post("/CreateUser",UserController.UserRegistration)


router.post('/fields',MiddleWare.authenticate,FieldController.CreatteField)
router.get('/fields',MiddleWare.authenticate,FieldController.AllField)
router.get('/fields/:Id',MiddleWare.authenticate,FieldController.GetSingelField)
router.put('/fields/:Id',MiddleWare.authenticate,FieldController.UpdateField)
router.delete('/fields/:Id',MiddleWare.authenticate,FieldController.deleteField)


module.exports = router;