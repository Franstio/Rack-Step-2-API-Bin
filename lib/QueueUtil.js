import Queue from 'bull';
import { config } from 'dotenv';
import client, { readCmd, writeCmd } from '../controllers/PLCUtil.js';
import { UpdateSensor } from '../controllers/ActionSensor.js';
import { io } from '../index.js';

import { ExpressAdapter } from '@bull-board/express';
import {createBullBoard} from '@bull-board/api';
import {BullAdapter} from '@bull-board/api/bullAdapter.js';
config();
const QueuePLC = new Queue('PLC Write Queue');
const QueueConnPLC = new Queue('PLC Connection Tasks Queue');
const SensorObserveQueue = new Queue("Sensors Observation Task Queue");
export const observationDataList =          [
  {address:0,value:1,index:0,name:"Top Sensor"},
  {address:1,value:1,index:1, name:"Bottom Sensor"},
  {address:6,value:1,index:2,name: "Red Lamp"},
  {address:7,value:1,index:3,name:"Yellow Lamp"},
  {address:8,value:1,index:4,name:"Green Lamp"},
  {address:4,value:1,index:5,name:"Top Lock"},
  {address:5,value:1,index:6,name:"Bottom Lock"},
];

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

QueueConnPLC.process( async (job,done)=>{
  try
  {
    await client.connectRTU(process.env.PLC_PORT, { baudRate: 9600 });
    //await client.connectTCP('127.0.0.1',{port:502});
    client.setTimeout(1000);
    done(null,'PLC Connection Opened');
  }
  catch (er){
    done(er?.message||err,"Gagal Koneksi PLC");
    QueueConnPLC.add({type:'plc'},{
        delay: 1500
    });
  }
});
QueuePLC.process(async (job,done)=>{
  if (!client.isOpen)
  {
     QueuePLC.add(job.data,{type:"WR"},{delay:1000,priority:2});
     return; 
  }
  const res = await writeCmd(job.data);
  if (!res.success)
  { 
     QueuePLC.add(job.data,{type:"WR"},{delay:1000,priority:2});
     done(res.msg,null);
  }
  else
    done(null,res.msg)
});
QueuePLC.on('active',(job,result)=>{
    if (!client.open)
       QueueConnPLC.add({id:1});
});
SensorObserveQueue.on('active',(job,result)=>{
    if (!client.open)
       QueueConnPLC.add({id:1});
});
SensorObserveQueue.process(async (job,done)=>{
    if (!client.isOpen)
    {
       done('PLC Connection Not Open',null);
       return; 
    } 
    client.setID(1);
    const response = [];
    for (let i=0;i<observationDataList.length;i++)
    {
      const data = observationDataList[i];
      const res = await readCmd(data.address,data.value);
      response.push({name: data.name,...res});
      UpdateSensor(data.index,res.data[0],io);
    }
    done(null,response);

});

const bullBoard = createBullBoard({
    queues: [new BullAdapter(QueueConnPLC),new BullAdapter(SensorObserveQueue),new BullAdapter(QueuePLC)],
    serverAdapter: serverAdapter,
    options:{
      uiConfig:{
        boardTitle:process.env.NAME
      }
    }
  });
export { QueuePLC,QueueConnPLC,SensorObserveQueue,serverAdapter};