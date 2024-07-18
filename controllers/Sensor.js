import client from './PLCUtil.js';
import { readCmd } from './PLCUtil.js';
client.setTimeout(5000);


export const SensorRack = async (req, res) => {
    const { clientId, address } = req.query;
    let receivedValue = null;
    try {
        client.setID(clientId);
        if (!client.isOpen) {
            client.open(() => {
            });
        }

        //const address = address;
        const response = await readCmd(address, 1);
        receivedValue = response.data[0];

        res.status(200).json({ sensorrack: receivedValue });
    } catch (error) {
        res.status(200).json({ sensorrack: receivedValue });
    }
};

