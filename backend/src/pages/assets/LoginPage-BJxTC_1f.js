import{d as B,r as n,o as S,c as i,a as t,b as m,w as y,u,e as C,F as b,f as l,t as V,g as k,v as h,h as q,i as U,j as A,k as r,B as P}from"./index-B3CwRWb_.js";import{u as R,U as $,r as D,N as F,S as M}from"./apath-DMI8AX7m.js";import{N as T}from"./headers-DdkgHe7O.js";const j={class:"ax-card ax-center ax-main"},E={class:"append-text"},H=["href"],I={class:"ax-input-box"},L=["disabled"],X={class:"ax-input-box"},z=["disabled"],G={class:"ax-button-box"},W=B({__name:"LoginPage",setup(J){const d=q(),w=U(),g=R(),o=n(d.query.service||"default"),s=n(!0),v=n(new M);let p=d.query.path;const c=n(""),f=n("");async function _(){if(s.value)return;s.value=!0;const a=await $.login(c.value,f.value,o.value);s.value=!1,a.success?(g.success({title:"登录成功",duration:3e3}),location.href=D(d.query.path,a.tgt,a.ticket)):g.error({title:"登录失败",content:a.message,duration:3e3})}return S(async()=>{try{await v.value.fetch(o.value),p||(p=v.value.servicePath??`https://go.abstrax.cn/?service=${o.value}`)}catch(a){a.response&&a.response.status===404?(console.warn(`Service ${o.value} not found`),o.value="default"):w.push({path:"/error",query:{code:500,mes:`查询服务${o}信息时出错`}})}finally{s.value=!1}}),(a,e)=>{const N=A("router-link");return r(),i(b,null,[t("div",j,[m(u(T),{class:"ax-header"},{default:y(()=>e[2]||(e[2]=[l("AbstraX")])),_:1}),t("div",E,[s.value?(r(),C(u(F),{key:0,text:"",style:{width:"60%"}})):(r(),i(b,{key:1},[e[3]||(e[3]=l(" 登录至")),o.value!=="default"?(r(),i("a",{key:0,href:u(p)},V(v.value.serviceName),9,H)):(r(),i(b,{key:1},[l("Abstrax CAS")],64))],64))]),t("div",I,[k(t("input",{class:"ax-input",type:"text","onUpdate:modelValue":e[0]||(e[0]=x=>c.value=x),placeholder:"用户名, 邮箱, 或者手机号",disabled:s.value},null,8,L),[[h,c.value]]),e[4]||(e[4]=t("div",{class:"ax-input-bar"},null,-1))]),t("div",X,[k(t("input",{class:"ax-input",type:"password","onUpdate:modelValue":e[1]||(e[1]=x=>f.value=x),placeholder:"密码",disabled:s.value},null,8,z),[[h,f.value]]),e[5]||(e[5]=t("div",{class:"ax-input-bar"},null,-1))]),t("div",G,[t("div",null,[e[7]||(e[7]=l(" 还没账号，立刻")),m(N,{to:"/register"},{default:y(()=>e[6]||(e[6]=[l("注册")])),_:1})]),m(u(P),{type:"info",style:{"border-radius":"0","padding-left":"40px","padding-right":"40px"},disabled:s.value,onClick:_},{default:y(()=>e[8]||(e[8]=[l("登录")])),_:1},8,["disabled"])])]),e[9]||(e[9]=t("div",{class:"ax-light"},null,-1))],64)}}});export{W as default};
