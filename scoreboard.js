/* Read-only adapter verified against the user-provided balanced-display ZIP. */
(function(root){
 'use strict';
 const databaseURL='https://king-basketball-communit-311a2-default-rtdb.asia-southeast1.firebasedatabase.app';
 function preset(matchId='main',disabled=false){
  if(typeof matchId!=='string'||! /^[a-zA-Z0-9_-]+$/.test(matchId))throw Error('Match ID hanya boleh huruf, angka, _ atau -');
  return {source:'balanced-v114',url:databaseURL,matchId,path:'matches/'+matchId+'/state',clock:'gameSec',quarter:'period',running:'gameRunning',format:'seconds',verified:true,disabled};
 }
 function normalize(raw,at){
  if(!raw||typeof raw!=='object')throw Error('State pertandingan belum tersedia');
  if(typeof raw.gameSec!=='number'||!Number.isFinite(raw.gameSec)||raw.gameSec<0)throw Error('gameSec tidak valid');
  if(!Number.isInteger(raw.period)||raw.period<1||raw.period>20)throw Error('period tidak valid');
  if(typeof raw.gameRunning!=='boolean')throw Error('gameRunning harus boolean');
  if(typeof raw.syncedAt!=='number'||!Number.isFinite(raw.syncedAt)||raw.syncedAt<=0)throw Error('syncedAt tidak valid');
  return {sec:raw.gameSec,q:String(raw.period),running:raw.gameRunning&&raw.timeoutTeam==null&&!raw.breakActive&&!raw.breakPending,sourceAt:raw.syncedAt,at};
 }
 const api={preset,normalize};root.Scoreboard=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
