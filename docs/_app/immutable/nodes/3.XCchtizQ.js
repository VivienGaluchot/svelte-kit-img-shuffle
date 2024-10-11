var Tt=Object.defineProperty;var Et=(i,t,e)=>t in i?Tt(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var z=(i,t,e)=>Et(i,typeof t!="symbol"?t+"":t,e);import{s as St,n as ct,r as Bt,o as zt,e as A,c as Nt,x as K}from"../chunks/scheduler.CcFN-_cZ.js";import{S as bt,i as kt,e as G,s as tt,c as V,a as X,d as k,f as et,v as O,B as P,g as L,h as M,C as at,k as Ft,l as Wt,m as Ct,n as It,o as Mt,p as Ot,q as Pt,D as Q,t as N,b as W,j as $,x as Rt}from"../chunks/index.Csv5Vs4x.js";import{b as qt}from"../chunks/paths.DvnS56CS.js";import{p as At}from"../chunks/stores.ChfJvek2.js";import{s as Gt,e as st,u as ht,d as gt,S as Vt,i as Lt}from"../chunks/image.D0jFKXzh.js";const Ht=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function it(i,t){return Y(i,t,(e,r)=>e+r)}function H(i,t){return Y(i,t,(e,r)=>e-r)}function dt(i,t){let e=i;return t.min&&(e=Y(e,t.min,Math.max)),t.max&&(e=Y(e,t.max,Math.min)),e}function Xt(i,t){return Y(i,t,(e,r)=>e/r)}function Yt(i,t){return Y(i,t,Math.min)}function Ut(i,t){return Y(i,t,Math.max)}function jt(i){return Jt(i,Math.round)}function j(i,t){return i.x==t.x&&i.y==t.y}function Jt(i,t){return{x:t(i.x),y:t(i.y)}}function Y(i,t,e){return{x:e(i.x,t.x),y:e(i.y,t.y)}}function lt(i){const t=new Map;return{call:(...e)=>{const r=JSON.stringify(e),s=t.get(r);if(s)return s;{const l=i(...e);return t.set(r,l),l}},clear:()=>{t.clear()}}}function Zt(i){let t=i.length,e;for(;t!=0;)e=Math.floor(Math.random()*t),t--,[i[t],i[e]]=[i[e],i[t]]}class Kt{constructor(t,e,r){z(this,"matrix");z(this,"initial");z(this,"current");z(this,"drag");this.matrix=r,this.initial={x:t,y:e},this.current={x:t,y:e},this.drag={from:null,to:null}}get rows(){return this.matrix.rows}get cols(){return this.matrix.cols}get image(){return this.matrix.image}isDragFrom(){return this.drag.from!=null}isDragTo(){return this.drag.to!=null}originOrCurrent(){var t,e;return((t=this.drag.from)==null?void 0:t.originCurrent)??((e=this.drag.to)==null?void 0:e.originCurrent)??this.current}getNext(t){return this.matrix.tileByCurrent(it(this.current,t))}isAtInitial(){return j(this.current,this.initial)}isOkWith(t){return j(H(t.current,this.current),H(t.initial,this.initial))}isOkWithNext(t){const e=this.getNext(t);return e?e.isOkWith(this):!0}setDragFrom(t){if(this.drag.from!=null)throw new Error("setDragFrom: from already set");if(this.drag.to!=null)throw new Error("setDragFrom: to already set");if(!this.matrix.options.getSlotPos(this.current,this.cols))throw new Error("setDragFrom: slot not found");this.drag.from={originCurrent:this.current,originMouse:t,pullOffset:{x:0,y:0}}}updateDragFrom(t){if(this.drag.from==null)throw new Error("updateDragFrom: from unset");const e=H(t,this.drag.from.originMouse);this.drag.from.pullOffset=e}unsetDragFrom(){if(this.drag.from==null)throw new Error("unsetDragFrom: from unset");this.drag.from=null}setDragTo(){if(this.drag.from!=null)throw new Error("setDragTo: from already set");if(this.drag.to!=null)throw new Error("setDragTo: to already set");this.drag.to={originCurrent:this.current}}unsetDragTo(){if(this.drag.to==null)throw new Error("unsetDragTo: to unset");this.current=this.drag.to.originCurrent,this.drag.to=null}cancelDrag(){this.drag.from&&(this.current=this.drag.from.originCurrent,this.unsetDragFrom()),this.drag.to&&this.unsetDragTo()}style(){var u,n,c;const t=this.matrix.options.getGridSize(),e=this.matrix.options.getSlotPos(this.initial,this.cols);let r;this.isDragFrom()?r=this.originOrCurrent():r=this.current;const s=this.matrix.options.getSlotPos(r,this.cols),l=this.matrix.options.getSlotSize(r,this.cols);if(t&&e&&s&&l){let o={...e};o.x=Math.min(o.x,t.x-l.x),o.x=Math.max(o.x,0),o.x=o.x*-1,o.y=Math.min(o.y,t.y-l.y),o.y=Math.max(o.y,0),o.y=o.y*-1;const m=t;return`left: ${s.x+(((u=this.drag.from)==null?void 0:u.pullOffset.x)??0)}px; top: ${s.y+(((c=(n=this.drag.from)==null?void 0:n.pullOffset)==null?void 0:c.y)??0)}px; width: ${l.x}px; height: ${l.y}px;background-image: url(${this.image.url}); background-position: ${o.x}px ${o.y}px; background-size: ${m.x}px ${m.y}px ; `}}}function Qt(i){const[t,...e]=i;if(t){const r={min:t.current,max:t.current};for(const s of e)r.min=Yt(r.min,s.current),r.max=Ut(r.max,s.current);return r}else return null}const ut={x:0,y:-1},nt={x:0,y:1},ft={x:-1,y:0},ot={x:1,y:0},$t=[ut,nt,ft,ot];class te{constructor(t){z(this,"options");z(this,"rows");z(this,"cols");z(this,"matrix",[]);z(this,"bounds");z(this,"dragFrom",null);this.options=t;let e=Gt(t.image.size,t.tileCount);this.cols=e.x,this.rows=e.y,this.matrix=[];for(let r=0;r<this.rows;r++)for(let s=0;s<this.cols;s++)this.matrix.push(new Kt(s,r,this));this.bounds={min:{x:0,y:0},max:{x:this.cols-1,y:this.rows-1}}}get image(){return this.options.image}*tiles(){for(const t of this.matrix)yield t}tileGroup(t){const e=new Set;function r(s){if(!e.has(s)){e.add(s);for(const l of $t){const u=s.getNext(l);u&&s.isOkWith(u)&&r(u)}}}return r(t),e}tileByInitial(t){return this.isInRange(t)?this.matrix[t.y*this.cols+t.x]:null}isInRange(t){return t.x>=0&&t.x<this.cols&&t.y>=0&&t.y<this.rows}tileByCurrent(t){for(const e of this.matrix)if(j(e.current,t))return e;return null}tileByOriginCurrent(t){for(const e of this.matrix)if(j(e.originOrCurrent(),t))return e;return null}style(){return`aspect-ratio: ${this.image.size.x} / ${this.image.size.y}; grid-template-columns: repeat(${this.cols}, 1fr);`}shuffle(){const t=[...this.matrix.map(e=>({...e.current}))];Zt(t);for(const e in this.matrix)this.matrix[e].current=t[e]}solveDrag(t,e){const r=[];if(e.x!=0||e.y!=0){const s=[];for(const l of t){const u=it(l.current,e);if(!this.isInRange(u))return[];s.push({pos:u,tile:l})}for(const{pos:l,tile:u}of s){r.push({tile:u,pos:l,isDragTo:!1});const n=this.tileByOriginCurrent(l);if(n&&!t.includes(n)){let c,o,m=u,_=0;do{c=m.originOrCurrent(),o=!0;for(const{pos:x,tile:F}of s)if(j(x,c)){o=!1,m=F;break}if(_++,_>1e3)throw new Error("infinite loop")}while(!o);r.push({tile:n,pos:c,isDragTo:!0})}}}return r}isSolved(){for(const t of this.matrix)if(!t.isAtInitial())return!1;return!0}setDragFrom(t,e){const r=this.tileByOriginCurrent(t);if(r){const s=[...this.tileGroup(r)],l=Qt(s);if(l==null)throw new Error("setDragFrom: boundingBox null");const u={min:H(this.bounds.min,l.min),max:H(this.bounds.max,l.max)};this.dragFrom={startClient:e,startPos:t,currentPos:t,tiles:s,dragActions:[],startOffsetBoundingBox:u},s.map(n=>n.setDragFrom(e))}}isDragging(){return this.dragFrom!=null}dragUpdate(t){var r;const e=this.options.getSlotSize(this.matrix[0].current,this.cols);if(e&&this.dragFrom){const s=H(t,this.dragFrom.startClient),l=dt(jt(Xt(s,e)),this.dragFrom.startOffsetBoundingBox),u=dt(it(this.dragFrom.startPos,l),this.bounds),n=H(u,this.dragFrom.currentPos);this.dragFrom.currentPos=u;const c=this.solveDrag(this.dragFrom.tiles,n);c.length!=0&&(this.dragFrom.dragActions.map(o=>{o.isDragTo&&o.tile.unsetDragTo()}),this.dragFrom.dragActions=c,this.dragFrom.dragActions.map(o=>{o.isDragTo?o.tile.setDragTo():o.tile.updateDragFrom(t),o.tile.current=o.pos})),(r=this.dragFrom)==null||r.tiles.map(o=>{o.updateDragFrom(t)})}}unsetDragFrom(t){var r,s,l,u;let e;return t&&((r=this.dragFrom)!=null&&r.startPos)&&!j((s=this.dragFrom)==null?void 0:s.startPos,t)?e=!0:e=!1,(l=this.dragFrom)==null||l.tiles.map(n=>n.unsetDragFrom()),(u=this.dragFrom)==null||u.dragActions.map(n=>{n.isDragTo&&n.tile.unsetDragTo(),n.tile.current=n.pos}),this.dragFrom=null,e}cancelDrag(){this.matrix.forEach(t=>t.cancelDrag()),this.dragFrom=null}}const{window:mt}=Ht;function _t(i,t,e){const r=i.slice();return r[22]=t[e],r}function pt(i,t,e){const r=i.slice();return r[22]=t[e],r[25]=t,r[26]=e,r}function wt(i,t){let e,r,s,l=t[26];const u=()=>t[15](e,l),n=()=>t[15](null,l);return{key:i,first:null,c(){e=G("div"),this.h()},l(c){e=V(c,"DIV",{class:!0,"data-pos-x":!0,"data-pos-y":!0}),X(e).forEach(k),this.h()},h(){O(e,"class","slot svelte-411q9w"),O(e,"data-pos-x",r=t[22].initial.x),O(e,"data-pos-y",s=t[22].initial.y),this.first=e},m(c,o){L(c,e,o),u()},p(c,o){t=c,o&8&&r!==(r=t[22].initial.x)&&O(e,"data-pos-x",r),o&8&&s!==(s=t[22].initial.y)&&O(e,"data-pos-y",s),l!==t[26]&&(n(),l=t[26],u())},d(c){c&&k(e),n()}}}function vt(i,t){let e,r,s,l;return{key:i,first:null,c(){e=G("div"),this.h()},l(u){e=V(u,"DIV",{class:!0,style:!0}),X(e).forEach(k),this.h()},h(){O(e,"class","tile svelte-411q9w"),O(e,"style",r=t[22].style()),P(e,"drag-from",t[22].isDragFrom()),P(e,"top-ok",t[22].isOkWithNext(ut)),P(e,"bottom-ok",t[22].isOkWithNext(nt)),P(e,"left-ok",t[22].isOkWithNext(ft)),P(e,"right-ok",t[22].isOkWithNext(ot)),this.first=e},m(u,n){L(u,e,n),s||(l=at(e,"mousedown",t[4]),s=!0)},p(u,n){t=u,n&8&&r!==(r=t[22].style())&&O(e,"style",r),n&8&&P(e,"drag-from",t[22].isDragFrom()),n&8&&P(e,"top-ok",t[22].isOkWithNext(ut)),n&8&&P(e,"bottom-ok",t[22].isOkWithNext(nt)),n&8&&P(e,"left-ok",t[22].isOkWithNext(ft)),n&8&&P(e,"right-ok",t[22].isOkWithNext(ot))},d(u){u&&k(e),s=!1,l()}}}function ee(i){let t,e,r=[],s=new Map,l,u,n=[],c=new Map,o,m,_=st([...i[3].tiles()]);const x=a=>a[22];for(let a=0;a<_.length;a+=1){let g=pt(i,_,a),p=x(g);s.set(p,r[a]=wt(p,g))}let F=st([...i[3].tiles()]);const C=a=>a[22];for(let a=0;a<F.length;a+=1){let g=_t(i,F,a),p=C(g);c.set(p,n[a]=vt(p,g))}return{c(){t=G("div"),e=G("div");for(let a=0;a<r.length;a+=1)r[a].c();u=tt();for(let a=0;a<n.length;a+=1)n[a].c();this.h()},l(a){t=V(a,"DIV",{class:!0});var g=X(t);e=V(g,"DIV",{class:!0,style:!0});var p=X(e);for(let S=0;S<r.length;S+=1)r[S].l(p);p.forEach(k),u=et(g);for(let S=0;S<n.length;S+=1)n[S].l(g);g.forEach(k),this.h()},h(){O(e,"class","grid svelte-411q9w"),O(e,"style",l=i[3].style()),O(t,"class","stack svelte-411q9w"),P(t,"show-borders",i[0])},m(a,g){L(a,t,g),M(t,e);for(let p=0;p<r.length;p+=1)r[p]&&r[p].m(e,null);i[16](e),M(t,u);for(let p=0;p<n.length;p+=1)n[p]&&n[p].m(t,null);o||(m=[at(mt,"mouseup",i[6]),at(mt,"mousemove",i[5])],o=!0)},p(a,[g]){g&10&&(_=st([...a[3].tiles()]),r=ht(r,g,x,1,a,_,s,e,gt,wt,null,pt)),g&8&&l!==(l=a[3].style())&&O(e,"style",l),g&24&&(F=st([...a[3].tiles()]),n=ht(n,g,C,1,a,F,c,t,gt,vt,null,_t)),g&1&&P(t,"show-borders",a[0])},i:ct,o:ct,d(a){a&&k(t);for(let g=0;g<r.length;g+=1)r[g].d();i[16](null);for(let g=0;g<n.length;g+=1)n[g].d();o=!1,Bt(m)}}}function ie(i){if(i.dataset.posX&&i.dataset.posY){const t=Number(i.dataset.posX),e=Number(i.dataset.posY);return{x:t,y:e}}else return null}function xt(i){for(const t of document.elementsFromPoint(i.x,i.y))if(t instanceof HTMLElement){const e=ie(t);if(e)return e}return null}function re(i,t,e){let{tileCount:r}=t,{image:s}=t,{showBorders:l}=t,{actionCount:u=0}=t,{durationInSec:n=0}=t,{rows:c=0}=t,{cols:o=0}=t,{isSolved:m=!1}=t;const _=[];let x;const F=lt(()=>x?{x:x.offsetWidth,y:x.offsetHeight}:null),C=lt((f,D)=>{if(_.length>0){if(f.x>=D)return null;const b=f.y*D+f.x;if(b>=0&&b<_.length)return{x:_[b].offsetLeft,y:_[b].offsetTop}}return null}),a=lt((f,D)=>{if(_.length>0){const b=C.call(f,D),Z=C.call(it(f,ot),D),rt=C.call(it(f,nt),D),E=f.y*D+f.x;if(E<0||E>=_.length)return null;const y={x:_[E].offsetWidth,y:_[E].offsetHeight};return b&&Z&&(y.x=Z.x-b.x),b&&rt&&(y.y=rt.y-b.y),y}return null});function g(f){if(!m)if(d.isDragging())d.cancelDrag(),e(3,d);else{const D={x:f.clientX,y:f.clientY},b=xt(D);b&&(d.setDragFrom(b,D),e(3,d))}}function p(f){if(m||!d.isDragging())return;const D={x:f.clientX,y:f.clientY};d.dragUpdate(D),e(3,d)}function S(f){if(m||!d.isDragging())return;const D={x:f.clientX,y:f.clientY},b=xt(D);d.unsetDragFrom(b)&&e(7,u+=1),e(3,d),e(11,m=d.isSolved())}let d=new te({tileCount:r,image:s,getGridSize:F.call,getSlotPos:C.call,getSlotSize:a.call});d.shuffle();const w=setInterval(()=>{m&&clearInterval(w),document.hidden||e(8,n+=1)},1e3);function J(){d.shuffle(),e(3,d),e(11,m=d.isSolved())}function R(){F.clear(),C.clear(),a.clear(),e(3,d)}zt(()=>(e(3,d),e(11,m=d.isSolved()),e(9,c=d.rows),e(10,o=d.cols),window.addEventListener("resize",R),()=>{window.removeEventListener("resize",R)}));function U(f,D){A[f?"unshift":"push"](()=>{_[D]=f,e(1,_)})}function T(f){A[f?"unshift":"push"](()=>{x=f,e(2,x)})}return i.$$set=f=>{"tileCount"in f&&e(12,r=f.tileCount),"image"in f&&e(13,s=f.image),"showBorders"in f&&e(0,l=f.showBorders),"actionCount"in f&&e(7,u=f.actionCount),"durationInSec"in f&&e(8,n=f.durationInSec),"rows"in f&&e(9,c=f.rows),"cols"in f&&e(10,o=f.cols),"isSolved"in f&&e(11,m=f.isSolved)},[l,_,x,d,g,p,S,u,n,c,o,m,r,s,J,U,T]}class se extends bt{constructor(t){super(),kt(this,t,re,ee,St,{tileCount:12,image:13,showBorders:0,actionCount:7,durationInSec:8,rows:9,cols:10,isSolved:11,shuffle:14})}get shuffle(){return this.$$.ctx[14]}}function yt(i){let t,e=`Solved ✨ <a href="${qt+"/"}">Play again</a>`;return{c(){t=G("div"),t.innerHTML=e},l(r){t=V(r,"DIV",{"data-svelte-h":!0}),Rt(t)!=="svelte-1gkzpfp"&&(t.innerHTML=e)},m(r,s){L(r,t,s)},d(r){r&&k(t)}}}function Dt(i){let t;return{c(){t=N("s")},l(e){t=W(e,"s")},m(e,r){L(e,t,r)},d(e){e&&k(t)}}}function ne(i){let t,e,r,s,l,u,n,c,o,m,_,x,F,C,a,g,p,S,d=Math.floor(i[1]/60).toString().padStart(2,"0")+"",w,J,R=(i[1]%60).toString().padStart(2,"0")+"",U,T;function f(h){i[10](h)}function D(h){i[11](h)}function b(h){i[12](h)}function Z(h){i[13](h)}function rt(h){i[14](h)}let E={showBorders:i[8],tileCount:i[6],image:i[7]};i[2]!==void 0&&(E.rows=i[2]),i[3]!==void 0&&(E.cols=i[3]),i[0]!==void 0&&(E.actionCount=i[0]),i[4]!==void 0&&(E.isSolved=i[4]),i[1]!==void 0&&(E.durationInSec=i[1]),t=new se({props:E}),i[9](t),A.push(()=>Q(t,"rows",f)),A.push(()=>Q(t,"cols",D)),A.push(()=>Q(t,"actionCount",b)),A.push(()=>Q(t,"isSolved",Z)),A.push(()=>Q(t,"durationInSec",rt));let y=i[4]&&yt(),I=i[0]>1&&Dt();return{c(){Ft(t.$$.fragment),n=tt(),c=G("div"),o=G("div"),m=N(i[2]),_=N(" x "),x=N(i[3]),F=tt(),y&&y.c(),C=tt(),a=G("div"),g=N(i[0]),p=N(" move"),I&&I.c(),S=N(" | "),w=N(d),J=N(":"),U=N(R),this.h()},l(h){Ct(t.$$.fragment,h),n=et(h),c=V(h,"DIV",{class:!0});var v=X(c);o=V(v,"DIV",{class:!0});var B=X(o);m=W(B,i[2]),_=W(B," x "),x=W(B,i[3]),B.forEach(k),F=et(v),y&&y.l(v),C=et(v),a=V(v,"DIV",{class:!0});var q=X(a);g=W(q,i[0]),p=W(q," move"),I&&I.l(q),S=W(q," | "),w=W(q,d),J=W(q,":"),U=W(q,R),q.forEach(k),v.forEach(k),this.h()},h(){O(o,"class","muted svelte-cx25hv"),O(a,"class","muted svelte-cx25hv"),O(c,"class","toolbar svelte-cx25hv")},m(h,v){It(t,h,v),L(h,n,v),L(h,c,v),M(c,o),M(o,m),M(o,_),M(o,x),M(c,F),y&&y.m(c,null),M(c,C),M(c,a),M(a,g),M(a,p),I&&I.m(a,null),M(a,S),M(a,w),M(a,J),M(a,U),T=!0},p(h,v){const B={};!e&&v&4&&(e=!0,B.rows=h[2],K(()=>e=!1)),!r&&v&8&&(r=!0,B.cols=h[3],K(()=>r=!1)),!s&&v&1&&(s=!0,B.actionCount=h[0],K(()=>s=!1)),!l&&v&16&&(l=!0,B.isSolved=h[4],K(()=>l=!1)),!u&&v&2&&(u=!0,B.durationInSec=h[1],K(()=>u=!1)),t.$set(B),(!T||v&4)&&$(m,h[2]),(!T||v&8)&&$(x,h[3]),h[4]?y||(y=yt(),y.c(),y.m(c,C)):y&&(y.d(1),y=null),(!T||v&1)&&$(g,h[0]),h[0]>1?I||(I=Dt(),I.c(),I.m(a,S)):I&&(I.d(1),I=null),(!T||v&2)&&d!==(d=Math.floor(h[1]/60).toString().padStart(2,"0")+"")&&$(w,d),(!T||v&2)&&R!==(R=(h[1]%60).toString().padStart(2,"0")+"")&&$(U,R)},i(h){T||(Mt(t.$$.fragment,h),T=!0)},o(h){Ot(t.$$.fragment,h),T=!1},d(h){h&&(k(n),k(c)),i[9](null),Pt(t,h),y&&y.d(),I&&I.d()}}}function oe(i){let t,e,r;return e=new Vt({props:{$$slots:{default:[ne]},$$scope:{ctx:i}}}),{c(){t=tt(),Ft(e.$$.fragment),this.h()},l(s){Wt("svelte-66crdv",document.head).forEach(k),t=et(s),Ct(e.$$.fragment,s),this.h()},h(){document.title="Play - Picture slicer"},m(s,l){L(s,t,l),It(e,s,l),r=!0},p(s,[l]){const u={};l&131135&&(u.$$scope={dirty:l,ctx:s}),e.$set(u)},i(s){r||(Mt(e.$$.fragment,s),r=!0)},o(s){Ot(e.$$.fragment,s),r=!1},d(s){s&&k(t),Pt(e,s)}}}function le(i,t,e){let r;Nt(i,At,w=>e(15,r=w));const s=parseInt(r.url.searchParams.get("n")??"100"),l=parseInt(r.url.searchParams.get("i")??"0"),u=Lt[l];let n,c,o,m,_,x,F;function C(w){A[w?"unshift":"push"](()=>{x=w,e(5,x)})}function a(w){o=w,e(2,o)}function g(w){m=w,e(3,m)}function p(w){n=w,e(0,n)}function S(w){_=w,e(4,_)}function d(w){c=w,e(1,c)}return[n,c,o,m,_,x,s,u,F,C,a,g,p,S,d]}class de extends bt{constructor(t){super(),kt(this,t,le,oe,St,{})}}export{de as component};