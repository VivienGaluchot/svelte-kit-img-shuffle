var St=Object.defineProperty;var Ft=(s,t,e)=>t in s?St(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var b=(s,t,e)=>Ft(s,typeof t!="symbol"?t+"":t,e);import{s as mt,n as rt,r as bt,o as Ct,e as z,c as kt,x as X}from"../chunks/scheduler.CcFN-_cZ.js";import{S as dt,i as _t,e as P,s as q,c as O,a as B,d as x,f as A,w as y,C as S,g as I,h as C,y as et,u as ot,k as pt,l as Tt,m as wt,n as vt,o as xt,p as yt,q as Dt,D as Y,t as N,b as W,j as $,v as Pt}from"../chunks/index.CBGqbQe2.js";import{b as Ot}from"../chunks/paths.JnVh6hv0.js";import{p as It}from"../chunks/stores.BfRkDkTx.js";import{s as Mt,e as U,S as Et,i as zt}from"../chunks/image.DxAZwI4E.js";const Bt=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function V(s,t){return L(s,t,(e,i)=>e+i)}function G(s,t){return L(s,t,(e,i)=>e-i)}function Nt(s,t){let e=s;return t.min&&(e=L(e,t.min,Math.max)),t.max&&(e=L(e,t.max,Math.min)),e}function Wt(s,t){return L(s,t,(e,i)=>e/i)}function Rt(s){return qt(s,Math.round)}function R(s,t){return s.x==t.x&&s.y==t.y}function qt(s,t){return{x:t(s.x),y:t(s.y)}}function L(s,t,e){return{x:e(s.x,t.x),y:e(s.y,t.y)}}function tt(s){const t=new Map;return{call:(...e)=>{const i=t.get(e);if(i)return i;{const r=s(...e);return t.set(e,r),r}},clear:()=>{t.clear()}}}function At(s){let t=s.length,e;for(;t!=0;)e=Math.floor(Math.random()*t),t--,[s[t],s[e]]=[s[e],s[t]]}class Gt{constructor(t,e,i){b(this,"matrix");b(this,"initial");b(this,"current");b(this,"drag");this.matrix=i,this.initial={x:t,y:e},this.current={x:t,y:e},this.drag={from:null,to:null}}get rows(){return this.matrix.rows}get cols(){return this.matrix.cols}get image(){return this.matrix.image}isDragFrom(){return this.drag.from!=null}isDragTo(){return this.drag.to!=null}originOrCurrent(){var t,e;return((t=this.drag.from)==null?void 0:t.originCurrent)??((e=this.drag.to)==null?void 0:e.originCurrent)??this.current}getNext(t){return this.matrix.tileByCurrent(V(this.current,t))}isAtInitial(){return R(this.current,this.initial)}isOkWith(t){return R(G(t.current,this.current),G(t.initial,this.initial))}isOkWithNext(t){const e=this.getNext(t);return e?e.isOkWith(this):!0}setDragFrom(t){if(this.drag.from!=null)throw new Error("setDragFrom: from already set");if(this.drag.to!=null)throw new Error("setDragFrom: to already set");if(!this.matrix.options.getSlotPos(this.current,this.cols))throw new Error("setDragFrom: slot not found");this.drag.from={originCurrent:this.current,originMouse:t,pullOffset:{x:0,y:0}}}updateDragFrom(t){if(this.drag.from==null)throw new Error("updateDragFrom: from unset");const e=G(t,this.drag.from.originMouse);this.drag.from.pullOffset=e}unsetDragFrom(){if(this.drag.from==null)throw new Error("unsetDragFrom: from unset");this.drag.from=null}setDragTo(){if(this.drag.from!=null)throw new Error("setDragTo: from already set");if(this.drag.to!=null)throw new Error("setDragTo: to already set");this.drag.to={originCurrent:this.current}}unsetDragTo(){if(this.drag.to==null)throw new Error("unsetDragTo: to unset");this.current=this.drag.to.originCurrent,this.drag.to=null}style(){var h,u,c;const t=this.matrix.options.getGridSize(),e=this.matrix.options.getSlotPos(this.initial,this.cols);let i;this.isDragFrom()?i=this.originOrCurrent():i=this.current;const r=this.matrix.options.getSlotPos(i,this.cols),o=this.matrix.options.getSlotSize(i,this.cols);if(t&&e&&r&&o){let l={...e};l.x=Math.min(l.x,t.x-o.x),l.x=Math.max(l.x,0),l.x=l.x*-1,l.y=Math.min(l.y,t.y-o.y),l.y=Math.max(l.y,0),l.y=l.y*-1;const m=t;return`left: ${r.x+(((h=this.drag.from)==null?void 0:h.pullOffset.x)??0)}px; top: ${r.y+(((c=(u=this.drag.from)==null?void 0:u.pullOffset)==null?void 0:c.y)??0)}px; width: ${o.x}px; height: ${o.y}px;background-image: url(${this.image.url}); background-position: ${l.x}px ${l.y}px; background-size: ${m.x}px ${m.y}px ; `}}}const st={x:0,y:-1},j={x:0,y:1},it={x:-1,y:0},Z={x:1,y:0},Vt=[st,j,it,Z];class Lt{constructor(t){b(this,"options");b(this,"rows");b(this,"cols");b(this,"matrix",[]);b(this,"dragFrom",null);b(this,"dragTarget",null);this.options=t;let e=Mt(t.image.size,t.tileCount);this.cols=e.x,this.rows=e.y,this.matrix=[];for(let i=0;i<this.rows;i++)for(let r=0;r<this.cols;r++)this.matrix.push(new Gt(r,i,this))}get image(){return this.options.image}*tiles(){for(const t of this.matrix)yield t}tileGroup(t){const e=new Set;function i(r){if(!e.has(r)){e.add(r);for(const o of Vt){const h=r.getNext(o);h&&r.isOkWith(h)&&i(h)}}}return i(t),e}tileByInitial(t){return this.isInRange(t)?this.matrix[t.y*this.cols+t.x]:null}isInRange(t){return t.x>=0&&t.x<this.cols&&t.y>=0&&t.y<this.rows}tileByCurrent(t){for(const e of this.matrix)if(R(e.current,t))return e;return null}tileByOriginCurrent(t){for(const e of this.matrix)if(R(e.originOrCurrent(),t))return e;return null}style(){return`aspect-ratio: ${this.image.size.x} / ${this.image.size.y}; grid-template-columns: repeat(${this.cols}, 1fr);`}shuffle(){const t=[...this.matrix.map(e=>({...e.current}))];At(t);for(const e in this.matrix)this.matrix[e].current=t[e]}solveDrag(t,e){const i=[];if(e.x!=0||e.y!=0){const r=[];for(const o of t){const h=V(o.current,e);if(!this.isInRange(h))return[];r.push({pos:h,tile:o})}for(const{pos:o,tile:h}of r){i.push({tile:h,pos:o,isDragTo:!1});const u=this.tileByOriginCurrent(o);if(u&&!t.includes(u)){let c,l,m=h,f=0;do{c=m.originOrCurrent(),l=!0;for(const{pos:w,tile:a}of r)if(R(w,c)){l=!1,m=a;break}if(f++,f>1e3)throw new Error("infinite loop")}while(!l);i.push({tile:u,pos:c,isDragTo:!0})}}}return i}isSolved(){for(const t of this.matrix)if(!t.isAtInitial())return!1;return!0}setDragFrom(t,e){const i=this.tileByOriginCurrent(t);if(i){const r=[...this.tileGroup(i)];this.dragFrom={startClient:e,startPos:t,currentPos:t,tiles:r,dragActions:[]},r.map(o=>o.setDragFrom(e))}}dragUpdate(t){var i;const e=this.options.getSlotSize(this.matrix[0].current,this.cols);if(e&&this.dragFrom){const r=G(t,this.dragFrom.startClient),o=Rt(Wt(r,e)),h=Nt(V(this.dragFrom.startPos,o),{min:{x:0,y:0},max:{x:this.cols-1,y:this.rows-1}}),u=G(h,this.dragFrom.currentPos);this.dragFrom.currentPos=h;const c=this.solveDrag(this.dragFrom.tiles,u);c.length!=0&&(this.dragFrom.dragActions.map(l=>{l.isDragTo&&l.tile.unsetDragTo()}),this.dragFrom.dragActions=c,this.dragFrom.dragActions.map(l=>{l.isDragTo?l.tile.setDragTo():l.tile.updateDragFrom(t),l.tile.current=l.pos})),(i=this.dragFrom)==null||i.tiles.map(l=>{l.updateDragFrom(t)})}}unsetDragFrom(t){var i,r,o,h;let e;return t&&((i=this.dragFrom)!=null&&i.startPos)&&!R((r=this.dragFrom)==null?void 0:r.startPos,t)?e=!0:e=!1,(o=this.dragFrom)==null||o.tiles.map(u=>u.unsetDragFrom()),(h=this.dragFrom)==null||h.dragActions.map(u=>{u.isDragTo&&u.tile.unsetDragTo(),u.tile.current=u.pos}),this.dragFrom=null,this.dragTarget=null,e}}const{window:nt}=Bt;function lt(s,t,e){const i=s.slice();return i[20]=t[e],i}function at(s,t,e){const i=s.slice();return i[20]=t[e],i[23]=t,i[24]=e,i}function ut(s){let t,e,i,r=s[24];const o=()=>s[14](t,r),h=()=>s[14](null,r);return{c(){t=P("div"),this.h()},l(u){t=O(u,"DIV",{class:!0,"data-pos-x":!0,"data-pos-y":!0}),B(t).forEach(x),this.h()},h(){y(t,"class","slot svelte-411q9w"),y(t,"data-pos-x",e=s[20].initial.x),y(t,"data-pos-y",i=s[20].initial.y)},m(u,c){I(u,t,c),o()},p(u,c){s=u,c&8&&e!==(e=s[20].initial.x)&&y(t,"data-pos-x",e),c&8&&i!==(i=s[20].initial.y)&&y(t,"data-pos-y",i),r!==s[24]&&(h(),r=s[24],o())},d(u){u&&x(t),h()}}}function ft(s){let t,e,i,r;return{c(){t=P("div"),this.h()},l(o){t=O(o,"DIV",{class:!0,style:!0}),B(t).forEach(x),this.h()},h(){y(t,"class","tile svelte-411q9w"),y(t,"style",e=s[20].style()),S(t,"drag-from",s[20].isDragFrom()),S(t,"top-ok",s[20].isOkWithNext(st)),S(t,"bottom-ok",s[20].isOkWithNext(j)),S(t,"left-ok",s[20].isOkWithNext(it)),S(t,"right-ok",s[20].isOkWithNext(Z))},m(o,h){I(o,t,h),i||(r=et(t,"mousedown",s[4]),i=!0)},p(o,h){h&8&&e!==(e=o[20].style())&&y(t,"style",e),h&8&&S(t,"drag-from",o[20].isDragFrom()),h&8&&S(t,"top-ok",o[20].isOkWithNext(st)),h&8&&S(t,"bottom-ok",o[20].isOkWithNext(j)),h&8&&S(t,"left-ok",o[20].isOkWithNext(it)),h&8&&S(t,"right-ok",o[20].isOkWithNext(Z))},d(o){o&&x(t),i=!1,r()}}}function Ht(s){let t,e,i,r,o,h,u=U([...s[3].tiles()]),c=[];for(let f=0;f<u.length;f+=1)c[f]=ut(at(s,u,f));let l=U([...s[3].tiles()]),m=[];for(let f=0;f<l.length;f+=1)m[f]=ft(lt(s,l,f));return{c(){t=P("div"),e=P("div");for(let f=0;f<c.length;f+=1)c[f].c();r=q();for(let f=0;f<m.length;f+=1)m[f].c();this.h()},l(f){t=O(f,"DIV",{class:!0});var w=B(t);e=O(w,"DIV",{class:!0,style:!0});var a=B(e);for(let p=0;p<c.length;p+=1)c[p].l(a);a.forEach(x),r=A(w);for(let p=0;p<m.length;p+=1)m[p].l(w);w.forEach(x),this.h()},h(){y(e,"class","grid svelte-411q9w"),y(e,"style",i=s[3].style()),y(t,"class","stack svelte-411q9w"),S(t,"show-borders",s[0])},m(f,w){I(f,t,w),C(t,e);for(let a=0;a<c.length;a+=1)c[a]&&c[a].m(e,null);s[15](e),C(t,r);for(let a=0;a<m.length;a+=1)m[a]&&m[a].m(t,null);o||(h=[et(nt,"mouseup",s[6]),et(nt,"mousemove",s[5])],o=!0)},p(f,[w]){if(w&10){u=U([...f[3].tiles()]);let a;for(a=0;a<u.length;a+=1){const p=at(f,u,a);c[a]?c[a].p(p,w):(c[a]=ut(p),c[a].c(),c[a].m(e,null))}for(;a<c.length;a+=1)c[a].d(1);c.length=u.length}if(w&8&&i!==(i=f[3].style())&&y(e,"style",i),w&24){l=U([...f[3].tiles()]);let a;for(a=0;a<l.length;a+=1){const p=lt(f,l,a);m[a]?m[a].p(p,w):(m[a]=ft(p),m[a].c(),m[a].m(t,null))}for(;a<m.length;a+=1)m[a].d(1);m.length=l.length}w&1&&S(t,"show-borders",f[0])},i:rt,o:rt,d(f){f&&x(t),ot(c,f),s[15](null),ot(m,f),o=!1,bt(h)}}}function Xt(s){if(s.dataset.posX&&s.dataset.posY){const t=Number(s.dataset.posX),e=Number(s.dataset.posY);return{x:t,y:e}}else return null}function ct(s){for(const t of document.elementsFromPoint(s.x,s.y))if(t instanceof HTMLElement){const e=Xt(t);if(e)return e}return null}function Yt(s,t,e){let{tileCount:i}=t,{image:r}=t,{showBorders:o}=t,{actionCount:h=0}=t,{rows:u=0}=t,{cols:c=0}=t,{isSolved:l=!1}=t;const m=[];let f;const w=tt(()=>f?{x:f.offsetWidth,y:f.offsetHeight}:null),a=tt((n,_)=>{if(m.length>0){if(n.x>=_)return null;const g=n.y*_+n.x;if(g>=0&&g<m.length)return{x:m[g].offsetLeft,y:m[g].offsetTop}}return null}),p=tt((n,_)=>{if(m.length>0){const g=a.call(n,_),v=a.call(V(n,Z),_),D=a.call(V(n,j),_),k=n.y*_+n.x;if(k<0||k>=m.length)return null;const Q={x:m[k].offsetWidth,y:m[k].offsetHeight};return g&&v&&(Q.x=v.x-g.x),g&&D&&(Q.y=D.y-g.y),Q}return null});function T(n){if(l)return;const _={x:n.clientX,y:n.clientY},g=ct(_);g&&(d.setDragFrom(g,_),e(3,d))}function M(n){if(l)return;const _={x:n.clientX,y:n.clientY};d.dragUpdate(_),e(3,d)}function F(n){if(l)return;const _={x:n.clientX,y:n.clientY},g=ct(_);d.unsetDragFrom(g)&&e(7,h+=1),e(3,d),e(10,l=d.isSolved())}let d=new Lt({tileCount:i,image:r,getGridSize:w.call,getSlotPos:a.call,getSlotSize:p.call});d.shuffle();function J(){d.shuffle(),e(3,d),e(10,l=d.isSolved())}function H(){w.clear(),a.clear(),p.clear(),e(3,d)}Ct(()=>(e(3,d),e(10,l=d.isSolved()),e(8,u=d.rows),e(9,c=d.cols),window.addEventListener("resize",H),()=>{window.removeEventListener("resize",H)}));function K(n,_){z[n?"unshift":"push"](()=>{m[_]=n,e(1,m)})}function E(n){z[n?"unshift":"push"](()=>{f=n,e(2,f)})}return s.$$set=n=>{"tileCount"in n&&e(11,i=n.tileCount),"image"in n&&e(12,r=n.image),"showBorders"in n&&e(0,o=n.showBorders),"actionCount"in n&&e(7,h=n.actionCount),"rows"in n&&e(8,u=n.rows),"cols"in n&&e(9,c=n.cols),"isSolved"in n&&e(10,l=n.isSolved)},[o,m,f,d,T,M,F,h,u,c,l,i,r,J,K,E]}class Ut extends dt{constructor(t){super(),_t(this,t,Yt,Ht,mt,{tileCount:11,image:12,showBorders:0,actionCount:7,rows:8,cols:9,isSolved:10,shuffle:13})}get shuffle(){return this.$$.ctx[13]}}function ht(s){let t,e=`Solved ✨ <a href="$${Ot}/">Play again</a>`;return{c(){t=P("div"),t.innerHTML=e},l(i){t=O(i,"DIV",{"data-svelte-h":!0}),Pt(t)!=="svelte-1vkq7g"&&(t.innerHTML=e)},m(i,r){I(i,t,r)},d(i){i&&x(t)}}}function gt(s){let t;return{c(){t=N("s")},l(e){t=W(e,"s")},m(e,i){I(e,t,i)},d(e){e&&x(t)}}}function jt(s){let t,e,i,r,o,h,u,c,l,m,f,w,a,p,T,M,F;function d(g){s[9](g)}function J(g){s[10](g)}function H(g){s[11](g)}function K(g){s[12](g)}let E={showBorders:s[7],tileCount:s[5],image:s[6]};s[1]!==void 0&&(E.rows=s[1]),s[2]!==void 0&&(E.cols=s[2]),s[0]!==void 0&&(E.actionCount=s[0]),s[3]!==void 0&&(E.isSolved=s[3]),t=new Ut({props:E}),s[8](t),z.push(()=>Y(t,"rows",d)),z.push(()=>Y(t,"cols",J)),z.push(()=>Y(t,"actionCount",H)),z.push(()=>Y(t,"isSolved",K));let n=s[3]&&ht(),_=s[0]>1&&gt();return{c(){pt(t.$$.fragment),h=q(),u=P("div"),c=P("div"),l=N(s[1]),m=N(" x "),f=N(s[2]),w=q(),n&&n.c(),a=q(),p=P("div"),T=N(s[0]),M=N(" move"),_&&_.c(),this.h()},l(g){wt(t.$$.fragment,g),h=A(g),u=O(g,"DIV",{class:!0});var v=B(u);c=O(v,"DIV",{class:!0});var D=B(c);l=W(D,s[1]),m=W(D," x "),f=W(D,s[2]),D.forEach(x),w=A(v),n&&n.l(v),a=A(v),p=O(v,"DIV",{class:!0});var k=B(p);T=W(k,s[0]),M=W(k," move"),_&&_.l(k),k.forEach(x),v.forEach(x),this.h()},h(){y(c,"class","muted svelte-cx25hv"),y(p,"class","muted svelte-cx25hv"),y(u,"class","toolbar svelte-cx25hv")},m(g,v){vt(t,g,v),I(g,h,v),I(g,u,v),C(u,c),C(c,l),C(c,m),C(c,f),C(u,w),n&&n.m(u,null),C(u,a),C(u,p),C(p,T),C(p,M),_&&_.m(p,null),F=!0},p(g,v){const D={};!e&&v&2&&(e=!0,D.rows=g[1],X(()=>e=!1)),!i&&v&4&&(i=!0,D.cols=g[2],X(()=>i=!1)),!r&&v&1&&(r=!0,D.actionCount=g[0],X(()=>r=!1)),!o&&v&8&&(o=!0,D.isSolved=g[3],X(()=>o=!1)),t.$set(D),(!F||v&2)&&$(l,g[1]),(!F||v&4)&&$(f,g[2]),g[3]?n||(n=ht(),n.c(),n.m(u,a)):n&&(n.d(1),n=null),(!F||v&1)&&$(T,g[0]),g[0]>1?_||(_=gt(),_.c(),_.m(p,null)):_&&(_.d(1),_=null)},i(g){F||(xt(t.$$.fragment,g),F=!0)},o(g){yt(t.$$.fragment,g),F=!1},d(g){g&&(x(h),x(u)),s[8](null),Dt(t,g),n&&n.d(),_&&_.d()}}}function Zt(s){let t,e,i;return e=new Et({props:{$$slots:{default:[jt]},$$scope:{ctx:s}}}),{c(){t=q(),pt(e.$$.fragment),this.h()},l(r){Tt("svelte-o5nfkw",document.head).forEach(x),t=A(r),wt(e.$$.fragment,r),this.h()},h(){document.title="Play - Picture slicer multi"},m(r,o){I(r,t,o),vt(e,r,o),i=!0},p(r,[o]){const h={};o&32799&&(h.$$scope={dirty:o,ctx:r}),e.$set(h)},i(r){i||(xt(e.$$.fragment,r),i=!0)},o(r){yt(e.$$.fragment,r),i=!1},d(r){r&&x(t),Dt(e,r)}}}function Jt(s,t,e){let i;kt(s,It,d=>e(13,i=d));const r=parseInt(i.url.searchParams.get("n")??"100"),o=parseInt(i.url.searchParams.get("i")??"0"),h=zt[o];let u,c,l,m,f,w;function a(d){z[d?"unshift":"push"](()=>{f=d,e(4,f)})}function p(d){c=d,e(1,c)}function T(d){l=d,e(2,l)}function M(d){u=d,e(0,u)}function F(d){m=d,e(3,m)}return[u,c,l,m,f,r,h,w,a,p,T,M,F]}class ie extends dt{constructor(t){super(),_t(this,t,Jt,Zt,mt,{})}}export{ie as component};
