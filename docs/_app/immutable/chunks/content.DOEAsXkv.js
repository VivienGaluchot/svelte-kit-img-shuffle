import{l as $,S as k,i as I,e as w,c as _,a as R,d,p as v,g as b,m as S,s as B,A as O,f as J,h as q,q as D}from"./index.l2PWj1v_.js";import{r as G,s as M,a as U,u as E,g as L,b as H,n as W}from"./scheduler.BQAbF66X.js";import{b as Y}from"./paths.BQCDhKMC.js";function we(a){return(a==null?void 0:a.length)!==void 0?a:Array.from(a)}function _e(a,e){a.d(1),e.delete(a.key)}function ve(a,e,n,l,t,s,i,c,r,u,P,F){let m=a.length,g=s.length,p=m;const j={};for(;p--;)j[a[p].key]=p;const y=[],T=new Map,V=new Map,x=[];for(p=g;p--;){const o=F(t,s,p),f=n(o);let h=i.get(f);h?x.push(()=>h.p(o,e)):(h=u(f,o),h.c()),T.set(f,y[p]=h),f in j&&V.set(f,Math.abs(p-j[f]))}const z=new Set,N=new Set;function A(o){$(o,1),o.m(c,P),i.set(o.key,o),P=o.first,g--}for(;m&&g;){const o=y[g-1],f=a[m-1],h=o.key,C=f.key;o===f?(P=o.first,m--,g--):T.has(C)?!i.has(h)||z.has(h)?A(o):N.has(C)?m--:V.get(h)>V.get(C)?(N.add(h),A(o)):(z.add(C),m--):(r(f,i),m--)}for(;m--;){const o=a[m];T.has(o.key)||r(o,i)}for(;g;)A(y[g-1]);return G(x),y}function Z(a){let e,n;const l=a[1].default,t=U(l,a,a[0],null);return{c(){e=w("section"),t&&t.c(),this.h()},l(s){e=_(s,"SECTION",{class:!0});var i=R(e);t&&t.l(i),i.forEach(d),this.h()},h(){v(e,"class","svelte-1y2ukbu")},m(s,i){b(s,e,i),t&&t.m(e,null),n=!0},p(s,[i]){t&&t.p&&(!n||i&1)&&E(t,l,s,s[0],n?H(l,s[0],i,null):L(s[0]),null)},i(s){n||($(t,s),n=!0)},o(s){S(t,s),n=!1},d(s){s&&d(e),t&&t.d(s)}}}function K(a,e,n){let{$$slots:l={},$$scope:t}=e;return a.$$set=s=>{"$$scope"in s&&n(0,t=s.$$scope)},[t,l]}class $e extends k{constructor(e){super(),I(this,e,K,Z,M,{})}}const Q=""+new URL("../assets/photo-1687057217908-54f8e6d30e3c.Dsb9PnRj.avif",import.meta.url).href,X=""+new URL("../assets/photo-1689085383650-13d21072f5a6.b_BMIJtR.avif",import.meta.url).href,ee=""+new URL("../assets/bruno-martins-GkZvxVsHYWw-unsplash.BovO_Ikv.jpg",import.meta.url).href,te=""+new URL("../assets/alex-gagareen-r8_ZJ3qzgKo-unsplash.fqDmtHqo.jpg",import.meta.url).href,se=""+new URL("../assets/slava-auchynnikau-hAkmZyuHuRE-unsplash.NwezTu0h.jpg",import.meta.url).href,ne=""+new URL("../assets/tara-mae-miller-SzI9z8snVjk-unsplash.xtVI9I0a.jpg",import.meta.url).href,ae=""+new URL("../assets/valeria-kodra-2mj8Yu6Vftc-unsplash.C0EkgBeV.jpg",import.meta.url).href,le=""+new URL("../assets/360floralflaves-SNQfkUNHWlA-unsplash.pfFBWyYi.jpg",import.meta.url).href;async function ke(a){const e=await new Promise((n,l)=>{const t=new Image;t.onload=()=>n(t),t.onerror=s=>l(s),t.src=a.url});return{...a,size:{x:e.naturalWidth,y:e.naturalHeight}}}const ie={sea:{name:"Sea",url:Q},town:{name:"Town",url:X},street:{name:"Street",url:ee},car:{name:"Car",url:te},air_ballon:{name:"Air ballon",url:se},tag:{name:"Tag",url:ne},cosy:{name:"Cozy",url:ae},nut:{name:"Nut",url:le}};function Ie(a,e){const n=Math.sqrt(e*a.y/a.x);return{x:Math.round(e/n),y:Math.round(n)}}function be(a,e){a.searchParams.set("n",`${e.tileCount}`),a.searchParams.set("s",`${encodeURIComponent(e.seed)}`),e.kind=="static"&&a.searchParams.set("i",encodeURIComponent(e.key)),e.kind=="custom"&&a.searchParams.set("c",encodeURIComponent(JSON.stringify(e.image)))}function Me(a){const e=a.searchParams.get("n");if(!e)throw new Error("missing 'n' url parameter");const n=parseInt(e),l=a.searchParams.get("s");if(!l)throw new Error("missing 's' url parameter");const t=decodeURIComponent(l),s=a.searchParams.get("i"),i=a.searchParams.get("c");if(s)return{kind:"static",tileCount:n,seed:t,key:s};if(i){const c=JSON.parse(decodeURIComponent(i));return{kind:"custom",tileCount:n,seed:t,image:c}}else throw new Error("missing 'c' or 's' url parameter")}function ye(a){if(a.kind=="static"){const e=ie[a.key];if(!e)throw new Error(`unknown image key '${a.key}'`);return e}else return a.image}function Ce(a){let e=1779033703,n=3144134277,l=1013904242,t=2773480762;for(let s=0,i;s<a.length;s++)i=a.charCodeAt(s),e=n^Math.imul(e^i,597399067),n=l^Math.imul(n^i,2869860233),l=t^Math.imul(l^i,951274213),t=e^Math.imul(t^i,2716044179);return e=Math.imul(l^e>>>18,597399067),n=Math.imul(t^n>>>22,2869860233),l=Math.imul(e^l>>>17,951274213),t=Math.imul(n^t>>>19,2716044179),e^=n^l^t,n^=e,l^=e,t^=e,{a:e>>>0,b:n>>>0,c:l>>>0,d:t>>>0}}function Re(a){let{a:e,b:n,c:l,d:t}=a;return function(){e|=0,n|=0,l|=0,t|=0;let s=(e+n|0)+t|0;return t=t+1|0,e=n^n>>>9,n=l+(l<<3)|0,l=l<<21|l>>>11,l=l+s|0,(s>>>0)/4294967296}}function Se(a,e){let n=e.length,l;for(;n!=0;)l=Math.floor(a()*n),n--,[e[n],e[l]]=[e[l],e[n]]}function Ue(a,e){let n="";const l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=l.length;let s=0;for(;s<e;)n+=l.charAt(Math.floor(a()*t)),s+=1;return n}function re(a){let e,n,l=`<img src="${Y}/favicon.png" alt="logo" class="svelte-134mbkx"/> <h1 class="svelte-134mbkx">Picture slicer</h1>`,t,s;const i=a[1].default,c=U(i,a,a[0],null);return{c(){e=w("header"),n=w("div"),n.innerHTML=l,t=B(),c&&c.c(),this.h()},l(r){e=_(r,"HEADER",{class:!0});var u=R(e);n=_(u,"DIV",{class:!0,"data-svelte-h":!0}),O(n)!=="svelte-1rs3xkn"&&(n.innerHTML=l),t=J(u),c&&c.l(u),u.forEach(d),this.h()},h(){v(n,"class","logo-bar svelte-134mbkx"),v(e,"class","svelte-134mbkx")},m(r,u){b(r,e,u),q(e,n),q(e,t),c&&c.m(e,null),s=!0},p(r,[u]){c&&c.p&&(!s||u&1)&&E(c,i,r,r[0],s?H(i,r[0],u,null):L(r[0]),null)},i(r){s||($(c,r),s=!0)},o(r){S(c,r),s=!1},d(r){r&&d(e),c&&c.d(r)}}}function oe(a,e,n){let{$$slots:l={},$$scope:t}=e;return a.$$set=s=>{"$$scope"in s&&n(0,t=s.$$scope)},[t,l]}class Ee extends k{constructor(e){super(),I(this,e,oe,re,M,{})}}function ce(a){let e,n='<a class="button" href="https://github.com/VivienGaluchot/svelte-kit-img-shuffle/issues" target="_blank">🐞 see a bug?</a>';return{c(){e=w("footer"),e.innerHTML=n,this.h()},l(l){e=_(l,"FOOTER",{class:!0,"data-svelte-h":!0}),O(e)!=="svelte-nr4tmr"&&(e.innerHTML=n),this.h()},h(){v(e,"class","svelte-1fnk7ix")},m(l,t){b(l,e,t)},p:W,i:W,o:W,d(l){l&&d(e)}}}class Le extends k{constructor(e){super(),I(this,e,null,ce,M,{})}}function ue(a){let e,n;const l=a[2].default,t=U(l,a,a[1],null);return{c(){e=w("div"),t&&t.c(),this.h()},l(s){e=_(s,"DIV",{style:!0,class:!0});var i=R(e);t&&t.l(i),i.forEach(d),this.h()},h(){D(e,"max-width",a[0]),v(e,"class","svelte-da5i2p")},m(s,i){b(s,e,i),t&&t.m(e,null),n=!0},p(s,[i]){t&&t.p&&(!n||i&2)&&E(t,l,s,s[1],n?H(l,s[1],i,null):L(s[1]),null),(!n||i&1)&&D(e,"max-width",s[0])},i(s){n||($(t,s),n=!0)},o(s){S(t,s),n=!1},d(s){s&&d(e),t&&t.d(s)}}}function fe(a,e,n){let{$$slots:l={},$$scope:t}=e,{maxWidth:s="unset"}=e;return a.$$set=i=>{"maxWidth"in i&&n(0,s=i.maxWidth),"$$scope"in i&&n(1,t=i.$$scope)},[s,t,l]}class He extends k{constructor(e){super(),I(this,e,fe,ue,M,{maxWidth:0})}}function he(a){let e,n;const l=a[1].default,t=U(l,a,a[0],null);return{c(){e=w("div"),t&&t.c(),this.h()},l(s){e=_(s,"DIV",{class:!0});var i=R(e);t&&t.l(i),i.forEach(d),this.h()},h(){v(e,"class","svelte-10od45t")},m(s,i){b(s,e,i),t&&t.m(e,null),n=!0},p(s,[i]){t&&t.p&&(!n||i&1)&&E(t,l,s,s[0],n?H(l,s[0],i,null):L(s[0]),null)},i(s){n||($(t,s),n=!0)},o(s){S(t,s),n=!1},d(s){s&&d(e),t&&t.d(s)}}}function me(a,e,n){let{$$slots:l={},$$scope:t}=e;return a.$$set=s=>{"$$scope"in s&&n(0,t=s.$$scope)},[t,l]}class Pe extends k{constructor(e){super(),I(this,e,me,he,M,{})}}export{He as C,Le as F,Ee as H,$e as S,be as a,Ue as b,Pe as c,Ie as d,we as e,Se as f,ye as g,Re as h,Ce as i,_e as j,Me as k,ie as s,ke as t,ve as u};
