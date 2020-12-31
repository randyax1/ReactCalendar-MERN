const { response } = require("express");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt")

const createUser = async(req,res = response) => {

    const {email, password} = req.body;

    try {
    
        let user = await User.findOne({email: email})

        if( user ){
            return res.status(400).json({
                ok:false,
                msg:"An user exist with this email."
            });
        }

    user = new User(req.body);

    //Encryptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password,salt);
    
    await user.save();

    //Generate JWT
    const token = await generateJWT(user.id,user.name);


    //manejo de errores
    const errors = validationResult(req);

    res.status(201).json({
        ok: true,
        uid: user.id,
        name: user.name,
        token
    })

    } catch (error) {
        
       res.status(500).json({
            ok: false,               
            msg: "Please contact to the admin."
            });
        
    }

} 

const loginUser = async(req,res = response) => {

    const {email, password} = req.body;


    try {
    
        const user = await User.findOne({email: email})

        if( !user ){
            return res.status(400).json({
                ok:false,
                msg:"An user don't exist with that email."
            });
        }

        //confirm password
        const validPassword = bcrypt.compareSync( password,user.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:"Password Incorrect."
            });
        }

        //Generate JWT
        const token = await generateJWT(user.id,user.name);

        //Generate our own Json web token
        res.json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
        })

        
    } catch (error) {
        
        res.status(500).json({
             ok: false,               
             msg: "Please contact to the admin."
             });
         
     } 
}

const refreshToken = async(req,res = response) => {

    const { uid,name } = req;

    //Generate JWT
    const token = await generateJWT( uid, name );

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    refreshToken
}