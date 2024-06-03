import express from "express";
import {rackOpen} from "../controllers/RackDoor.js"

const router = express.Router();

router.post('/rackOpen', rackOpen);


export default router;