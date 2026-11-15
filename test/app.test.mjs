import {test} from 'node:test';import assert from 'node:assert/strict';import {once} from 'node:events';
import {createApp} from '../src/app.js';
import {Problem} from '../src/common.js';
test('HTTP domain behavior, boundaries and conflicts',async()=>{

const rows=new Map(); const repository={ready:async()=>{},close:async()=>{},add:async row=>{if(rows.has(row.id))throw new Problem(409,'duplicate_movement');rows.set(row.id,row);return row;},get:async item=>{const movements=[...rows.values()].filter(r=>r.item===item);return {item,movements,balance:movements.reduce((n,r)=>n+r.delta,0)};}};

const runtime=createApp({token:'synthetic-unit-token',repository});const server=runtime.app.listen(0,'127.0.0.1');
try{await once(server,'listening');const base=`http://127.0.0.1:${server.address().port}`;
const request=(method,path,body,auth=true)=>fetch(base+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer synthetic-unit-token'}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
assert.equal((await request('GET','/health/live')).status,200);
assert.equal((await request('POST','/movements',{id:'a',item:'books',delta:7})).status,201);
assert.equal((await request('POST','/movements',{id:'b',item:'books',delta:-2})).status,201);
assert.equal((await request('POST','/movements',{id:'a',item:'books',delta:99})).status,409);
assert.equal((await (await request('GET','/stock/books')).json()).balance,5);
assert.equal((await request('POST','/movements',{id:'c',item:'books',delta:0})).status,400);
}finally{if(server.listening){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}await runtime.close();}
});
