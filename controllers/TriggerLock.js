import { PushPayload } from './ActionSensor.js';
import os from 'os';


export const lockTop = async (req, res) => {
    try {
        const {idLockTop} = req.body;
        console.log(idLockTop);
        const address = 4;
        const value = 1;
        PushPayload({id:idLockTop,address:address,value:value});
        return res.status(200).json({ msg: `Rack Telah Dibuka` });

    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};

export const lockBottom = async (req, res) => {
    try {
        const {idLockBottom} = req.body;
	//console.log({id: idRollingDoor});

        const address = 5;
        const value = 1;
        PushPayload({id:idLockBottom,address:address,value:value});
//        const data = await client.readHoldingRe  gisters(address, 8);
//        console.log({ log: log, data: data });
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        return res.status(200).json({ msg: `Bottom Lock diBuka` });

    } catch (error) {
        return res.status(500).json({ msg: error });
    }
};

export const getHostname = async (req,res) =>{
    res.status(200).json({hostname: os.hostname()});
}