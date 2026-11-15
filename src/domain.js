import { Problem, identifier, integer } from './common.js';
export class Ledger {
  constructor(repository) { this.repository=repository; }
  async add(input) {
    const row={ id:identifier(input?.id), item:identifier(input?.item), delta:integer(input?.delta,-10000,10000) };
    if (row.delta===0) throw new Problem(400,'zero_movement');
    return this.repository.add(row);
  }
  async get(item) { return this.repository.get(identifier(item)); }
}
