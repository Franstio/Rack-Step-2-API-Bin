import ModbusRTU from 'modbus-serial';
const client = new ModbusRTU();

export default client;

export const readCmd =  async (address,val) =>
{
    let _res=0;
    try
    {
        _res = await client.readHoldingRegisters(address, val);
        return _res;
    }
    catch (err)
    {
        console.log(err);
        await new Promise((resolve) => setTimeout(resolve,500));
        return await readCmd(address,val);
    }
}
export const writeCmd = async (data) => {
    try
    {
        client.setID(data.id);
        const res = await client.writeRegister(data.address,data.value);
        return {success:true,msg:JSON.stringify(res)};
    }
    catch(err)
    {
        return {success: false,msg:err?.message || err};
    }
}

