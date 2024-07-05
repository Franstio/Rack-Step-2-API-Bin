import client from './PLCUtil.js';
import { io } from '../index.js';
import { checkLampRed } from './Bin.js';
import { readCmd, writeCmd } from './PLCUtil.js';
client.setTimeout(3000);

let bottomSensor=null;
let topSensor=null;
export const SensorTop = async (req, res) => {
    const { SensorTopId } = req.body;
    console.log(SensorTopId);
    let receivedValue = null;
    try {
/*        client.setID(SensorTopId);
        if (!client.isOpen) {
            client.open(() => {
                console.log("modbus open");
            });
        }*/

        const address = 0;

        const response = await readCmd(address, 1);
        receivedValue = response.data[0];

        res.status(200).json({ sensorTop: receivedValue });
    } catch (error) {
        console.log(error);
        res.status(200).json({ sensorTop: receivedValue });
    }
};

export const SensorBottom = async (req, res) => {
    const { SensorBottomId } = req.body;
    console.log(SensorBottomId);
    try {
/*        client.setID(SensorBottomId);
        if (!client.isOpen) {
            client.open(() => {
                console.log("modbus open");
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
                    console.log("modbus open");
                });
            }
            
            const address = 1;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            console.log("received value: "+receivedValue+", target: " + readTarget);
            if (receivedValue == readTarget)
            {
                io.emit('target-'+readTarget,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
            console.log(err);
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
                    console.log("modbus open");
                });
            }
            
            const address = 0;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            console.log("received value: "+receivedValue+", target: " + readTargetTop);
            if (receivedValue == readTargetTop)
            {
                io.emit('target-top-'+readTargetTop,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
            console.log(err);
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
                    console.log("modbus open");
                });
            }
            
            const address = 0;

            const response = await client.readHoldingRegisters(address, 1);
            const receivedValue = response.data[0];
            console.log("received value: "+receivedValue+", target: " + readTargetTop);
            if (receivedValue == readTargetTop)
            {
                io.emit('target-top-'+readTargetTop,true);
                clearInterval(idInterval);
                idInterval  = null;
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
    }, 100);
    res.status(200).json({msg:'ok'});
}
*/
const SensorData = [0,0,0,0,0,0,0];
const PayloadData = [];
export const PushPayload =  (data)=>{
    if (!data.id || !data.address || !data.value)
        return;
    PayloadData.push(data);
}
const executePayload = async ()=>{
    const payload = [...PayloadData];
    for (let i=0;i<payload.length;i++)
    {
        await writeCmd(payload[i]);
    }
    client.setID(1);
    PayloadData = [];
}
const UpdateSensor = async (index,data,_io)=>{
    await executePayload();
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
            console.log("modbus open");
        });
    }
    while(true)
    {
    try {
        await executePayload();
        client.setID(1);

        
        await checkLampRed();

        const topRes = await readCmd(0, 1);
        await UpdateSensor(topRes.data[0]);
       // await new Promise((resolve)=> setTimeout(resolve,100) );
        const bottomRes = await readCmd(1,1);
        await UpdateSensor(bottomRes.data[0]);
        const redLamp = await readCmd(6,1);
        await UpdateSensor(redLamp.data[0]);
        const yellowLamp = await readCmd(7,1);
        await UpdateSensor(yellowLamp.data[0]);
        const greenLamp = await readCmd(8,1);
        await UpdateSensor(greenLamp.data[0]);
        const locktop = await readCmd(4,1);
        await UpdateSensor(locktop.data[0]);
        const lockbottom = await readCmd(5,1);
        await UpdateSensor(lockbottom.data[0]);
        const topResValue = topRes.data[0];
        const bottomResValue = bottomRes.data[0];
        console.log("topres value: "+topResValue+" ,bottomres value: " + bottomResValue + ", target top:" + topSensor + " , target bottom: " + bottomSensor);
        console.log([topResValue,bottomResValue,redLamp.data[0],yellowLamp.data[0],greenLamp.data[0],locktop.data[0],lockbottom.data[0]]);
 
    }
    catch (err) {
        console.log(err);
    }
    finally
    {
        await new Promise((resolve)=> setTimeout(resolve,10) );
    }
}
};
