import client from '../controllers/TriggerLock.js';
client.setTimeout(5000);

export const rackOpen = async (req, res) => {
    try {
        if (!client.isOpen) {
            client.open(() => {
                console.log("modbus open");
            });
        }
        const {address} = req.body;
        const {value} = req.body; 
        const {idRack} = req.body;
     console.log({i:idRack,ad:address,val:value});
        client.setID(idRack);
        await client.writeRegister(address, value);
        res.status(200).json({ msg: "Pintu Rack Dibuka" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};