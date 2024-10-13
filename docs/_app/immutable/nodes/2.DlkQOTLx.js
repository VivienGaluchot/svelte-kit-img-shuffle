import{s as se,n as M,e as le,r as ie}from"../chunks/scheduler.BQAbF66X.js";import{S as ae,i as ne,n as K,g as D,d as m,z as oe,e as d,s as I,t as q,c as v,a as k,f as w,b as O,p as $,q as Q,h as f,j as fe,v as U,k as ce,w as P,x as S,l as A,m as H,y as L,A as X,B as Y}from"../chunks/index.l2PWj1v_.js";import{b as ue}from"../chunks/paths.Bif0m1Mf.js";import{e as Z,C as me,H as $e,a as he,F as _e,S as x,s as ge}from"../chunks/content.B-1a-dId.js";function ee(i,a,n){const s=i.slice();return s[2]=a[n],s}function te(i){let a,n,s,t,e,r=i[2].name+"",l,c,o,g,b,V,N,C,u,h,E,y,B,T,F;return{c(){a=d("div"),n=d("div"),s=d("div"),t=I(),e=d("div"),l=q(r),c=I(),o=d("div"),g=d("a"),b=q("Easy"),N=I(),C=d("a"),u=q("Medium"),E=I(),y=d("a"),B=q("Hard"),F=I(),this.h()},l(_){a=v(_,"DIV",{class:!0});var p=k(a);n=v(p,"DIV",{class:!0});var j=k(n);s=v(j,"DIV",{class:!0,style:!0}),k(s).forEach(m),t=w(j),e=v(j,"DIV",{class:!0});var z=k(e);l=O(z,r),z.forEach(m),j.forEach(m),c=w(p),o=v(p,"DIV",{class:!0});var R=k(o);g=v(R,"A",{class:!0,href:!0});var J=k(g);b=O(J,"Easy"),J.forEach(m),N=w(R),C=v(R,"A",{class:!0,href:!0});var W=k(C);u=O(W,"Medium"),W.forEach(m),E=w(R),y=v(R,"A",{class:!0,href:!0});var G=k(y);B=O(G,"Hard"),G.forEach(m),R.forEach(m),F=w(p),p.forEach(m),this.h()},h(){$(s,"class","icon svelte-hsov69"),Q(s,"background-image","url("+i[2].url+")"),$(e,"class","img-name svelte-hsov69"),$(n,"class","flex-h g-sm svelte-hsov69"),$(g,"class","button"),$(g,"href",V=i[1](40,i[2])),$(C,"class","button"),$(C,"href",h=i[1](80,i[2])),$(y,"class","button"),$(y,"href",T=i[1](120,i[2])),$(o,"class","flex-h g-sm svelte-hsov69"),$(a,"class","flex-h row svelte-hsov69")},m(_,p){D(_,a,p),f(a,n),f(n,s),f(n,t),f(n,e),f(e,l),f(a,c),f(a,o),f(o,g),f(g,b),f(o,N),f(o,C),f(C,u),f(o,E),f(o,y),f(y,B),f(a,F)},p(_,p){p&1&&Q(s,"background-image","url("+_[2].url+")"),p&1&&r!==(r=_[2].name+"")&&fe(l,r),p&1&&V!==(V=_[1](40,_[2]))&&$(g,"href",V),p&1&&h!==(h=_[1](80,_[2]))&&$(C,"href",h),p&1&&T!==(T=_[1](120,_[2]))&&$(y,"href",T)},d(_){_&&m(a)}}}function pe(i){let a,n=Z(i[0]),s=[];for(let t=0;t<n.length;t+=1)s[t]=te(ee(i,n,t));return{c(){for(let t=0;t<s.length;t+=1)s[t].c();a=K()},l(t){for(let e=0;e<s.length;e+=1)s[e].l(t);a=K()},m(t,e){for(let r=0;r<s.length;r+=1)s[r]&&s[r].m(t,e);D(t,a,e)},p(t,[e]){if(e&3){n=Z(t[0]);let r;for(r=0;r<n.length;r+=1){const l=ee(t,n,r);s[r]?s[r].p(l,e):(s[r]=te(l),s[r].c(),s[r].m(a.parentNode,a))}for(;r<s.length;r+=1)s[r].d(1);s.length=n.length}},i:M,o:M,d(t){t&&m(a),oe(s,t)}}}function de(i,a,n){function s(e,r){let l=new URL(`${ue}/play`,window.location.origin);return l.searchParams.set("n",`${e}`),l.searchParams.set("i",`${encodeURIComponent(JSON.stringify(r))}`),l.toString()}let{images:t}=a;return i.$$set=e=>{"images"in e&&n(0,t=e.images)},[t,s]}class re extends ae{constructor(a){super(),ne(this,a,de,pe,se,{images:0})}}function ve(i){let a,n,s;return n=new re({props:{images:ge}}),{c(){a=q(`Choose an image
			`),U(n.$$.fragment)},l(t){a=O(t,`Choose an image
			`),P(n.$$.fragment,t)},m(t,e){D(t,a,e),S(n,t,e),s=!0},p:M,i(t){s||(A(n.$$.fragment,t),s=!0)},o(t){H(n.$$.fragment,t),s=!1},d(t){t&&m(a),L(n,t)}}}function be(i){let a,n,s="Play with custom image",t,e,r,l="+",c,o,g,b,V,N,C;return b=new re({props:{images:i[1]}}),{c(){a=d("div"),n=d("div"),n.textContent=s,t=I(),e=d("div"),r=d("button"),r.textContent=l,c=I(),o=d("input"),g=I(),U(b.$$.fragment),this.h()},l(u){a=v(u,"DIV",{class:!0});var h=k(a);n=v(h,"DIV",{"data-svelte-h":!0}),X(n)!=="svelte-19f51kg"&&(n.textContent=s),t=w(h),e=v(h,"DIV",{});var E=k(e);r=v(E,"BUTTON",{class:!0,"data-svelte-h":!0}),X(r)!=="svelte-1bdsucn"&&(r.textContent=l),c=w(E),o=v(E,"INPUT",{type:!0,accept:!0}),E.forEach(m),h.forEach(m),g=w(u),P(b.$$.fragment,u),this.h()},h(){$(r,"class","button"),o.hidden=!0,$(o,"type","file"),$(o,"accept","image/*"),$(a,"class","flex-h svelte-mfg0e8")},m(u,h){D(u,a,h),f(a,n),f(a,t),f(a,e),f(e,r),f(e,c),f(e,o),i[4](o),D(u,g,h),S(b,u,h),V=!0,N||(C=[Y(r,"click",i[3]),Y(o,"change",i[5])],N=!0)},p(u,h){const E={};h&2&&(E.images=u[1]),b.$set(E)},i(u){V||(A(b.$$.fragment,u),V=!0)},o(u){H(b.$$.fragment,u),V=!1},d(u){u&&(m(a),m(g)),i[4](null),L(b,u),N=!1,ie(C)}}}function Ie(i){let a,n,s,t;return a=new x({props:{$$slots:{default:[ve]},$$scope:{ctx:i}}}),s=new x({props:{$$slots:{default:[be]},$$scope:{ctx:i}}}),{c(){U(a.$$.fragment),n=I(),U(s.$$.fragment)},l(e){P(a.$$.fragment,e),n=w(e),P(s.$$.fragment,e)},m(e,r){S(a,e,r),D(e,n,r),S(s,e,r),t=!0},p(e,r){const l={};r&64&&(l.$$scope={dirty:r,ctx:e}),a.$set(l);const c={};r&71&&(c.$$scope={dirty:r,ctx:e}),s.$set(c)},i(e){t||(A(a.$$.fragment,e),A(s.$$.fragment,e),t=!0)},o(e){H(a.$$.fragment,e),H(s.$$.fragment,e),t=!1},d(e){e&&m(n),L(a,e),L(s,e)}}}function we(i){let a,n,s,t,e,r;return a=new $e({}),s=new he({props:{$$slots:{default:[Ie]},$$scope:{ctx:i}}}),e=new _e({}),{c(){U(a.$$.fragment),n=I(),U(s.$$.fragment),t=I(),U(e.$$.fragment)},l(l){P(a.$$.fragment,l),n=w(l),P(s.$$.fragment,l),t=w(l),P(e.$$.fragment,l)},m(l,c){S(a,l,c),D(l,n,c),S(s,l,c),D(l,t,c),S(e,l,c),r=!0},p(l,c){const o={};c&71&&(o.$$scope={dirty:c,ctx:l}),s.$set(o)},i(l){r||(A(a.$$.fragment,l),A(s.$$.fragment,l),A(e.$$.fragment,l),r=!0)},o(l){H(a.$$.fragment,l),H(s.$$.fragment,l),H(e.$$.fragment,l),r=!1},d(l){l&&(m(n),m(t)),L(a,l),L(s,l),L(e,l)}}}function Ce(i){let a,n,s;return n=new me({props:{maxWidth:"35rem",$$slots:{default:[we]},$$scope:{ctx:i}}}),{c(){a=I(),U(n.$$.fragment),this.h()},l(t){ce("svelte-oh93rq",document.head).forEach(m),a=w(t),P(n.$$.fragment,t),this.h()},h(){document.title="Picture slicer"},m(t,e){D(t,a,e),S(n,t,e),s=!0},p(t,[e]){const r={};e&71&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){s||(A(n.$$.fragment,t),s=!0)},o(t){H(n.$$.fragment,t),s=!1},d(t){t&&m(a),L(n,t)}}}function Ee(i,a,n){let s=[],t,e=null;const r=()=>t.click();function l(o){le[o?"unshift":"push"](()=>{t=o,n(2,t)})}function c(){e=this.files,n(0,e)}return i.$$.update=()=>{if(i.$$.dirty&1&&e){const o=e[0];o&&n(1,s=[{name:o.name,url:URL.createObjectURL(o)}])}},[e,s,t,r,l,c]}class Ue extends ae{constructor(a){super(),ne(this,a,Ee,Ce,se,{})}}export{Ue as component};