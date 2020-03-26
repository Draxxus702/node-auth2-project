const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('../users/user-model')
const {jwtSecret} = require('../config/secrets')

router.post('/register', (req, res) => {
    let body = req.body
    const hash = bcrypt.hashSync(body.password, 10) //2 to the power of x
    body.password = hash

    Users.add(body)
    .then(param => {
        res.status(201).json(param)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post("/login", (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user); //get a token
          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token, //send the token
          });
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({errorMessage: 'wth is wrong'});
      });
  });
  
  function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      role: user.role || "user",
    };
  
    const options = {
      expiresIn: "1h",
    };
  
    return jwt.sign(payload, jwtSecret, options);
  }






module.exports = router