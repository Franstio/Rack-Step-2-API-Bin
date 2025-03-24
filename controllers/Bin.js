import axios from 'axios';
import os from 'os';
import { io } from '../index.js';
import { QueuePLC } from '../lib/QueueUtil.js';

export const switchLamp =  (id, lampType, isAlive) => {
    const dict = {
        "RED": 6,
        "YELLOW":7,
        "GREEN": 8
    };
    const address = dict[lampType];
    QueuePLC.add({id:1,address:address,value: isAlive ? 1 : 0},{removeOnFail:{age: 60,count:10},timeout:3000,removeOnComplete:{age:60,count:5}});
};

export const checkLampRed = async () => {
    
    try {
        const response = await axios.get(`http://${process.env.TIMBANGAN}/getbinData?hostname=${os.hostname()}`, { withCredentials: false,timeout: 100 });
        const bin = response.data.bin;
            
        const limit = (parseFloat(bin.max_weight) /100) * 100;
        if (bin && parseFloat(bin.weight) >= limit) {
            await switchLamp(bin.id, 'RED', true);
            await switchLamp(bin.id, 'YELLOW', false);
        } else {
            await switchLamp(bin.id, 'RED', false);
            await switchLamp(bin.id, 'YELLOW', true);
        }
    } catch (error) {
        console.error('Error fetching bin data');
    }

//    await new Promise(resolve => setTimeout(resolve, 10));
};

export const checkLampYellow = async () => {
    while (true) {
        try {
            const response = await axios.get(`http://${process.env.TIMBANGAN}/getbinData?hostname=${os.hostname()}`, { withCredentials: false });
            const bin = response.data;
            
            if (parseFloat(bin.weight) > parseFloat(bin.max_weight)) {
                await switchLamp(bin.id, 'YELLOW', false);
            } else {
                await switchLamp(bin.id, 'YELLOW', true);
            }
        } catch (error) {
            console.error('Error fetching bin data:', error);
        }

        // Menambahkan delay untuk mencegah request yang berlebihan
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};




export const receiveInstruksi = async (req,res) =>{
    const {instruksi} = req.body ;
    io.emit('UpdateInstruksi', instruksi);
    res.status(200).json({msg:'ok'});
}

export const receiveType = async (req,res) =>{
    const {type} = req.body ;
    io.emit('GetType', type);
    res.status(200).json({msg:'ok'});
}