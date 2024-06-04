import express from "express";
import {rackOpen,rackOpenManual} from "../controllers/TriggerRack.js"


const router = express.Router();

router.post('/rackOpen', rackOpen);
router.post('/rackOpenManual', rackOpenManual);


export default router;