import{q as Q,s as n,x as o,y as w,z as f,A as Y,C as Z,D as oo,E as V,d as _,G as ro,H as eo,I as R,J as to,K as lo,L as M,r as N,o as ao,c as h,a,b as g,w as x,u as i,e as $,F as C,f as v,t as T,i as no,k as p,B as L}from"./index-aVLYjZOP.js";import{B as io}from"./BaseServices-CFey6swV.js";import{N as so}from"./headers-Bz4uihiD.js";import{N as m}from"./settings-Cyt-79II.js";const co={thPaddingSmall:"6px",thPaddingMedium:"12px",thPaddingLarge:"12px",tdPaddingSmall:"6px",tdPaddingMedium:"12px",tdPaddingLarge:"12px"};function bo(d){const{dividerColor:e,cardColor:l,modalColor:t,popoverColor:s,tableHeaderColor:b,tableColorStriped:c,textColor1:r,textColor2:u,borderRadius:y,fontWeightStrong:k,lineHeight:z,fontSizeSmall:P,fontSizeMedium:S,fontSizeLarge:B}=d;return Object.assign(Object.assign({},co),{fontSizeSmall:P,fontSizeMedium:S,fontSizeLarge:B,lineHeight:z,borderRadius:y,borderColor:n(l,e),borderColorModal:n(t,e),borderColorPopover:n(s,e),tdColor:l,tdColorModal:t,tdColorPopover:s,tdColorStriped:n(l,c),tdColorStripedModal:n(t,c),tdColorStripedPopover:n(s,c),thColor:n(l,b),thColorModal:n(t,b),thColorPopover:n(s,b),thTextColor:r,tdTextColor:u,thFontWeight:k})}const go={name:"Table",common:Q,self:bo},po=o([w("table",`
 font-size: var(--n-font-size);
 font-variant-numeric: tabular-nums;
 line-height: var(--n-line-height);
 width: 100%;
 border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;
 text-align: left;
 border-collapse: separate;
 border-spacing: 0;
 overflow: hidden;
 background-color: var(--n-td-color);
 border-color: var(--n-merged-border-color);
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 --n-merged-border-color: var(--n-border-color);
 `,[o("th",`
 white-space: nowrap;
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 text-align: inherit;
 padding: var(--n-th-padding);
 vertical-align: inherit;
 text-transform: none;
 border: 0px solid var(--n-merged-border-color);
 font-weight: var(--n-th-font-weight);
 color: var(--n-th-text-color);
 background-color: var(--n-th-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 border-right: 1px solid var(--n-merged-border-color);
 `,[o("&:last-child",`
 border-right: 0px solid var(--n-merged-border-color);
 `)]),o("td",`
 transition:
 background-color .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 color .3s var(--n-bezier);
 padding: var(--n-td-padding);
 color: var(--n-td-text-color);
 background-color: var(--n-td-color);
 border: 0px solid var(--n-merged-border-color);
 border-right: 1px solid var(--n-merged-border-color);
 border-bottom: 1px solid var(--n-merged-border-color);
 `,[o("&:last-child",`
 border-right: 0px solid var(--n-merged-border-color);
 `)]),f("bordered",`
 border: 1px solid var(--n-merged-border-color);
 border-radius: var(--n-border-radius);
 `,[o("tr",[o("&:last-child",[o("td",`
 border-bottom: 0 solid var(--n-merged-border-color);
 `)])])]),f("single-line",[o("th",`
 border-right: 0px solid var(--n-merged-border-color);
 `),o("td",`
 border-right: 0px solid var(--n-merged-border-color);
 `)]),f("single-column",[o("tr",[o("&:not(:last-child)",[o("td",`
 border-bottom: 0px solid var(--n-merged-border-color);
 `)])])]),f("striped",[o("tr:nth-of-type(even)",[o("td","background-color: var(--n-td-color-striped)")])]),Y("bottom-bordered",[o("tr",[o("&:last-child",[o("td",`
 border-bottom: 0px solid var(--n-merged-border-color);
 `)])])])]),Z(w("table",`
 background-color: var(--n-td-color-modal);
 --n-merged-border-color: var(--n-border-color-modal);
 `,[o("th",`
 background-color: var(--n-th-color-modal);
 `),o("td",`
 background-color: var(--n-td-color-modal);
 `)])),oo(w("table",`
 background-color: var(--n-td-color-popover);
 --n-merged-border-color: var(--n-border-color-popover);
 `,[o("th",`
 background-color: var(--n-th-color-popover);
 `),o("td",`
 background-color: var(--n-td-color-popover);
 `)]))]),uo=Object.assign(Object.assign({},V.props),{bordered:{type:Boolean,default:!0},bottomBordered:{type:Boolean,default:!0},singleLine:{type:Boolean,default:!0},striped:Boolean,singleColumn:Boolean,size:{type:String,default:"medium"}}),ho=_({name:"Table",props:uo,setup(d){const{mergedClsPrefixRef:e,inlineThemeDisabled:l,mergedRtlRef:t}=ro(d),s=V("Table","-table",po,go,d,e),b=eo("Table",t,e),c=R(()=>{const{size:u}=d,{self:{borderColor:y,tdColor:k,tdColorModal:z,tdColorPopover:P,thColor:S,thColorModal:B,thColorPopover:E,thTextColor:H,tdTextColor:O,borderRadius:j,thFontWeight:A,lineHeight:F,borderColorModal:D,borderColorPopover:I,tdColorStriped:W,tdColorStripedModal:q,tdColorStripedPopover:K,[M("fontSize",u)]:U,[M("tdPadding",u)]:G,[M("thPadding",u)]:J},common:{cubicBezierEaseInOut:X}}=s.value;return{"--n-bezier":X,"--n-td-color":k,"--n-td-color-modal":z,"--n-td-color-popover":P,"--n-td-text-color":O,"--n-border-color":y,"--n-border-color-modal":D,"--n-border-color-popover":I,"--n-border-radius":j,"--n-font-size":U,"--n-th-color":S,"--n-th-color-modal":B,"--n-th-color-popover":E,"--n-th-font-weight":A,"--n-th-text-color":H,"--n-line-height":F,"--n-td-padding":G,"--n-th-padding":J,"--n-td-color-striped":W,"--n-td-color-striped-modal":q,"--n-td-color-striped-popover":K}}),r=l?to("table",R(()=>d.size[0]),c,d):void 0;return{rtlEnabled:b,mergedClsPrefix:e,cssVars:l?void 0:c,themeClass:r==null?void 0:r.themeClass,onRender:r==null?void 0:r.onRender}},render(){var d;const{mergedClsPrefix:e}=this;return(d=this.onRender)===null||d===void 0||d.call(this),lo("table",{class:[`${e}-table`,this.themeClass,{[`${e}-table--rtl`]:this.rtlEnabled,[`${e}-table--bottom-bordered`]:this.bottomBordered,[`${e}-table--bordered`]:this.bordered,[`${e}-table--single-line`]:this.singleLine,[`${e}-table--single-column`]:this.singleColumn,[`${e}-table--striped`]:this.striped}],style:this.cssVars},this.$slots)}}),vo={class:"ax-card ax-center ax-main"},mo={class:"append-text"},fo={key:0,style:{display:"flex","flex-direction":"column",gap:"10px"}},zo=_({__name:"UserTickets",setup(d){const e=no(),l=N(!0),t=N({login:!1}),s=()=>{e.push("/")},b=()=>{e.push("/register")};return ao(async()=>{try{t.value=await io.getAuthTickets()}catch{e.push({path:"/error",query:{code:500,mes:"查询票据信息时出错"}})}finally{l.value=!1}}),(c,r)=>(p(),h(C,null,[a("div",vo,[g(i(so),{class:"ax-header"},{default:x(()=>r[0]||(r[0]=[v("AbstraX")])),_:1}),a("div",mo,[l.value?(p(),$(i(m),{key:0,style:{width:"60%"}})):t.value.login?(p(),h(C,{key:2},[v(" 欢迎您，"+T(t.value.user),1)],64)):(p(),h(C,{key:1},[v(" 看起来您还没有登录 ")],64))]),l.value?(p(),h("div",fo,[g(i(m),{style:{width:"60%"}}),g(i(m),{style:{width:"40%"}}),g(i(m),{style:{width:"20%"}}),g(i(m),{style:{width:"80%"}})])):t.value.login?(p(),$(i(ho),{key:2},{default:x(()=>[a("tbody",null,[a("tr",null,[r[3]||(r[3]=a("td",null,"IP",-1)),a("td",null,T(t.value.auth.ip),1)]),a("tr",null,[r[4]||(r[4]=a("td",null,"UA",-1)),a("td",null,T(t.value.auth.ua),1)])])]),_:1})):(p(),h(C,{key:1},[g(i(L),{type:"info",onClick:s,style:{"border-radius":"0","padding-left":"40px","padding-right":"40px"}},{default:x(()=>r[1]||(r[1]=[v("登录")])),_:1}),g(i(L),{type:"info",secondary:"",onClick:b,style:{"margin-left":"5px","border-radius":"0","padding-left":"40px","padding-right":"40px"}},{default:x(()=>r[2]||(r[2]=[v("注册")])),_:1})],64))]),r[5]||(r[5]=a("div",{class:"ax-light"},null,-1))],64))}});export{zo as default};
