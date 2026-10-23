import {read,write,userKey} from './storage';
import {defaultCategories} from '../data/defaultCategories';
export const getTransactions=id=>read(userKey(id,'transactions'),[]);
export const putTransactions=(id,rows)=>write(userKey(id,'transactions'),rows.map(x=>({...x,userId:id})));
export const getSettings=id=>read(userKey(id,'settings'),{categories:defaultCategories,budgets:{}});
export const putSettings=(id,s)=>write(userKey(id,'settings'),s);
export function validateTransaction(x){return x&&['income','expense'].includes(x.type)&&Number.isFinite(x.amount)&&x.amount>0&&typeof x.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&!isNaN(Date.parse(x.date))&&new Date(x.date+'T12:00:00Z').toISOString().slice(0,10)===x.date&&typeof x.category==='string'&&x.category.trim()&&typeof x.description==='string';}
export function validateBackup(b){if(b?.version!==1||!Array.isArray(b.transactions)||!b.transactions.every(validateTransaction)||!b.settings?.categories||!['income','expense'].every(t=>Array.isArray(b.settings.categories[t])&&b.settings.categories[t].every(c=>typeof c==='string'&&c.trim()))||!b.settings.budgets||typeof b.settings.budgets!=='object'||Array.isArray(b.settings.budgets)||!Object.entries(b.settings.budgets).every(([k,v])=>/^\d{4}-(0[1-9]|1[0-2])$/.test(k)&&Number.isFinite(v)&&v>=0))throw Error('Format backup tidak valid.');return b;}
