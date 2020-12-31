// Event Routes
// /api/events

const { Router } = require("express");
const { validateJWT } = require ("../middlewares/validate-jwt");
const { getEvents,createEvent,refreshEvent,deleteEvent } = require("../controllers/events");
const { validatefields } = require("../middlewares/validate-fields")
const { isDate } = require("../helpers/isDate")

const { check } = require("express-validator")
const router = Router();

//Todas tienen que pasar por la validacion del JWT
router.use( validateJWT );

//Obtain events
router.get("/", getEvents)

//Create new event
router.post(
    "/",
    [
        check("title","The title is necesary.").not().isEmpty(),
        check("start", "Beginning date start is necessary.").custom(isDate),
        check("end", "End date is necessary.").custom(isDate),
        validatefields,
    ],
    createEvent
    
    );

//Refresh event
router.put("/:id", refreshEvent);

//Delete event
router.delete("/:id", deleteEvent);


module.exports = router;