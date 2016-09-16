!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports["parallel-es"]=r():e["parallel-es"]=r()}(this,function(){return webpackJsonpparallel_es([1],{159:function(e,r,t){"use strict";function n(e){for(;v.rows.length>1;)v.deleteRow(1);var r=!0,t=!1,n=void 0;try{for(var a,i=o()(e);!(r=(a=i.next()).done);r=!0){var u=a.value,l=v.insertRow();l.insertCell().innerText=u.project.startYear.toLocaleString(),l.insertCell().innerText=u.project.totalAmount.toLocaleString();for(var c=["green","yellow","gray","red"],s=function(){var e=c[m],r=u.groups.find(function(r){return r.name===e});l.insertCell().innerText=r?(100*r.percentage).toFixed(2):"-"},m=0;m<c.length;m++)s()}}catch(f){t=!0,n=f}finally{try{!r&&i["return"]&&i["return"]()}finally{if(t)throw n}}}var a=t(2),o=t.n(a),i=t(6),u=t(24),l=t(25),c=t(23),s=document.querySelector("#mandelbrot-canvas"),m=s.getContext("2d"),f=t.i(u.a)(s.width,s.height,1e4),d={investmentAmount:62e4,numRuns:1e4,numYears:15,performance:.034,projects:[{startYear:0,totalAmount:1e4},{startYear:1,totalAmount:1e4},{startYear:2,totalAmount:1e4},{startYear:5,totalAmount:5e4},{startYear:15,totalAmount:8e5}],seed:10,volatility:.0896},v=document.querySelector("#montecarlo-table");document.querySelector("#mandelbrot-run-async").addEventListener("click",function(e){e.preventDefault(),m.putImageData(m.createImageData(s.width,s.height),0,0);var r=parseInt(document.querySelector("#mandelbrot-values-per-task").value,10);console.time("mandelbrot-async"),i["default"].range(0,f.imageHeight,1,{maxValuesPerTask:r}).environment(f).map(u.b).result().subscribe(function(e,r,t){for(var n=0;n<e.length;++n)m.putImageData(new ImageData(e[n],f.imageWidth,1),0,r*t+n)}).then(function(){return console.timeEnd("mandelbrot-async")},function(e){return console.error(e)})}),document.querySelector("#mandelbrot-run-sync").addEventListener("click",function(){var e=document.querySelector("#mandelbrot-canvas"),r=e.getContext("2d");r.putImageData(r.createImageData(e.width,e.height),0,0),setTimeout(function(){console.time("mandelbrot-sync");for(var e=0;e<f.imageHeight;++e){var n=t.i(u.b)(e,f);r.putImageData(new ImageData(n,f.imageWidth,1),0,e)}console.timeEnd("mandelbrot-sync")},0)}),document.querySelector("#montecarlo-run-sync").addEventListener("click",function(){console.time("montecarlo-sync");var e=t.i(l.a)(d);console.timeEnd("montecarlo-sync"),n(e),console.log(e)}),document.querySelector("#montecarlo-run-parallel").addEventListener("click",function(){console.time("montecarlo-parallel");var e=t.i(l.b)(d);e.then(function(e){console.timeEnd("montecarlo-parallel"),n(e),console.log(e)}),e["catch"](function(e){return console.error(e)})});var y=document.querySelector("#knight-board-result");document.querySelector("#knight-run-sync").addEventListener("click",function(){var e=parseInt(document.querySelector("#knight-board-size").value,10);y.innerText="Calculating...",setTimeout(function(){console.time("knight-run-sync");var r=t.i(c.a)({x:0,y:0},e);console.timeEnd("knight-run-sync"),y.innerText="Found "+r+" solutions for "+e+"x"+e+" board"},0)}),document.querySelector("#knight-run-parallel").addEventListener("click",function(){var e=parseInt(document.querySelector("#knight-board-size").value,10);y.innerText="Calculating...",console.time("knight-run-parallel"),t.i(c.b)({x:0,y:0},e).then(function(r){console.timeEnd("knight-run-parallel"),y.innerText="Found "+r+" solutions for "+e+"x"+e+" board"},function(e){return console.log(e)})})},23:function(e,r,t){"use strict";function n(e){var r=e.boardSize,t=new Array(r*r);return t.fill(0),{board:t,boardSize:r}}function a(e,r){for(var t=r.board,n=r.boardSize,a=[{x:-2,y:-1},{x:-2,y:1},{x:-1,y:-2},{x:-1,y:2},{x:1,y:-2},{x:1,y:2},{x:2,y:-1},{x:2,y:1}],o=n*n,i=0,u=e.map(function(e,r){return{coordinate:e,n:r+1}}),l=0;l<e.length-1;++l){var c=e[l].x*n+e[l].y;t[c]=l+1}for(;u.length>0;){var s=u[u.length-1],m=s.coordinate,f=s.n,d=m.x*n+m.y;if(0===t[d])if(f!==o){t[d]=f;for(var v=0;v<a.length;++v){var y=a[v],h={x:m.x+y.x,y:m.y+y.y},p=h.x>=0&&h.y>=0&&h.x<n&&h.y<n&&0===t[h.x*n+h.y];p&&u.push({coordinate:h,n:f+1})}}else++i,u.pop();else t[d]=0,u.pop()}return i}function o(e,r){var t=n({boardSize:r});return a([e],t)}function i(e,r,t){function o(t){var n=[{x:-2,y:-1},{x:-2,y:1},{x:-1,y:-2},{x:-1,y:2},{x:1,y:-2},{x:1,y:2},{x:2,y:-1},{x:2,y:1}],a=[],o=!0,i=!1,u=void 0;try{for(var c,s=l()(n);!(o=(c=s.next()).done);o=!0){var m=c.value,f={x:t.x+m.x,y:t.y+m.y},d=f.x>=0&&f.y>=0&&f.x<r&&f.y<r&&(f.x!==e.x||f.y!==e.y)&&f.x!==t.x&&f.y!==t.y;d&&a.push(f)}}catch(v){i=!0,u=v}finally{try{!o&&s["return"]&&s["return"]()}finally{if(i)throw u}}return a}function i(){var r=[],t=!0,n=!1,a=void 0;try{for(var i,u=l()(o(e));!(t=(i=u.next()).done);t=!0){var c=i.value,s=!0,m=!1,f=void 0;try{for(var d,v=l()(o(c));!(s=(d=v.next()).done);s=!0){var y=d.value;r.push([e,c,y])}}catch(h){m=!0,f=h}finally{try{!s&&v["return"]&&v["return"]()}finally{if(m)throw f}}}}catch(h){n=!0,a=h}finally{try{!t&&u["return"]&&u["return"]()}finally{if(n)throw a}}return r}var u=0,s=performance.now();return c["default"].from(i(),t).environment({boardSize:r}).initializer(n).map(a).reduce(0,function(e,r){return e+r}).subscribe(function(e){var r=!0,t=!1,n=void 0;try{for(var a,o=l()(e);!(r=(a=o.next()).done);r=!0){var i=a.value;u+=i}}catch(c){t=!0,n=c}finally{try{!r&&o["return"]&&o["return"]()}finally{if(t)throw n}}console.log(u/(performance.now()-s)*1e3+" results per second")})}var u=t(2),l=t.n(u),c=t(6);r.a=o,r.b=i},24:function(e,r,t){"use strict";function n(e,r,t){var n={i:-1.2,real:-2},a={i:0,real:1};a.i=n.i+(a.real-n.real)*r/e;var o={i:(a.i-n.i)/(r-1),real:(a.real-n.real)/(e-1)};return{imageHeight:r,imageWidth:e,iterations:t,max:a,min:n,scalingFactor:o}}function a(e,r){function t(e){for(var r={i:e.i,real:e.real},t=0;t<i&&!(Math.pow(r.real,2)+Math.pow(r.i,2)>4);++t){var n=r.i;r.i=2*r.real*r.i+e.i,r.real=Math.pow(r.real,2)-Math.pow(n,2)+e.real}return{z:r,n:t}}for(var n=r.min,a=r.max,o=r.scalingFactor,i=r.iterations,u=r.imageWidth,l=new Uint8ClampedArray(4*u),c=a.i-e*o.i,s=0;s<u;++s){var m={i:c,real:n.real+s*o.real},f=t(m),d=f.n,v=4*s;l[v]=255&d,l[v+1]=65280&d,l[v+2]=16711680&d,l[v+3]=255}return l}r.a=n,r.b=a},25:function(e,r,t){"use strict";function n(e){return m()({},{investmentAmount:1e6,liquidity:1e4,numRuns:1e4,numYears:10,performance:0,projects:[],seed:void 0,volatility:.01},e)}function a(e){function r(r,t){function n(t){for(var n=e.investmentAmount,a=100,o=0;o<t.length;++o){var i=t[o],u=0===o?0:r[o-1],l=i/a;n=(n+u)*l,t[o]=Math.round(n),a=i}return t}for(var a=new Array(e.numYears),o=0;o<=t;++o)a[o]=new Array(e.numRuns);for(var i=0;i<e.numRuns;i++){for(var u=[100],l=1;l<=t;l++){var c=1+Math.random();u.push(u[l-1]*c)}n(u);for(var s=0;s<u.length;++s)a[s][i]=u[s]}return a}function t(){for(var r=[],t=0;t<e.numYears;++t){var n=i[t]||[],a=-n.reduce(function(e,r){return e+r.totalAmount},0);r.push(a)}return r}function n(r){for(var t=[],n=e.investmentAmount,a=0;a<e.numYears;++a)n+=r[a],t.push(n);return t}var a=e.projects;e.taskIndex&&e.valuesPerWorker&&(a=e.projects.slice(e.taskIndex*e.valuesPerWorker,(e.taskIndex+1)*e.valuesPerWorker));for(var o=e.projects.sort(function(e,r){return e.startYear-r.startYear}),i={},u=0;u<o.length;++u){var l=o[u],c=i[l.startYear]=i[l.startYear]||[];c.push(l)}var s=t(),m=n(s),f=a.reduce(function(e,r){return Math.max(e,r.startYear)},0);return{investmentAmount:e.investmentAmount,liquidity:e.liquidity,noInterestReferenceLine:m,numRuns:e.numRuns,numYears:f,projectsByStartYear:i,simulatedValues:r(s,f)}}function o(e,r){function t(e,r){return r.find(function(r){return("undefined"==typeof r.from||r.from<=e)&&("undefined"==typeof r.to||r.to>e)})}function n(e,r){return[{description:"Ziel erreichbar",from:e,name:"green",percentage:0,separator:!0},{description:"mit Zusatzliquidität erreichbar",from:e-l,name:"yellow",percentage:0,separator:!0,to:e},{description:"nicht erreichbar",from:r,name:"gray",percentage:0,separator:!1,to:e-l},{description:"nicht erreichbar, mit Verlust",name:"red",percentage:0,separator:!1,to:r}]}function a(){for(var r=e.totalAmount,t=c[e.startYear],n=0;n<t.length;++n){var a=t[n];if(a===e)break;r+=a.totalAmount}return r}function o(e){var r=Math.floor(e.length/2);return e.length%2?e[r]:(e[r-1]+e[r])/2}var i=r.noInterestReferenceLine,u=r.simulatedValues,l=r.liquidity,c=r.projectsByStartYear,s=10,m=a(),f=u[e.startYear];f.sort(function(e,r){return e-r});for(var d=n(m,i[e.startYear]),v={},y=Math.round(f.length/s),h=[],p=0;p<f.length;p+=y){for(var g={max:Number.MIN_VALUE,min:Number.MAX_VALUE,subBuckets:{}},x=p;x<p+y;++x){var b=f[x];g.min=Math.min(g.min,b),g.max=Math.max(g.max,b);var k=t(f[x],d);v[k.name]=(v[k.name]||0)+1;var w=g.subBuckets[k.name]=g.subBuckets[k.name]||{group:k.name,max:Number.MIN_VALUE,min:Number.MAX_VALUE};w.min=Math.min(w.min,b),w.max=Math.max(w.max,b)}h.push(g)}var A=d.filter(function(e){return!!v[e.name]});A.forEach(function(e){return e.percentage=v[e.name]/f.length});var S=Math.round(f.length/6);return{buckets:h,groups:A,max:f[f.length-1],median:o(f),min:f[0],project:e,twoThird:{max:f[f.length-S],min:f[S]}}}function i(e){var r=a(n(e)),t=[],i=!0,u=!1,l=void 0;try{for(var s,m=c()(e.projects);!(i=(s=m.next()).done);i=!0){var f=s.value;t.push(o(f,r))}}catch(d){u=!0,l=d}finally{try{!i&&m["return"]&&m["return"]()}finally{if(u)throw l}}return t}function u(e){var r=n(e);return f["default"].from(r.projects).environment(r).initializer(a).map(o).result()}var l=t(2),c=t.n(l),s=t(14),m=t.n(s),f=t(6);r.a=i,r.b=u}},[159])});