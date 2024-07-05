import { PushPayload } from "./ActionSensor.js";


export const rackOpen = async (req, res) => {
    try {
        const {address} = req.body;
        const {value} = req.body; 
        const {clientId} = req.body;
        PushPayload({id:clientId,address:address,value:value});
        res.status(200).json({ msg: "Pintu Rack Dibuka" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const rackOpenManual = async (req, res) => {
    try {
        const {address} = req.body;
        const {value} = req.body; 
        const {idRack} = req.body;
        PushPayload({id:idRack,address:address,value:value})
        res.status(200).json({ msg: "Pintu Rack Dibuka" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};