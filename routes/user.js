const router = require('express').Router()
const User = require('../model/user')

const {handleRegister} = require('../controllers/handleRegister')
const {handleLogin} = require('../controllers/handleLogin')
const {handleLogout} = require('../controllers/handleLogout')
const {verifyJWT} = require('../middleware/verifyJWT')

router.post('/register',handleRegister)
router.post('/login',handleLogin)
router.get('/logout', handleLogout);

router.get('/getUsers',async(req,res)=>{
    try {
    const resp = await User.find()
    console.log(resp)
    res.status(200).json(resp)
    }
    catch(err) {
    res.status(400).json(err)
    }
})

router.get('/getUser/:id',async(req,res)=>{
    try {
    const resp = await User.findOne({_id:req.params.id})
    console.log(resp)
    res.status(200).json(resp)
    }
    catch(err) {
    res.status(400).json(err)
    }
})

module.exports = router