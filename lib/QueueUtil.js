import Queue from 'bull';
import { config } from 'dotenv';
import client, { readCmd, writeCmd } from '../controllers/PLCUtil.js';
import { UpdateSensor } from '../controllers/ActionSensor.js';
import { io } from '../index.js';

import { ExpressAdapter } from '@bull-board/express';
import {createBullBoard} from '@bull-board/api';
import {BullAdapter} from '@bull-board/api/bullAdapter.js';
config();
const QueuePLC = new Queue('PLC Write Queue',{
  limiter: { 
    duration: 1000,
    max: 3,
  }
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

QueuePLC.process(async (job,done)=>{
  const res = await writeCmd(job.data);
  const count = job.data.count != undefined && job.data.count != null  ? job.data.count : 1 ;
  console.log(count);
  if (!res.success)
  { 
    
    if (count <= 3)
    {
      job.data.count = count+1;
     QueuePLC.add(job.data,{type:"WR"},{removeOnFail:{age: 60*10,count:10},timeout:3000,removeOnComplete:{age:60,count:5}});
    }
     done(res.msg,null);
  }
  else
    done(null,res.msg)
});
const bullBoard = createBullBoard({
    queues: [new BullAdapter(QueuePLC)],
    serverAdapter: serverAdapter,
    options:{
      uiConfig:{
        boardTitle:process.env.NAME
      }
    }
  });
export { QueuePLC,serverAdapter};