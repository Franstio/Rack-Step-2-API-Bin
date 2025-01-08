import client from './PLCUtil.js';
import { io } from '../index.js';
import { checkLampRed } from './Bin.js';
import { readCmd, writeCmd } from './PLCUtil.js';
import { QueuePLC } from '../lib/QueueUtil.js';
client.setTimeout(3000);

let bottomSensor=null;
let topSensor=null;
export const SensorTop = async (req, res) => {
    const { SensorTopId } = req.body;
    let receivedValue = null;
    try {
/*        client.setID(SensorTopId);
        if (!client.isOpen) {
            client.open(() => {
            });
        }*/

        const address = 0;

        const response = await readCmd(address, 1);
        receivedValue = response.data[0];

        res.status(200).json({ sensorTop: receivedValue });
    } catch (error) {
        res.status(200).json({ sensorTop: receivedValue });
    }
};

export const SensorBottom = async (req, res) => {
    const { SensorBottomId } = req.body;
    try {
/*        client.setID(SensorBottomId);
        if (!client.isOpen) {
            client.open(() => {
            });
        }*/

        const address = 1;

        const response = await readCmd(address, 1);
        const receivedValue = response.data[0];

        res.status(200).json({ sensorBottom: receivedValue });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
let idInterval= null;
export const observeBottomSensor = async (req, res) => {
    const { readTarget } = req.body;
    bottomSensor = readTarget;
/*    client.setID(1);
     idInterval = setInterval(async () => {
        try {
            if (!client.isOpen) {
                client.open(() => {
                });
            }
            
            const address = 1;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            if (receivedValue == readTarget)
            {
                io.emit('target-'+readTarget,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
        }
    }, 100);*/
    res.status(200).json({msg:'ok'});
}

export const observeTopSensor = async (req, res) => {
    const { readTargetTop } = req.body;
    topSensor = readTargetTop;
/*    client.setID(1);
     idInterval = setInterval(async () => {
        try {
            if (!client.isOpen) {
                client.open(() => {
                });
            }
            
            const address = 0;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            if (receivedValue == readTargetTop)
            {
                io.emit('target-top-'+readTargetTop,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
        }
    }, 100);*/
    res.status(200).json({msg:'ok'});
}
/*
export const observeBottomSensorIndicator = async (req, res) => {
    if (idInterval != null)
        return;
    const { indicatorBottom } = req.body;
    bottomSensor=indicatorBottom;
    res.status(200).json({msg:'ok'});
}

export const observeTopSensorIndicator = async (req, res) => {
    if (idInterval != null)
        return;
    const { readTargetTop } = req.body;
    topSensor = readTargetTop;
    //client.setID(1);
     /*idInterval = setInterval(async () => {
        try {
            if (!client.isOpen) {
                client.open(() => {
                });
            }
            
            const address = 0;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            if (receivedValue == readTargetTop)
            {
                io.emit('target-top-'+readTargetTop,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
        }
    }, 100);
    res.status(200).json({msg:'ok'});
}
*/
const SensorData = [0,0,0,0,0,0,0];
export const PushPayload =  (data)=>{
    if (!data.id || !data.address || !data.value)
        return;
    QueuePLC.add(data,{removeOnFail:{age: 60*10,count:10},timeout:3000,removeOnComplete:{age:60,count:5}});
}
export const UpdateSensor = async (index,data,_io)=>{
    if (index < 0 || index > SensorData.length-1)
        return;
    SensorData[index] = data;
    _io.emit("sensorUpdate",SensorData);
    const topResValue = SensorData[0];
    const bottomResValue = SensorData[1];
    if (topSensor != null && topResValue == topSensor )
    {
        const target = 'target-top-'+topSensor;
        topSensor= null;
//            clearInterval(idInterval);
        _io.emit(target,true);
    }
    if ( bottomSensor != null && bottomResValue == bottomSensor )
    {
        const target = 'target-'+bottomSensor;
        bottomSensor = null;

        _io.emit(target,true);
    }
}

export const observeSensor = async (_io)=>  {
    if (!client.isOpen) {
        client.open(() => {
        });
    }
    while(true)
    {
    try {

        
//        await checkLampRed();

        const topRes = await readCmd(0, 1);
        await UpdateSensor(0, topRes.data[0],_io);
       // await new Promise((resolve)=> setTimeout(resolve,100) );
        const bottomRes = await readCmd(1,1);
        await UpdateSensor(1,bottomRes.data[0],_io);
        const redLamp = await readCmd(6,1);
        await UpdateSensor(2,redLamp.data[0],_io);
        const yellowLamp = await readCmd(7,1);
        await UpdateSensor(3,yellowLamp.data[0],_io);
        const greenLamp = await readCmd(8,1);
        await UpdateSensor(4,greenLamp.data[0],_io);
        const locktop = await readCmd(4,1);
        await UpdateSensor(5,locktop.data[0],_io);
        const lockbottom = await readCmd(5,1);
        await UpdateSensor(6,lockbottom.data[0],_io);
        const topResValue = topRes.data[0];
        const bottomResValue = bottomRes.data[0];
 
    }
    catch (err) {
    }
    finally
    {
        await new Promise((resolve)=> setTimeout(resolve,10) );
    }
}
};
