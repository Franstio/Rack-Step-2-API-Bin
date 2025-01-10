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
        if (client.isOpen)
            client.close(()=>{

                QueueConnPLC.add({id:1},{removeOnFail:{age: 60*10,count:10},timeout:3000,removeOnComplete:{age:60,count:5}});
            }); 
        await new Promise((resolve) => setTimeout(resolve,1000));
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

