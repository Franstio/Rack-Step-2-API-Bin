import ModbusRTU from 'modbus-serial';
const client = new ModbusRTU();
client.connectRTU("/dev/ttyUSB0", { baudRate: 9600 });
client.setTimeout(2000); 

export default client;

export const readCmd =  async (address,val) =>
{
    let _res=0;
    try
    {
        _res = await client.readHoldingRegisters(address, val);
        return _res;
    }
    catch
    {
        await new Promise((resolve) => setTimeout(resolve,10));
        return await readCmd(address,val);
    }
}
export const writeCmd = async (data) => {
    try
    {
        client.setID(data.id);
        await client.writeRegister(data.address,data.value);
        return;
    }
    catch(err)
    {
        await new Promise((resolve) => setTimeout(resolve,10));
        await writeCmd(data);
    }
}

