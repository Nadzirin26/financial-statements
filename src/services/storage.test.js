import {test,beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import {read,write,userKey} from './storage.js';
import {getTransactions,getSettings,putTransactions,putSettings,importBackup,validateBackup} from './transactions.js';
import {initialize,login,logout,session,changePassword,users,deleteUser} from './auth.js';
import {readFile} from 'node:fs/promises';

let data;
let failWrite=false;
beforeEach(()=>{
  data=new Map();failWrite=false;
  globalThis.localStorage={
    getItem:key=>data.get(key)??null,
    setItem:(key,value)=>{if(failWrite)throw new DOMException('Penuh','QuotaExceededError');data.set(key,value);},
    removeItem:key=>data.delete(key)
  };
});
const row=(amount=25000)=>({id:'one',userId:'a',type:'expense',amount,date:'2026-10-23',category:'Belanja',description:'Beli buku catatan',createdAt:'2026-10-23T10:00:00.000Z'});

test('catatan dan rincian pembelian tetap tersimpan saat dibaca ulang dan logout',async()=>{
  await initialize();await login('user1','user123');
  putTransactions('user1',[row()],[]);logout();
  assert.equal(session(),null);
  assert.equal(getTransactions('user1')[0].description,'Beli buku catatan');
  await login('user1','user123');
  assert.equal(getTransactions('user1')[0].amount,25000);
});
test('data per akun terpisah dan userId mengikuti akun tujuan',()=>{
  putTransactions('a',[row()],[]);
  assert.equal(getTransactions('a')[0].userId,'a');
  assert.deepEqual(getTransactions('b'),[]);
});
test('data versi awal tetap terbaca dan tidak hilang saat format penyimpanan diperbarui',()=>{
  write(userKey('a','transactions'),[row()]);
  const settings=getSettings('a');settings.budgets['2026-10']=100000;
  putSettings('a',settings);
  assert.deepEqual(getTransactions('a'),[row()]);
  assert.equal(getSettings('a').budgets['2026-10'],100000);
});
test('tab dengan data lama tidak dapat menimpa transaksi terbaru',()=>{
  putTransactions('a',[row()],[]);
  const stale=getTransactions('a');
  putTransactions('a',[row(),{...row(10000),id:'two'}],stale);
  assert.throws(()=>putTransactions('a',[],stale),/tab lain/);
  assert.equal(getTransactions('a').length,2);
});
test('tab dengan pengaturan lama tidak dapat menimpa anggaran terbaru',()=>{
  const stale=getSettings('a');
  putSettings('a',{...stale,budgets:{'2026-10':100000}},stale);
  assert.throws(()=>putSettings('a',stale,stale),/tab lain/);
});
test('impor backup atomik: kegagalan kuota mempertahankan transaksi dan pengaturan lama',()=>{
  putTransactions('a',[row()],[]);
  const previous=data.get('catatan:v1:user:a:profile');
  failWrite=true;
  assert.throws(()=>importBackup('a',{version:1,transactions:[row(999)],settings:{...getSettings('a'),budgets:{'2026-10':555}}}),/Penuh/);
  assert.equal(data.get('catatan:v1:user:a:profile'),previous);
});
test('backup diimpor ke akun aktif dan mempertahankan rincian pembelian',()=>{
  const backup={version:1,transactions:[row()],settings:getSettings('a')};
  importBackup('b',backup,[],getSettings('b'));
  assert.equal(getTransactions('b')[0].userId,'b');
  assert.equal(getTransactions('b')[0].description,'Beli buku catatan');
  assert.equal(getTransactions('b')[0].createdAt,row().createdAt);
});
test('backup tidak valid tidak menimpa catatan yang tersimpan',()=>{
  putTransactions('a',[row()],[]);
  assert.throws(()=>importBackup('a',{version:1,transactions:[row(-10)],settings:getSettings('a')}),/tidak valid/);
  assert.equal(getTransactions('a')[0].amount,25000);
  assert.throws(()=>validateBackup({version:1,transactions:[],settings:{categories:{income:[],expense:[]},budgets:{}}}),/tidak valid/);
});
test('data JSON rusak tidak direset atau dihapus otomatis',()=>{
  data.set('catatan:v1:user:a:profile','{rusak');
  assert.throws(()=>getTransactions('a'),/tidak dapat dibaca/);
  assert.equal(data.get('catatan:v1:user:a:profile'),'{rusak');
});
test('akun awal tidak menimpa password pribadi atau transaksi saat inisialisasi berikutnya',async()=>{
  await initialize();
  await changePassword('admin','admin123','Pribadi123!');
  putTransactions('admin',[row()],[]);
  await initialize();
  await assert.rejects(login('admin','admin123'));
  assert.equal((await login('admin','Pribadi123!')).id,'admin');
  assert.equal(getTransactions('admin').length,1);
  const admin=users().find(x=>x.id==='admin');
  assert.equal('password' in admin,false);
  assert.notEqual(admin.hash,'Pribadi123!');
});
test('hapus akun membersihkan data format baru dan lama, admin utama dilindungi',async()=>{
  await initialize();
  putTransactions('user1',[row()],[]);
  write(userKey('user1','transactions'),[row()]);
  deleteUser('user1');
  assert.equal(users().some(x=>x.id==='user1'),false);
  assert.equal(read(userKey('user1','profile'),null),null);
  assert.equal(read(userKey('user1','transactions'),null),null);
  assert.throws(()=>deleteUser('admin'),/tidak dapat dihapus/);
});
test('konfigurasi Vercel mendeklarasikan hasil build Vite dan fallback React Router',async()=>{
  const config=JSON.parse(await readFile(new URL('../../vercel.json',import.meta.url),'utf8'));
  assert.equal(config.framework,'vite');
  assert.equal(config.outputDirectory,'dist');
  assert.deepEqual(config.rewrites,[{source:'/(.*)',destination:'/index.html'}]);
});
