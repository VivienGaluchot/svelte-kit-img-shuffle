import{l as w,S as b,i as y,e as _,c as v,a as H,d,p as $,g as k,m as L,s as Z,A as B,f as G,h as O,q as P}from"./index.l2PWj1v_.js";import{r as J,s as I,a as M,u as E,g as S,b as j,n as D}from"./scheduler.BQAbF66X.js";import{b as N}from"./paths.Bif0m1Mf.js";function pe(n){return(n==null?void 0:n.length)!==void 0?n:Array.from(n)}function ge(n,e){n.d(1),e.delete(n.key)}function _e(n,e,a,i,s,t,l,u,o,c,T,F){let m=n.length,g=t.length,p=m;const V={};for(;p--;)V[n[p].key]=p;const R=[],z=new Map,U=new Map,W=[];for(p=g;p--;){const r=F(s,t,p),f=a(r);let h=l.get(f);h?W.push(()=>h.p(r,e)):(h=c(f,r),h.c()),z.set(f,R[p]=h),f in V&&U.set(f,Math.abs(p-V[f]))}const x=new Set,A=new Set;function q(r){w(r,1),r.m(u,T),l.set(r.key,r),T=r.first,g--}for(;m&&g;){const r=R[g-1],f=n[m-1],h=r.key,C=f.key;r===f?(T=r.first,m--,g--):z.has(C)?!l.has(h)||x.has(h)?q(r):A.has(C)?m--:U.get(h)>U.get(C)?(A.add(h),q(r)):(x.add(C),m--):(o(f,l),m--)}for(;m--;){const r=n[m];z.has(r.key)||o(r,l)}for(;g;)q(R[g-1]);return J(W),R}function Y(n){let e,a;const i=n[1].default,s=M(i,n,n[0],null);return{c(){e=_("section"),s&&s.c(),this.h()},l(t){e=v(t,"SECTION",{class:!0});var l=H(e);s&&s.l(l),l.forEach(d),this.h()},h(){$(e,"class","svelte-1y2ukbu")},m(t,l){k(t,e,l),s&&s.m(e,null),a=!0},p(t,[l]){s&&s.p&&(!a||l&1)&&E(s,i,t,t[0],a?j(i,t[0],l,null):S(t[0]),null)},i(t){a||(w(s,t),a=!0)},o(t){L(s,t),a=!1},d(t){t&&d(e),s&&s.d(t)}}}function K(n,e,a){let{$$slots:i={},$$scope:s}=e;return n.$$set=t=>{"$$scope"in t&&a(0,s=t.$$scope)},[s,i]}class ve extends b{constructor(e){super(),y(this,e,K,Y,I,{})}}const Q=""+new URL("../assets/photo-1687057217908-54f8e6d30e3c.Dsb9PnRj.avif",import.meta.url).href,X=""+new URL("../assets/photo-1689085383650-13d21072f5a6.b_BMIJtR.avif",import.meta.url).href,ee=""+new URL("../assets/bruno-martins-GkZvxVsHYWw-unsplash.BovO_Ikv.jpg",import.meta.url).href,te=""+new URL("../assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.fqDmtHqo.jpg",import.meta.url).href,se=""+new URL("../assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.NwezTu0h.jpg",import.meta.url).href,ne=""+new URL("../assets/tara-mae-miller-SzI9z8snVjk-unsplash.xtVI9I0a.jpg",import.meta.url).href,ae=""+new URL("../assets/valeria-kodra-2mj8Yu6Vftc-unsplash.C0EkgBeV.jpg",import.meta.url).href;async function $e(n){const e=await new Promise((a,i)=>{const s=new Image;s.onload=()=>a(s),s.onerror=t=>i(t),s.src=n.url});return{...n,size:{x:e.naturalWidth,y:e.naturalHeight}}}const we=[{name:"Sea",url:Q},{name:"Town",url:X},{name:"Street",url:ee},{name:"Car",url:te},{name:"Air ballon",url:se},{name:"Tag",url:ne},{name:"Cozy",url:ae}];function be(n,e){const a=Math.sqrt(e*n.y/n.x);return{x:Math.round(e/a),y:Math.round(a)}}function le(n){let e,a,i=`<img src="${N}/favicon.png" alt="logo" class="svelte-134mbkx"/> <h1 class="svelte-134mbkx">Picture slicer</h1>`,s,t;const l=n[1].default,u=M(l,n,n[0],null);return{c(){e=_("header"),a=_("div"),a.innerHTML=i,s=Z(),u&&u.c(),this.h()},l(o){e=v(o,"HEADER",{class:!0});var c=H(e);a=v(c,"DIV",{class:!0,"data-svelte-h":!0}),B(a)!=="svelte-1rs3xkn"&&(a.innerHTML=i),s=G(c),u&&u.l(c),c.forEach(d),this.h()},h(){$(a,"class","logo-bar svelte-134mbkx"),$(e,"class","svelte-134mbkx")},m(o,c){k(o,e,c),O(e,a),O(e,s),u&&u.m(e,null),t=!0},p(o,[c]){u&&u.p&&(!t||c&1)&&E(u,l,o,o[0],t?j(l,o[0],c,null):S(o[0]),null)},i(o){t||(w(u,o),t=!0)},o(o){L(u,o),t=!1},d(o){o&&d(e),u&&u.d(o)}}}function ie(n,e,a){let{$$slots:i={},$$scope:s}=e;return n.$$set=t=>{"$$scope"in t&&a(0,s=t.$$scope)},[s,i]}class ye extends b{constructor(e){super(),y(this,e,ie,le,I,{})}}function oe(n){let e,a='<a class="button" href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle/issues">🐞 see a bug?</a>';return{c(){e=_("footer"),e.innerHTML=a,this.h()},l(i){e=v(i,"FOOTER",{class:!0,"data-svelte-h":!0}),B(e)!=="svelte-1iej4yg"&&(e.innerHTML=a),this.h()},h(){$(e,"class","svelte-1fnk7ix")},m(i,s){k(i,e,s)},p:D,i:D,o:D,d(i){i&&d(e)}}}class ke extends b{constructor(e){super(),y(this,e,null,oe,I,{})}}function re(n){let e,a;const i=n[2].default,s=M(i,n,n[1],null);return{c(){e=_("div"),s&&s.c(),this.h()},l(t){e=v(t,"DIV",{style:!0,class:!0});var l=H(e);s&&s.l(l),l.forEach(d),this.h()},h(){P(e,"max-width",n[0]),$(e,"class","svelte-da5i2p")},m(t,l){k(t,e,l),s&&s.m(e,null),a=!0},p(t,[l]){s&&s.p&&(!a||l&2)&&E(s,i,t,t[1],a?j(i,t[1],l,null):S(t[1]),null),(!a||l&1)&&P(e,"max-width",t[0])},i(t){a||(w(s,t),a=!0)},o(t){L(s,t),a=!1},d(t){t&&d(e),s&&s.d(t)}}}function ue(n,e,a){let{$$slots:i={},$$scope:s}=e,{maxWidth:t="unset"}=e;return n.$$set=l=>{"maxWidth"in l&&a(0,t=l.maxWidth),"$$scope"in l&&a(1,s=l.$$scope)},[t,s,i]}class Ie extends b{constructor(e){super(),y(this,e,ue,re,I,{maxWidth:0})}}function ce(n){let e,a;const i=n[1].default,s=M(i,n,n[0],null);return{c(){e=_("div"),s&&s.c(),this.h()},l(t){e=v(t,"DIV",{class:!0});var l=H(e);s&&s.l(l),l.forEach(d),this.h()},h(){$(e,"class","svelte-10od45t")},m(t,l){k(t,e,l),s&&s.m(e,null),a=!0},p(t,[l]){s&&s.p&&(!a||l&1)&&E(s,i,t,t[0],a?j(i,t[0],l,null):S(t[0]),null)},i(t){a||(w(s,t),a=!0)},o(t){L(s,t),a=!1},d(t){t&&d(e),s&&s.d(t)}}}function fe(n,e,a){let{$$slots:i={},$$scope:s}=e;return n.$$set=t=>{"$$scope"in t&&a(0,s=t.$$scope)},[s,i]}class Re extends b{constructor(e){super(),y(this,e,fe,ce,I,{})}}export{Ie as C,ke as F,ye as H,ve as S,Re as a,be as b,ge as d,pe as e,we as s,$e as t,_e as u};
