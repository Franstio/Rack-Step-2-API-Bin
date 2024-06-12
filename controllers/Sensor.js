import client from '../controllers/TriggerLock.js';
client.setTimeout(5000);


export const SensorRack = async (req, res) => {
    const { clientId, address } = req.query;
    console.log([clientId,address]);
    let receivedValue = null;
    try {
        client.setID(clientId);
        if (!client.isOpen) {
            client.open(() => {
                console.log("modbus open");
            });
        }

        //const address = address;
        const response = await client.readHoldingRegisters(address, 1);
        console.log({response:response.data});//tolong push ri.
        receivedValue = response.data[0];

        res.status(200).json({ sensorrack: receivedValue });
    } catch (error) {
        console.log(error);
        res.status(200).json({ sensorrack: receivedValue });
    }
};

