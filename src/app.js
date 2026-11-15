import express from 'express';
import { Ledger } from './domain.js';
import { authorized,wrap,errors } from './common.js';
import { PostgresLedger } from './repository.js';

export function createApp(options={}) {
 const app=express();app.use(express.json({limit:'16kb'}));
 const repository=options.repository ?? new PostgresLedger(process.env.DATABASE_URL);const service=new Ledger(repository);
 app.get('/health/live',(_req,res)=>res.json({status:'ok'}));
 app.get('/ready',wrap(async(_req,res)=>{await repository.ready();res.json({status:'ready'});}));
 app.post('/movements',wrap(async(req,res)=>res.status(201).json(await service.add(req.body))));
app.get('/stock/:item',wrap(async(req,res)=>res.json(await service.get(req.params.item))));
 app.use(errors);return {app,close:()=>repository?.close()??Promise.resolve()};
}
