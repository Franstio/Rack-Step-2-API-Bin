import express from "express";
import {rackOpen} from "../controllers/TriggerRack.js"


const router = express.Router();

router.post('/rackOpen', rackOpen);


export default router;