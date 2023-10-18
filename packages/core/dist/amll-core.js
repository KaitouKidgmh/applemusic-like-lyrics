"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const C=require("@pixi/display"),z=require("@pixi/app"),y=require("@pixi/filter-blur"),v=require("@pixi/filter-color-matrix"),D=require("@pixi/core"),w=require("@pixi/sprite"),P=require("@pixi/filter-bulge-pinch"),A=require("jss"),I=require("jss-preset-default"),B=/^(((?<hour>[0-9]+):)?(?<min>[0-9]+):)?(?<sec>[0-9]+([\.:]([0-9]+))?)/;function T(h){const e=B.exec(h);if(e){const t=Number(e.groups?.hour||"0"),i=Number(e.groups?.min||"0"),s=Number(e.groups?.sec.replace(/:/,".")||"0");return Math.floor((t*3600+i*60+s)*1e3)}else throw new TypeError("时间戳字符串解析失败")}function k(h){const t=new DOMParser().parseFromString(h,"application/xml");let i="v1";for(const r of t.querySelectorAll("ttm\\:agent"))if(r.getAttribute("type")==="person"){const n=r.getAttribute("xml:id");n&&(i=n)}const s=[];for(const r of t.querySelectorAll("body p[begin][end]")){const n={words:[],startTime:T(r.getAttribute("begin")??"0:0"),endTime:T(r.getAttribute("end")??"0:0"),translatedLyric:"",romanLyric:"",isBG:!1,isDuet:r.getAttribute("ttm:agent")!==i};let a=null;for(const l of r.childNodes)if(l.nodeType===Node.TEXT_NODE){const o=l.textContent??"";/^(\s+)$/.test(o)?n.words.push({word:" ",startTime:0,endTime:0}):n.words.push({word:o,startTime:0,endTime:0})}else if(l.nodeType===Node.ELEMENT_NODE){const o=l,c=o.getAttribute("ttm:role");if(o.nodeName==="span"&&c)if(c==="x-bg"){const d={words:[],startTime:n.startTime,endTime:n.endTime,translatedLyric:"",romanLyric:"",isBG:!0,isDuet:n.isDuet};for(const m of o.childNodes)if(m.nodeType===Node.TEXT_NODE){const p=m.textContent??"";/^(\s+)$/.test(p)?d.words.push({word:" ",startTime:0,endTime:0}):d.words.push({word:p,startTime:0,endTime:0})}else if(m.nodeType===Node.ELEMENT_NODE){const p=m,L=p.getAttribute("ttm:role");if(p.nodeName==="span"&&L)L==="x-translation"?d.translatedLyric=p.innerHTML.trim():L==="x-roman"&&(d.romanLyric=p.innerHTML.trim());else if(p.hasAttribute("begin")&&p.hasAttribute("end")){const b={word:m.textContent,startTime:T(p.getAttribute("begin")),endTime:T(p.getAttribute("end"))};d.words.push(b)}}const u=d.words[0];d.startTime=u.startTime,u?.word.startsWith("(")&&(u.word=u.word.substring(1));const f=d.words[d.words.length-1];d.endTime=f.endTime,f?.word.endsWith(")")&&(f.word=f.word.substring(0,f.word.length-1)),a=d}else c==="x-translation"?n.translatedLyric=o.innerHTML:c==="x-roman"&&(n.romanLyric=o.innerHTML);else if(o.hasAttribute("begin")&&o.hasAttribute("end")){const d={word:l.textContent??"",startTime:T(o.getAttribute("begin")),endTime:T(o.getAttribute("end"))};n.words.push(d)}}s.push(n),a&&s.push(a)}return s}const F=Object.freeze(Object.defineProperty({__proto__:null,parseTTML:k},Symbol.toStringTag,{value:"Module"}));class O extends C.Container{time=0}class q{constructor(e){this.canvas=e;const t=e.getBoundingClientRect();this.canvas.width=t.width*this.currerntRenderScale,this.canvas.height=t.height*this.currerntRenderScale,this.observer=new ResizeObserver(()=>{const i=e.getBoundingClientRect();this.canvas.width=Math.max(1,i.width),this.canvas.height=Math.max(1,i.height),this.app.renderer.resize(this.canvas.width*this.currerntRenderScale,this.canvas.height*this.currerntRenderScale),this.app.ticker.start(),this.rebuildFilters()}),this.observer.observe(e),this.app=new z.Application({view:e,resizeTo:this.canvas,powerPreference:"low-power",backgroundAlpha:0}),this.rebuildFilters(),this.app.ticker.add(this.onTick),this.app.ticker.start()}observer;app;curContainer;staticMode=!1;lastContainer=new Set;onTick=e=>{for(const t of this.lastContainer)t.alpha=Math.max(0,t.alpha-e/60),t.alpha<=0&&(this.app.stage.removeChild(t),this.lastContainer.delete(t),t.destroy(!0));if(this.curContainer){this.curContainer.alpha=Math.min(1,this.curContainer.alpha+e/60);const[t,i,s,r]=this.curContainer.children,n=Math.max(this.app.screen.width,this.app.screen.height);t.position.set(this.app.screen.width/2,this.app.screen.height/2),i.position.set(this.app.screen.width/2.5,this.app.screen.height/2.5),s.position.set(this.app.screen.width/2,this.app.screen.height/2),r.position.set(this.app.screen.width/2,this.app.screen.height/2),t.width=n*Math.sqrt(2),t.height=t.width,i.width=n*.8,i.height=i.width,s.width=n*.5,s.height=s.width,r.width=n*.25,r.height=r.width,this.curContainer.time+=e*this.flowSpeed,t.rotation+=e/1e3*this.flowSpeed,i.rotation-=e/500*this.flowSpeed,s.rotation+=e/1e3*this.flowSpeed,r.rotation-=e/750*this.flowSpeed,s.x=this.app.screen.width/2+this.app.screen.width/4*Math.cos(this.curContainer.time/1e3*.75),s.y=this.app.screen.height/2+this.app.screen.width/4*Math.cos(this.curContainer.time/1e3*.75),r.x=this.app.screen.width/2+this.app.screen.width/4*.1+Math.cos(this.curContainer.time*.006*.75),r.y=this.app.screen.height/2+this.app.screen.width/4*.1+Math.cos(this.curContainer.time*.006*.75),this.curContainer.alpha>=1&&this.lastContainer.size===0&&this.staticMode&&this.app.ticker.stop()}};flowSpeed=2;currerntRenderScale=.75;setFlowSpeed(e){this.flowSpeed=e}setRenderScale(e){this.currerntRenderScale=e;const t=this.canvas.getBoundingClientRect();this.canvas.width=Math.max(1,t.width),this.canvas.height=Math.max(1,t.height),this.app.renderer.resize(this.canvas.width*this.currerntRenderScale,this.canvas.height*this.currerntRenderScale),this.rebuildFilters()}rebuildFilters(){const e=Math.min(this.canvas.width,this.canvas.height),t=Math.max(this.canvas.width,this.canvas.height),i=new v.ColorMatrixFilter;i.saturate(1.2,!1);const s=new v.ColorMatrixFilter;s.brightness(.6,!1);const r=new v.ColorMatrixFilter;r.contrast(.3,!0),this.app.stage.filters?.forEach(n=>{n.destroy()}),this.app.stage.filters=[],this.app.stage.filters.push(new y.BlurFilter(5,1)),this.app.stage.filters.push(new y.BlurFilter(10,1)),this.app.stage.filters.push(new y.BlurFilter(20,2)),this.app.stage.filters.push(new y.BlurFilter(40,2)),this.app.stage.filters.push(new y.BlurFilter(80,2)),e>768&&this.app.stage.filters.push(new y.BlurFilter(160,4)),e>768*2&&this.app.stage.filters.push(new y.BlurFilter(320,4)),this.app.stage.filters.push(i,s,r),this.app.stage.filters.push(new y.BlurFilter(5,1)),this.app.stage.filters.push(new P.BulgePinchFilter({radius:(t+e)/2,strength:1,center:[.25,1]})),this.app.stage.filters.push(new P.BulgePinchFilter({radius:(t+e)/2,strength:1,center:[.75,0]}))}setStaticMode(e=!1){this.staticMode=e,this.app.ticker.start()}setFPS(e){this.app.ticker.maxFPS=e}pause(){this.app.ticker.stop(),this.app.render()}resume(){this.app.ticker.start()}async setAlbumImage(e){const t=new Image;t.src=e;let i=5,s;for(;!s?.baseTexture?.resource?.valid&&i>0;)try{await t.decode(),s=D.Texture.from(t,{resourceOptions:{autoLoad:!1}}),await s.baseTexture.resource.load()}catch(c){console.warn(`failed on loading album image, retrying (${i})`,e,c),s=void 0,i--}if(!s)return;const r=new O,n=new w.Sprite(s),a=new w.Sprite(s),l=new w.Sprite(s),o=new w.Sprite(s);n.anchor.set(.5,.5),a.anchor.set(.5,.5),l.anchor.set(.5,.5),o.anchor.set(.5,.5),n.rotation=Math.random()*Math.PI*2,a.rotation=Math.random()*Math.PI*2,l.rotation=Math.random()*Math.PI*2,o.rotation=Math.random()*Math.PI*2,r.addChild(n,a,l,o),this.curContainer&&this.lastContainer.add(this.curContainer),this.curContainer=r,this.app.stage.addChild(this.curContainer),this.curContainer.alpha=0,this.app.ticker.start()}dispose(){this.observer.disconnect(),this.app.ticker.remove(this.onTick)}}class N extends q{element;constructor(){const e=document.createElement("canvas");super(e),this.element=e,e.style.pointerEvents="none",e.style.zIndex="-1"}getElement(){return this.element}dispose(){super.dispose(),this.element.remove()}}const $=(h,e)=>h.size===e.size&&[...h].every(t=>e.has(t));class S{currentPosition=0;targetPosition=0;currentTime=0;params={};currentSolver;getV;queueParams;queuePosition;constructor(e=0){this.targetPosition=e,this.currentPosition=this.targetPosition,this.currentSolver=()=>this.targetPosition,this.getV=()=>0}resetSolver(){const e=this.getV(this.currentTime);this.currentTime=0,this.currentSolver=R(this.currentPosition,e,this.targetPosition,0,this.params),this.getV=_(this.currentSolver)}arrived(){return Math.abs(this.targetPosition-this.currentPosition)<.01&&this.getV(this.currentTime)<.01&&this.queueParams===void 0&&this.queuePosition===void 0}setPosition(e){this.targetPosition=e,this.currentPosition=e,this.currentSolver=()=>this.targetPosition,this.getV=()=>0}update(e=0){this.currentTime+=e,this.currentPosition=this.currentSolver(this.currentTime),this.queueParams&&(this.queueParams.time-=e,this.queueParams.time<=0&&this.updateParams({...this.queueParams})),this.queuePosition&&(this.queuePosition.time-=e,this.queuePosition.time<=0&&this.setTargetPosition(this.queuePosition.position)),this.arrived()&&this.setPosition(this.targetPosition)}updateParams(e,t=0){t>0?this.queueParams={...e,time:t}:(this.params={...this.params,...e},this.resetSolver())}setTargetPosition(e,t=0){t>0?this.queuePosition={position:e,time:t}:(this.queuePosition=void 0,this.targetPosition=e,this.resetSolver())}getCurrentPosition(){return this.currentPosition}}function R(h,e,t,i=0,s){const r=s?.soft??!1,n=s?.stiffness??100,a=s?.damping??10,l=s?.mass??1,o=t-h;if(r||1<=a/(2*Math.sqrt(n*l))){const c=-Math.sqrt(n/l),d=-c*o-e;return u=>(u-=i,u<0?h:t-(o+u*d)*Math.E**(u*c))}else{const c=Math.sqrt(4*l*n-a**2),d=(a*o-2*l*e)/c,u=.5*c/l,f=-(.5*a)/l;return m=>(m-=i,m<0?h:t-(Math.cos(m*u)*o+Math.sin(m*u)*d)*Math.E**(m*f))}}function W(h){return t=>(h(t+.001)-h(t-.001))/(2*.001)}function _(h){return W(h)}class X{constructor(e){this.lyricPlayer=e,this.element.setAttribute("class",this.lyricPlayer.style.classes.lyricLine),this.rebuildStyle()}element=document.createElement("div");left=0;top=0;delay=0;lineSize=[0,0];lineTransforms={posX:new S(0),posY:new S(0)};measureSize(){return[this.element.clientWidth,this.element.clientHeight]}lastStyle="";show(){this.rebuildStyle()}hide(){this.rebuildStyle()}rebuildStyle(){let e=`transform:translate(${this.lineTransforms.posX.getCurrentPosition()}px,${this.lineTransforms.posY.getCurrentPosition()}px);`;!this.lyricPlayer.getEnableSpring()&&this.isInSight&&(e+=`transition-delay:${this.delay}ms;`),e!==this.lastStyle&&(this.lastStyle=e,this.element.setAttribute("style",e))}getElement(){return this.element}setTransform(e=this.left,t=this.top,i=!1,s=0){this.left=e,this.top=t,this.delay=s*1e3|0,i||!this.lyricPlayer.getEnableSpring()?(i&&this.element.classList.add(this.lyricPlayer.style.classes.tmpDisableTransition),this.lineTransforms.posX.setPosition(e),this.lineTransforms.posY.setPosition(t),this.lyricPlayer.getEnableSpring()?this.rebuildStyle():this.show(),i&&requestAnimationFrame(()=>{this.element.classList.remove(this.lyricPlayer.style.classes.tmpDisableTransition)})):(this.lineTransforms.posX.setTargetPosition(e,s),this.lineTransforms.posY.setTargetPosition(t,s))}update(e=0){this.lyricPlayer.getEnableSpring()&&(this.lineTransforms.posX.update(e),this.lineTransforms.posY.update(e),this.isInSight?this.show():this.hide())}get isInSight(){const e=this.lineTransforms.posX.getCurrentPosition(),t=this.lineTransforms.posY.getCurrentPosition(),i=e+this.lineSize[0],s=t+this.lineSize[1],r=this.lyricPlayer.size[0],n=this.lyricPlayer.size[1];return!(e>r||t>n||i<0||s<0)}dispose(){this.element.remove()}}function Y(h){const t=2.5949095;return h<.5?Math.pow(2*h,2)*((t+1)*2*h-t)/2:(Math.pow(2*h-2,2)*((t+1)*(h*2-2)+t)+2)/2}const g=(h,e,t)=>Math.max(h,Math.min(e,t));class G{constructor(e){this.lyricPlayer=e,this.element.className=this.lyricPlayer.style.classes.interludeDots,this.element.appendChild(this.dot0),this.element.appendChild(this.dot1),this.element.appendChild(this.dot2)}element=document.createElement("div");dot0=document.createElement("span");dot1=document.createElement("span");dot2=document.createElement("span");left=0;top=0;scale=1;lastStyle="";currentInterlude;currentTime=0;targetBreatheDuration=1500;getElement(){return this.element}setTransform(e=this.left,t=this.top){this.left=e,this.top=t,this.update()}setInterlude(e){this.currentInterlude=e,this.currentTime=e?.[0]??0}update(e=0){this.currentTime+=e;let t="";if(t+=`transform:translate(${this.left}px, ${this.top}px)`,this.currentInterlude){const i=this.currentInterlude[1]-this.currentInterlude[0],s=this.currentTime-this.currentInterlude[0];if(s<=i){const r=i/Math.ceil(i/this.targetBreatheDuration);let n=1,a=1;n*=Math.sin(1.5*Math.PI-s/r*2)/10+1,s<1e3&&(n*=1-Math.pow((1e3-s)/1e3,2)),s<500?a=0:s<1e3&&(a*=(s-500)/500),i-s<750&&(n*=1-Y((750-(i-s))/750/2)),i-s<375&&(a*=g(0,(i-s)/375,1)),n=Math.max(0,n),t+=` scale(${n})`;const l=g(.25,s*3/i*.75,1),o=g(.25,(s-i/3)*3/i*.75,1),c=g(.25,(s-i/3*2)*3/i*.75,1);this.dot0.style.opacity=`${g(0,Math.max(0,a*l),1)}`,this.dot1.style.opacity=`${g(0,Math.max(0,a*o),1)}`,this.dot2.style.opacity=`${g(0,Math.max(0,a*c),1)}`}else t+=" scale(0)",this.dot0.style.opacity="0",this.dot1.style.opacity="0",this.dot2.style.opacity="0"}else t+=" scale(0)",this.dot0.style.opacity="0",this.dot1.style.opacity="0",this.dot2.style.opacity="0";t+=";",this.lastStyle!==t&&(this.element.setAttribute("style",t),this.lastStyle=t)}dispose(){this.element.remove()}}const x=/^[\p{Unified_Ideograph}\u0800-\u9FFC]+$/u;function H(h,e="rgba(0,0,0,1)",t="rgba(0,0,0,0.5)"){const i=2+h,s=h/i,r=(1-s)/2;return[`linear-gradient(to right,${e} ${r*100}%,${t} ${(r+s)*100}%)`,s,i]}function M(h){return h.endTime-h.startTime>=1e3&&h.word.length<=7}class V extends MouseEvent{constructor(e,t){super(t.type,t),this.line=e}}class j extends EventTarget{constructor(e,t={words:[],translatedLyric:"",romanLyric:"",startTime:0,endTime:0,isBG:!1,isDuet:!1}){super(),this.lyricPlayer=e,this.lyricLine=t,this.element.setAttribute("class",this.lyricPlayer.style.classes.lyricLine),this.lyricLine.isBG&&this.element.classList.add(this.lyricPlayer.style.classes.lyricBgLine),this.lyricLine.isDuet&&this.element.classList.add(this.lyricPlayer.style.classes.lyricDuetLine),this.element.appendChild(document.createElement("div")),this.element.appendChild(document.createElement("div")),this.element.appendChild(document.createElement("div"));const i=this.element.children[0],s=this.element.children[1],r=this.element.children[2];i.setAttribute("class",this.lyricPlayer.style.classes.lyricMainLine),s.setAttribute("class",this.lyricPlayer.style.classes.lyricSubLine),r.setAttribute("class",this.lyricPlayer.style.classes.lyricSubLine),this.rebuildElement(),this.rebuildStyle()}element=document.createElement("div");left=0;top=0;scale=1;blur=0;delay=0;splittedWords=[];lineSize=[0,0];lineTransforms={posX:new S(0),posY:new S(0),scale:new S(1)};listenersMap=new Map;onMouseEvent=e=>{if(!this.dispatchEvent(new V(this,e)))return e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation(),!1};addEventListener(e,t,i){if(super.addEventListener(e,t,i),t){const s=this.listenersMap.get(e)??new Set;s.size===0&&this.element.addEventListener(e,this.onMouseEvent),s.add(t),this.listenersMap.set(e,s)}}removeEventListener(e,t,i){if(super.removeEventListener(e,t,i),t){const s=this.listenersMap.get(e);s&&(s.delete(t),s.size===0&&this.element.removeEventListener(e,this.onMouseEvent))}}isEnabled=!1;enable(){this.isEnabled=!0,this.element.classList.add("active");const e=this.element.children[0];this.splittedWords.forEach(t=>{t.elementAnimations.forEach(i=>{i.currentTime=0,i.playbackRate=1,i.play()})}),e.classList.add("active")}measureSize(){this._hide&&(this.element.style.display="",this.element.style.visibility="hidden");const e=[this.element.clientWidth,this.element.clientHeight];return this._hide&&(this.element.style.display="none",this.element.style.visibility=""),e}disable(){this.isEnabled=!1,this.element.classList.remove("active");const e=this.element.children[0];this.splittedWords.forEach(t=>{t.elementAnimations.forEach(i=>{i.id==="float-word"&&(i.playbackRate=-1,i.play())})}),e.classList.remove("active")}setLine(e){this.lyricLine=e,this.lyricLine.isBG?this.element.classList.add(this.lyricPlayer.style.classes.lyricBgLine):this.element.classList.remove(this.lyricPlayer.style.classes.lyricBgLine),this.lyricLine.isDuet?this.element.classList.add(this.lyricPlayer.style.classes.lyricDuetLine):this.element.classList.remove(this.lyricPlayer.style.classes.lyricDuetLine),this.rebuildElement(),this.rebuildStyle()}getLine(){return this.lyricLine}_hide=!0;lastStyle="";show(){this._hide=!1,this.rebuildStyle()}hide(){this._hide=!0,this.rebuildStyle()}rebuildStyle(){if(this._hide){this.lastStyle!=="display:none;transform:translate(0,-10000px);"&&(this.lastStyle="display:none;transform:translate(0,-10000px);",this.element.setAttribute("style","display:none;transform:translate(0,-10000px);"));return}let e=`transform:translate(${this.lineTransforms.posX.getCurrentPosition()}px,${this.lineTransforms.posY.getCurrentPosition()}px) scale(${this.lineTransforms.scale.getCurrentPosition()});`;!this.lyricPlayer.getEnableSpring()&&this.isInSight&&(e+=`transition-delay:${this.delay}ms;`),e+=`filter:blur(${Math.min(32,this.blur)}px);`,e!==this.lastStyle&&(this.lastStyle=e,this.element.setAttribute("style",e))}rebuildElement(){const e=this.element.children[0],t=this.element.children[1],i=this.element.children[2];if(this.lyricPlayer._getIsNonDynamic()){for(;e.firstChild;)e.removeChild(e.firstChild),n(e.firstChild);e.innerText=this.lyricLine.words.map(l=>l.word).join(""),t.innerText=this.lyricLine.translatedLyric,i.innerText=this.lyricLine.romanLyric;return}this.splittedWords=[],this.lyricLine.words.forEach(l=>{const o=l.word.split(/\s+/),c=o.reduce((u,f)=>u+f.length,0);let d=0;o.forEach((u,f)=>{f>0&&this.splittedWords.push({word:" ",startTime:0,endTime:0,width:0,height:0,elements:[],elementAnimations:[],shouldEmphasize:!1}),this.splittedWords.push({word:u,startTime:l.startTime+(l.endTime-l.startTime)/c*d,endTime:l.startTime+(l.endTime-l.startTime)/c*(d+u.length),width:0,height:0,elements:[],elementAnimations:[],shouldEmphasize:M(l)}),d+=u.length})});const s=[],r=[];function n(l){for(;l.firstChild;)l.firstChild.nodeType===Node.ELEMENT_NODE?s.push(e.firstChild):l.firstChild.nodeType===Node.TEXT_NODE&&r.push(e.firstChild),l.removeChild(l.firstChild),n(l.firstChild)}n(e);let a=null;this.splittedWords.forEach(l=>{if(l.word.trim().length>0)if(l.shouldEmphasize){const o=s.pop()??document.createElement("span");o.className="emphasize",l.elements=[o];for(const c of l.word){const d=s.pop()??document.createElement("span");d.className="",d.innerText=c,o.appendChild(d),l.elements.push(d)}if(l.elementAnimations=this.initEmphasizeAnimation(l),a&&!x.test(l.word))if(a.childElementCount>0)a.appendChild(o);else{const c=s.pop()??document.createElement("span");c.className="",a.remove(),c.appendChild(a),c.appendChild(o),e.appendChild(c),a=c}else a=x.test(l.word)?null:o,e.appendChild(o)}else{const o=s.pop()??document.createElement("span");if(o.className="",o.innerText=l.word,l.elements=[o],l.elementAnimations.push(this.initFloatAnimation(l,o)),a)if(a.childElementCount>0)a.appendChild(o);else{const c=s.pop()??document.createElement("span");c.className="",a.remove(),c.appendChild(a),c.appendChild(o),e.appendChild(c),a=c}else a=o,e.appendChild(o)}else if(l.word.length>0){const o=r.pop()??document.createTextNode(" ");e.appendChild(o),a=null}else a=null}),t.innerText=this.lyricLine.translatedLyric,i.innerText=this.lyricLine.romanLyric}initFloatAnimation(e,t){const i=e.startTime-this.lyricLine.startTime,s=Math.max(1e3,e.endTime-e.startTime),r=t.animate([{transform:"translateY(0px)"},{transform:"translateY(-3%)"}],{duration:isFinite(s)?s:0,delay:isFinite(i)?i:0,id:"float-word",composite:"add",fill:"both"});return r.pause(),r}initEmphasizeAnimation(e){const t=e.startTime-this.lyricLine.startTime,i=e.endTime-e.startTime;return e.elements.map((s,r,n)=>{if(r===0)return this.initFloatAnimation(e,s);{const a=Math.max(1e3,e.endTime-e.startTime),l=t+i/(n.length-1)*(r-1),o=s.animate([{offset:0,transform:"translate3d(0, 0, 0px)",filter:"drop-shadow(0 0 0 var(--amll-lyric-view-color,white))"},{offset:.5,transform:"translate3d(0, -1%, 20px)",filter:"drop-shadow(0 0 0.05em var(--amll-lyric-view-color,white))"},{offset:1,transform:"translate3d(0, 0, 0)",filter:"drop-shadow(0 0 0 var(--amll-lyric-view-color,white))"}],{duration:isFinite(a)?a:0,delay:isFinite(l)?l:0,id:"glow-word",iterations:1,composite:"replace",fill:"both"});return o.pause(),o}})}updateMaskImage(){this._hide&&(this.element.style.display="",this.element.style.visibility="hidden"),this.splittedWords.forEach(e=>{const t=e.elements[0];if(t){e.width=t.clientWidth,e.height=t.clientHeight;const[i,s,r]=H(16/e.width,"rgba(0,0,0,0.75)","rgba(0,0,0,0.25)"),n=`${r*100}% 100%`;this.lyricPlayer.supportMaskImage?(t.style.maskImage=i,t.style.maskOrigin="left",t.style.maskSize=n):(t.style.webkitMaskImage=i,t.style.webkitMaskOrigin="left",t.style.webkitMaskSize=n);const a=e.width+16,l=`clamp(${-a}px,calc(${-a}px + (var(--amll-player-time) - ${e.startTime})*${a/Math.abs(e.endTime-e.startTime)}px),0px) 0px, left top`;t.style.maskPosition=l,t.style.webkitMaskPosition=l}}),this._hide&&(this.element.style.display="none",this.element.style.visibility="")}getElement(){return this.element}setTransform(e=this.left,t=this.top,i=this.scale,s=1,r=0,n=!1,a=0){const l=this.isInSight,o=this.lyricPlayer.getEnableSpring();this.left=e,this.top=t,this.scale=i,this.delay=a*1e3|0;const c=this.element.children[0];if(c.style.opacity=`${s}`,n||!o){if(this.blur=Math.min(32,r),n&&this.element.classList.add(this.lyricPlayer.style.classes.tmpDisableTransition),this.lineTransforms.posX.setPosition(e),this.lineTransforms.posY.setPosition(t),this.lineTransforms.scale.setPosition(i),o)this.rebuildStyle();else{const d=this.isInSight;l||d?this.show():this.hide()}n&&requestAnimationFrame(()=>{this.element.classList.remove(this.lyricPlayer.style.classes.tmpDisableTransition)})}else this.lineTransforms.posX.setTargetPosition(e,a),this.lineTransforms.posY.setTargetPosition(t,a),this.lineTransforms.scale.setTargetPosition(i),this.blur!==Math.min(32,r)&&(this.blur=Math.min(32,r),this.element.style.filter=`blur(${Math.min(32,r)}px)`)}update(e=0){this.lyricPlayer.getEnableSpring()&&(this.lineTransforms.posX.update(e),this.lineTransforms.posY.update(e),this.lineTransforms.scale.update(e),this.isInSight?this.show():this.hide())}get isInSight(){const e=this.lineTransforms.posX.getCurrentPosition(),t=this.lineTransforms.posY.getCurrentPosition(),i=e+this.lineSize[0],s=t+this.lineSize[1],r=this.lyricPlayer.size[0],n=this.lyricPlayer.size[1];return!(e>r||i<0||t>n||s<0)}dispose(){this.element.remove()}}const J=A.create(I());class K extends MouseEvent{constructor(e,t,i){super(`line-${i.type}`,i),this.lineIndex=e,this.line=t}}class Q extends EventTarget{element=document.createElement("div");currentTime=0;lyricLines=[];processedLines=[];lyricLinesEl=[];lyricLinesSize=new WeakMap;lyricLinesIndexes=new WeakMap;hotLines=new Set;bufferedLines=new Set;scrollToIndex=0;allowScroll=!0;scrolledHandler=0;isScrolled=!1;invokedByScrollEvent=!1;scrollOffset=0;resizeObserver=new ResizeObserver(e=>{const t=e[0].contentRect;this.size[0]=t.width,this.size[1]=t.height;const i=getComputedStyle(e[0].target),s=this.element.clientWidth-parseFloat(i.paddingLeft)-parseFloat(i.paddingRight),r=this.element.clientHeight-parseFloat(i.paddingTop)-parseFloat(i.paddingBottom);this.innerSize[0]=s,this.innerSize[1]=r,this.rebuildStyle(),this.calcLayout(!0,!0),this.lyricLinesEl.forEach(n=>n.updateMaskImage())});posXSpringParams={mass:1,damping:10,stiffness:100};posYSpringParams={mass:1,damping:15,stiffness:100};scaleSpringParams={mass:1,damping:20,stiffness:100};enableBlur=!0;enableScale=!0;interludeDots;interludeDotsSize=[0,0];bottomLine;supportPlusLighter=CSS.supports("mix-blend-mode","plus-lighter");supportMaskImage=CSS.supports("mask-image","none");disableSpring=!1;alignAnchor="center";alignPosition=.5;isNonDynamic=!1;size=[0,0];innerSize=[0,0];onLineClickedHandler=e=>{const t=new K(this.lyricLinesIndexes.get(e.line)??-1,e.line,e);this.dispatchEvent(t)||(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation())};_getIsNonDynamic(){return this.isNonDynamic}setEnableSpring(e=!0){this.disableSpring=!e,e?this.element.classList.remove(this.style.classes.disableSpring):this.element.classList.add(this.style.classes.disableSpring),this.calcLayout(!0)}getEnableSpring(){return!this.disableSpring}setEnableScale(e=!0){this.enableScale=e,this.calcLayout()}getEnableScale(){return this.enableScale}style=J.createStyleSheet({lyricPlayer:{userSelect:"none",fontSize:"var(--amll-lyric-player-font-size,max(5vh, 12px))",padding:"1em",margin:"-1em",width:"100%",height:"100%",overflow:"hidden",maxWidth:"100%",maxHeight:"100%",zIndex:1,color:"var(--amll-lyric-view-color,white)",mixBlendMode:"plus-lighter",contain:"strict","&:hover":{"& $lyricLine":{filter:"unset !important"}}},lyricLine:{position:"absolute",transformOrigin:"left",maxWidth:"var(--amll-lyric-player-width,100%)",minWidth:"var(--amll-lyric-player-width,100%)",width:"var(--amll-lyric-player-width,100%)",padding:"2vh 0.05em",contain:"content",willChange:"filter,transform,opacity",transition:"filter 0.25s, background-color 0.25s, box-shadow 0.25s",boxSizing:"border-box",borderRadius:"8px","&:hover":{backgroundColor:"var(--amll-lyric-view-hover-bg-color,#fff1)",boxShadow:"0 0 0 8px var(--amll-lyric-view-hover-bg-color,#fff1)"},"&:active":{boxShadow:"0 0 0 4px var(--amll-lyric-view-hover-bg-color,#fff1)"}},"@media (max-width: 1024px)":{lyricLine:{padding:"1vh 0"}},lyricDuetLine:{textAlign:"right",transformOrigin:"right"},lyricBgLine:{opacity:0,fontSize:"max(50%, 10px)",transition:"opacity 0.25s","&.active":{transition:"opacity 0.25s 0.25s",opacity:.75}},lyricMainLine:{transition:"opacity 0.3s 0.25s",willChange:"opacity",margin:"-1em",padding:"1em","& span":{display:"inline-block"},"& > span":{whiteSpace:"pre-wrap",wordBreak:"keep-all",maxLines:"1","&.emphasize":{transformStyle:"preserve-3d",perspective:"50vw",padding:"1em",margin:"-1em"}}},lyricSubLine:{fontSize:"max(50%, 10px)",opacity:.5},disableSpring:{"& > *":{transition:"filter 0.25s, transform 0.5s, background-color 0.25s, box-shadow 0.25s"}},interludeDots:{height:"clamp(0.5em,1vh,3em)",transformOrigin:"center",width:"fit-content",padding:"2.5% 0",position:"absolute",display:"flex",gap:"0.25em",left:"1em","& > *":{height:"clamp(0.5em,1vh,3em)",display:"inline-block",borderRadius:"50%",aspectRatio:"1 / 1",backgroundColor:"var(--amll-lyric-view-color,white)",marginRight:"4px"},"&.duet":{right:"1em",transformOrigin:"center"}},"@supports (mix-blend-mode: plus-lighter)":{lyricSubLine:{opacity:.3}},tmpDisableTransition:{transition:"none !important"}});onPageShow=()=>{this.calcLayout(!0,!0)};constructor(){super(),this.interludeDots=new G(this),this.bottomLine=new X(this),this.element.setAttribute("class",this.style.classes.lyricPlayer),this.disableSpring&&this.element.classList.add(this.style.classes.disableSpring),this.rebuildStyle(),this.resizeObserver.observe(this.element),this.element.appendChild(this.interludeDots.getElement()),this.element.appendChild(this.bottomLine.getElement()),this.style.attach(),this.interludeDots.setTransform(0,200),window.addEventListener("pageshow",this.onPageShow),this.element.addEventListener("wheel",e=>{this.allowScroll&&(this.isScrolled=!0,clearTimeout(this.scrolledHandler),this.scrolledHandler=setTimeout(()=>{this.isScrolled=!1,this.scrollOffset=0},5e3),this.invokedByScrollEvent=!0,e.deltaMode===e.DOM_DELTA_PIXEL?(this.scrollOffset+=e.deltaY,this.calcLayout(!0)):(this.scrollOffset+=e.deltaY*50,this.calcLayout(!1)),this.invokedByScrollEvent=!1)})}getCurrentInterlude(){if(this.bufferedLines.size>0)return;const e=this.currentTime+20,t=this.scrollToIndex;if(t===0){if(this.processedLines[0]?.startTime&&this.processedLines[0].startTime>e)return[e,this.processedLines[0].startTime,-2,this.processedLines[0].isDuet]}else if(this.processedLines[t]?.endTime&&this.processedLines[t+1]?.startTime&&this.processedLines[t+1].startTime>e&&this.processedLines[t].endTime<e)return[Math.max(this.processedLines[t].endTime,e),this.processedLines[t+1].startTime,t,this.processedLines[t+1].isDuet]}rebuildStyle(){let e="";e+="--amll-lyric-player-width:",e+=this.innerSize[0],e+="px;",e+="--amll-lyric-player-height:",e+=this.innerSize[1],e+="px;",e+="--amll-player-time:",e+=this.currentTime,e+=";",this.element.setAttribute("style",e)}setEnableBlur(e){this.enableBlur!==e&&(this.enableBlur=e,this.calcLayout())}setLyricLines(e){this.lyricLines=e;const t=750;this.processedLines=e.filter(i=>i.words.reduce((s,r)=>s+r.word.trim().length,0)>0).map((i,s,r)=>{if(i.isBG)return{...i};{const n=r[s-1],a=r[s-2];if(n?.isBG&&a){if(a.endTime<i.startTime)return{...i,startTime:Math.max(a.endTime,i.startTime-t)||i.startTime}}else if(n?.endTime&&n.endTime<i.startTime)return{...i,startTime:Math.max(n?.endTime,i.startTime-t)||i.startTime};return{...i}}}),this.isNonDynamic=!0;for(const i of this.processedLines)if(i.words.length>1){this.isNonDynamic=!1;break}this.processedLines.forEach((i,s,r)=>{const n=r[s+1],a=i.words[i.words.length-1];a&&M(a)&&(n?n.startTime>i.endTime&&(i.endTime=Math.min(i.endTime+1500,n.startTime)):i.endTime=i.endTime+1500)}),this.processedLines.forEach((i,s,r)=>{if(i.isBG)return;const n=r[s+1];n?.isBG&&(n.startTime=Math.min(n.startTime,i.startTime))}),this.lyricLinesEl.forEach(i=>{i.removeEventListener("click",this.onLineClickedHandler),i.removeEventListener("contextmenu",this.onLineClickedHandler),i.dispose()}),this.lyricLinesEl=this.processedLines.map(i=>{const s=new j(this,i);return s.addEventListener("click",this.onLineClickedHandler),s.addEventListener("contextmenu",this.onLineClickedHandler),s}),this.lyricLinesEl.forEach((i,s)=>{this.element.appendChild(i.getElement()),this.lyricLinesIndexes.set(i,s),i.updateMaskImage()}),this.interludeDots.setInterlude(void 0),this.hotLines.clear(),this.bufferedLines.clear(),this.setLinePosXSpringParams({}),this.setLinePosYSpringParams({}),this.setLineScaleSpringParams({}),this.setCurrentTime(0,!0),this.calcLayout(!0,!0)}resetScroll(){this.isScrolled=!1,this.scrollOffset=0,this.invokedByScrollEvent=!1,clearTimeout(this.scrolledHandler),this.scrolledHandler=0}calcLayout(e=!1,t=!1){t&&(this.lyricLinesEl.forEach(m=>{const p=m.measureSize();this.lyricLinesSize.set(m,p),m.lineSize=p}),this.interludeDotsSize[0]=this.interludeDots.getElement().clientWidth,this.interludeDotsSize[1]=this.interludeDots.getElement().clientHeight,this.bottomLine.lineSize=this.bottomLine.measureSize());const i=this.getCurrentInterlude();let s=-this.scrollOffset,r=this.scrollToIndex,n=0;i?(n=i[1]-i[0],n>=5e3&&this.lyricLinesEl[i[2]+1]&&(r=i[2]+1)):this.interludeDots.setInterlude(void 0);const a=this.enableScale?.95:1,l=this.lyricLinesEl.slice(0,r).reduce((m,p)=>m+(p.getLine().isBG?0:this.lyricLinesSize.get(p)?.[1]??0),0);s-=l,s+=this.size[1]*this.alignPosition;const o=this.lyricLinesEl[r];if(o){const m=this.lyricLinesSize.get(o)?.[1]??0;switch(this.alignAnchor){case"bottom":s-=m;break;case"center":s-=m/2;break}}const c=Math.max(...this.bufferedLines);let d=0,u=.05,f=!1;this.lyricLinesEl.forEach((m,p)=>{const L=this.bufferedLines.has(p),b=L||p>=this.scrollToIndex&&p<c,E=m.getLine();E.isDuet&&this.size[0]-(this.lyricLinesSize.get(m)?.[0]??0),!f&&n>=5e3&&(p===this.scrollToIndex&&i?.[2]===-2||p===this.scrollToIndex+1)&&(f=!0,this.interludeDots.setTransform(32,s),i&&this.interludeDots.setInterlude([i[0],i[1]]),s+=this.interludeDotsSize[1]),m.setTransform(0,s,b?1:a,L?1:1/3,!this.invokedByScrollEvent&&this.enableBlur?b?0:1+(p<this.scrollToIndex?Math.abs(this.scrollToIndex-p):Math.abs(p-Math.max(this.scrollToIndex,c))):0,e,d),E.isBG&&b?s+=this.lyricLinesSize.get(m)?.[1]??0:E.isBG||(s+=this.lyricLinesSize.get(m)?.[1]??0),s>=0&&(d+=u,u/=1.2)}),this.bottomLine.setTransform(0,s,e,d)}getCurrentTime(){return this.currentTime}getLyricLines(){return this.lyricLines}getElement(){return this.element}getBottomLineElement(){return this.bottomLine.getElement()}setAlignAnchor(e){this.alignAnchor=e}setAlignPosition(e){this.alignPosition=e}setCurrentTime(e,t=!1){if(this.currentTime=e,this.element.style.setProperty("--amll-player-time",`${e}`),this.isScrolled)return;const i=new Set,s=new Set,r=new Set;this.hotLines.forEach(n=>{const a=this.processedLines[n];if(a){if(a.isBG)return;const l=this.processedLines[n+1];if(l?.isBG){const o=Math.min(a.startTime,l?.startTime),c=Math.max(a.endTime,l?.endTime);(o>e||c<=e)&&(this.hotLines.delete(n),i.add(n),this.hotLines.delete(n+1),i.add(n+1),t&&(this.lyricLinesEl[n].disable(),this.lyricLinesEl[n+1].disable()))}else(a.startTime>e||a.endTime<=e)&&(this.hotLines.delete(n),i.add(n),t&&this.lyricLinesEl[n].disable())}else this.hotLines.delete(n),i.add(n),t&&this.lyricLinesEl[n].disable()}),this.processedLines.forEach((n,a,l)=>{!n.isBG&&n.startTime<=e&&n.endTime>e&&(this.hotLines.has(a)||(this.hotLines.add(a),r.add(a),t&&this.lyricLinesEl[a].enable(),l[a+1]?.isBG&&(this.hotLines.add(a+1),r.add(a+1),t&&this.lyricLinesEl[a+1].enable())))}),this.bufferedLines.forEach(n=>{this.hotLines.has(n)||(s.add(n),t&&this.lyricLinesEl[n].disable())}),t?(this.bufferedLines.size>0?this.scrollToIndex=Math.min(...this.bufferedLines):this.scrollToIndex=this.processedLines.findIndex(n=>n.startTime>=e),this.bufferedLines.clear(),this.hotLines.forEach(n=>this.bufferedLines.add(n)),this.calcLayout(!0)):(s.size>0||r.size>0)&&(s.size===0&&r.size>0?(r.forEach(n=>{this.bufferedLines.add(n),this.lyricLinesEl[n].enable()}),this.scrollToIndex=Math.min(...this.bufferedLines)):r.size===0&&s.size>0?$(s,this.bufferedLines)&&this.bufferedLines.forEach(n=>{this.hotLines.has(n)||(this.bufferedLines.delete(n),this.lyricLinesEl[n].disable())}):(r.forEach(n=>{this.bufferedLines.add(n),this.lyricLinesEl[n].enable()}),s.forEach(n=>{this.bufferedLines.delete(n),this.lyricLinesEl[n].disable()}),this.bufferedLines.size>0&&(this.scrollToIndex=Math.min(...this.bufferedLines))),this.calcLayout())}update(e=0){const t=e/1e3;this.interludeDots.update(e),this.bottomLine.update(t),this.lyricLinesEl.forEach(i=>i.update(t))}setLinePosXSpringParams(e){this.posXSpringParams={...this.posXSpringParams,...e},this.bottomLine.lineTransforms.posX.updateParams(this.posXSpringParams),this.lyricLinesEl.forEach(t=>t.lineTransforms.posX.updateParams(this.posXSpringParams))}setLinePosYSpringParams(e){this.posYSpringParams={...this.posYSpringParams,...e},this.bottomLine.lineTransforms.posY.updateParams(this.posYSpringParams),this.lyricLinesEl.forEach(t=>t.lineTransforms.posY.updateParams(this.posYSpringParams))}setLineScaleSpringParams(e){this.scaleSpringParams={...this.scaleSpringParams,...e},this.lyricLinesEl.forEach(t=>t.lineTransforms.scale.updateParams(this.scaleSpringParams))}dispose(){this.element.remove(),this.resizeObserver.disconnect(),this.style.detach(),this.lyricLinesEl.forEach(e=>e.dispose()),window.removeEventListener("pageshow",this.onPageShow),this.bottomLine.dispose(),this.interludeDots.dispose()}}exports.BackgroundRender=N;exports.LyricPlayer=Q;exports.ttml=F;
//# sourceMappingURL=amll-core.js.map
