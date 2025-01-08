import { QueuePLC } from '../lib/QueueUtil.js';
import { PushPayload } from './ActionSensor.js';

export const REDLampOn = async (req, res) => {
    try {
        const {idLockTop} = req.body;

        const address = 6;
        const value = 1;
        PushPayload({id:idLockTop,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Merah Menyala` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const REDLampOff = async (req, res) => {
    try {
        const {idLockTop} = req.body;

        const address = 6;
        const value = 0;
        PushPayload({id:idLockTop,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Merah Mati` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const YELLOWLampOn = async (req, res) => {
    try {
        const {idLampYellow} = req.body;
        const address = 7;
        const value = 1;
        PushPayload({id:idLampYellow,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Kuning Menyala` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const YELLOWLampOff = async (req, res) => {
    try {
        const {idLampYellow} = req.body;
        const address = 7;
        const value = 0;
        PushPayload({id:idLampYellow,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Kuning Mati` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const GREENLampOn = async (req, res) => {
    try {
        const {idLampGreen} = req.body;
        const address = 8;
        const value = 1;
        PushPayload({id:idLampGreen,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Hijau Menyala` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const GREENLampOff = async (req, res) => {
    try {
        const {idLampGreen} = req.body;
        const address = 8;
        const value = 0;
        PushPayload({id:idLampGreen,address:address,value:value});
//        const data = await client.readHoldingRegisters(address, 8);
       /*  if (value === 1) {
            res.status(200).json({ msg: `Top Lock diBuka` });
        } else {
            res.status(200).json({ msg: `Kunci dengan address ${address} berhasil ditutup.` });
        } */
        res.status(200).json({ msg: `Lampu Hijau Mati` });

    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

export const switchLamp = async (id, lampType, isAlive) => {
    const dict = {
        "RED": 6,
        "GREEN": 8,
        "YELLOW": 7
    };
    const address = dict[lampType];
    QueuePLC.add({id:id,address:address,value: isAlive ? 1 : 0},{removeOnFail:{age: 60*10,count:10},timeout:3000,removeOnComplete:{age:60,count:5}});
}