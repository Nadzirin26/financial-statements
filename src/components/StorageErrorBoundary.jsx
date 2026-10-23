import {Component} from 'react';

export default class StorageErrorBoundary extends Component{
  state={error:null};
  static getDerivedStateFromError(error){return {error};}
  render(){
    if(!this.state.error)return this.props.children;
    return <main className="storage-error"><section className="panel">
      <h1>Catatan belum dapat dibuka</h1>
      <p>{this.state.error.message}</p>
      <p>Data yang sudah tersimpan tidak dihapus atau direset otomatis. Jangan bersihkan data situs. Coba muat ulang halaman atau periksa izin penyimpanan browser.</p>
      <button className="primary" onClick={()=>location.reload()}>Muat ulang halaman</button>
    </section></main>;
  }
}
