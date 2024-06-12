import client from '../controllers/TriggerLock.js';
client.setTimeout(5000);


export const SensorRack = async (req, res) => {
    const { SensorId } = req.query;
    console.log(SensorId);
    let receivedValue = null;
    try {
        client.setID(SensorId);
        if (!client.isOpen) {
            client.open(() => {
                console.log("modbus open");
            });
        }

        const address = 0;

        const response = await client.readHoldingRegisters(address, 1);
        receivedValue = response.data[0];

        res.status(200).json({ sensorrack: receivedValue });
    } catch (error) {
        console.log(error);
        res.status(200).json({ sensorrack: receivedValue });
    }
};

