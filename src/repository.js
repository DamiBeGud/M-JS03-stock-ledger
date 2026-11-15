import { Pool } from 'pg';
import { Problem } from './common.js';
export class PostgresLedger {
  constructor(url) { if (!url) throw new Error('DATABASE_URL_required'); this.pool=new Pool({ connectionString:url,max:3,connectionTimeoutMillis:2000 }); }
  async ready() { await this.pool.query('SELECT id FROM movements LIMIT 1'); }
  async add(row) {
    try { await this.pool.query('INSERT INTO movements(id,item,delta) VALUES($1,$2,$3)',[row.id,row.item,row.delta]); }
    catch(e) { if(e.code==='23505') throw new Problem(409,'duplicate_movement'); throw e; }
    return row;
  }
  async get(item) {
    const {rows}=await this.pool.query('SELECT id,item,delta FROM movements WHERE item=$1 ORDER BY id',[item]);
    return { item, balance:rows.reduce((n,r)=>n+r.delta,0), movements:rows };
  }
  close() { return this.pool.end(); }
}
