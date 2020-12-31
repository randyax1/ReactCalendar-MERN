// Rutas de usuarios / Auth
// host + /api/auth

const { Router } = require("express");
const {check} = require("express-validator");

const router = Router();

const { createUser,loginUser,refreshToken } = require("../controllers/auth");
const { validatefields } = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt")

router.post(
    "/new", 
    [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "El password debe de ser minimo de 6 caracteres").isLength({min: 6}),
    validatefields
    ],
    createUser);


router.post(
    "/", 
    [
     check("email", "El correo es obligatorio").isEmail(),
     check("password", "El password debe de ser de 6 caracteres").isLength({min: 6}),
     validatefields
    ],
    loginUser);


router.get("/renew", validateJWT, refreshToken);

//Para exportar en node
module.exports = router;