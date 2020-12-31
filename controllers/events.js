const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response ) =>{

    const events = await Event.find()
                                .populate("user", "name");
                            
            

    res.json({
        ok: true,
        msg: "getEvents",
        events
    });
}

const createEvent = async(req, res = response ) =>{

    const event = new Event(req.body);

    try {

       event.user = req.uid;

       const evenSaved = await event.save()

       res.json({
          ok: true,
          event: evenSaved
       })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Contact with the admin."
        })
    }

}

const refreshEvent = async (req, res = response ) =>{

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if( !event){
            return res.status(404).json({
                ok:false,
                msg: "The event don´t exist by this ID"
            });
        }

        if(event.user.toString() !== uid ){
            return res.status(401).json({
                ok:false,
                msg:"You don't have permission to edit this event"
            })
        }

        const newEvent = {
            ...req.body,
            user:uid
        }

        const eventrefreshed = await Event.findByIdAndUpdate(eventId,newEvent, {new: true} );

        res.json({
            ok:true,
            event: eventrefreshed
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Contact with the admin"
        });
    }

}

const deleteEvent = async(req, res = response ) =>{

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById(eventId);

        if( !event){
            return res.status(404).json({
                ok:false,
                msg: "The event don´t exist by this ID"
            });
        }

        if(event.user.toString() !== uid ){
            return res.status(401).json({
                ok:false,
                msg:"You don't have permission to deleted this event"
            })
        }


        await Event.findByIdAndDelete( eventId );

        res.json({ ok:true });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "Contact with the admin"
        });
    }

}


module.exports = {
    getEvents,
    createEvent,
    refreshEvent,
    deleteEvent
}