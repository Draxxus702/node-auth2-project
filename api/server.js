const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')

const authRouter = require('../auth/auth-router')
const userRouter = require('../users/user-router')
const restricted = require('../auth/restricted-middlware')

const server = express()

// const sessionConfig = {
//     name: 'users',
//     secret: 'there is no secret that is safe',
//     cookie:{
//         maxAge: 1000*60*60,
//         secure:false,
//         httpOnly:true
//     },
//     resave: false,
//     saveUninitialized:true
// }

server.use(helmet())
server.use(express.json())
server.use(cors())
// server.use(session(sessionConfig))

server.use("/api/auth", authRouter)
server.use("/api/users", restricted, checkRole("user"), userRouter);


server.get("/", (req, res) => {
    res.send('Server is working')
})


module.exports = server


function checkRole(param){
return (req, res, next) => {
    if(
        req.decodedToken &&
        req.decodedToken.role &&
        req.decodedToken.role.toLowerCase() === param
    ){
        next()
    } else{
        res.status(403).json({warning: 'You will not enter'})
    }
}
}