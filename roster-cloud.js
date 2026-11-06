/* KING master roster: separate Firebase project from scoreboard clock. */
'use strict';
const KING_ADMIN_UID='Y9ob3I1FgFgvhnDjVkQWRLptKPd2';
const kingConfig={apiKey:'AIzaSyAaqyjlYJOoauON9xx-5kq1D3ShOYK2bFA',authDomain:'king-basketball-communit-311a2.firebaseapp.com',databaseURL:'https://king-basketball-communit-311a2-default-rtdb.asia-southeast1.firebasedatabase.app',projectId:'king-basketball-communit-311a2',appId:'1:933317992912:web:b58b234f369c72dd8e59d5'};
const KingCloud={ready:false,user:null,loaded:false,error:'',pending:false,ref:null,initializing:false};
function kingNotice(s){KingCloud.error=s; if(typeof render==='function' && view==='Roster')render();}
function kingRosterUI(){
 const c=KingCloud;
 if(!c.ready)return '<div class="panel"><strong>Roster Cloud</strong><p>Menyiapkan Firebase…</p></div>';
 if(!c.user)return `<div class="panel"><h3>Roster KING · Firebase</h3><p class="muted">Login admin untuk memuat dan mengelola roster permanen. Statistik pertandingan tetap lokal.</p><form id="kingLogin"><label>Email admin<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="primary">Login</button></form><p class="muted">${esc(c.error)}</p></div>`;
 return `<div class="panel"><div class="row between"><strong>Roster KING · ${c.loaded?'Tersinkron Firebase':'Memuat roster…'}</strong>${btn('Logout','king-logout')}</div>${c.error?`<p class="notice">${esc(c.error)}</p>`:''}<p class="muted">Roster disimpan online. Statistik dan riwayat tetap di HP ini.</p></div>`;
}
async function kingStart(){
 try{
  firebase.initializeApp(kingConfig,'king-roster');
  const app=firebase.app('king-roster');KingCloud.auth=app.auth();KingCloud.ref=app.database().ref('kingStats/players');KingCloud.ready=true;
  KingCloud.auth.onAuthStateChanged(async user=>{
   KingCloud.user=user&&user.uid===KING_ADMIN_UID?user:null;KingCloud.loaded=false;
   if(user&&!KingCloud.user){await KingCloud.auth.signOut();kingNotice('Akun ini bukan admin KING.');return}
   if(!KingCloud.user){kingNotice('');return}
   try{
    const snap=await KingCloud.ref.once('value');
    if(!snap.exists()){
     const res=await fetch('./king-roster-seed.json',{cache:'no-store'});if(!res.ok)throw Error('Gagal membaca roster awal');
     const initial=await res.json();await KingCloud.ref.set(Object.fromEntries(initial.map(p=>[p.id,p])));
    }
    KingCloud.ref.on('value',snap=>{
     const v=snap.val()||{};db.roster=Object.values(v).filter(p=>p&&p.id&&p.name).map(p=>({id:String(p.id),name:String(p.name),number:String(p.number??''),active:!!p.active}));
     KingCloud.loaded=true;KingCloud.error='';save();if(view==='Roster'||view==='Live')render();
    },err=>kingNotice('Sinkronisasi gagal: '+err.message));
   }catch(err){kingNotice('Gagal memuat roster: '+err.message)}
  });
 }catch(err){KingCloud.ready=true;kingNotice('Firebase gagal dimuat: '+err.message)}
}
async function kingWritePlayer(p){if(!KingCloud.user||!KingCloud.loaded)throw Error('Login dan tunggu roster Firebase selesai dimuat.');await KingCloud.ref.child(p.id).set(p)}
async function kingRemovePlayer(id){if(!KingCloud.user||!KingCloud.loaded)throw Error('Login dan tunggu roster Firebase selesai dimuat.');await KingCloud.ref.child(id).remove()}
