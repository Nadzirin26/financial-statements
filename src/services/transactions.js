import {read,write,userKey} from './storage.js';
import {defaultCategories} from '../data/defaultCategories.js';

const defaultSettings=()=>({categories:structuredClone(defaultCategories),budgets:{}});

// Satu dokumen per akun membuat impor transaksi dan pengaturan atomik.
// Data lama dibaca tanpa dihapus; penulisan berikutnya memakai profil baru.
export function getProfile(id){
  const profile=read(userKey(id,'profile'),null);
  if(profile!==null){
    if(profile.version!==1||!Array.isArray(profile.transactions)||!profile.settings)
      throw Error('Format data lokal tidak dikenali. Data tidak diubah.');
    validateBackup(profile);
    return profile;
  }
  const legacy={version:1,transactions:read(userKey(id,'transactions'),[]),settings:read(userKey(id,'settings'),defaultSettings())};
  validateBackup(legacy);
  return legacy;
}
export const getTransactions=id=>getProfile(id).transactions;
export const getSettings=id=>getProfile(id).settings;
function assertUnchanged(actual,expected){
  if(expected!==undefined&&JSON.stringify(actual)!==JSON.stringify(expected))
    throw Error('Data berubah di tab lain. Muat ulang halaman sebelum menyimpan agar catatan terbaru tidak tertimpa.');
}
export function putTransactions(id,rows,expected){
  const profile=getProfile(id);
  assertUnchanged(profile.transactions,expected);
  if(!rows.every(validateTransaction))throw Error('Transaksi tidak valid. Data tidak diubah.');
  write(userKey(id,'profile'),{...profile,transactions:rows.map(x=>({...x,userId:id}))});
}
export function putSettings(id,settings,expected){
  const profile=getProfile(id);
  assertUnchanged(profile.settings,expected);
  validateBackup({version:1,transactions:[],settings});
  write(userKey(id,'profile'),{...profile,settings});
}
export function importBackup(id,backup,expectedRows,expectedSettings){
  validateBackup(backup);
  const profile=getProfile(id);
  assertUnchanged(profile.transactions,expectedRows);
  assertUnchanged(profile.settings,expectedSettings);
  const transactions=backup.transactions.map(x=>({...x,id:crypto.randomUUID(),userId:id,createdAt:x.createdAt||new Date().toISOString()}));
  const next={version:1,transactions,settings:backup.settings};
  write(userKey(id,'profile'),next);
  return next;
}
export function validateTransaction(x){return x&&['income','expense'].includes(x.type)&&Number.isFinite(x.amount)&&x.amount>0&&typeof x.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&!isNaN(Date.parse(x.date))&&new Date(x.date+'T12:00:00Z').toISOString().slice(0,10)===x.date&&typeof x.category==='string'&&x.category.trim()&&typeof x.description==='string';}
export function validateBackup(b){if(b?.version!==1||!Array.isArray(b.transactions)||!b.transactions.every(validateTransaction)||!b.settings?.categories||!['income','expense'].every(t=>Array.isArray(b.settings.categories[t])&&b.settings.categories[t].length>0&&b.settings.categories[t].every(c=>typeof c==='string'&&c.trim()))||!b.settings.budgets||typeof b.settings.budgets!=='object'||Array.isArray(b.settings.budgets)||!Object.entries(b.settings.budgets).every(([k,v])=>/^\d{4}-(0[1-9]|1[0-2])$/.test(k)&&Number.isFinite(v)&&v>=0))throw Error('Format backup tidak valid.');return b;}
