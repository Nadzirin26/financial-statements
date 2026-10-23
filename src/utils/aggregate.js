import {months} from './format.js';
export function totals(rows){const income=rows.filter(x=>x.type==='income').reduce((a,x)=>a+x.amount,0),expense=rows.filter(x=>x.type==='expense').reduce((a,x)=>a+x.amount,0);return {income,expense,balance:income-expense};}
export const monthly=(rows,year)=>months.map((name,i)=>({name,...totals(rows.filter(x=>x.date.startsWith(`${year}-${String(i+1).padStart(2,'0')}`)))}));
export function byCategory(rows){return Object.entries(rows.filter(x=>x.type==='expense').reduce((a,x)=>{a[x.category]=(a[x.category]||0)+x.amount;return a;},{})).map(([name,value])=>({name,value}));}
