import{d as y,c as b,a as i,b as s,w as o,u as t,t as k,F as C,h as N,i as _,k as v,f as d,B as l}from"./index-CWOFgP__.js";import{N as B}from"./headers-ChCDR5PC.js";import{N as E}from"./Result-qGpdCfXd.js";const q={class:"ax-card ax-center ax-main"},w={class:"append-text"},D=y({__name:"ErrorPage",setup(R){const a=N(),u=_();function p(n){return["403","404","500","error","info","success","warning","418"].includes(String(n))?String(n):"error"}const r=Number(a.query.code)||1234,c=a.query.mes||`${r} 错误`,f={400:"若方法不对，无论多么努力，都无法寻得心中的那个她。",403:"被她拒绝时也无需灰心，提升自我，或许下次机会便被受。",404:"虽迷失于寻找她的路途，但请相信，总有新方向等你去发现。",500:"每个人都有崩溃的瞬间，但只需重整旗鼓，前路依旧光明。",502:"暂时的挫折是成功的垫脚石，在追梦的旅程中，永远不要灰心。",504:"等待虽苦，但心怀信念，终将跨越时空，追逐梦想。"},x=a.query.explain||f[r]||"未知的错误如同心中的一抹阴霾，虽不明其因，但时光终会带来答案。";function m(){u.back()}function g(){u.push("/")}return(n,e)=>(v(),b(C,null,[i("div",q,[s(t(B),{class:"ax-header"},{default:o(()=>e[0]||(e[0]=[d("AbstraX")])),_:1}),i("div",w," 发生"+k(t(r))+" 错误 ",1),s(t(E),{status:p(t(r)),title:t(c),description:t(x)},{footer:o(()=>[s(t(l),{type:"info",secondary:"",onClick:m,style:{"border-radius":"0","padding-left":"40px","padding-right":"40px"}},{default:o(()=>e[1]||(e[1]=[d("返回")])),_:1}),s(t(l),{type:"info",onClick:g,style:{"margin-left":"5px","border-radius":"0","padding-left":"40px","padding-right":"40px"}},{default:o(()=>e[2]||(e[2]=[d("首页")])),_:1})]),_:1},8,["status","title","description"])]),e[3]||(e[3]=i("div",{class:"ax-light"},null,-1))],64))}});export{D as default};
