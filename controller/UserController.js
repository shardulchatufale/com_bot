const jwt= require("jsonwebtoken")
const bcrypt = require('bcrypt');

const validator=require("../validator/validation")
const UserModel=require("../module/UserModule")



const UserRegistration = async function (req, res) {
    try {
      let data = req.body
      const { username, email, password ,...rest} = data;
      if(Object.keys(rest).length>0)return res.status(400).send({ status: false, message: `you can't provide ${Object.keys(rest)} key` })
          
      if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
      if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: 'Password should be between 8 to 15 character[At least One Upper letter, one small letter, one number and one special charater]' })
  
      if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
      if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })
  
      if (!username) return res.status(400).send({ status: false, message: 'Please enter email' })
      if (!validator.isValidUserName(username)) return res.status(400).send({ status: false, message: 'Please enter valid username' })
  
      let existingUser = await UserModel.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
      }

      let checkEmail = await UserModel.findOne({ email })
      if (checkEmail) return res.status(400).send({ status: false, message: "Email is already used" })

  
      const bcryptPassword = await bcrypt.hash(req.body.password, 10)
      req.body.password = bcryptPassword
  
      const user = await UserModel.create(data)
  
      return res.status(201).send({ status: true, message: 'User Created Successfully', data: user })
  
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

//...............................................................................................................
const login = async function (req, res) {
    try {
      const { username, password,...rest } = req.body;
      if(Object.keys(rest).length>0)return res.status(400).send({ status: false, message: `you can't provide ${Object.keys(rest)} key` })
  
      if (!username) return res.status(400).send({ status: false, message: 'Please enter email' })
      if (!validator.isValidUserName(username)) return res.status(400).send({ status: false, message: 'Please enter valid username' })
  
      if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
  
      const Login = await UserModel.findOne({ username: req.body.username })
      if (!Login) return res.status(400).send({ status: false, message: 'Not a register email Id' })
  
      const passwordMatch = await bcrypt.compare(password, Login.password);
    
  
      if (!passwordMatch) {
        return res.status(401).send({ message: 'Invalid username or password' });
      }
       let token = jwt.sign(
        {
          UserId: Login._id.toString(),
        },
        'just_paste_it', { expiresIn: '1d' }
      );
      res.setHeader('x-Api-key', token);
      res.status(200).send({ status: true,message:" YOU ARE LOG IN SUCCESSFULLY", token: token });
  
    
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }

  module.exports={login,UserRegistration}
