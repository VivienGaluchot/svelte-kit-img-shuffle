var Ft=Object.defineProperty;var St=(i,t,e)=>t in i?Ft(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var C=(i,t,e)=>St(i,typeof t!="symbol"?t+"":t,e);import{s as _t,n as rt,r as Ct,o as Mt,e as B,c as Ot,x as X}from"../chunks/scheduler.CcFN-_cZ.js";import{S as pt,i as xt,e as P,s as G,c as T,a as N,d as D,f as V,v as b,B as S,g as I,h as M,C as et,k as wt,l as Pt,m as yt,n as vt,o as Dt,p as bt,q as kt,D as Y,t as R,b as q,j as $,x as Tt}from"../chunks/index.Csv5Vs4x.js";import{b as It}from"../chunks/paths.DDgW2AlH.js";import{p as Et}from"../chunks/stores.y_NxEH2R.js";import{s as Bt,e as U,u as nt,d as ot,S as zt,i as Nt}from"../chunks/image.D0jFKXzh.js";const Wt=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function L(i,t){return W(i,t,(e,s)=>e+s)}function z(i,t){return W(i,t,(e,s)=>e-s)}function lt(i,t){let e=i;return t.min&&(e=W(e,t.min,Math.max)),t.max&&(e=W(e,t.max,Math.min)),e}function Rt(i,t){return W(i,t,(e,s)=>e/s)}function qt(i,t){return W(i,t,Math.min)}function At(i,t){return W(i,t,Math.max)}function Gt(i){return Vt(i,Math.round)}function A(i,t){return i.x==t.x&&i.y==t.y}function Vt(i,t){return{x:t(i.x),y:t(i.y)}}function W(i,t,e){return{x:e(i.x,t.x),y:e(i.y,t.y)}}function tt(i){const t=new Map;return{call:(...e)=>{const s=JSON.stringify(e),r=t.get(s);if(r)return r;{const a=i(...e);return t.set(s,a),a}},clear:()=>{t.clear()}}}function Lt(i){let t=i.length,e;for(;t!=0;)e=Math.floor(Math.random()*t),t--,[i[t],i[e]]=[i[e],i[t]]}class Ht{constructor(t,e,s){C(this,"matrix");C(this,"initial");C(this,"current");C(this,"drag");this.matrix=s,this.initial={x:t,y:e},this.current={x:t,y:e},this.drag={from:null,to:null}}get rows(){return this.matrix.rows}get cols(){return this.matrix.cols}get image(){return this.matrix.image}isDragFrom(){return this.drag.from!=null}isDragTo(){return this.drag.to!=null}originOrCurrent(){var t,e;return((t=this.drag.from)==null?void 0:t.originCurrent)??((e=this.drag.to)==null?void 0:e.originCurrent)??this.current}getNext(t){return this.matrix.tileByCurrent(L(this.current,t))}isAtInitial(){return A(this.current,this.initial)}isOkWith(t){return A(z(t.current,this.current),z(t.initial,this.initial))}isOkWithNext(t){const e=this.getNext(t);return e?e.isOkWith(this):!0}setDragFrom(t){if(this.drag.from!=null)throw new Error("setDragFrom: from already set");if(this.drag.to!=null)throw new Error("setDragFrom: to already set");if(!this.matrix.options.getSlotPos(this.current,this.cols))throw new Error("setDragFrom: slot not found");this.drag.from={originCurrent:this.current,originMouse:t,pullOffset:{x:0,y:0}}}updateDragFrom(t){if(this.drag.from==null)throw new Error("updateDragFrom: from unset");const e=z(t,this.drag.from.originMouse);this.drag.from.pullOffset=e}unsetDragFrom(){if(this.drag.from==null)throw new Error("unsetDragFrom: from unset");this.drag.from=null}setDragTo(){if(this.drag.from!=null)throw new Error("setDragTo: from already set");if(this.drag.to!=null)throw new Error("setDragTo: to already set");this.drag.to={originCurrent:this.current}}unsetDragTo(){if(this.drag.to==null)throw new Error("unsetDragTo: to unset");this.current=this.drag.to.originCurrent,this.drag.to=null}cancelDrag(){this.drag.from&&(this.current=this.drag.from.originCurrent,this.unsetDragFrom()),this.drag.to&&this.unsetDragTo()}style(){var u,n,g;const t=this.matrix.options.getGridSize(),e=this.matrix.options.getSlotPos(this.initial,this.cols);let s;this.isDragFrom()?s=this.originOrCurrent():s=this.current;const r=this.matrix.options.getSlotPos(s,this.cols),a=this.matrix.options.getSlotSize(s,this.cols);if(t&&e&&r&&a){let o={...e};o.x=Math.min(o.x,t.x-a.x),o.x=Math.max(o.x,0),o.x=o.x*-1,o.y=Math.min(o.y,t.y-a.y),o.y=Math.max(o.y,0),o.y=o.y*-1;const p=t;return`left: ${r.x+(((u=this.drag.from)==null?void 0:u.pullOffset.x)??0)}px; top: ${r.y+(((g=(n=this.drag.from)==null?void 0:n.pullOffset)==null?void 0:g.y)??0)}px; width: ${a.x}px; height: ${a.y}px;background-image: url(${this.image.url}); background-position: ${o.x}px ${o.y}px; background-size: ${p.x}px ${p.y}px ; `}}}function Xt(i){const[t,...e]=i;if(t){const s={min:t.current,max:t.current};for(const r of e)s.min=qt(s.min,r.current),s.max=At(s.max,r.current);return s}else return null}const it={x:0,y:-1},j={x:0,y:1},st={x:-1,y:0},J={x:1,y:0},Yt=[it,j,st,J];class Ut{constructor(t){C(this,"options");C(this,"rows");C(this,"cols");C(this,"matrix",[]);C(this,"bounds");C(this,"dragFrom",null);this.options=t;let e=Bt(t.image.size,t.tileCount);this.cols=e.x,this.rows=e.y,this.matrix=[];for(let s=0;s<this.rows;s++)for(let r=0;r<this.cols;r++)this.matrix.push(new Ht(r,s,this));this.bounds={min:{x:0,y:0},max:{x:this.cols-1,y:this.rows-1}}}get image(){return this.options.image}*tiles(){for(const t of this.matrix)yield t}tileGroup(t){const e=new Set;function s(r){if(!e.has(r)){e.add(r);for(const a of Yt){const u=r.getNext(a);u&&r.isOkWith(u)&&s(u)}}}return s(t),e}tileByInitial(t){return this.isInRange(t)?this.matrix[t.y*this.cols+t.x]:null}isInRange(t){return t.x>=0&&t.x<this.cols&&t.y>=0&&t.y<this.rows}tileByCurrent(t){for(const e of this.matrix)if(A(e.current,t))return e;return null}tileByOriginCurrent(t){for(const e of this.matrix)if(A(e.originOrCurrent(),t))return e;return null}style(){return`aspect-ratio: ${this.image.size.x} / ${this.image.size.y}; grid-template-columns: repeat(${this.cols}, 1fr);`}shuffle(){const t=[...this.matrix.map(e=>({...e.current}))];Lt(t);for(const e in this.matrix)this.matrix[e].current=t[e]}solveDrag(t,e){const s=[];if(e.x!=0||e.y!=0){const r=[];for(const a of t){const u=L(a.current,e);if(!this.isInRange(u))return[];r.push({pos:u,tile:a})}for(const{pos:a,tile:u}of r){s.push({tile:u,pos:a,isDragTo:!1});const n=this.tileByOriginCurrent(a);if(n&&!t.includes(n)){let g,o,p=u,x=0;do{g=p.originOrCurrent(),o=!0;for(const{pos:k,tile:y}of r)if(A(k,g)){o=!1,p=y;break}if(x++,x>1e3)throw new Error("infinite loop")}while(!o);s.push({tile:n,pos:g,isDragTo:!0})}}}return s}isSolved(){for(const t of this.matrix)if(!t.isAtInitial())return!1;return!0}setDragFrom(t,e){const s=this.tileByOriginCurrent(t);if(s){const r=[...this.tileGroup(s)],a=Xt(r);if(a==null)throw new Error("setDragFrom: boundingBox null");const u={min:z(this.bounds.min,a.min),max:z(this.bounds.max,a.max)};this.dragFrom={startClient:e,startPos:t,currentPos:t,tiles:r,dragActions:[],startOffsetBoundingBox:u},r.map(n=>n.setDragFrom(e))}}isDragging(){return this.dragFrom!=null}dragUpdate(t){var s;const e=this.options.getSlotSize(this.matrix[0].current,this.cols);if(e&&this.dragFrom){const r=z(t,this.dragFrom.startClient),a=lt(Gt(Rt(r,e)),this.dragFrom.startOffsetBoundingBox),u=lt(L(this.dragFrom.startPos,a),this.bounds),n=z(u,this.dragFrom.currentPos);this.dragFrom.currentPos=u;const g=this.solveDrag(this.dragFrom.tiles,n);g.length!=0&&(this.dragFrom.dragActions.map(o=>{o.isDragTo&&o.tile.unsetDragTo()}),this.dragFrom.dragActions=g,this.dragFrom.dragActions.map(o=>{o.isDragTo?o.tile.setDragTo():o.tile.updateDragFrom(t),o.tile.current=o.pos})),(s=this.dragFrom)==null||s.tiles.map(o=>{o.updateDragFrom(t)})}}unsetDragFrom(t){var s,r,a,u;let e;return t&&((s=this.dragFrom)!=null&&s.startPos)&&!A((r=this.dragFrom)==null?void 0:r.startPos,t)?e=!0:e=!1,(a=this.dragFrom)==null||a.tiles.map(n=>n.unsetDragFrom()),(u=this.dragFrom)==null||u.dragActions.map(n=>{n.isDragTo&&n.tile.unsetDragTo(),n.tile.current=n.pos}),this.dragFrom=null,e}cancelDrag(){this.matrix.forEach(t=>t.cancelDrag()),this.dragFrom=null}}const{window:at}=Wt;function ut(i,t,e){const s=i.slice();return s[20]=t[e],s}function ft(i,t,e){const s=i.slice();return s[20]=t[e],s[23]=t,s[24]=e,s}function ct(i,t){let e,s,r,a=t[24];const u=()=>t[14](e,a),n=()=>t[14](null,a);return{key:i,first:null,c(){e=P("div"),this.h()},l(g){e=T(g,"DIV",{class:!0,"data-pos-x":!0,"data-pos-y":!0}),N(e).forEach(D),this.h()},h(){b(e,"class","slot svelte-411q9w"),b(e,"data-pos-x",s=t[20].initial.x),b(e,"data-pos-y",r=t[20].initial.y),this.first=e},m(g,o){I(g,e,o),u()},p(g,o){t=g,o&8&&s!==(s=t[20].initial.x)&&b(e,"data-pos-x",s),o&8&&r!==(r=t[20].initial.y)&&b(e,"data-pos-y",r),a!==t[24]&&(n(),a=t[24],u())},d(g){g&&D(e),n()}}}function ht(i,t){let e,s,r,a;return{key:i,first:null,c(){e=P("div"),this.h()},l(u){e=T(u,"DIV",{class:!0,style:!0}),N(e).forEach(D),this.h()},h(){b(e,"class","tile svelte-411q9w"),b(e,"style",s=t[20].style()),S(e,"drag-from",t[20].isDragFrom()),S(e,"top-ok",t[20].isOkWithNext(it)),S(e,"bottom-ok",t[20].isOkWithNext(j)),S(e,"left-ok",t[20].isOkWithNext(st)),S(e,"right-ok",t[20].isOkWithNext(J)),this.first=e},m(u,n){I(u,e,n),r||(a=et(e,"mousedown",t[4]),r=!0)},p(u,n){t=u,n&8&&s!==(s=t[20].style())&&b(e,"style",s),n&8&&S(e,"drag-from",t[20].isDragFrom()),n&8&&S(e,"top-ok",t[20].isOkWithNext(it)),n&8&&S(e,"bottom-ok",t[20].isOkWithNext(j)),n&8&&S(e,"left-ok",t[20].isOkWithNext(st)),n&8&&S(e,"right-ok",t[20].isOkWithNext(J))},d(u){u&&D(e),r=!1,a()}}}function jt(i){let t,e,s=[],r=new Map,a,u,n=[],g=new Map,o,p,x=U([...i[3].tiles()]);const k=h=>h[20];for(let h=0;h<x.length;h+=1){let m=ft(i,x,h),_=k(m);r.set(_,s[h]=ct(_,m))}let y=U([...i[3].tiles()]);const v=h=>h[20];for(let h=0;h<y.length;h+=1){let m=ut(i,y,h),_=v(m);g.set(_,n[h]=ht(_,m))}return{c(){t=P("div"),e=P("div");for(let h=0;h<s.length;h+=1)s[h].c();u=G();for(let h=0;h<n.length;h+=1)n[h].c();this.h()},l(h){t=T(h,"DIV",{class:!0});var m=N(t);e=T(m,"DIV",{class:!0,style:!0});var _=N(e);for(let c=0;c<s.length;c+=1)s[c].l(_);_.forEach(D),u=V(m);for(let c=0;c<n.length;c+=1)n[c].l(m);m.forEach(D),this.h()},h(){b(e,"class","grid svelte-411q9w"),b(e,"style",a=i[3].style()),b(t,"class","stack svelte-411q9w"),S(t,"show-borders",i[0])},m(h,m){I(h,t,m),M(t,e);for(let _=0;_<s.length;_+=1)s[_]&&s[_].m(e,null);i[15](e),M(t,u);for(let _=0;_<n.length;_+=1)n[_]&&n[_].m(t,null);o||(p=[et(at,"mouseup",i[6]),et(at,"mousemove",i[5])],o=!0)},p(h,[m]){m&10&&(x=U([...h[3].tiles()]),s=nt(s,m,k,1,h,x,r,e,ot,ct,null,ft)),m&8&&a!==(a=h[3].style())&&b(e,"style",a),m&24&&(y=U([...h[3].tiles()]),n=nt(n,m,v,1,h,y,g,t,ot,ht,null,ut)),m&1&&S(t,"show-borders",h[0])},i:rt,o:rt,d(h){h&&D(t);for(let m=0;m<s.length;m+=1)s[m].d();i[15](null);for(let m=0;m<n.length;m+=1)n[m].d();o=!1,Ct(p)}}}function Jt(i){if(i.dataset.posX&&i.dataset.posY){const t=Number(i.dataset.posX),e=Number(i.dataset.posY);return{x:t,y:e}}else return null}function gt(i){for(const t of document.elementsFromPoint(i.x,i.y))if(t instanceof HTMLElement){const e=Jt(t);if(e)return e}return null}function Zt(i,t,e){let{tileCount:s}=t,{image:r}=t,{showBorders:a}=t,{actionCount:u=0}=t,{rows:n=0}=t,{cols:g=0}=t,{isSolved:o=!1}=t;const p=[];let x;const k=tt(()=>x?{x:x.offsetWidth,y:x.offsetHeight}:null),y=tt((l,d)=>{if(p.length>0){if(l.x>=d)return null;const f=l.y*d+l.x;if(f>=0&&f<p.length)return{x:p[f].offsetLeft,y:p[f].offsetTop}}return null}),v=tt((l,d)=>{if(p.length>0){const f=y.call(l,d),w=y.call(L(l,J),d),F=y.call(L(l,j),d),O=l.y*d+l.x;if(O<0||O>=p.length)return null;const Q={x:p[O].offsetWidth,y:p[O].offsetHeight};return f&&w&&(Q.x=w.x-f.x),f&&F&&(Q.y=F.y-f.y),Q}return null});function h(l){if(!o)if(c.isDragging())c.cancelDrag(),e(3,c);else{const d={x:l.clientX,y:l.clientY},f=gt(d);f&&(c.setDragFrom(f,d),e(3,c))}}function m(l){if(o||!c.isDragging())return;const d={x:l.clientX,y:l.clientY};c.dragUpdate(d),e(3,c)}function _(l){if(o||!c.isDragging())return;const d={x:l.clientX,y:l.clientY},f=gt(d);c.unsetDragFrom(f)&&e(7,u+=1),e(3,c),e(10,o=c.isSolved())}let c=new Ut({tileCount:s,image:r,getGridSize:k.call,getSlotPos:y.call,getSlotSize:v.call});c.shuffle();function Z(){c.shuffle(),e(3,c),e(10,o=c.isSolved())}function H(){k.clear(),y.clear(),v.clear(),e(3,c)}Mt(()=>(e(3,c),e(10,o=c.isSolved()),e(8,n=c.rows),e(9,g=c.cols),window.addEventListener("resize",H),()=>{window.removeEventListener("resize",H)}));function K(l,d){B[l?"unshift":"push"](()=>{p[d]=l,e(1,p)})}function E(l){B[l?"unshift":"push"](()=>{x=l,e(2,x)})}return i.$$set=l=>{"tileCount"in l&&e(11,s=l.tileCount),"image"in l&&e(12,r=l.image),"showBorders"in l&&e(0,a=l.showBorders),"actionCount"in l&&e(7,u=l.actionCount),"rows"in l&&e(8,n=l.rows),"cols"in l&&e(9,g=l.cols),"isSolved"in l&&e(10,o=l.isSolved)},[a,p,x,c,h,m,_,u,n,g,o,s,r,Z,K,E]}class Kt extends pt{constructor(t){super(),xt(this,t,Zt,jt,_t,{tileCount:11,image:12,showBorders:0,actionCount:7,rows:8,cols:9,isSolved:10,shuffle:13})}get shuffle(){return this.$$.ctx[13]}}function mt(i){let t,e=`Solved ✨ <a href="${It+"/"}">Play again</a>`;return{c(){t=P("div"),t.innerHTML=e},l(s){t=T(s,"DIV",{"data-svelte-h":!0}),Tt(t)!=="svelte-1gkzpfp"&&(t.innerHTML=e)},m(s,r){I(s,t,r)},d(s){s&&D(t)}}}function dt(i){let t;return{c(){t=R("s")},l(e){t=q(e,"s")},m(e,s){I(e,t,s)},d(e){e&&D(t)}}}function Qt(i){let t,e,s,r,a,u,n,g,o,p,x,k,y,v,h,m,_;function c(f){i[9](f)}function Z(f){i[10](f)}function H(f){i[11](f)}function K(f){i[12](f)}let E={showBorders:i[7],tileCount:i[5],image:i[6]};i[1]!==void 0&&(E.rows=i[1]),i[2]!==void 0&&(E.cols=i[2]),i[0]!==void 0&&(E.actionCount=i[0]),i[3]!==void 0&&(E.isSolved=i[3]),t=new Kt({props:E}),i[8](t),B.push(()=>Y(t,"rows",c)),B.push(()=>Y(t,"cols",Z)),B.push(()=>Y(t,"actionCount",H)),B.push(()=>Y(t,"isSolved",K));let l=i[3]&&mt(),d=i[0]>1&&dt();return{c(){wt(t.$$.fragment),u=G(),n=P("div"),g=P("div"),o=R(i[1]),p=R(" x "),x=R(i[2]),k=G(),l&&l.c(),y=G(),v=P("div"),h=R(i[0]),m=R(" move"),d&&d.c(),this.h()},l(f){yt(t.$$.fragment,f),u=V(f),n=T(f,"DIV",{class:!0});var w=N(n);g=T(w,"DIV",{class:!0});var F=N(g);o=q(F,i[1]),p=q(F," x "),x=q(F,i[2]),F.forEach(D),k=V(w),l&&l.l(w),y=V(w),v=T(w,"DIV",{class:!0});var O=N(v);h=q(O,i[0]),m=q(O," move"),d&&d.l(O),O.forEach(D),w.forEach(D),this.h()},h(){b(g,"class","muted svelte-cx25hv"),b(v,"class","muted svelte-cx25hv"),b(n,"class","toolbar svelte-cx25hv")},m(f,w){vt(t,f,w),I(f,u,w),I(f,n,w),M(n,g),M(g,o),M(g,p),M(g,x),M(n,k),l&&l.m(n,null),M(n,y),M(n,v),M(v,h),M(v,m),d&&d.m(v,null),_=!0},p(f,w){const F={};!e&&w&2&&(e=!0,F.rows=f[1],X(()=>e=!1)),!s&&w&4&&(s=!0,F.cols=f[2],X(()=>s=!1)),!r&&w&1&&(r=!0,F.actionCount=f[0],X(()=>r=!1)),!a&&w&8&&(a=!0,F.isSolved=f[3],X(()=>a=!1)),t.$set(F),(!_||w&2)&&$(o,f[1]),(!_||w&4)&&$(x,f[2]),f[3]?l||(l=mt(),l.c(),l.m(n,y)):l&&(l.d(1),l=null),(!_||w&1)&&$(h,f[0]),f[0]>1?d||(d=dt(),d.c(),d.m(v,null)):d&&(d.d(1),d=null)},i(f){_||(Dt(t.$$.fragment,f),_=!0)},o(f){bt(t.$$.fragment,f),_=!1},d(f){f&&(D(u),D(n)),i[8](null),kt(t,f),l&&l.d(),d&&d.d()}}}function $t(i){let t,e,s;return e=new zt({props:{$$slots:{default:[Qt]},$$scope:{ctx:i}}}),{c(){t=G(),wt(e.$$.fragment),this.h()},l(r){Pt("svelte-66crdv",document.head).forEach(D),t=V(r),yt(e.$$.fragment,r),this.h()},h(){document.title="Play - Picture slicer"},m(r,a){I(r,t,a),vt(e,r,a),s=!0},p(r,[a]){const u={};a&32799&&(u.$$scope={dirty:a,ctx:r}),e.$set(u)},i(r){s||(Dt(e.$$.fragment,r),s=!0)},o(r){bt(e.$$.fragment,r),s=!1},d(r){r&&D(t),kt(e,r)}}}function te(i,t,e){let s;Ot(i,Et,c=>e(13,s=c));const r=parseInt(s.url.searchParams.get("n")??"100"),a=parseInt(s.url.searchParams.get("i")??"0"),u=Nt[a];let n,g,o,p,x,k;function y(c){B[c?"unshift":"push"](()=>{x=c,e(4,x)})}function v(c){g=c,e(1,g)}function h(c){o=c,e(2,o)}function m(c){n=c,e(0,n)}function _(c){p=c,e(3,p)}return[n,g,o,p,x,r,u,k,y,v,h,m,_]}class le extends pt{constructor(t){super(),xt(this,t,te,$t,_t,{})}}export{le as component};
