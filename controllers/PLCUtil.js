import ModbusRTU from 'modbus-serial';
import { SerialPort } from 'serialport';
let client = new ModbusRTU();
let sp = null;
export default client;

export const readCmd =  async (address,val) =>
{
    let _res=0;
    try
    {
        if (!client.isOpen)
            await openModbus();
        _res = await client.readHoldingRegisters(address, val);
        await closeModbus();
        return _res;
    }
    catch (err)
    {
        await closeModbus();
        console.log(err);
        await new Promise((resolve) => setTimeout(resolve,500));
        return await readCmd(address,val);
    }
}
export const writeCmd = async (data) => {
    try
    {
        if (!client.isOpen)
            await openModbus();
        client.setID(data.id);
        const res = await client.writeRegister(data.address,data.value);
        await closeModbus();
        return {success:true,msg:JSON.stringify(res)};
    }
    catch(err)
    {
        await closeModbus();
        return {success: false,msg:err?.message || err};
    }
}


export const openModbus = async () => {
    
    //await client.connectRTU("/dev/ttyUSB0", { baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none' });
    sp = new SerialPort({lock:false,path:process.env.PORT_PLC,baudRate:9600,autoOpen:true,parity:'none',dataBits:8,stopBits:1}); 
    sp.on('data',(data)=>{

    });
    sp.on('close',(c)=>{
    });
    sp.on('error',(err)=>{
        console.log(err);
    });
    client = new ModbusRTU();
    await client.connectRTU(process.env.PORT_PLC, { baudRate: 9600, dataBits: 8, stopBits: 1, parity: 'none' });
    client.setTimeout(300);
    
    client.on('error', (err) => {
        console.log('FROM MODBUS EVENT:');
        console.log(err);
    });
    client.on('close', () => {
    });
}
export const closeModbus = async () => {
    try {
        await new Promise((resolve) => {
            try {
                sp.close(() => {
                    resolve('');
                });
            }
            catch (err) {
                resolve(null);
            }
        });
    }
    catch (err) {
        console.log({close_modbus:err});
    }
}