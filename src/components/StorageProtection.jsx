import {useEffect,useState} from 'react';
import {persistenceStatus,requestPersistence} from '../services/persistence';
import {changePassword} from '../services/auth';

export default function StorageProtection({user,notify}){
  const [status,setStatus]=useState('loading');
  const [busy,setBusy]=useState(false);
  useEffect(()=>{persistenceStatus().then(setStatus);},[]);
  const descriptions={
    loading:'Memeriksa dukungan browser…',
    granted:'Perlindungan penyimpanan telah diizinkan browser.',
    prompt:'Browser belum memberikan perlindungan penyimpanan persisten.',
    denied:'Browser belum mengizinkan penyimpanan persisten. Data tetap tersimpan secara lokal; ekspor backup secara rutin.',
    unsupported:'Browser ini tidak menyediakan fitur perlindungan penyimpanan persisten. Gunakan backup JSON secara rutin.'
  };
  return <div className="two-columns">
    <section className="panel">
      <h2>Perlindungan data lokal</h2>
      <p>Catatan dan rincian belanja disimpan di browser ini tanpa masa kedaluwarsa. Keluar akun, refresh, atau pembaruan aplikasi tidak menghapus transaksi.</p>
      <p role="status">{descriptions[status]}</p>
      <button className="secondary" disabled={busy||['loading','granted','unsupported'].includes(status)} onClick={async()=>{
        setBusy(true);
        const next=await requestPersistence();
        setStatus(next);
        setBusy(false);
        notify(next==='granted'?'Perlindungan penyimpanan diaktifkan. Tetap simpan backup JSON.':descriptions[next]);
      }}>{busy?'Meminta izin…':'Lindungi penyimpanan lokal'}</button>
      <p>Izin ini membantu melindungi data dari pembersihan otomatis oleh browser, tetapi tidak dapat mencegah penghapusan data situs secara manual, kerusakan perangkat, atau kehilangan data di mode privat.</p>
      <p>Gunakan alamat produksi Vercel yang sama setiap kali mencatat. Data localhost, alamat preview, domain berbeda, dan perangkat lain terpisah. Pindahkan dengan Export Backup dan Import Backup.</p>
    </section>
    <section className="panel">
      <h2>Ganti kata sandi pribadi</h2>
      <p>Ubah kata sandi awal sebelum mulai menggunakan akun untuk catatan pribadimu.</p>
      <form onSubmit={async e=>{
        e.preventDefault();
        const form=e.currentTarget;
        const data=new FormData(form);
        if(data.get('new')!==data.get('repeat'))return notify('Konfirmasi kata sandi baru belum cocok.');
        setBusy(true);
        try{await changePassword(user.id,data.get('current'),data.get('new'));form.reset();notify('Kata sandi berhasil diganti.');}
        catch(error){notify(error.message);}
        finally{setBusy(false);}
      }}>
        <label>Kata sandi saat ini<input name="current" type="password" autoComplete="current-password" required/></label>
        <label>Kata sandi baru<input name="new" type="password" minLength={8} autoComplete="new-password" required/></label>
        <label>Ulangi kata sandi baru<input name="repeat" type="password" minLength={8} autoComplete="new-password" required/></label>
        <button className="primary" disabled={busy}>Simpan kata sandi</button>
      </form>
    </section>
  </div>;
}
