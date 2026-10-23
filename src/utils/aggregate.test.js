import {test} from 'node:test';
import assert from 'node:assert/strict';
import {totals,monthly,byCategory} from './aggregate.js';
const rows=[{type:'income',amount:100,date:'2025-01-01',category:'Gaji'},{type:'expense',amount:30,date:'2025-01-02',category:'Makan'},{type:'expense',amount:20,date:'2025-02-01',category:'Makan'},{type:'expense',amount:70,date:'2026-01-01',category:'Lainnya'}];
test('menghitung saldo dan data kosong',()=>{assert.deepEqual(totals(rows.slice(0,3)),{income:100,expense:50,balance:50});assert.deepEqual(totals([]),{income:0,expense:0,balance:0});});
test('rekap menghasilkan 12 bulan dan memisahkan tahun',()=>{const result=monthly(rows,'2025');assert.equal(result.length,12);assert.equal(result[0].expense,30);assert.equal(result[1].expense,20);assert.equal(result[11].balance,0);});
test('kategori hanya menghitung pengeluaran',()=>assert.deepEqual(byCategory(rows),[{name:'Makan',value:50},{name:'Lainnya',value:70}]));
