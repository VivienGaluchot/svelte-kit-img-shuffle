import{s as ae,n as z,e as ie,r as oe}from"../chunks/scheduler.BQAbF66X.js";import{S as ne,i as re,n as Q,g as y,d as $,z as fe,e as p,s as k,t as j,c as v,a as C,f as I,b as q,p as h,q as X,h as c,j as ce,v as S,k as ue,w as U,x as A,l as H,m as L,y as P,A as Y,B as Z}from"../chunks/index.l2PWj1v_.js";import{e as x,g as O,a as me,b as $e,C as he,s as _e,H as ge,c as de,F as pe,S as ee}from"../chunks/content.DOEAsXkv.js";import{b as ve}from"../chunks/paths.BQCDhKMC.js";function te(i,a,n){const s=i.slice();return s[2]=a[n],s}function se(i){let a,n,s,t,e,r=O(i[2]).name+"",l,u,o,f,b,V,R,w,m,_,E,D,B,M,F;return{c(){a=p("div"),n=p("div"),s=p("div"),t=k(),e=p("div"),l=j(r),u=k(),o=p("div"),f=p("a"),b=j("Easy"),R=k(),w=p("a"),m=j("Medium"),E=k(),D=p("a"),B=j("Hard"),F=k(),this.h()},l(g){a=v(g,"DIV",{class:!0});var d=C(a);n=v(d,"DIV",{class:!0});var N=C(n);s=v(N,"DIV",{class:!0,style:!0}),C(s).forEach($),t=I(N),e=v(N,"DIV",{class:!0});var G=C(e);l=q(G,r),G.forEach($),N.forEach($),u=I(d),o=v(d,"DIV",{class:!0});var T=C(o);f=v(T,"A",{class:!0,href:!0});var W=C(f);b=q(W,"Easy"),W.forEach($),R=I(T),w=v(T,"A",{class:!0,href:!0});var J=C(w);m=q(J,"Medium"),J.forEach($),E=I(T),D=v(T,"A",{class:!0,href:!0});var K=C(D);B=q(K,"Hard"),K.forEach($),T.forEach($),F=I(d),d.forEach($),this.h()},h(){h(s,"class","icon svelte-hsov69"),X(s,"background-image","url("+O(i[2]).url+")"),h(e,"class","img-name svelte-hsov69"),h(n,"class","flex-h g-sm svelte-hsov69"),h(f,"class","button"),h(f,"href",V=i[1](40,i[2])),h(w,"class","button"),h(w,"href",_=i[1](80,i[2])),h(D,"class","button"),h(D,"href",M=i[1](120,i[2])),h(o,"class","flex-h g-sm svelte-hsov69"),h(a,"class","flex-h row svelte-hsov69")},m(g,d){y(g,a,d),c(a,n),c(n,s),c(n,t),c(n,e),c(e,l),c(a,u),c(a,o),c(o,f),c(f,b),c(o,R),c(o,w),c(w,m),c(o,E),c(o,D),c(D,B),c(a,F)},p(g,d){d&1&&X(s,"background-image","url("+O(g[2]).url+")"),d&1&&r!==(r=O(g[2]).name+"")&&ce(l,r),d&1&&V!==(V=g[1](40,g[2]))&&h(f,"href",V),d&1&&_!==(_=g[1](80,g[2]))&&h(w,"href",_),d&1&&M!==(M=g[1](120,g[2]))&&h(D,"href",M)},d(g){g&&$(a)}}}function be(i){let a,n=x(i[0]),s=[];for(let t=0;t<n.length;t+=1)s[t]=se(te(i,n,t));return{c(){for(let t=0;t<s.length;t+=1)s[t].c();a=Q()},l(t){for(let e=0;e<s.length;e+=1)s[e].l(t);a=Q()},m(t,e){for(let r=0;r<s.length;r+=1)s[r]&&s[r].m(t,e);y(t,a,e)},p(t,[e]){if(e&3){n=x(t[0]);let r;for(r=0;r<n.length;r+=1){const l=te(t,n,r);s[r]?s[r].p(l,e):(s[r]=se(l),s[r].c(),s[r].m(a.parentNode,a))}for(;r<s.length;r+=1)s[r].d(1);s.length=n.length}},i:z,o:z,d(t){t&&$(a),fe(s,t)}}}function ke(i,a,n){function s(e,r){const l=new URL(`${ve}/play`,window.location.origin);return me(l,{tileCount:e,seed:$e(Math.random,6),...r}),l.toString()}let{images:t}=a;return i.$$set=e=>{"images"in e&&n(0,t=e.images)},[t,s]}class le extends ne{constructor(a){super(),re(this,a,ke,be,ae,{images:0})}}function Ie(i){let a,n,s;return n=new le({props:{images:i[3]}}),{c(){a=j(`Choose an image
			`),S(n.$$.fragment)},l(t){a=q(t,`Choose an image
			`),U(n.$$.fragment,t)},m(t,e){y(t,a,e),A(n,t,e),s=!0},p:z,i(t){s||(H(n.$$.fragment,t),s=!0)},o(t){L(n.$$.fragment,t),s=!1},d(t){t&&$(a),P(n,t)}}}function we(i){let a,n,s="Play with custom image",t,e,r,l="+",u,o,f,b,V,R,w;return b=new le({props:{images:i[1]}}),{c(){a=p("div"),n=p("div"),n.textContent=s,t=k(),e=p("div"),r=p("button"),r.textContent=l,u=k(),o=p("input"),f=k(),S(b.$$.fragment),this.h()},l(m){a=v(m,"DIV",{class:!0});var _=C(a);n=v(_,"DIV",{"data-svelte-h":!0}),Y(n)!=="svelte-19f51kg"&&(n.textContent=s),t=I(_),e=v(_,"DIV",{});var E=C(e);r=v(E,"BUTTON",{class:!0,"data-svelte-h":!0}),Y(r)!=="svelte-1bdsucn"&&(r.textContent=l),u=I(E),o=v(E,"INPUT",{type:!0,accept:!0}),E.forEach($),_.forEach($),f=I(m),U(b.$$.fragment,m),this.h()},h(){h(r,"class","button"),o.hidden=!0,h(o,"type","file"),h(o,"accept","image/*"),h(a,"class","flex-h svelte-mfg0e8")},m(m,_){y(m,a,_),c(a,n),c(a,t),c(a,e),c(e,r),c(e,u),c(e,o),i[5](o),y(m,f,_),A(b,m,_),V=!0,R||(w=[Z(r,"click",i[4]),Z(o,"change",i[6])],R=!0)},p(m,_){const E={};_&2&&(E.images=m[1]),b.$set(E)},i(m){V||(H(b.$$.fragment,m),V=!0)},o(m){L(b.$$.fragment,m),V=!1},d(m){m&&($(a),$(f)),i[5](null),P(b,m),R=!1,oe(w)}}}function Ee(i){let a,n,s,t;return a=new ee({props:{$$slots:{default:[Ie]},$$scope:{ctx:i}}}),s=new ee({props:{$$slots:{default:[we]},$$scope:{ctx:i}}}),{c(){S(a.$$.fragment),n=k(),S(s.$$.fragment)},l(e){U(a.$$.fragment,e),n=I(e),U(s.$$.fragment,e)},m(e,r){A(a,e,r),y(e,n,r),A(s,e,r),t=!0},p(e,r){const l={};r&128&&(l.$$scope={dirty:r,ctx:e}),a.$set(l);const u={};r&135&&(u.$$scope={dirty:r,ctx:e}),s.$set(u)},i(e){t||(H(a.$$.fragment,e),H(s.$$.fragment,e),t=!0)},o(e){L(a.$$.fragment,e),L(s.$$.fragment,e),t=!1},d(e){e&&$(n),P(a,e),P(s,e)}}}function Ce(i){let a,n,s,t,e,r;return a=new ge({}),s=new de({props:{$$slots:{default:[Ee]},$$scope:{ctx:i}}}),e=new pe({}),{c(){S(a.$$.fragment),n=k(),S(s.$$.fragment),t=k(),S(e.$$.fragment)},l(l){U(a.$$.fragment,l),n=I(l),U(s.$$.fragment,l),t=I(l),U(e.$$.fragment,l)},m(l,u){A(a,l,u),y(l,n,u),A(s,l,u),y(l,t,u),A(e,l,u),r=!0},p(l,u){const o={};u&135&&(o.$$scope={dirty:u,ctx:l}),s.$set(o)},i(l){r||(H(a.$$.fragment,l),H(s.$$.fragment,l),H(e.$$.fragment,l),r=!0)},o(l){L(a.$$.fragment,l),L(s.$$.fragment,l),L(e.$$.fragment,l),r=!1},d(l){l&&($(n),$(t)),P(a,l),P(s,l),P(e,l)}}}function Ve(i){let a,n,s;return n=new he({props:{maxWidth:"35rem",$$slots:{default:[Ce]},$$scope:{ctx:i}}}),{c(){a=k(),S(n.$$.fragment),this.h()},l(t){ue("svelte-oh93rq",document.head).forEach($),a=I(t),U(n.$$.fragment,t),this.h()},h(){document.title="Picture slicer"},m(t,e){y(t,a,e),A(n,t,e),s=!0},p(t,[e]){const r={};e&135&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){s||(H(n.$$.fragment,t),s=!0)},o(t){L(n.$$.fragment,t),s=!1},d(t){t&&$(a),P(n,t)}}}function ye(i,a,n){let s=[];const t=[];for(const f of Object.keys(_e))t.push({kind:"static",key:f});let e,r=null;const l=()=>e.click();function u(f){ie[f?"unshift":"push"](()=>{e=f,n(2,e)})}function o(){r=this.files,n(0,r)}return i.$$.update=()=>{if(i.$$.dirty&1&&r){const f=r[0];f&&n(1,s=[{kind:"custom",image:{name:f.name,url:URL.createObjectURL(f)}}])}},[r,s,e,t,l,u,o]}class He extends ne{constructor(a){super(),re(this,a,ye,Ve,ae,{})}}export{He as component};