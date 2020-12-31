const { response } = require("express");
const { validationResult } = require("express-validator")

const validatefields = (req,res = response ,next) =>{

     //manejo de errores
     const errors = validationResult(req);

     if(!errors.isEmpty() ){
         return res.status(400).json({
             ok: false,
             error: errors.mapped()
         });
     } 

    next();
}
module.exports = {
    validatefields
}