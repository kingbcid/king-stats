(function(root){
const keys=['2M','2X','3M','3X','FTM','FTX','OREB','DREB','AST','STL','BLK','TO','PF'];
function totals(s={}){const n=k=>s[k]||0;const pm=n('2M'),px=n('2X'),tm=n('3M'),tx=n('3X'),fm=n('FTM'),fx=n('FTX');return {MIN:s.seconds||0,PTS:pm*2+tm*3+fm,'2PM':pm,'2PA':pm+px,'2P%':pct(pm,pm+px),'3PM':tm,'3PA':tm+tx,'3P%':pct(tm,tm+tx),FTM:fm,FTA:fm+fx,'FT%':pct(fm,fm+fx),FGM:pm+tm,FGA:pm+px+tm+tx,'FG%':pct(pm+tm,pm+px+tm+tx),OREB:n('OREB'),DREB:n('DREB'),REB:n('OREB')+n('DREB'),AST:n('AST'),STL:n('STL'),BLK:n('BLK'),TO:n('TO'),PF:n('PF')};}
function pct(a,b){return b?(a/b*100).toFixed(1):'—'}
function seconds(v,format){if(format==='mm:ss'){if(typeof v!=='string'||!/^\d+:\d{2}(\.\d+)?$/.test(v))throw Error('Clock harus MM:SS');const [m,s]=v.split(':').map(Number);if(s>=60)throw Error('Detik tidak valid');return m*60+s;}if(typeof v!=='number'||!Number.isFinite(v)||v<0)throw Error('Clock numerik tidak valid');return format==='milliseconds'?v/1000:v;}
function delta(a,b){if(!a||a.q!==b.q||!a.running||b.at-a.at>5000||b.at<=a.at)return 0;const d=a.sec-b.sec;if(a.sourceAt!==undefined&&b.sourceAt!==undefined&&(b.sourceAt<a.sourceAt||(b.sourceAt===a.sourceAt&&d!==0)||b.sourceAt-a.sourceAt>5000))return 0;return d>=0&&d<=(b.at-a.at)/1000+1?d:0;}
function addTime(match,d){match.playSeconds=(match.playSeconds||0)+d;for(const id of match.court){match.stats[id]??={};match.stats[id].seconds=(match.stats[id].seconds||0)+d;}}
const api={keys,totals,seconds,delta,addTime};root.CS=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
