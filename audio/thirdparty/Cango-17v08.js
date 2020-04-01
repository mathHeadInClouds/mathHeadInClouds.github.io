/*==========================================================================
  Filename: Cango-17v08.js
  Rev: 17
  By: Dr A.R.Collins
  Description: A graphics library for the canvas element.

  Copyright 2012-2019 A.R.Collins
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
  For more detail about the GNU General Public License see
  <https://www.gnu.org/licenses/>.
    
  Giving credit to A.R.Collins <http://www.arc.id.au> would be appreciated.
  Report bugs to tony at arc.id.au.

  Date   |Description                                                   |By
  --------------------------------------------------------------------------
  14Oct12 Rev 1.00 First release based on Cango0v43                      ARC
  29Nov12 Released as Cango2v00                                          ARC
  06May14 Released as Cango4v00                                          ARC
  14Jul14 Released as Cango-5v00                                         ARC
  09Feb15 Released as Cango-6v00                                         ARC
  20Mar15 Released as Cango-7v00                                         ARC
  21Dec15 Released as Cango-8v00                                         ARC
  28Mar17 Released as Cango-9v00                                         ARC
  10Jul17 Released as Cango-10v00                                        ARC
  22Jul17 Released as Cango-11v00                                        ARC
  15Aug17 Released as Cango-12v00                                        ARC
  13Feb19 Handle ArrayBuffer views and DataViews as Path2D definitions   ARC
  27Apr19 Added manualClear as an animation.options property             ARC
  01May19 Added Cango.redrawAnimation method                             
          bugfix: AnimObj didn't handle options == undefined or null     ARC
  22Jun19 bugfix: transform.skew wants degs was getting rads
          bugfix: transform.skew not corrected for non-iso scaling       ARC
  25Jun19 Rename Distorter to more meaningful 'Transformer'              ARC
  10Jul19 Restore the not 'unused' transformer code                      ARC
  12Jul19 bugfix: dwgOrg transforms not inheriting xfms correctly
          softTfms needed to be applied in reverse order
          Removed drag-n-drop add target parent dwgOrg no needed now     ARC
  16Jul19 Merged SVGpathUtils into Cango dropped shapeDefs               ARC
  22Jul19 Removed the 'transform' indirect calls of Obj2D transforms
          Removed unused pthCmds
          Moved initDragAndDrop into Cango constructor                   ARC
  24Jul19 Merge SVGpathUtils source into Cango 
          Converted svgPath segments to be Objects {type:, values:[]}    ARC
  28Jul19 Update to SVGpathUtils-4beta05 methods which return new arrays ARC 
  30Jul19 Reinstate hard transforms but as Obj2D properties              ARC
  06Aug19 Imbed latest SVGpathUtils ver5 drop svgPath for SVGsegs        ARC                                     
  07Aug19 Add setDescriptor                                              ARC                                   
  09Aug19 Add fixed frameRate to Animation                               
          bugfix: Text and Img dup needed a parameter                    ARC
  12Aug19 Released as Cango-15v00 (no transform, no shapeDefs)           ARC 
  14Oct19 Sort obj.ofsTfmAry before making netTfm to preserve tfm order  ARC
  17Oct19 bugfix: Group enableDrag should be 'this' not childNode        ARC
  21Oct19 bugfix: Remove nonIsoScl correction from dwgOrg calculation    ARC
  23Oct19 bugfix: Several ClipMask options not being honoured            ARC
  11Nov19 Apply options in order of insertion (ok in ES 2015)
          Apply soft transforms in insertion order (delete REV tfm) 
          Added Group.setProperty method                                 ARC
  17Nov19 Convert to use ES2015 classes etc                              ARC
  18Nov19 Allow 'rot' as option equivalent to degs                       ARC
  19Nov19 Released as Cango-17v00                                        ARC
  02Jan20 bugfix: getUnique unique to context should be unique to canvas ARC
  18Jan20 Replace all commas in strings passed to SVGsegs constructor    ARC
  19Jan20 Added Track and TrackTweener classes                           ARC
  20Jan20 SVGsegs made private, shapeDefs now returns SVGsegs objects
          circle, square etd now become shapeDefs methods
          Added shapeDefs.svg method, equivalent to new SVGsegs
          Added shapeDefs.arc method                                     ARC
  16Mar20 Update with all changes to Ver 18 but not using Path2D         ARC
  20Feb20 Remove Animation methods to a separate extension               ARC
  ==========================================================================*/

// exposed globals
    var Cango,
    SVGsegs, circle, arc, ellipse, ellipticalArc, square, rectangle, triangle, cross, ex,
    segment,
    Path, Shape, Img, Text, ClipMask, Group,
    LinearGradient, RadialGradient, 
    initZoomPan; 

(function() {
  "use strict";

  const identityMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
  const types = ["GRP", "PATH", "SHAPE", "IMG", "TEXT", "CLIP"];
  var cvsCmds = { "M": "moveTo",
                  "L": "lineTo",
                  "C": "bezierCurveTo",
                  "Z": "closePath" };

  if (!SVGPathElement.prototype.getPathData || !SVGPathElement.prototype.setPathData) {
    // @info
    //   Polyfill for SVG getPathData() and setPathData() methods. Based on:
    //   - SVGPathSeg polyfill by Philip Rogers (MIT License)
    //     https://github.com/progers/pathseg
    //   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
    //     https://github.com/motooka/SVGPathNormalizer/tree/master/src
    //   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
    //     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
    // @author
    //   Jarosław Foksa
    // @source
    //   https://github.com/jarek-foksa/path-data-polyfill.js/
    // @license
    //   MIT License
    !function(){var e={Z:"Z",M:"M",L:"L",C:"C",Q:"Q",A:"A",H:"H",V:"V",S:"S",T:"T",z:"Z",m:"m",l:"l",c:"c",q:"q",a:"a",h:"h",v:"v",s:"s",t:"t"},t=function(e){this._string=e,this._currentIndex=0,this._endIndex=this._string.length,this._prevCommand=null,this._skipOptionalSpaces()},s=-1!==window.navigator.userAgent.indexOf("MSIE ")
    t.prototype={parseSegment:function(){var t=this._string[this._currentIndex],s=e[t]?e[t]:null
    if(null===s){if(null===this._prevCommand)return null
    if(s=("+"===t||"-"===t||"."===t||t>="0"&&"9">=t)&&"Z"!==this._prevCommand?"M"===this._prevCommand?"L":"m"===this._prevCommand?"l":this._prevCommand:null,null===s)return null}else this._currentIndex+=1
    this._prevCommand=s
    var r=null,a=s.toUpperCase()
    return"H"===a||"V"===a?r=[this._parseNumber()]:"M"===a||"L"===a||"T"===a?r=[this._parseNumber(),this._parseNumber()]:"S"===a||"Q"===a?r=[this._parseNumber(),this._parseNumber(),this._parseNumber(),this._parseNumber()]:"C"===a?r=[this._parseNumber(),this._parseNumber(),this._parseNumber(),this._parseNumber(),this._parseNumber(),this._parseNumber()]:"A"===a?r=[this._parseNumber(),this._parseNumber(),this._parseNumber(),this._parseArcFlag(),this._parseArcFlag(),this._parseNumber(),this._parseNumber()]:"Z"===a&&(this._skipOptionalSpaces(),r=[]),null===r||r.indexOf(null)>=0?null:{type:s,values:r}},hasMoreData:function(){return this._currentIndex<this._endIndex},peekSegmentType:function(){var t=this._string[this._currentIndex]
    return e[t]?e[t]:null},initialCommandIsMoveTo:function(){if(!this.hasMoreData())return!0
    var e=this.peekSegmentType()
    return"M"===e||"m"===e},_isCurrentSpace:function(){var e=this._string[this._currentIndex]
    return" ">=e&&(" "===e||"\n"===e||"	"===e||"\r"===e||"\f"===e)},_skipOptionalSpaces:function(){for(;this._currentIndex<this._endIndex&&this._isCurrentSpace();)this._currentIndex+=1
    return this._currentIndex<this._endIndex},_skipOptionalSpacesOrDelimiter:function(){return this._currentIndex<this._endIndex&&!this._isCurrentSpace()&&","!==this._string[this._currentIndex]?!1:(this._skipOptionalSpaces()&&this._currentIndex<this._endIndex&&","===this._string[this._currentIndex]&&(this._currentIndex+=1,this._skipOptionalSpaces()),this._currentIndex<this._endIndex)},_parseNumber:function(){var e=0,t=0,s=1,r=0,a=1,n=1,u=this._currentIndex
    if(this._skipOptionalSpaces(),this._currentIndex<this._endIndex&&"+"===this._string[this._currentIndex]?this._currentIndex+=1:this._currentIndex<this._endIndex&&"-"===this._string[this._currentIndex]&&(this._currentIndex+=1,a=-1),this._currentIndex===this._endIndex||(this._string[this._currentIndex]<"0"||this._string[this._currentIndex]>"9")&&"."!==this._string[this._currentIndex])return null
    for(var i=this._currentIndex;this._currentIndex<this._endIndex&&this._string[this._currentIndex]>="0"&&this._string[this._currentIndex]<="9";)this._currentIndex+=1
    if(this._currentIndex!==i)for(var l=this._currentIndex-1,h=1;l>=i;)t+=h*(this._string[l]-"0"),l-=1,h*=10
    if(this._currentIndex<this._endIndex&&"."===this._string[this._currentIndex]){if(this._currentIndex+=1,this._currentIndex>=this._endIndex||this._string[this._currentIndex]<"0"||this._string[this._currentIndex]>"9")return null
    for(;this._currentIndex<this._endIndex&&this._string[this._currentIndex]>="0"&&this._string[this._currentIndex]<="9";)s*=10,r+=(this._string.charAt(this._currentIndex)-"0")/s,this._currentIndex+=1}if(this._currentIndex!==u&&this._currentIndex+1<this._endIndex&&("e"===this._string[this._currentIndex]||"E"===this._string[this._currentIndex])&&"x"!==this._string[this._currentIndex+1]&&"m"!==this._string[this._currentIndex+1]){if(this._currentIndex+=1,"+"===this._string[this._currentIndex]?this._currentIndex+=1:"-"===this._string[this._currentIndex]&&(this._currentIndex+=1,n=-1),this._currentIndex>=this._endIndex||this._string[this._currentIndex]<"0"||this._string[this._currentIndex]>"9")return null
    for(;this._currentIndex<this._endIndex&&this._string[this._currentIndex]>="0"&&this._string[this._currentIndex]<="9";)e*=10,e+=this._string[this._currentIndex]-"0",this._currentIndex+=1}var v=t+r
    return v*=a,e&&(v*=Math.pow(10,n*e)),u===this._currentIndex?null:(this._skipOptionalSpacesOrDelimiter(),v)},_parseArcFlag:function(){if(this._currentIndex>=this._endIndex)return null
    var e=null,t=this._string[this._currentIndex]
    if(this._currentIndex+=1,"0"===t)e=0
    else{if("1"!==t)return null
    e=1}return this._skipOptionalSpacesOrDelimiter(),e}}
    var r=function(e){if(!e||0===e.length)return[]
    var s=new t(e),r=[]
    if(s.initialCommandIsMoveTo())for(;s.hasMoreData();){var a=s.parseSegment()
    if(null===a)break
    r.push(a)}return r},a=SVGPathElement.prototype.setAttribute,n=SVGPathElement.prototype.removeAttribute,u=window.Symbol?Symbol():"__cachedPathData",i=window.Symbol?Symbol():"__cachedNormalizedPathData",l=function(e,t,s,r,a,n,u,i,h,v){var p,_,c,o,d=function(e){return Math.PI*e/180},y=function(e,t,s){var r=e*Math.cos(s)-t*Math.sin(s),a=e*Math.sin(s)+t*Math.cos(s)
    return{x:r,y:a}},x=d(u),f=[]
    if(v)p=v[0],_=v[1],c=v[2],o=v[3]
    else{var I=y(e,t,-x)
    e=I.x,t=I.y
    var m=y(s,r,-x)
    s=m.x,r=m.y
    var g=(e-s)/2,b=(t-r)/2,M=g*g/(a*a)+b*b/(n*n)
    M>1&&(M=Math.sqrt(M),a=M*a,n=M*n)
    var S
    S=i===h?-1:1
    var V=a*a,A=n*n,C=V*A-V*b*b-A*g*g,P=V*b*b+A*g*g,N=S*Math.sqrt(Math.abs(C/P))
    c=N*a*b/n+(e+s)/2,o=N*-n*g/a+(t+r)/2,p=Math.asin(parseFloat(((t-o)/n).toFixed(9))),_=Math.asin(parseFloat(((r-o)/n).toFixed(9))),c>e&&(p=Math.PI-p),c>s&&(_=Math.PI-_),0>p&&(p=2*Math.PI+p),0>_&&(_=2*Math.PI+_),h&&p>_&&(p-=2*Math.PI),!h&&_>p&&(_-=2*Math.PI)}var E=_-p
    if(Math.abs(E)>120*Math.PI/180){var D=_,O=s,L=r
    _=h&&_>p?p+120*Math.PI/180*1:p+120*Math.PI/180*-1,s=c+a*Math.cos(_),r=o+n*Math.sin(_),f=l(s,r,O,L,a,n,u,0,h,[_,D,c,o])}E=_-p
    var k=Math.cos(p),G=Math.sin(p),T=Math.cos(_),Z=Math.sin(_),w=Math.tan(E/4),H=4/3*a*w,Q=4/3*n*w,z=[e,t],F=[e+H*G,t-Q*k],q=[s+H*Z,r-Q*T],j=[s,r]
    if(F[0]=2*z[0]-F[0],F[1]=2*z[1]-F[1],v)return[F,q,j].concat(f)
    f=[F,q,j].concat(f)
    for(var R=[],U=0;U<f.length;U+=3){var a=y(f[U][0],f[U][1],x),n=y(f[U+1][0],f[U+1][1],x),B=y(f[U+2][0],f[U+2][1],x)
    R.push([a.x,a.y,n.x,n.y,B.x,B.y])}return R},h=function(e){return e.map(function(e){return{type:e.type,values:Array.prototype.slice.call(e.values)}})},v=function(e){var t=[],s=null,r=null,a=null,n=null
    return e.forEach(function(e){var u=e.type
    if("M"===u){var i=e.values[0],l=e.values[1]
    t.push({type:"M",values:[i,l]}),a=i,n=l,s=i,r=l}else if("m"===u){var i=s+e.values[0],l=r+e.values[1]
    t.push({type:"M",values:[i,l]}),a=i,n=l,s=i,r=l}else if("L"===u){var i=e.values[0],l=e.values[1]
    t.push({type:"L",values:[i,l]}),s=i,r=l}else if("l"===u){var i=s+e.values[0],l=r+e.values[1]
    t.push({type:"L",values:[i,l]}),s=i,r=l}else if("C"===u){var h=e.values[0],v=e.values[1],p=e.values[2],_=e.values[3],i=e.values[4],l=e.values[5]
    t.push({type:"C",values:[h,v,p,_,i,l]}),s=i,r=l}else if("c"===u){var h=s+e.values[0],v=r+e.values[1],p=s+e.values[2],_=r+e.values[3],i=s+e.values[4],l=r+e.values[5]
    t.push({type:"C",values:[h,v,p,_,i,l]}),s=i,r=l}else if("Q"===u){var h=e.values[0],v=e.values[1],i=e.values[2],l=e.values[3]
    t.push({type:"Q",values:[h,v,i,l]}),s=i,r=l}else if("q"===u){var h=s+e.values[0],v=r+e.values[1],i=s+e.values[2],l=r+e.values[3]
    t.push({type:"Q",values:[h,v,i,l]}),s=i,r=l}else if("A"===u){var i=e.values[5],l=e.values[6]
    t.push({type:"A",values:[e.values[0],e.values[1],e.values[2],e.values[3],e.values[4],i,l]}),s=i,r=l}else if("a"===u){var i=s+e.values[5],l=r+e.values[6]
    t.push({type:"A",values:[e.values[0],e.values[1],e.values[2],e.values[3],e.values[4],i,l]}),s=i,r=l}else if("H"===u){var i=e.values[0]
    t.push({type:"H",values:[i]}),s=i}else if("h"===u){var i=s+e.values[0]
    t.push({type:"H",values:[i]}),s=i}else if("V"===u){var l=e.values[0]
    t.push({type:"V",values:[l]}),r=l}else if("v"===u){var l=r+e.values[0]
    t.push({type:"V",values:[l]}),r=l}else if("S"===u){var p=e.values[0],_=e.values[1],i=e.values[2],l=e.values[3]
    t.push({type:"S",values:[p,_,i,l]}),s=i,r=l}else if("s"===u){var p=s+e.values[0],_=r+e.values[1],i=s+e.values[2],l=r+e.values[3]
    t.push({type:"S",values:[p,_,i,l]}),s=i,r=l}else if("T"===u){var i=e.values[0],l=e.values[1]
    t.push({type:"T",values:[i,l]}),s=i,r=l}else if("t"===u){var i=s+e.values[0],l=r+e.values[1]
    t.push({type:"T",values:[i,l]}),s=i,r=l}else("Z"===u||"z"===u)&&(t.push({type:"Z",values:[]}),s=a,r=n)}),t},p=function(e){var t=[],s=null,r=null,a=null,n=null,u=null,i=null,h=null
    return e.forEach(function(e){if("M"===e.type){var v=e.values[0],p=e.values[1]
    t.push({type:"M",values:[v,p]}),i=v,h=p,n=v,u=p}else if("C"===e.type){var _=e.values[0],c=e.values[1],o=e.values[2],d=e.values[3],v=e.values[4],p=e.values[5]
    t.push({type:"C",values:[_,c,o,d,v,p]}),r=o,a=d,n=v,u=p}else if("L"===e.type){var v=e.values[0],p=e.values[1]
    t.push({type:"L",values:[v,p]}),n=v,u=p}else if("H"===e.type){var v=e.values[0]
    t.push({type:"L",values:[v,u]}),n=v}else if("V"===e.type){var p=e.values[0]
    t.push({type:"L",values:[n,p]}),u=p}else if("S"===e.type){var y,x,o=e.values[0],d=e.values[1],v=e.values[2],p=e.values[3]
    "C"===s||"S"===s?(y=n+(n-r),x=u+(u-a)):(y=n,x=u),t.push({type:"C",values:[y,x,o,d,v,p]}),r=o,a=d,n=v,u=p}else if("T"===e.type){var _,c,v=e.values[0],p=e.values[1]
    "Q"===s||"T"===s?(_=n+(n-r),c=u+(u-a)):(_=n,c=u)
    var y=n+2*(_-n)/3,x=u+2*(c-u)/3,f=v+2*(_-v)/3,I=p+2*(c-p)/3
    t.push({type:"C",values:[y,x,f,I,v,p]}),r=_,a=c,n=v,u=p}else if("Q"===e.type){var _=e.values[0],c=e.values[1],v=e.values[2],p=e.values[3],y=n+2*(_-n)/3,x=u+2*(c-u)/3,f=v+2*(_-v)/3,I=p+2*(c-p)/3
    t.push({type:"C",values:[y,x,f,I,v,p]}),r=_,a=c,n=v,u=p}else if("A"===e.type){var m=Math.abs(e.values[0]),g=Math.abs(e.values[1]),b=e.values[2],M=e.values[3],S=e.values[4],v=e.values[5],p=e.values[6]
    if(0===m||0===g)t.push({type:"C",values:[n,u,v,p,v,p]}),n=v,u=p
    else if(n!==v||u!==p){var V=l(n,u,v,p,m,g,b,M,S)
    V.forEach(function(e){t.push({type:"C",values:e})}),n=v,u=p}}else"Z"===e.type&&(t.push(e),n=i,u=h)
    s=e.type}),t}
    SVGPathElement.prototype.setAttribute=function(e,t){"d"===e&&(this[u]=null,this[i]=null),a.call(this,e,t)},SVGPathElement.prototype.removeAttribute=function(e,t){"d"===e&&(this[u]=null,this[i]=null),n.call(this,e)},SVGPathElement.prototype.getPathData=function(e){if(e&&e.normalize){if(this[i])return h(this[i])
    var t
    this[u]?t=h(this[u]):(t=r(this.getAttribute("d")||""),this[u]=h(t))
    var s=p(v(t))
    return this[i]=h(s),s}if(this[u])return h(this[u])
    var t=r(this.getAttribute("d")||"")
    return this[u]=h(t),t},SVGPathElement.prototype.setPathData=function(e){if(0===e.length)s?this.setAttribute("d",""):this.removeAttribute("d")
    else{for(var t="",r=0,a=e.length;a>r;r+=1){var n=e[r]
    r>0&&(t+=" "),t+=n.type,n.values&&n.values.length>0&&(t+=" "+n.values.join(" "))}this.setAttribute("d",t)}},SVGRectElement.prototype.getPathData=function(e){var t=this.x.baseVal.value,s=this.y.baseVal.value,r=this.width.baseVal.value,a=this.height.baseVal.value,n=this.hasAttribute("rx")?this.rx.baseVal.value:this.ry.baseVal.value,u=this.hasAttribute("ry")?this.ry.baseVal.value:this.rx.baseVal.value
    n>r/2&&(n=r/2),u>a/2&&(u=a/2)
    var i=[{type:"M",values:[t+n,s]},{type:"H",values:[t+r-n]},{type:"A",values:[n,u,0,0,1,t+r,s+u]},{type:"V",values:[s+a-u]},{type:"A",values:[n,u,0,0,1,t+r-n,s+a]},{type:"H",values:[t+n]},{type:"A",values:[n,u,0,0,1,t,s+a-u]},{type:"V",values:[s+u]},{type:"A",values:[n,u,0,0,1,t+n,s]},{type:"Z",values:[]}]
    return i=i.filter(function(e){return"A"!==e.type||0!==e.values[0]&&0!==e.values[1]?!0:!1}),e&&e.normalize===!0&&(i=p(i)),i},SVGCircleElement.prototype.getPathData=function(e){var t=this.cx.baseVal.value,s=this.cy.baseVal.value,r=this.r.baseVal.value,a=[{type:"M",values:[t+r,s]},{type:"A",values:[r,r,0,0,1,t,s+r]},{type:"A",values:[r,r,0,0,1,t-r,s]},{type:"A",values:[r,r,0,0,1,t,s-r]},{type:"A",values:[r,r,0,0,1,t+r,s]},{type:"Z",values:[]}]
    return e&&e.normalize===!0&&(a=p(a)),a},SVGEllipseElement.prototype.getPathData=function(e){var t=this.cx.baseVal.value,s=this.cy.baseVal.value,r=this.rx.baseVal.value,a=this.ry.baseVal.value,n=[{type:"M",values:[t+r,s]},{type:"A",values:[r,a,0,0,1,t,s+a]},{type:"A",values:[r,a,0,0,1,t-r,s]},{type:"A",values:[r,a,0,0,1,t,s-a]},{type:"A",values:[r,a,0,0,1,t+r,s]},{type:"Z",values:[]}]
    return e&&e.normalize===!0&&(n=p(n)),n},SVGLineElement.prototype.getPathData=function(){return[{type:"M",values:[this.x1.baseVal.value,this.y1.baseVal.value]},{type:"L",values:[this.x2.baseVal.value,this.y2.baseVal.value]}]},SVGPolylineElement.prototype.getPathData=function(){for(var e=[],t=0;t<this.points.numberOfItems;t+=1){var s=this.points.getItem(t)
    e.push({type:0===t?"M":"L",values:[s.x,s.y]})}return e},SVGPolygonElement.prototype.getPathData=function(){for(var e=[],t=0;t<this.points.numberOfItems;t+=1){var s=this.points.getItem(t)
    e.push({type:0===t?"M":"L",values:[s.x,s.y]})}return e.push({type:"Z",values:[]}),e}}()
  }

  function clone(orgItem)
  {
    if (orgItem) return JSON.parse(JSON.stringify(orgItem));
  }

  function segsToString(segsAry, sigFigs=4)
  {
    let str = "";
    segsAry.forEach((seg)=>{
      str = str.concat(seg.type);
      for (let i=0; i<seg.values.length; i+=2)
      {
        str = str.concat(seg.values[i].toPrecision(sigFigs) +","+ seg.values[i+1].toPrecision(sigFigs)+" ");
      }
    });
    return str.trim();
  }

  function arcToBezier(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterClockwise) // angles in rads
  {
    startAngle = startAngle % (2*Math.PI);
    endAngle = endAngle % (2*Math.PI);
    if (startAngle === endAngle) {
      //circle time! subtract some of the angle so svg is happy (svg elliptical arc can't draw a full circle)
      endAngle = ((endAngle + (2*Math.PI)) - 0.001 * (counterClockwise ? -1 : 1)) % (2*Math.PI);
    }
    const endX = x+radiusX*Math.cos(endAngle),
          endY = y+radiusY*Math.sin(endAngle),
          startX = x+radiusX*Math.cos(startAngle),
          startY = y+radiusY*Math.sin(startAngle),
          sweepFlag = counterClockwise ? 0 : 1;
    let largeArcFlag = 0,
        diff = endAngle - startAngle;

    // https://github.com/gliffy/canvas2svg/issues/4
    if (diff < 0) {
      diff += 2*Math.PI;
    }

    if (counterClockwise) 
    {
      largeArcFlag = diff > Math.PI ? 0 : 1;
    } 
    else 
    {
      largeArcFlag = diff > Math.PI ? 1 : 0;
    }

    return ["M", startX, startY, "A", radiusX, radiusY, rotation, largeArcFlag, sweepFlag, endX, endY];
  }

  SVGsegs = class extends Array
  {
    constructor (d)
    {
      function toSegs(pathStr)
      {
        const svgPathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgPathElem.setAttribute("d", pathStr);
        const segs = svgPathElem.getPathData({normalize: true}); // returns segments converted to lines and Bezier curves 
 
        return segs;
      }

      if (!d || d.length === 0)
      {
        super();
      }
      else if (typeof d === 'string')
      {
        const pathStr = d.replace(/\,/g, " ");
        const svgData = toSegs(pathStr);  
        super(...svgData);
      }
      else if (Array.isArray(d))
      {
        // check typed Array views etc, convert to real Array
        if (ArrayBuffer.isView(d))    
        {
          d = Array.from(d);  
        }
        let pathStr = "";
        if (typeof(d[0]) === "number")  // its an Array of numbers
        {
          pathStr = "M "+d.join(" ");  // insert 'M' command so its valid SVG
        }
        else
        {
          pathStr = d.join(" "); 
        }
        const svgData = toSegs(pathStr);
        super(...svgData);
      }
    }

    toString(decPlaces)
    {
      return segsToString(this, decPlaces);
    }

    dup(){
      const newPathSegs = [];
      this.forEach((seg)=>{
        newPathSegs.push(seg.type, ...seg.values);
      });

      return new SVGsegs(newPathSegs);
    }

    translate(x=0, y=0){
      const newPathSegs = [];

      this.forEach((seg)=>{
        newPathSegs.push(seg.type);
        for (let j=0; j<seg.values.length; j+=2)   // step through the coord pairs
        {
          newPathSegs.push(seg.values[j] + x, seg.values[j+1] + y);
        }
      });

      return new SVGsegs(newPathSegs);
    }

    scale(xScl, yScl){
      const newPathSegs = [];
      const sx = xScl || 0.001,
            sy = yScl || sx;

      this.forEach((seg)=>{
        newPathSegs.push(seg.type);
        for (let j=0; j<seg.values.length; j+=2)   // step through the coord pairs
        {
          newPathSegs.push(seg.values[j] * sx, seg.values[j+1] * sy);
        }
      });

      return new SVGsegs(newPathSegs);
    }

    rotate(degs){
      const newPathSegs = [];
      const angle = degs || 0,
            toRad = Math.PI/180.0,
            s	= Math.sin(angle*toRad),
            c	= Math.cos(angle*toRad);

      this.forEach((seg)=>{
        newPathSegs.push(seg.type);
        for (let j=0; j<seg.values.length; j+=2)   // step through the coord pairs
        {
          let orgX = seg.values[j];
          let orgY = seg.values[j+1];
          newPathSegs.push(orgX*c + orgY*s, -orgX*s + orgY*c);
        }
      });

      return new SVGsegs(newPathSegs);
    }
  
    skew(hDegs, vDegs){
      const newPathSegs = [];
      const ha = hDegs || 0,
            va = vDegs || 0,
            toRad = Math.PI/180.0,
            htn	= Math.tan(-ha*toRad),
            vtn	= Math.tan(va*toRad);

      this.forEach((seg)=>{
        newPathSegs.push(seg.type);
        for (let j=0; j<seg.values.length; j+=2)   // step through the coord pairs
        {
          let orgX = seg.values[j];
          let orgY = seg.values[j+1];
          newPathSegs.push(orgX + orgY*htn, orgX*vtn + orgY);
        }
      });

      return new SVGsegs(newPathSegs);
    }

    appendPath(extensionData){
      let extAry = [];
      let orgAry = [];
      if (extensionData instanceof SVGsegs)
      {
        extensionData.forEach((seg)=>{
          extAry.push(seg.type, ...seg.values);
        });
      }
      else
      {
        console.warn("TypeError: SVGsegs.appendPath argument 0 not type SVGsegs");
        return;
      }
      this.forEach((seg)=>{
        orgAry.push(seg.type, ...seg.values);
      });
      // concatenate the segments
      const newPathSegs = orgAry.concat(extAry);

      return new SVGsegs(newPathSegs);
    }

    joinPath(extensionData){
      const org = this.dup();   // don't damage the original
      const newPathSegs = [];
      let extSegs;
      if (extensionData instanceof SVGsegs)
      {
        extSegs = extensionData;
      }
      else
      {
        console.warn("TypeError: SVGsegs.joinPath argument 0 not type SVGsegs");
        return;
      }

      if (org.length == 0)  // just add the extra including the "M" command
      {
        extSegs.forEach((seg)=>{
          newPathSegs.push(seg.type, ...seg.values);
        });
      }
      else // this has length
      {
        if (org[org.length-1].type == "Z")  // closed path
        {
          org.length = org.length-1;   // delete the 'closePath'
        }
        // start with the org segs
        org.forEach((seg)=>{
          newPathSegs.push(seg.type, ...seg.values);
        });
        // now tack on the extra commands skipping the initial "M" segment
        for (let j=1; j<extSegs.length; j++)
        {
          newPathSegs.push(extSegs[j].type, ...extSegs[j].values);
        }
      }

      return new SVGsegs(newPathSegs);
    }

    revWinding(){
      // reverse the direction of drawing around a path
      let cmds = this.dup(),
          zCmd = null,
          k, len,
          dCmd;
      const newPathSegs = [];  
      const newPathData = [];  

      function revPairs(ary)
      {
        // return a single array of x,y coords made by taking array of [x,y] arrays and reversing the order
        // eg. [1,2, 3,4, 5,6] returns [5,6, 3,4, 1,2]
        const opAry = [];

        for (let i=ary.length; i>0; i-=2)
        {
          opAry.push(ary[i-2], ary[i-1]);
        }
        return opAry;
      }

      if (cmds[cmds.length-1].type === "Z")
      {
        zCmd = cmds[cmds.length-1];
        cmds.length = cmds.length-1;     // leave off 'Z' cmd segment
      }
      // now step back along the path
      k = cmds.length-1;     // k points at the last segment in the path
      len = cmds[k].values.length;  // length of last seg coords array
      dCmd = {type:"M", values:[cmds[k].values[len-2], cmds[k].values[len-1]]};   // make a 'M' command from final coord pair
      newPathSegs.push(dCmd);         // make this the first command of the output
      cmds[k].values = cmds[k].values.slice(0,-2);  // last coord pair (we've used them)
      while (k>0)
      {
        dCmd = {type:cmds[k].type, values:revPairs(cmds[k].values)};  
        len = cmds[k-1].values.length;     // needed to find the last coord pair of the next segment back
        dCmd.values.push(cmds[k-1].values[len-2], cmds[k-1].values[len-1]); // add the last point of next cmd
        newPathSegs.push(dCmd); 
        // shove it out
        cmds[k-1].values = cmds[k-1].values.slice(0,-2);  // we've used the last point so slice it off
        k -= 1;
      }
      // add the 'z' if it was a closed path
      if (zCmd)
      {
        newPathSegs.push(zCmd);
      }
      newPathSegs.forEach((seg)=>{
        newPathData.push(seg.type, ...seg.values);
      });

      return new SVGsegs(newPathData);
    }
  };

  // function to create the SVGsegs without the 'new' word
  segment = (d)=>new SVGsegs(d);

  circle = function(d=1){
    return ["m", -0.5*d,0,
                  "c", 0,-0.27614*d, 0.22386*d,-0.5*d, 0.5*d,-0.5*d,
                  "c", 0.27614*d,0, 0.5*d,0.22386*d, 0.5*d,0.5*d,
                  "c", 0,0.27614*d, -0.22386*d,0.5*d, -0.5*d,0.5*d,
                  "c", -0.27614*d,0, -0.5*d,-0.22386*d, -0.5*d,-0.5*d, "z"];
  };

  arc = function(size, begDegs, endDegs){
    begDegs = begDegs % 360;
    endDegs = endDegs % 360;
    const swp = (endDegs > begDegs)? 1: 0;
    const lrg = (Math.abs(endDegs-begDegs)>180)? 1: 0;
    const secSrt = Math.PI*begDegs/180;
    const secEnd = Math.PI*endDegs/180;
    return ["M", size*Math.cos(secSrt), size*Math.sin(secSrt),
            "A", size, size, 0, lrg, swp, size*Math.cos(secEnd), size*Math.sin(secEnd)];
  };

  ellipse = function(width, height){
    const w = width || 1;
    let h = w;

    if ((typeof height === 'number')&&(height>0))
    {
      h = height;
    }
    return ["m", -0.5*w,0,
      "c", 0,-0.27614*h, 0.22386*w,-0.5*h, 0.5*w,-0.5*h,
      "c", 0.27614*w,0, 0.5*w,0.22386*h, 0.5*w,0.5*h,
      "c", 0,0.27614*h, -0.22386*w,0.5*h, -0.5*w,0.5*h,
      "c", -0.27614*w,0, -0.5*w,-0.22386*h, -0.5*w,-0.5*h, "z"];
  };

  ellipticalArc = function(radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)  // angles in degrees
  {
    // rotation of ellipse not currently supported by arcToBezier utility
    const svg = arcToBezier(0, 0, radiusX, radiusY, 0, Math.PI*startAngle/180, Math.PI*endAngle/180, anticlockwise);
    const pth = (new Path2Dext(svg)).rotate(-rotation);
    const data = [];

    pth.segs.forEach((seg)=>{
      data.push(seg.type, ...seg.values);
    });

    return data;
  };
 
  square = function(w=1){
    return ["m", 0.5*w, -0.5*w, "l", 0, w, -w, 0, 0, -w, "z"];
  };

  rectangle = function(width, height, rad)
  {
    const w = width || 1,
          h = height || w;
    let data;
    
    if ((rad === undefined)||(rad<=0))
    {
      data = ["m",-w/2,-h/2, "l",w,0, 0,h, -w,0, "z"];
    }
    else
    {
      const r = Math.min(w/2, h/2, rad);

      data = ["m", -w/2+r,-h/2, "l",w-2*r,0, "a",r,r,0,0,1,r,r, "l",0,h-2*r,
              "a",r,r,0,0,1,-r,r, "l",-w+2*r,0, "a",r,r,0,0,1,-r,-r, "l",0,-h+2*r,
              "a",r,r,0,0,1,r,-r, "z"];
    }

    return data;
  };

  triangle = function(s=1){
    return ["m", 0.5*s, -0.289*s, "l", -0.5*s, 0.866*s, -0.5*s, -0.866*s, "z"];
  };

  cross = function(w=1){
    return ["m", -0.5*w, 0, "l", w, 0, "m", -0.5*w, -0.5*w, "l", 0, w];
  };

  ex = function(d=1){
    return ["m", -0.3535*d,-0.3535*d, "l",0.707*d,0.707*d,
                  "m",-0.707*d,0, "l",0.707*d,-0.707*d];
  };

  class Drag2D 
  {
    constructor(grabFn, dragFn, dropFn) {
      this.cgo = null;                    // filled in by render
      this.layer = null;                  // filled in by render
      this.target = null;                 // filled by enableDrag method
      this.topCvs = null;
      this.grabCallback = grabFn || null;
      this.dragCallback = dragFn || null;
      this.dropCallback = dropFn || null;
      this.grabCsrPos = {x:0, y:0};
      this.grabDwgOrg = {x:0, y:0};       // target drawing origin in world coords
      this.grabOfs = {x:0, y:0};          // csr offset from target (maybe Obj or Group) drawing origin
    }

    grab(evt){
      const event = evt||window.event;
      // calc top canvas at grab time since layers can come and go
      const nLrs = this.cgo.bkgCanvas.layers.length;
      this.topCvs = this.cgo.bkgCanvas.layers[nLrs-1].cElem;

      this.topCvs.onmouseup = (e)=>{this.drop(e);};
      this.topCvs.onmouseout = (e)=>{this.drop(e);};
      const csrPosWC = this.cgo.getCursorPosWC(event);      // update mouse pos to pass to the owner
      // save the cursor pos its very useful
      this.grabCsrPos.x = csrPosWC.x;
      this.grabCsrPos.y = csrPosWC.y;
      // copy the parent drawing origin (for convenience)
      this.grabDwgOrg.x = this.target.dwgOrg.x;
      this.grabDwgOrg.y = this.target.dwgOrg.y;
      if (this.target.parent)
      {
        // save cursor offset from drawing origin add parent Group offset (it will be inherited)
        this.grabOfs.x = csrPosWC.x - this.grabDwgOrg.x + this.target.parent.dwgOrg.x;
        this.grabOfs.y = csrPosWC.y - this.grabDwgOrg.y + this.target.parent.dwgOrg.y;
      }
      else
      {
        this.grabOfs.x = csrPosWC.x - this.grabDwgOrg.x;
        this.grabOfs.y = csrPosWC.y - this.grabDwgOrg.y;
      }
      if (this.grabCallback)
      {
        this.grabCallback(csrPosWC);    // call in the scope of dragNdrop object
      }
      this.topCvs.onmousemove = (event)=>{this.drag(event);};
      event.preventDefault();
      return false;
    }

    drag(event){
      if (this.dragCallback)
      {
        const csrPosWC = this.cgo.getCursorPosWC(event);  // update mouse pos to pass to the owner
        this.dragCallback(csrPosWC);
      }
    }

    drop(event){
      const csrPosWC = this.cgo.getCursorPosWC(event);  // update mouse pos to pass to the owner

      this.topCvs.onmouseup = null;
      this.topCvs.onmouseout = null;
      this.topCvs.onmousemove = null;
      if (this.dropCallback)
      {
        this.dropCallback(csrPosWC);
      }
    }

    // version of drop that can be called from an app to stop a drag before the mouseup event
    cancelDrag(mousePos){
      this.topCvs.onmouseup = null;
      this.topCvs.onmouseout = null;
      this.topCvs.onmousemove = null;
      if (this.dropCallback)
      {
        this.dropCallback(mousePos);
      }
    }
  }

  LinearGradient = class 
  {
    constructor(p1x, p1y, p2x, p2y)
    {
      this.grad = [p1x, p1y, p2x, p2y];
      this.colorStops = [];
    }
    
    addColorStop()
    {
      this.colorStops.push(arguments);
    }
  }

  RadialGradient = class 
  { 
    constructor(p1x, p1y, r1, p2x, p2y, r2)
    {
      this.grad = [p1x, p1y, r1, p2x, p2y, r2];
      this.colorStops = [];
    }

    addColorStop()
    {
      this.colorStops.push(arguments);
    }
  }

  function transformPoint(px, py, m)
  {
    return {x:px*m.a + py*m.c + m.e, y:px*m.b + py*m.d + m.f};
  }

  function matrixReset(m)
  { // reset to the identity matrix
    m.a = 1;
    m.b = 0;
    m.c = 0;
    m.d = 1;
    m.e = 0;
    m.f = 0;
  }

  const xfmrFns = {
    // Must have these functions as properties so they can be cloned using toJSON and JSON.stringify
    TRN: function translater(args)  // will be called with 'this' pointing to an Obj2D
    {
      const x = args[0] || 0,
            y = args[1] || 0;

      if (this.hasOwnProperty('type'))    // this transformer may be called on point object {x:, y: }
      {
        this.ofsTfm = this.ofsTfm.translate(x, y);   
      }
      else     // its a point to be transformed
      {
        return {x:this.x + x, y:this.y + y};  // transformPoint returns an Object {x:, y: }
      }
    },
    SCL: function scaler(args)      // will be called with 'this' pointing to an Obj2D
    {
      // scale matrix, applied before translate or revolve
      const sx = args[0] || 0.001,
            sy = args[1] || sx;

      if (this.hasOwnProperty('type'))
      {
        this.ofsTfm = this.ofsTfm.scaleNonUniform(sx, sy);
      }
      else    // this transformer may be called on point object {x:, y: }
      {
        return {x:this.x*sx, y:this.y*sy};  // transformPoint returns an Object {x:, y: }
      }
    },
    ROT: function rotater(args)      // will be called with 'this' pointing to an Obj2D
    {
      // rotate matrix, angles in degrees applied before translate or revolve
      const angle = args[0] || 0,
            rad = Math.PI/180.0,
            s	= Math.sin(-angle*rad),
            c	= Math.cos(-angle*rad);
          
      if (this.hasOwnProperty('type'))
      {
        this.ofsTfm = this.ofsTfm.rotate(angle);
      }
      else     // this transformer may be called on point object {x:, y: }
      {
        return {x:this.x*c + this.y*s, y:-this.x*s + this.y*c};  // transformPoint returns an Object {x:, y: }
      }
    },
    SKW: function skewer(args)
    {
      // Skew matrix, angles in degrees applied before translate or revolve
      const nonIsoScl = args[2] || 1,
            ha = args[0] || 0,
            va = args[1] || 0,
            rad = Math.PI/180.0,
            htn = Math.tan(-ha*rad)/nonIsoScl,
            vtn = Math.tan(va*rad)*nonIsoScl;

      if (this.hasOwnProperty('type'))    // check for Obj (this transformer may be called on point)
      {
        this.ofsTfm = this.ofsTfm.skewX(-ha);
        this.ofsTfm = this.ofsTfm.skewY(va);
      }
      else
      {
        return {x:this.x + this.y*htn, y:this.x*vtn + this.y};  // transformPoint returns an Object {x:, y: }
      }
    }
  };

  class Transformer
  {
    constructor(type)  // and other arguments
    {
      const argAry = Array.prototype.slice.call(arguments).slice(1);     // skip type parameter save the rest

      this.type = type;
      this.args = argAry;     // array of arguments
    }
  }

  Group = class 
  {
    constructor()
    {
      this.type = "GRP";                    // enum of type to instruct the render method
      this.parent = null;                   // pointer to parent group if any
      this.children = [];                   // only Groups have children
      this.dwgOrg = {x:0, y:0};             // drawing origin (0,0) may get translated
      this.ofsTfmAry = [];                  // soft offset from any parent Group's transform
      this.netTfmAry = [];                  // ofsTfmAry with grpTfmAry concatenated
      this.ofsTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();  // product of hard & ofs tfm actions, filled in at render
      this.grpTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();  // product of hard & ofs tfm actions, filled in at render
      this.netTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();  // parent Group netTfm applied to this.ofsTfm
      this.dragNdropHandlers = null;        // array of DnD handlers to be passed to newly added children
      // add any objects passed by forwarding them to addObj
      this.addObj.apply(this, arguments);
    }

    setProperty(propertyName, value)
    {
      // set Obj2D property recursively
      function iterate(grp)
      {
        grp.children.forEach((childNode)=>{
          if (childNode.type === "GRP")
          {
            iterate(childNode);
          }
          else   // Obj2D
          {
            childNode.setProperty(propertyName, value);
          }
        });
      }

      iterate(this);
    }

    deleteObj(obj)
    {
      // remove from children array
      const idx = this.children.indexOf(obj);

      if (idx >= 0)
      {
        this.children.splice(idx, 1);
        obj.parent = null;
      }
    }

    addObj(/* arguments */)
    {
      const args = Array.prototype.slice.call(arguments); // grab array of arguments

      for (let i=0; i<args.length; i++)
      {
        if (Array.isArray(args[i]))
        {
          // check that only Groups or Obj2Ds are passed
          for (let j=0; j<args[i].length; j++)
          {
            if (!types.includes(args[i][j].type))
            {
              console.error("Group.addObj called on bad object type");
              return;
            }
            else
            {
              // point the Obj2D or Group parent property at this Group
              args[i][j].parent = this;           // now its a free agent link it to this group
              this.children.push(args[i][j]);
              // enable drag and drop if this group has drag
              if (!args[i][j].dragNdrop && this.dragNdropHandlers)
              {
                args[i][j].enableDrag.apply(args[i][j], this.dragNdropHandlers);
                args[i][j].dragNdrop.target = this;     // the Group is the target being dragged
              }
            }
          }
        }
        else
        {
          if (!args[i] || (!types.includes(args[i].type)))  // don't add undefined or non-Obj2D
          {
            console.error("Group.addObj called on bad object type");
            return;
          }
          else
          {
            args[i].parent = this;            // now its a free agent link it to this group
            this.children.push(args[i]);
            // enable drag and drop if this group has drag
            if (!args[i].dragNdrop && this.dragNdropHandlers)
            {
              args[i].enableDrag.apply(args[i], this.dragNdropHandlers);
              args[i].dragNdrop.target = this;     // the Group is the target being dragged
            }
          }
        }
      } 
    }

    /*======================================
    * Recursively add drag object to Obj2D
    * descendants.
    * When rendered all these Obj2D will be
    * added to dragObjects to be checked on
    * mousedown
    *-------------------------------------*/
   enableDrag(grabFn, dragFn, dropFn)
   {
     const savThis = this;

     function iterate(grp)
     {
       grp.children.forEach((childNode)=>{
         if (childNode.type === "GRP")
         {
           iterate(childNode);
         }
         else   // Obj2D
         {
           if (childNode.dragNdrop === null)    // don't over-write if its already assigned a handler
           {
             childNode.enableDrag(grabFn, dragFn, dropFn);
             childNode.dragNdrop.target = savThis;     // the Group is the target being dragged
           }
         }
       });
     }

     this.dragNdropHandlers = arguments;
     iterate(this);
   }

   /*======================================
   * Disable dragging on Obj2D children
   *-------------------------------------*/
   disableDrag()
   {
     function iterate(grp)
     {
       grp.children.forEach(function(childNode){
         if (childNode.type === "GRP")
         {
           iterate(childNode);
         }
         else
         {
           childNode.disableDrag();
         }
       });
     }

     this.dragNdropHandlers = undefined;
     iterate(this);
   }

    /*======================================
    * Apply a translation transform to the
    * Group's OfsTfmAry.
    *-------------------------------------*/
    translate(x, y)
    {
      const trnsDstr = new Transformer("TRN", x, y);
      this.ofsTfmAry.push(trnsDstr);
    }

    /*======================================
    * Apply a rotation transform to the
    * Group's OfsTfmAry.
    *-------------------------------------*/
    rotate(degs)
    {
      const rotDstr = new Transformer("ROT", degs);
      this.ofsTfmAry.push(rotDstr);
    }

    /*======================================
    * Apply a skew transform to the
    * Group's OfsTfmAry.
    *-------------------------------------*/
    skew(degH, degV)
    {
      const skwDstr = new Transformer("SKW", degH, degV);
      this.ofsTfmAry.push(skwDstr);
    }

    /*======================================
    * Apply a scale transform to the
    * Group's OfsTfmAry.
    *-------------------------------------*/
    scale(xScl, yScl)
    {
      const sclDstr = new Transformer("SCL", xScl, yScl);
      this.ofsTfmAry.push(sclDstr);
    }

    /*======================================
    * Reset the Group's OfsTfmAry
    *-------------------------------------*/
    transformReset()
    {
      this.ofsTfmAry = [];
      matrixReset(this.ofsTfm);  // reset the accumulation matrix
    }
  }

  function setPropertyFn(propertyName, value)
  {
    const lorgVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    if ((typeof propertyName !== "string")||(value === undefined))
    {
      return;
    }

    switch (propertyName.toLowerCase())
    {
      case "fillrule":
        if (typeof value !== "string")
        {
          return;
        }
        if ((value === "evenodd")||(value ==="nonzero"))
        {
          this.fillRule = value;
        }
        break;
      case "fillcolor":
        this.fillCol = value;
        break;
      case "strokecolor":
        this.strokeCol = value;
        break;
      case "linewidth":
      case "strokewidth":                 // for backward compatability
        if ((typeof value === "number")&&(value > 0))
        {
          this.lineWidth = value;
        }
        break;
      case "linewidthwc":
        if ((typeof value === "number")&&(value > 0))
        {
          this.lineWidthWC = value;
        }
        break;
      case "linecap":
        if (typeof value !== "string")
        {
          return;
        }
        if ((value === "butt")||(value ==="round")||(value === "square"))
        {
          this.lineCap = value;
        }
        break;
      case "iso":
      case "isotropic":
        if ((value == true)||(value === 'iso')||(value === 'isotropic'))
        {
          this.iso = true;
        }
        else
        {
          this.iso = false;
        }
        break;
      case "dashed":
        if (Array.isArray(value) && value[0])
        {
          this.dashed = value;
        }
        else     // ctx.setLineDash([]) will clear dashed settings
        {
          this.dashed = [];
        }
        break;
      case "dashoffset":
        this.dashOffset = value || 0;
        break;
      case "border":
        if (value === true)
        {
          this.border = true;
        }
        if (value === false)
        {
          this.border = false;
        }
        break;
      case "fontsize":
        if ((typeof value === "number")&&(value > 0))
        {
          this.fontSize = value;
        }
        break;
      case "fontweight":
        if ((typeof value === "string")||((typeof value === "number")&&(value>=100)&&(value<=900)))
        {
          this.fontWeight = value;
        }
        break;
      case "fontfamily":
        if (typeof value === "string")
        {
          this.fontFamily = value;
        }
        break;
      case "bgfillcolor":
        this.bgFillColor = value;
        break;
      case "imgwidth":
        this.imgWidth = Math.abs(value);
        break;
      case "imgheight":
        this.imgHeight = Math.abs(value);
        break;
      case "lorg":
        if (lorgVals.indexOf(value) !== -1)
        {
          this.lorg = value;
        }
        break;
      case "shadowoffsetx":
        this.shadowOffsetX = value || 0;
        break;
      case "shadowoffsety":
        this.shadowOffsetY = value || 0;
        break;
      case "shadowblur":
        this.shadowBlur = value || 0;
        break;
      case "shadowcolor":
        this.shadowColor = value;
        break;
      case "x":
        const trnsXDstr = new Transformer("TRN", value, 0);
        this.hardTfmAry.push(trnsXDstr);
        break;
      case "y":
        const trnsYDstr = new Transformer("TRN", 0, value);
        this.hardTfmAry.push(trnsYDstr);
        break;
      case "rot":
      case "degs":
        const rotDstr = new Transformer("ROT", value);
        this.hardTfmAry.push(rotDstr);
        break;
      case "scl":
        const scl = (value != 0)? value: 0.001;   // limit to 1/1000th full size
        const sclDstr = new Transformer("SCL", scl, scl);
        this.hardTfmAry.push(sclDstr);
        break;
      case "skewx":
        const skewXDstr = new Transformer("SKW", value, 0);
        this.hardTfmAry.push(skewXDstr);
        break;
      case "skewy":
        const skewYDstr = new Transformer("SKW", 0, value);
        this.hardTfmAry.push(skewYDstr);
        break;
      default:
      return;
    }
  }

  class Obj2D
  { 
    constructor()
    {
      this.iso = true;                          // default for Shape, Img, Text
      this.parent = null;                       // pointer to parent Group if any
      this.dwgOrg = {x:0, y:0};                 // drawing origin (0,0) may get translated
      // properties handling transform inheritance
      this.hardTfmAry = [];                     // hard offset from any parent Group's transform
      this.ofsTfmAry = [];                      // soft offset from any parent Group's transform
      this.netTfmAry = [];                      // ofsTfmAry with grpTfmAry concatenated
      this.ofsTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
      this.netTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
      this.dragNdrop = null;
    }

    enableDrag(grabFn, dragFn, dropFn)
    {
      this.dragNdrop = new Drag2D(grabFn, dragFn, dropFn);
      // fill in the Drag2D properties for use by callBacks
      this.dragNdrop.target = this;
    }

    disableDrag()
    {
      if (!this.dragNdrop)
      {
        return;
      }
      // remove this object from array to be checked on mousedown
      const aidx = this.dragNdrop.layer.dragObjects.indexOf(this);
      this.dragNdrop.layer.dragObjects.splice(aidx, 1);
      this.dragNdrop = null;
    }

    /*======================================
    * Apply a translation transform to the
    * Obj2D's OfsTfmAry.
    *-------------------------------------*/
    translate(x, y)
    {
      const trnsDstr = new Transformer("TRN", x, y);
      this.ofsTfmAry.push(trnsDstr);
    }

    /*======================================
    * Apply a rotation transform to the
    * Obj2D's OfsTfmAry.
    *-------------------------------------*/
    rotate(degs)
    {
      const rotDstr = new Transformer("ROT", degs);
      this.ofsTfmAry.push(rotDstr);
    }

    /*======================================
    * Apply a skew transform to the
    * Obj2D's OfsTfmAry.
    *-------------------------------------*/
    skew(degH, degV)
    {
      const skwDstr = new Transformer("SKW", degH, degV);
      this.ofsTfmAry.push(skwDstr);
    }

    /*======================================
    * Apply a scale transform to the
    * Obj2D's OfsTfmAry.
    *-------------------------------------*/
    scale(xScl, yScl)
    {
      const sclDstr = new Transformer("SCL", xScl, yScl);
      this.ofsTfmAry.push(sclDstr);
    }

    /*======================================
    * Reset the Obj2D's OfsTfmAry
    *-------------------------------------*/
    transformReset()
    {
      this.ofsTfmAry = [];
      matrixReset(this.ofsTfm);  // reset the accumulation matrix
    }
  }

  ClipMask = class extends Obj2D
  {  
    constructor(pathDef, options)
    {
      super();
      this.type = "CLIP";
      this.drawCmds = [];

      this.fillRule = "nonzero";
      this.fillColor = null;
      this.border = false;    // ClipMask can have a border (half width showing)
      this.strokeCol = null;
      this.lineWidth = null;
      this.lineWidthWC = null;
      this.lineCap = null;
      this.savScale = 1; 
      this.iso= false;    // default
      // drop shadow properties
      this.shadowOffsetX = 0;
      this.shadowOffsetY = 0;
      this.shadowBlur = 0;
      this.shadowColor = "#000000";
      // dashed line properties
      this.dashed = [];
      this.dashOffset = 0;
  
      this.setDescriptor(pathDef);

      // handle user requested options
      const opt = (typeof options === 'object')? options: {};   // avoid undeclared object errors
      for (let prop in opt)
      {
        if (opt.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
            this.setProperty(prop, opt[prop]);
        }
      }
    }

    setDescriptor(commands)
    {
      let pathStr;
      let path;
      if (commands instanceof SVGsegs)
      {
        this.drawCmds = commands.dup();
      }
      else if ((typeof commands === "string") && commands.length)  // a string will be svg commands
      {
        pathStr = commands.replace(/\,/g, " ");  // commas cause trouble, replace with spaces
        path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathStr);
        this.drawCmds = path.getPathData({normalize: true}); // returns segments converted to lines and Bezier curves 
      }
      else if (commands && commands.length)  // non-empty array 
      {
        // check typed Array views etc, convert to real Array
        if (ArrayBuffer.isView(commands))
        {
          commands = Array.from(commands);  
        }
        if (Array.isArray(commands))
        {
          if (typeof(commands[0]) === "number")  // must be an Array of numbers
          {
            pathStr = "M "+commands.join(" "); // insert 'M' command so its valid SVG
          }
          else
          {
            pathStr = commands.join(" ");
          }
          path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", pathStr);
          this.drawCmds = path.getPathData({normalize: true}); // returns segments converted to lines and Bezier curves 
        }
      }
    }

    setProperty()
    {
      setPropertyFn.apply(this, arguments);
    }

    dup()
    {
      const newObj = new ClipMask();

      newObj.type = this.type;
      newObj.drawCmds = clone(this.drawCmds);
      newObj.parent = null;                       // pointer to parent group if any
      newObj.dwgOrg = clone(this.dwgOrg);
      newObj.hardTfmAry = clone(this.hardTfmAry);  // hard offset from any parent Group's transform
      newObj.ofsTfmAry = clone(this.ofsTfmAry);    // soft offset from any parent Group's transform
  
      newObj.fillRule = this.fillRule;   // for SHAPE
      newObj.fillCol = this.fillCol;     // for SHAPE
      newObj.border = this.border;
      newObj.strokeCol = this.strokeCol;
      newObj.lineWidth = this.lineWidth;
      newObj.lineWidthWC = this.lineWidthWC;
      newObj.lineCap = this.lineCap;
      newObj.savScale = 1; 
      newObj.iso = this.iso;
  
      newObj.shadowOffsetX = this.shadowOffsetX;
      newObj.shadowOffsetY = this.shadowOffsetY;
      newObj.shadowBlur = this.shadowBlur;
      newObj.shadowColor = this.shadowColor;
  
      newObj.dashed = clone(this.dashed);
      newObj.dashOffset = this.dashOffset;
      // The other objects are dynamic, calculated at render
  
      return newObj;         // return a object which inherits Obj2D properties
    }
  }

  Path = class extends ClipMask
  {
    constructor(commands, options)
    {
      super(commands, options);
      this.type = "PATH";               // type string to instruct the render method
    }
  }

  Shape = class extends Path
  {
    constructor(commands, options)
    {
      const opt = options || {};

      super(commands, options);
      this.type = "SHAPE";
      this.clearFlag = false;  // private flag for clearShape method
      // only other difference is the default value for 'iso' property
      if (opt.hasOwnProperty("iso"))
      {
        this.setProperty("iso", opt.iso);
      }
      else if (opt.hasOwnProperty("isotropic"))
      {
        this.setProperty("iso", opt.isotropic);
      }
      else
      {
        this.iso = true;   // default true = maintain aspect ratio
      }
    }
  }

  Img = class extends Obj2D
  {
    constructor(imgDef, options)
    {
      super();
      this.type = "IMG";

      this.setDescriptor(imgDef);

      this.drawCmds = [];               // DrawCmd array for the text or img bounding box
      this.width = 0;                   // only used for type = IMG, TEXT, set to 0 until image loaded
      this.height = 0;                  //     "
      this.imgWidth = 0;                // user requested width in WC
      this.imgHeight = 0;               // user requested height in WC
      this.imgLorgX = 0;                // only used for type = IMG, TEXT, set to 0 until image loaded
      this.imgLorgY = 0;                //     "
      this.lorg = 1;                    // used by IMG and TEXT to set drawing origin
      // properties set by setProperty method, if undefined render uses Cango default
      this.border = false;              // true = stroke outline with strokeColor & lineWidth
      this.strokeCol = null;            // render will stroke a path in this color
      this.lineWidthWC = null;          // border width world coords
      this.lineWidth = null;            // border width pixels
      this.lineCap = null;              // round, butt or square
      this.savScale = 1;                // save accumulated scale factors for lineWidth of border
      // drop shadow properties
      this.shadowOffsetX = 0;
      this.shadowOffsetY = 0;
      this.shadowBlur = 0;
      this.shadowColor = "#000000";

      // handle user requested options
      const opt = (typeof options === 'object')? options: {};   // avoid undeclared object errors
      for (let prop in opt)
      {
        if (opt.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          this.setProperty(prop, opt[prop]);
        }
      }
    }

    setDescriptor(imgData)
    {
      if (typeof imgData === "string")
      {
        this.imgBuf = new Image();    // pointer to the Image object when image is loaded
        this.imgBuf.src = imgData;    // start loading the image immediately
      }
      else if (imgData instanceof Image)
      {
        this.imgBuf = imgData;        // pre-loaded Image passed
      }
      else if (imgData instanceof HTMLCanvasElement)
      {
        this.imgBuf = imgData;
      }
      else
      {
        console.error("Img data type unrecognised");
      }
    }

    setProperty()
    {
      setPropertyFn.apply(this, arguments);
    }

    dup()
    {
      const newObj = new Img(this.imgBuf);   // just copy reference

      newObj.type = this.type;
      newObj.drawCmds = clone(this.drawCmds);
      newObj.dwgOrg = clone(this.dwgOrg);
      newObj.dragNdrop = null;
      newObj.hardTfmAry = clone(this.hardTfmAry);  // hard offset from any parent Group's transform
      newObj.ofsTfmAry = clone(this.ofsTfmAry);    // soft offset from any parent Group's transform
      newObj.border = this.border;
      newObj.strokeCol = this.strokeCol;
      newObj.lineWidth = this.lineWidth;
      newObj.lineWidthWC = this.lineWidthWC;
      newObj.lineCap = this.lineCap;
      newObj.savScale = 1; 
      newObj.iso = this.iso;
      newObj.dashed = clone(this.dashed);
      newObj.dashOffset = this.dashOffset;
      newObj.width = this.width;
      newObj.height = this.height;
      newObj.imgWidth = this.imgWidth;
      newObj.imgHeight = this.imgHeight;
      newObj.imgLorgX = this.imgLorgX;
      newObj.imgLorgY = this.imgLorgY;
      newObj.lorg = this.lorg;
      newObj.shadowOffsetX = this.shadowOffsetX;
      newObj.shadowOffsetY = this.shadowOffsetY;
      newObj.shadowBlur = this.shadowBlur;
      newObj.shadowColor = this.shadowColor;
      // The other objects are dynamic, calculated at render

      return newObj;         // return a object which inherits Obj2D properties
    }

    formatImg(cgo)
    {
      const wcAspectRatio = Math.abs(cgo.yscl/cgo.xscl);
      let wid, hgt, 
          dx = 0,
          dy = 0;

      this.iso = true;   // over-ride any iso=false (rotation fials with no-iso pics)
      if (!this.imgBuf.width)
      {
        console.log("in image onload handler yet image NOT loaded!");
      }
      if (this.imgWidth && this.imgHeight)
      {
        wid = this.imgWidth;
        hgt = this.imgHeight*wcAspectRatio;
      }
      else if (this.imgWidth && !this.imgHeight)  // width only passed height is auto
      {
        wid = this.imgWidth;
        hgt = wid*this.imgBuf.height/this.imgBuf.width;  // keep aspect ratio, use x units
      }
      else if (this.imgHeight && !this.imgWidth)  // height only passed width is auto
      {
        hgt = this.imgHeight*wcAspectRatio;
        wid = hgt*this.imgBuf.width/this.imgBuf.height;    // keep aspect ratio
      }
      else    // no width or height default to natural size;
      {
        wid = this.imgBuf.width;    // default to natural width if none passed
        hgt = wid*this.imgBuf.height/this.imgBuf.width;  // keep aspect ratio, use x units
      }

      const wid2 = wid/2;
      const hgt2 = hgt/2;
      const lorgWC = [0, [0,    0], [wid2,    0], [wid,    0],
                        [0, hgt2], [wid2, hgt2], [wid, hgt2],
                        [0,  hgt], [wid2,  hgt], [wid,  hgt]];
      if (lorgWC[this.lorg] !== undefined)
      {
        dx = -lorgWC[this.lorg][0];
        dy = -lorgWC[this.lorg][1];
      }
      this.imgLorgX = dx;     // world coords offset to drawing origin
      this.imgLorgY = dy;
      this.width = wid;       // default to natural width if none passed
      this.height = hgt;      // default to natural height if none passed
      // construct the draw cmds for the Img bounding box
      const ulx = dx;
      const uly = dy;
      const llx = dx;
      const lly = dy+hgt;
      const lrx = dx+wid;
      const lry = dy+hgt;
      const urx = dx+wid;
      const ury = dy;
      this.drawCmds = [ {type:"M", values:[ulx, uly]}, 
                        {type:"L", values:[llx, lly]}, 
                        {type:"L", values:[lrx, lry]}, 
                        {type:"L", values:[urx, ury]}, 
                        {type:"Z", values:[]} ];
    }
  }

  Text = class extends Obj2D
  {
    constructor (txtString, options)
    {
      super();
      this.type = "TEXT";               // type string to instruct the render method
      this.txtStr = "";                 // store the text String
      this.drawCmds = [];               // DrawCmd array for the text or img bounding box
      this.width = 0;                   // only used for type = IMG, TEXT, set to 0 until image loaded
      this.height = 0;                  //     "
      this.imgLorgX = 0;                //     "
      this.imgLorgY = 0;                //     "
      this.lorg = 1;                    // used by IMG and TEXT to set drawing origin
      // properties set by setProperty method, if undefined render uses Cango default
      this.border = false;              // true = stroke outline with strokeColor & lineWidth
      this.fillCol = null;              // only used if type == SHAPE or TEXT
      this.bgFillColor = null;          // only used if type = TEXT
      this.strokeCol = null;            // render will stroke a path in this color
      this.fontSize = null;             // fontSize in pixels (TEXT only)
      this.fontSizeZC = null;           // fontSize zoom corrected, scaled for any change in context xscl
      this.fontWeight = null;           // fontWeight 100..900 (TEXT only)
      this.fontFamily = null;           // (TEXT only)
      this.lineWidthWC = null;          // border width world coords
      this.lineWidth = null;            // border width pixels
      this.lineCap = null;              // round, butt or square
      this.savScale = 1;                // save acculmulated scale factors to scale lineWidth of border 
      // drop shadow properties
      this.shadowOffsetX = 0;
      this.shadowOffsetY = 0;
      this.shadowBlur = 0;
      this.shadowColor = "#000000";

      this.setDescriptor(txtString);

      // handle user requested options
      const opt = (typeof options === 'object')? options: {};   // avoid undeclared object errors
      for (let prop in opt)
      {
        if (opt.hasOwnProperty(prop)) // own property, not inherited from prototype
        {
          this.setProperty(prop, opt[prop]);
        }
      }
    }

    setDescriptor(str)
    {
      if (typeof str !== "string")
      {
        console.error("Text data type not a string");
      }
      else
      {
        this.txtStr = str;
      }
    }

    setProperty()
    {
      setPropertyFn.apply(this, arguments);
    }

    dup()
    {
      const newObj = new Text(this.txtStr.slice(0));

      newObj.type = this.type;
      newObj.drawCmds = clone(this.drawCmds);
      newObj.dwgOrg = clone(this.dwgOrg);
      newObj.hardTfmAry = clone(this.hardTfmAry);  // hard offset from any parent Group's transform
      newObj.ofsTfmAry = clone(this.ofsTfmAry);    // soft offset from any parent Group's transform
      newObj.border = this.border;
      newObj.strokeCol = this.strokeCol;
      newObj.fillCol = this.fillCol;
      newObj.bgFillColor = this.bgFillColor;
      newObj.lineWidth = this.lineWidth;
      newObj.lineWidthWC = this.lineWidthWC;
      newObj.lineCap = this.lineCap;
      newObj.savScale = 1; 
      newObj.dashed = clone(this.dashed);
      newObj.dashOffset = this.dashOffset;
      newObj.width = this.width;
      newObj.height = this.height;
      newObj.imgLorgX = this.imgLorgX;
      newObj.imgLorgY = this.imgLorgY;
      newObj.lorg = this.lorg;
      newObj.fontSize = this.fontSize;
      newObj.fontWeight = this.fontWeight;
      newObj.fontFamily = this.fontFamily;
      newObj.shadowOffsetX = this.shadowOffsetX;
      newObj.shadowOffsetY = this.shadowOffsetY;
      newObj.shadowBlur = this.shadowBlur;
      newObj.shadowColor = this.shadowColor;
      // The other objects are dynamic, calculated at render

      return newObj;         // return a object which inherits Obj2D properties
    }

    formatText(gc)
    {
      const fntSz = this.fontSize || gc.fontSize,     // fontSize in pxls
            fntFm = this.fontFamily || gc.fontFamily,
            fntWt = this.fontWeight || gc.fontWeight,
            lorg = this.lorg || 1;
      let wid, hgt,   // Note: char cell is ~1.4*fontSize pixels high
          dx = 0,
          dy = 0,
          fntScl;

      // support for zoom and pan
      if (!this.orgXscl)
      {
        // first time drawn save the scale
        this.orgXscl = gc.xscl;
      }
      fntScl = gc.xscl/this.orgXscl;   // scale for any zoom factor
      this.fontSizeZC = fntSz*fntScl;
      // set the drawing context to measure the size
      gc.ctx.save();
      transformCtx(gc.ctx);  // reset to identity matrix
      gc.ctx.font = fntWt+" "+fntSz+"px "+fntFm;
      wid = gc.ctx.measureText(this.txtStr).width;  // width in pixels
      gc.ctx.restore();

      wid *= fntScl;   // handle zoom scaling
      hgt = fntSz;     // TEXT height from bottom of decender to top of capitals
      hgt *= fntScl;   // handle zoom scaling
      const wid2 = wid/2;
      const hgt2 = hgt/2;
      const lorgWC = [0,[0,  hgt], [wid2,  hgt], [wid,  hgt],
                        [0, hgt2], [wid2, hgt2], [wid, hgt2],
                        [0,    0], [wid2,    0], [wid,    0]];
      if (lorgWC[lorg] !== undefined)
      {
        dx = -lorgWC[lorg][0];
        dy = lorgWC[lorg][1];
      }
      this.imgLorgX = dx;           // pixel offsets to drawing origin
      this.imgLorgY = dy-0.25*hgt;  // correct for alphabetic baseline, its offset about 0.25*char height

      // construct the cmdsAry for the text bounding box (world coords)
      const ulx = dx;
      const uly = dy;
      const llx = dx;
      const lly = dy-hgt;
      const lrx = dx+wid;
      const lry = dy-hgt;
      const urx = dx+wid;
      const ury = dy;
      this.drawCmds = [ {type:"M", values:[ulx, uly]}, 
                        {type:"L", values:[llx, lly]}, 
                        {type:"L", values:[lrx, lry]}, 
                        {type:"L", values:[urx, ury]}, 
                        {type:"Z", values:[]} ];
    }
  } 

  function transformCtx(ctx, xfm)  // apply a matrix transform to a canvas 2D context
  {
    if (xfm === undefined)
    {
      ctx.setTransform(1, 0, 0,
                       0, 1, 0);
    }
    else
    {
      ctx.setTransform(xfm.matrix[0][0], xfm.matrix[0][1], xfm.matrix[1][0],
                       xfm.matrix[1][1], xfm.matrix[2][0], xfm.matrix[2][1]);
    }
  }

  class Layer
  {
    constructor(canvasID, canvasElement)
    {
      this.id = canvasID;
      this.cElem = canvasElement;
      this.dragObjects = [];
    }
  }

  function getLayer(cgo)
  {
    let lyr = cgo.bkgCanvas.layers[0];

    for (let i=1; i < cgo.bkgCanvas.layers.length; i++)
    {
      if (cgo.bkgCanvas.layers[i].id === cgo.cId)
      {
        lyr = cgo.bkgCanvas.layers[i];
        break;
      }
    }
    return lyr;    // Layer object
  }

  Cango = class 
  {
    constructor(cvs)
    {
      const resizeLayers = ()=>
      {
        const t = this.bkgCanvas.offsetTop + this.bkgCanvas.clientTop,
              l = this.bkgCanvas.offsetLeft + this.bkgCanvas.clientLeft,
              w = this.bkgCanvas.offsetWidth,
              h = this.bkgCanvas.offsetHeight;

        // check if canvas is resized when window -resized, allow some rounding error in layout calcs
        if ((Math.abs(w - this.rawWidth)/w < 0.01) && (Math.abs(h - this.rawHeight)/h < 0.01))
        {
          // canvas size didn't change so return
          return;
        }
        // canvas has been resized so re0size all the overlay canvases
        // kill off any animations on resize (else they stil contiune along with any new ones)
        if (this.bkgCanvas.timeline && this.bkgCanvas.timeline.animTasks.length)
        {
          this.deleteAllAnimations();
        }
        // fix all Cango contexts to know about new size
        this.rawWidth = w;
        this.rawHeight = h;
        this.aRatio = w/h;
        // there may be multiple Cango contexts a layer, try to only fix actual canvas properties once
        if (this.bkgCanvas !== this.cnvs)
        {
          return;
        }
        this.cnvs.width = w;    // reset canvas pixels width
        this.cnvs.height = h;   // don't use style for this
        // step through the stack of canvases (if any)
        for (let j=1; j<this.bkgCanvas.layers.length; j++)  // bkg is layer[0]
        {
          let ovl = this.bkgCanvas.layers[j].cElem;
          if (ovl)
          {
            ovl.style.top = t+'px';
            ovl.style.left = l+'px';
            ovl.style.width = w+'px';
            ovl.style.height = h+'px';
            ovl.width = w;    // reset canvas attribute to pixel width
            ovl.height = h;  
          }
        }
      }

      const initDragAndDrop = ()=>{
        const dragHandler = (evt)=>{
          const event = evt || window.event;
    
          const getCursorPos = (e)=>{
            // pass in any mouse event, returns the position of the cursor in raw pixel coords
            const rect = this.cnvs.getBoundingClientRect();
    
            return {x: e.clientX - rect.left, y: e.clientY - rect.top};
          };
    
          const hitTest = (pathObj, csrX, csrY)=>{
            const gc = pathObj.dragNdrop.cgo,
                  ysl = (gc.yDown)? gc.xscl: -gc.xscl;
            let hit,
                WCtoPX = identityMatrix.translate(gc.vpOrgX+gc.xoffset, gc.vpOrgY+gc.yoffset)
                                        .scaleNonUniform(gc.xscl, ysl)
                                        .multiply(pathObj.netTfm);
    
            if ((pathObj.type === 'IMG') && (!gc.yDown))
            {
              WCtoPX = WCtoPX.flipY();  // invert all world coords values
            }            
            else if (pathObj.type === 'TEXT')
            {
              WCtoPX = WCtoPX.scaleNonUniform(1/gc.xscl, 1/ysl);     // pre-invert to counter the invert to come
            }
    
            gc.ctx.save();       // save un-scaled
            gc.ctx.setTransform(WCtoPX.a, WCtoPX.b, WCtoPX.c, WCtoPX.d, WCtoPX.e, WCtoPX.f);
            gc.ctx.beginPath();
            pathObj.drawCmds.forEach(function(dCmd){
              gc.ctx[cvsCmds[dCmd.type]].apply(gc.ctx, dCmd.values); // add the path segment
            });
            hit = gc.ctx.isPointInPath(csrX, csrY);
  /* 
    // for diagnostics on hit region, uncomment
    gc.ctx.strokeStyle = 'red';
    gc.ctx.lineWidth = (pathObj.type === 'TEXT')? 3: 3/gc.xscl;
    gc.ctx.stroke();
  */ 
            gc.ctx.restore();
    
            return hit;
          };

          const csrPos = getCursorPos(event);  // this is any Cango ctx on the canvas
          const nLyrs = this.bkgCanvas.layers.length;
          // run through all the registered objects and test if cursor pos is in their path
          loops:      // label to break out of nested loops
          for (let j = nLyrs-1; j >= 0; j--)       // search top layer down the stack
          {
            let lyr = this.bkgCanvas.layers[j];
            for (let k = lyr.dragObjects.length-1; k >= 0; k--)  // search from last drawn to first (underneath)
            {
              let testObj = lyr.dragObjects[k];
              if (hitTest(testObj, csrPos.x, csrPos.y))
              {
                // call the grab handler for this object (check it is still enabled)
                if (testObj.dragNdrop)
                {
                  testObj.dragNdrop.grab(event);
                  break loops;
                }
              }
            }
          }
        }
        this.cnvs.onmousedown = dragHandler;   // added to all layers but only top layer will catch events
      };

      if ((typeof cvs === "string") && document.getElementById(cvs))   // element ID was passed
      {
        this.cnvs = document.getElementById(cvs);
        this.cId = cvs;
        if (!(this.cnvs instanceof HTMLCanvasElement))  // not a canavs
        {
          console.error("TypeError: Cango target not an HTMLCanvasElement");
          return;
        }
        // check if this is a context for an overlay
        if (this.cId.indexOf("_ovl_") !== -1)
        {
          this.cgoType = "OVL"; 
          // this is an overlay. get a reference to the backGround canvas
          const bkgId = this.cId.slice(0, this.cId.indexOf("_ovl_"));
          this.bkgCanvas = document.getElementById(bkgId);
        }
        else
        {
          this.cgoType = "BKG"; 
          this.bkgCanvas = this.cnvs;
        }
        this.rawWidth = this.cnvs.offsetWidth;    // ignore attriute use the on screen pixel size
        this.rawHeight = this.cnvs.offsetHeight;
        if (!this.bkgCanvas.hasOwnProperty('unique'))
        {
          this.bkgCanvas.unique = 0;
        }    
      }
      else if (cvs instanceof HTMLCanvasElement)   // canvas element passed
      {
        this.cnvs = cvs;
        this.bkgCanvas = this.cnvs;
        this.rawWidth = this.cnvs.width;
        this.rawHeight = this.cnvs.height;
        if (!this.bkgCanvas.hasOwnProperty('unique'))
        {
          this.bkgCanvas.unique = 0;
        }    
        if (document.contains(cvs))  // element is part of the DOM
        {
          this.cId = this.cnvs.id;
          this.cgoType = "BKG"; 
          if (!this.cId)
          {
            this.cId = "_bkg_"+this.getUnique();
            this.cnvs.id = this.cId;    // set the attribute to match new id
          }
        }
        else  // off-screen canvas
        {
          this.cId = "_os_"+this.getUnique();  // over-ride any existing id
          this.cgoType = "OS";     
        }
      }
      else  // not a canvas element
      {
        console.error("TypeError: Cango target element is undefined");
        return;
      }

      this.aRatio = this.rawWidth/this.rawHeight;
      this.widthPW = 100;                          // width of canvas in Percent Width Coords
      this.heightPW = 100/this.aRatio;    // height of canvas in Percent Width Coords
      if (!this.bkgCanvas.hasOwnProperty('layers'))
      {
        // create an array to hold all the overlay canvases for this canvas
        this.bkgCanvas.layers = [];
        // make a Layer object for the bkgCanvas
        const bkgL = new Layer(this.cId, this.cnvs);
        this.bkgCanvas.layers[0] = bkgL;
        // make sure the overlay canvases always match the bkgCanvas size
        if (this.cgoType !== "OS")
        {
          let timer_id = undefined;
          window.addEventListener("resize", ()=>{
            if(timer_id != undefined) 
            {
              clearTimeout(timer_id);
              timer_id = undefined;
            }
            timer_id = setTimeout(()=>{
              timer_id = undefined;
              resizeLayers();
            }, 250);
          });
        }
      }
      if ((typeof Timeline !== "undefined") && !this.bkgCanvas.hasOwnProperty('timeline'))
      {
        // create a single timeline for all animations on all layers
        this.bkgCanvas.timeline = new Timeline();
      }
      if (!this.cnvs.hasOwnProperty('resized'))
      {
        // make canvas native aspect ratio equal style box aspect ratio.
        // Note: rawWidth and rawHeight are floats, assignment to ints will truncate
        this.cnvs.width = this.rawWidth;    // reset canvas pixels width
        this.cnvs.height = this.rawHeight;  // don't use style for this
        this.cnvs.resized = true;
      }
      this.ctx = this.cnvs.getContext('2d');    // draw direct to screen canvas
      this.yDown = true;                // set by setWordlCoordsRHC & setWorldCoordsSVG (SVG is default)
      this.vpW = this.rawWidth;         // vp width in pixels (no more viewport so use full canvas)
      this.vpH = this.rawHeight;        // vp height in pixels, canvas height = width/aspect ratio
      this.vpOrgX = 0;                  // gridbox origin in pixels (upper left for SVG, the default)
      this.vpOrgYsvg = 0;               // save vpOrgY, needed when switching between RHC and SVG and back
      this.vpOrgYrhc = this.rawHeight;  //   "
      this.vpOrgY = this.vpOrgYsvg;     // gridbox origin in pixels (upper left for SVG, the default)
      this.xscl = 1;                    // world x axis scale factor, default: pixels
      this.yscl = 1;                    // world y axis scale factor, +ve down (SVG style default)
      this.xoffset = 0;                 // world x origin offset from viewport left in pixels
      this.yoffset = 0;                 // world y origin offset from viewport bottom in pixels
      this.savWC = {"xscl":this.xscl,
                    "yscl":this.yscl,
                    "xoffset":this.xoffset,
                    "yoffset":this.yoffset};  // save world coords for zoom/pan
      this.ctx.textAlign = "left";      // all offsets are handled by lorg facility
      this.ctx.textBaseline = "alphabetic";
      this.penCol = "rgba(0, 0, 0, 1.0)";        // black
      this.penWid = 1;                  // pixels
      this.lineCap = "butt";
      this.paintCol = "rgba(128,128,128,1.0)";   // gray
      this.fontSize = 12;               // pixels
      this.fontWeight = 400;            // 100..900, 400 = normal,700 = bold
      this.fontFamily = "Consolas, Monaco, 'Andale Mono', monospace";
      this.clipCount = 0;               // count ClipMask calls for use by resetClip

      initDragAndDrop();
    }
  };

  Cango.prototype.getUnique = function()
  {
    this.bkgCanvas.unique += 1; 
    return this.bkgCanvas.unique;
  };

  Cango.prototype.toPixelCoords = function(x, y)
  {
    // transform x,y in world coords to canvas pixel coords (top left is 0,0 y axis +ve down)
    const xPx = this.vpOrgX+this.xoffset+x*this.xscl,
          yPx = this.vpOrgY+this.yoffset+y*this.yscl;

    return {x: xPx, y: yPx};
  };

  Cango.prototype.toWorldCoords = function(xPx, yPx)
  {
    // transform xPx,yPx in raw canvas pixels to world coords (lower left is 0,0 +ve up)
    const xW = (xPx - this.vpOrgX - this.xoffset)/this.xscl,
          yW = (yPx - this.vpOrgY - this.yoffset)/this.yscl;

    return {x: xW, y: yW};
  };

  Cango.prototype.getCursorPosWC = function(evt)
  {
    // pass in any mouse event, returns the position of the cursor in raw pixel coords
    const e = evt||window.event,
          rect = this.cnvs.getBoundingClientRect();

    return this.toWorldCoords(e.clientX-rect.left, e.clientY-rect.top);
  };

  Cango.prototype.clearCanvas = function(fillColor)
  {
    const genLinGradient = (lgrad)=>{
      const p1 = this.toPixelCoords(lgrad.grad[0], lgrad.grad[1]),
            p2 = this.toPixelCoords(lgrad.grad[2], lgrad.grad[3]),
            grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

      lgrad.colorStops.forEach((colStop)=>{
        grad.addColorStop(colStop[0], colStop[1]);
      });

      return grad;
    };

    const genRadGradient = (rgrad)=>{
      const p1 = this.toPixelCoords(rgrad.grad[0], rgrad.grad[1]),
            r1 = rgrad.grad[2]*this.xscl,
            p2 = this.toPixelCoords(rgrad.grad[3], rgrad.grad[4]),
            r2 = rgrad.grad[5]*this.xscl,
            grad = this.ctx.createRadialGradient(p1.x, p1.y, r1, p2.x, p2.y, r2);

      rgrad.colorStops.forEach((colStop)=>{
        grad.addColorStop(colStop[0], colStop[1]);
      });

      return grad;
    };

    if (fillColor)
    {
      this.ctx.save();
      if (fillColor instanceof LinearGradient)
      {
        this.ctx.fillStyle = genLinGradient(fillColor);
      }
      else if (fillColor instanceof RadialGradient)
      {
        this.ctx.fillStyle = genRadGradient(fillColor);
      }
      else
      {
        this.ctx.fillStyle = fillColor;
      }
      this.ctx.fillRect(0, 0, this.rawWidth, this.rawHeight);
      this.ctx.restore();
    }
    else
    {
      this.ctx.clearRect(0, 0, this.rawWidth, this.rawHeight);
    }
    // all drawing erased, but graphics contexts remain intact
    // clear the dragObjects array, draggables put back when rendered
    const layerObj = getLayer(this);
    layerObj.dragObjects.length = 0;
    // in case the CangoHTMLtext extension is used
    if (this.cnvs.alphaOvl && this.cnvs.alphaOvl.parentNode)
    {
      this.cnvs.alphaOvl.parentNode.removeChild(this.cnvs.alphaOvl);
    }
  };

  Cango.prototype.gridboxPadding = function(left, bottom, right, top)
  {
    // left, bottom, right, top are the padding from the respective sides, 
    // all are in % of canvas width units, negative values are set to 0.

    const setDefault = ()=>{
      this.vpW = this.rawWidth;
      this.vpH = this.rawHeight;
      this.vpOrgX = 0;
      this.vpOrgY = 0;
      this.setWorldCoordsSVG(); // if new gridbox created, world coords are garbage, so reset to defaults
    }

    if (left === undefined)   // no error just resetiing to default
    {
      setDefault();
      return;
    }
    // check if only left defined
    if (bottom === undefined)  // only one parameter
    {
      if ((left >= 50) || (left < 0))
      {
        console.error("gridbox right must be greater than left");
        setDefault();
        return;
      }
      else
      {
        bottom = left;
      }
    }
    if ((left < 0) || (left > 99))
    {
      left = 0;
    }
    // now we have a valid left and a bottom
    if ((bottom < 0) || (bottom > 99/this.aRatio))
    {
      bottom = 0;
    }
    if (right === undefined)   // right == 0 is OK
    {
      right = left;
    }
    else if (right < 0)
    {
      right = 0;
    }
    if (top === undefined)    // top == 0 is OK
    {
      top = bottom;
    }
    else if (top < 0)
    {
      top = 0;
    }
    // now we have all 4 valid padding values
    const width = 100 - left - right;
    const height = 100/this.aRatio - top - bottom;
    if ((width < 0) || (height < 0))
    {
      console.error("invalid gridbox dimensions");
      setDefault();
      return;
    }

    this.vpW = width*this.rawWidth/100;
    this.vpH = height*this.rawWidth/100;
    // now calc upper left of viewPort in pixels = this is the vpOrg
    this.vpOrgX = left*this.rawWidth/100;
    this.vpOrgYsvg = top*this.rawWidth/100;  // SVG vpOrg is up at the top left
    this.vpOrgYrhc = this.vpOrgYsvg+this.vpH;// RHC vpOrg is down at the lower left
    this.vpOrgY = this.vpOrgYsvg;            // SVG is the default
    this.yDown = true;                       // reset, both setWorldCoords needs this  
    this.setWorldCoordsSVG(); // if new gridbox created, world coords are garbage, so reset to defaults
  };

  Cango.prototype.fillGridbox = function(fillColor)
  {
    const newCol = fillColor || this.paintCol,
          yCoord = this.vpOrgYsvg;

    const genLinGradient = (lgrad)=>{
      const p1 = this.toPixelCoords(lgrad.grad[0], lgrad.grad[1]),
            p2 = this.toPixelCoords(lgrad.grad[2], lgrad.grad[3]),
            grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

      lgrad.colorStops.forEach((colStop)=>{
        grad.addColorStop(colStop[0], colStop[1]);
      });

      return grad;
    }

    const genRadGradient = (rgrad)=>{
      const p1 = this.toPixelCoords(rgrad.grad[0], rgrad.grad[1]),
            r1 = rgrad.grad[2]*this.xscl,
            p2 = this.toPixelCoords(rgrad.grad[3], rgrad.grad[4]),
            r2 = rgrad.grad[5]*this.xscl,
            grad = this.ctx.createRadialGradient(p1.x, p1.y, r1, p2.x, p2.y, r2);

      rgrad.colorStops.forEach((colStop)=>{
        grad.addColorStop(colStop[0], colStop[1]);
      });

      return grad;
    }

    this.ctx.save();
    if (newCol instanceof LinearGradient)
    {
      this.ctx.fillStyle = genLinGradient(newCol);
    }
    else if (newCol instanceof RadialGradient)
    {
      this.ctx.fillStyle = genRadGradient(newCol);
    }
    else
    {
      this.ctx.fillStyle = newCol;
    }
    this.ctx.fillRect(this.vpOrgX, yCoord, this.vpW, this.vpH); // fillRect(left, top, wid, hgt)
    this.ctx.restore();
  };

  Cango.prototype.setWorldCoordsSVG = function(vpOriginX, vpOriginY, spanX, spanY)
  {
    // gridbox origin is upper left
    const vpOrgXWC = vpOriginX || 0,  // gridbox upper left (vpOrgX) in world coords
          vpOrgYWC = vpOriginY || 0;  // gridbox upper left (vpOrgY) in world coords

    this.yDown = true;              // flag true for SVG world coords being used
    this.vpOrgY = this.vpOrgYsvg;   // switch vpOrg to upper left corner of gridbox
    if (spanX && (spanX > 0))
    {
      this.xscl = this.vpW/spanX;
    }
    else
    {
      this.xscl = 1;                   // use pixel units
    }
    if (spanY && (spanY > 0))
    {
      this.yscl = this.vpH/spanY;     // yscl is positive for SVG
    }
    else
    {
      this.yscl = this.xscl;          // square pixels
    }
    this.xoffset = -vpOrgXWC*this.xscl;
    this.yoffset = -vpOrgYWC*this.yscl;   // reference to upper left of gridbox
    // save values to support resetting zoom and pan
    this.savWC = {"xscl":this.xscl, "yscl":this.yscl, "xoffset":this.xoffset, "yoffset":this.yoffset};
  };

  Cango.prototype.setWorldCoordsRHC = function(vpOriginX, vpOriginY, spanX, spanY)
  {
    const vpOrgXWC = vpOriginX || 0,  // gridbox lower left (vpOrgX) in world coords
          vpOrgYWC = vpOriginY || 0;  // gridbox lower left (vpOrgY) in world coords

    this.yDown = false;             // flag false for RHC world coords
    this.vpOrgY = this.vpOrgYrhc;   // switch vpOrg to lower left corner of gridbox
    if (spanX && (spanX > 0))
    {
      this.xscl = this.vpW/spanX;
    }
    else
    {
      this.xscl = 1;                   // use pixel units
    }
    if (spanY && (spanY > 0))
    {
      this.yscl = -this.vpH/spanY;    // yscl is negative for RHC
    }
    else
    {
      this.yscl = -this.xscl;          // square pixels
    }
    this.xoffset = -vpOrgXWC*this.xscl;
    this.yoffset = -vpOrgYWC*this.yscl;
    // save these values to support resetting zoom and pan
    this.savWC = {"xscl":this.xscl, "yscl":this.yscl, "xoffset":this.xoffset, "yoffset":this.yoffset};
  };

  Cango.prototype.setPropertyDefault = function(propertyName, value)
  {
    if ((typeof propertyName !== "string")||(value === undefined)||(value === null))
    {
      return;
    }
    switch (propertyName.toLowerCase())
    {
      case "fillcolor":
        if ((typeof value === "string")||(typeof value === "object"))  // gradient will be an object
        {
          this.paintCol = value;
        }
        break;
      case "strokecolor":
        if ((typeof value === "string")||(typeof value === "object"))  // gradient will be an object
        {
          this.penCol = value;
        }
        break;
      case "linewidth":
      case "strokewidth":
        this.penWid = value;
        break;
      case "linecap":
        if ((typeof value === "string")&&((value === "butt")||(value ==="round")||(value === "square")))
        {
          this.lineCap = value;
        }
        break;
      case "fontfamily":
        if (typeof value === "string")
        {
          this.fontFamily = value;
        }
        break;
      case "fontsize":
        this.fontSize = value;
        break;
      case "fontweight":
        if ((typeof value === "string")||((value >= 100)&&(value <= 900)))
        {
          this.fontWeight = value;
        }
        break;
      case "steptime":
        if ((value >= 15)&&(value <= 500))
        {
          this.bkgCanvas.timeline.stepTime = value;
        }
        break;
      case "framerate":
        if (value && value === "auto")
        {
          this.bkgCanvas.timeline.frameRate = undefined;
        }
        else if (isNaN(value) || value > 50 || value <= 0.5)  // 1/2 frame to 50 frame/sec
        {
          console.error("invalid frame rate [\"auto\" or value 0.5 .. 50 lines/sec]");
          // don't change the frameRate;
        }
        else
        {
          this.bkgCanvas.timeline.frameRate = value;
        }
        break;
      default:
        return;
    }
  };

  Cango.prototype.dropShadow = function(obj)  // no argument will reset to no drop shadows 
  {
    let xOfs = 0,
        yOfs = 0,
        radius = 0,
        color = "#000000",
        xScale = 1,
        yScale = 1;

    if (obj != undefined)
    {
      xOfs = obj.shadowOffsetX || 0;
      yOfs = obj.shadowOffsetY || 0;
      radius = obj.shadowBlur || 0;
      color = obj.shadowColor || "#000000";
      if ((obj.type === "SHAPE")||((obj.type === "PATH")&& !obj.iso))   // must scale for world coords (matrix scaling not used)
      {
        xScale *= this.xscl;
        yScale *= this.yscl;
      }
      else                         // no need to scale here (matrix scaling used)
      {
        xScale *= this.xscl;
        yScale *= -this.xscl;
      }
    }
    this.ctx.shadowOffsetX = xOfs*xScale;
    this.ctx.shadowOffsetY = yOfs*yScale;
    this.ctx.shadowBlur = radius*xScale;
    this.ctx.shadowColor = color;
  };

  /*=============================================
   * render will draw a Group or Obj2D.
   * If an Obj2D is passed, update the netTfm
   * and render it.
   * If a Group is passed, recursively update
   * the netTfm of the group's family tree,
   * then render all Obj2Ds.
   *--------------------------------------------*/
  Cango.prototype.render = function(rootObj, clear)
  {
    const nonIsoScl = Math.abs(this.yscl/this.xscl);

    function genNetTfmMatrix(obj)
    {
      if (!obj.iso)
      {
        const toIso = new Transformer("SCL", 1, nonIsoScl);
        // apply the non-iso world coord scaling to the original y coords
        obj.netTfmAry.unshift(toIso);   // scale Transformer will do the job
      }
      matrixReset(obj.ofsTfm);  // clear out previous transforms
      obj.savScale = 1;            // reset the scale factor for re-calc
      // apply the net transform to the obj2D transform matrix

      obj.netTfmAry.reverse().forEach(function(xfmr){
        // calc accumulated scaling to apply to lineWidth
        if (xfmr.type === "SCL")
        {
          obj.savScale *= Math.abs(xfmr.args[0]);
        }
        if (xfmr.type === "TRN")
        {
          xfmrFns[xfmr.type].call(obj, [xfmr.args[0], xfmr.args[1]*nonIsoScl]);
        }
        else if (xfmr.type === "SKW")
        { // correct for non-iso scaling
          if (obj.iso)
          {
            xfmrFns[xfmr.type].call(obj, [xfmr.args[0], xfmr.args[1]]);
          }
          else
          {
            xfmrFns[xfmr.type].call(obj, [xfmr.args[0], xfmr.args[1], nonIsoScl]);  
          }
        }
        else
        {
          xfmrFns[xfmr.type].call(obj, xfmr.args);
        }
      });
      obj.netTfm = obj.ofsTfm.multiply(obj.grpTfm); // apply inherited group Tfms
    }

    function genNetTfm(obj)
    {
      let grpTfmAry, grpTfm, softTfmAry;

      if (obj.parent)   // must be a child of a Group
      {
        grpTfmAry = obj.parent.netTfmAry;    // grpTfm is always netTfm of the parent Group
        grpTfm = obj.parent.netTfm;
      }
      else    // must be the rootObj
      {
        grpTfmAry = [];
        grpTfm = document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();
      }
      // now generate the soft transforms
      // Note: Apply xfms in order of insertion
      const ofsTfms = [];
      obj.ofsTfmAry.forEach((xfmr)=>{ 
        ofsTfms.push(xfmr); 
      }); 
      obj.ofsTfmAry = ofsTfms;
      // now generate the soft transforms
      softTfmAry = obj.ofsTfmAry.concat(grpTfmAry);
      if (obj.type === "GRP")
      {
        obj.netTfmAry = softTfmAry;
      }
      else
      {
        obj.netTfmAry = obj.hardTfmAry.concat(softTfmAry);
        // save the inherited transforms to be applied when obj ready to render (Images may not be loaded)
        obj.grpTfm = grpTfm;
      }
      // apply the soft transforms to the dwgOrg of the Group or the Obj2D
      // NB: hard Transforms don't move dwgOrg, they move the object relative to dwgOrg!
      obj.dwgOrg = {x:0, y:0};
      softTfmAry.forEach((xfmr)=>{ 
        if (xfmr.type === "SKW" && !obj.iso)
        { // correct for non-iso scaling
          obj.dwgOrg = xfmrFns[xfmr.type].call(obj.dwgOrg, [xfmr.args[0], xfmr.args[1], nonIsoScl]);   // pass extra arg 'nonIsoScl' for point skew 
        }
        else
        {
          obj.dwgOrg = xfmrFns[xfmr.type].call(obj.dwgOrg, xfmr.args);
        }
      });
    }

    function recursiveGenNetTfm()
    {
      const flatAry = [];

      // task:function, grp: group with children
      function iterate(task, obj)
      {
        task(obj);
        if (obj.type === "GRP")    // find Obj2Ds to draw
        {
        obj.children.forEach(function(childNode){
            iterate(task, childNode);
          });
        }
        else
        {
          flatAry.push(obj);       // just push into the array to be drawn
        }
      }
      // now propagate the current grpXfm through the tree of children
      iterate(genNetTfm, rootObj);

      return flatAry;
    }

    const processObj2D = (obj)=>{   // now 'this' will mean the Cango object
      const imgLoaded = ()=>{  // now this 'this' will be Cango too
        obj.formatImg(this);
        genNetTfmMatrix(obj);
        this.paintImg(obj);
      }

      if (obj.type === "IMG")
      {
        if (obj.imgBuf.complete || obj.imgBuf instanceof HTMLCanvasElement)    // see if already loaded
        {
          imgLoaded();
        }
        else
        {
          obj.imgBuf.addEventListener('load', imgLoaded);
        }
      }
      else if (obj.type === "TEXT")
      {
        obj.formatText(this);
        genNetTfmMatrix(obj);
        this.paintText(obj);
      }
      else if (obj.type === "CLIP")
      {
        genNetTfmMatrix(obj);
        this.applyClipMask(obj);
      }
      else // "PATH" or "SHAPE"
      {
        genNetTfmMatrix(obj);
        this.paintPath(obj);
      }
    }

  	function iterativeReset(obj)
  	{
   	  obj.transformReset();
  	  if (obj.type === "GRP")
      {
    	  obj.children.forEach(function(childNode){
            iterativeReset(childNode);
          });
      }
  	}

// ============ Start Here =====================================================

    if (!types.includes(rootObj.type))
    {
      console.error("render called on bad object type");
      return;
    }
    if (clear === true)
    {
      this.clearCanvas();
    }
    if (rootObj.type === "GRP")
    {
      // recursively apply transforms and return the flattened tree as an array of Obj2D to be drawn
      const objAry = recursiveGenNetTfm();
      // now render the Obj2Ds onto the canvas
      objAry.forEach(processObj2D);
    }
    else   // single Obj2D, type = "PATH", "SHAPE", "IMG", "TEXT", "CLIP"
    {
      genNetTfm(rootObj);
      // draw the single Obj2D onto the canvas
      processObj2D(rootObj);
    }
    // all rendering done so recursively reset the dynamic ofsTfmAry
    iterativeReset(rootObj);
    this.resetClip();         // clear all active masks
  };

  Cango.prototype.genLinGrad = function(lgrad, tfm)
  {
    const p1x = lgrad.grad[0],
          p1y = lgrad.grad[1],
          p2x = lgrad.grad[2],
          p2y = lgrad.grad[3],
          tp1 = transformPoint(p1x, p1y, tfm),
          tp2 = transformPoint(p2x, p2y, tfm),
          grad = this.ctx.createLinearGradient(tp1.x, tp1.y, tp2.x, tp2.y);
    
    lgrad.colorStops.forEach(function(colStop){grad.addColorStop(colStop[0], colStop[1]);});

    return grad;
  };

  Cango.prototype.genRadGrad = function(rgrad, tfm, scl)
  {
    const p1x = rgrad.grad[0],
          p1y = rgrad.grad[1],
          r1 = rgrad.grad[2]*scl, 
          p2x = rgrad.grad[3],
          p2y = rgrad.grad[4],
          r2 = rgrad.grad[5]*scl,
          tp1 = transformPoint(p1x, p1y, tfm),
          tp2 = transformPoint(p2x, p2y, tfm),
          grad = this.ctx.createRadialGradient(tp1.x, tp1.y, r1, tp2.x, tp2.y, r2);

    rgrad.colorStops.forEach(function(colStop){grad.addColorStop(colStop[0], colStop[1]);});

    return grad;
  };

  Cango.prototype.paintImg = function(imgObj)
  {
    // should only be called after image has been loaded into imgBuf
    const img = imgObj.imgBuf,  // this is the place the image is stored in object
          ysl = (this.yDown)? this.xscl: -this.xscl;
    let WCtoPX = identityMatrix.translate(this.vpOrgX + this.xoffset, this.vpOrgY + this.yoffset)   //  viewport offset
                               .scaleNonUniform(this.xscl, ysl)     // world coords to pixels
                               .multiply(imgObj.netTfm);       // app transforms

    if (!this.yDown)
    {
      WCtoPX = WCtoPX.flipY();  // invert all world coords values
    }            
    this.ctx.save();   // save raw canvas no transforms no dropShadow
    this.ctx.setTransform(WCtoPX.a, WCtoPX.b, WCtoPX.c, WCtoPX.d, WCtoPX.e, WCtoPX.f);
    this.dropShadow(imgObj);  // set up dropShadow if any
    // now insert the image canvas ctx will apply transforms (width etc in WC)
    this.ctx.drawImage(img, imgObj.imgLorgX, imgObj.imgLorgY, imgObj.width, imgObj.height);
    if (imgObj.border)
    {
      this.ctx.beginPath();
      imgObj.drawCmds.forEach((dCmd)=>{
        this.ctx[cvsCmds[dCmd.type]].apply(this.ctx, dCmd.values); // add the path segment
      });
      this.ctx.restore();   // revert to no drop shadow no transforms ready for border
      this.ctx.save();
      const col = imgObj.strokeCol || this.penCol;
      let stkCol = col;
      if (col instanceof LinearGradient)
      {
        stkCol = this.genLinGrad(col, WCtoPX);
      }
      else if (col instanceof RadialGradient)
      {
        stkCol = this.genRadGrad(col, WCtoPX, imgObj.savScale*this.xscl);
      }
      if (imgObj.lineWidthWC)
      {
        this.ctx.lineWidth = imgObj.lineWidthWC*imgObj.savScale*this.xscl;   // lineWidth in world coords so scale to px
      }
      else
      {
        this.ctx.lineWidth = imgObj.lineWidth || this.penWid; 
      }
      this.ctx.strokeStyle = stkCol;
      // if properties are undefined use Cango default
      this.ctx.lineCap = imgObj.lineCap || this.lineCap;
      this.ctx.stroke();
    }
    this.ctx.restore();    // undo the stroke style etc

    if (imgObj.dragNdrop !== null)
    {
      // update dragNdrop layer to match this canvas
      const currLr = getLayer(this);
      if (currLr !== imgObj.dragNdrop.layer)
      {
        if (imgObj.dragNdrop.layer)  // if not the first time rendered
        {
          // remove the object reference from the old layer
          const aidx = imgObj.dragNdrop.layer.dragObjects.indexOf(this);
          if (aidx !== -1)
          {
            imgObj.dragNdrop.layer.dragObjects.splice(aidx, 1);
          }
        }
      }
      imgObj.dragNdrop.cgo = this;
      imgObj.dragNdrop.layer = currLr;
      // now push it into Cango.dragObjects array, its checked by canvas mousedown event handler
      if (!imgObj.dragNdrop.layer.dragObjects.includes(imgObj))
      {
        imgObj.dragNdrop.layer.dragObjects.push(imgObj);
      }
    }
  };

  Cango.prototype.paintPath = function(pathObj)
  {
    // used for type: PATH, SHAPE
    const ysl = (this.yDown)? this.xscl: -this.xscl,
          WCtoPX = identityMatrix.translate(this.vpOrgX+this.xoffset, this.vpOrgY+this.yoffset)
                                 .scaleNonUniform(this.xscl, ysl)
                                 .multiply(pathObj.netTfm);
    let col, filCol, stkCol;

    if (!pathObj.drawCmds.length)
    {
      console.warn("Attempt to draw an object with 0 length descriptor");
      return;
    }
    this.ctx.save();   // save current context
    // make a scaled path that will render onto raw pixel scaling so lineWidth doesn't get distorted by non-iso scaling
    this.ctx.transform(WCtoPX.a, WCtoPX.b, WCtoPX.c, WCtoPX.d, WCtoPX.e, WCtoPX.f);
    this.ctx.beginPath();                      // make the canvas 'current path' the scaled path
    pathObj.drawCmds.forEach((dCmd)=>{
      this.ctx[cvsCmds[dCmd.type]].apply(this.ctx, dCmd.values); // add the path segment
    });
    
    this.ctx.restore();  
    
    this.ctx.save();   // save current context
    col = pathObj.fillCol || this.paintCol;
    if (col instanceof LinearGradient)
    {
      filCol = this.genLinGrad(col, WCtoPX);
    }
    else if (col instanceof RadialGradient)
    {
      filCol = this.genRadGrad(col, WCtoPX, pathObj.savScale*this.xscl);
    }
    else
    {
      filCol = col;
    }
    col = pathObj.strokeCol || this.penCol;
    if (col instanceof LinearGradient)
    {
      stkCol = this.genLinGrad(col, WCtoPX);
    }
    else if (col instanceof RadialGradient)
    {
      stkCol = this.genRadGrad(col, WCtoPX, pathObj.savScale*this.xscl);
    }
    else
    {
      stkCol = col;
    }
    this.dropShadow(pathObj);    // set up dropShadow if any
    if (pathObj.type === "SHAPE")
    {
      this.ctx.fillStyle = filCol;
      if (pathObj.clearFlag)
      {
        this.ctx.save();   // save current context
        this.ctx.globalCompositeOperation = "destination-out";  // clear the canvas in the shape of the pathObj
        this.ctx.fill(pathObj.fillRule);
        this.ctx.restore();
      }
      else
      {
        this.ctx.fill(pathObj.fillRule);
      }
    }
    if ((pathObj.type === "PATH")|| pathObj.border)
    {
      if (pathObj.border) // drop shadows for Path not border
      {
        // if Shape with border clear any drop shadow so not rendered twice
        this.dropShadow(); 
      }
      // handle dashed lines
      if (Array.isArray(pathObj.dashed) && pathObj.dashed.length)
      {
        this.ctx.setLineDash(pathObj.dashed);
        this.ctx.lineDashOffset = pathObj.dashOffset || 0;
      }
      // support for zoom and pan changing line width
      if (pathObj.lineWidthWC)
      {
        this.ctx.lineWidth = pathObj.lineWidthWC*pathObj.savScale*this.xscl;   // lineWidth in world coords so scale to px
      }
      else
      {
        this.ctx.lineWidth = pathObj.lineWidth || this.penWid; // lineWidth in pixels
      }
      this.ctx.strokeStyle = stkCol;
      this.ctx.lineCap = pathObj.lineCap || this.lineCap;
      this.ctx.stroke();   // stroke the current path
      this.ctx.setLineDash([]);   // clean up dashes (they are not reset by save/restore)
      this.ctx.lineDashOffset = 0;
    }
    this.ctx.restore();  
    if (pathObj.dragNdrop !== null)
    {
      // update dragNdrop layer to match this canvas
      const currLr = getLayer(this);
      if (currLr !== pathObj.dragNdrop.layer)
      {
        if (pathObj.dragNdrop.layer)  // if not the first time rendered
        {
          // remove the object reference from the old layer
          const aidx = pathObj.dragNdrop.layer.dragObjects.indexOf(this);
          if (aidx !== -1)
          {
            pathObj.dragNdrop.layer.dragObjects.splice(aidx, 1);
          }
        }
      }
      pathObj.dragNdrop.cgo = this;
      pathObj.dragNdrop.layer = currLr;
      // now push it into Cango.dragObjects array, its checked by canvas mousedown event handler
      if (!pathObj.dragNdrop.layer.dragObjects.includes(pathObj))
      {
        pathObj.dragNdrop.layer.dragObjects.push(pathObj);
      }
    }
  };

  Cango.prototype.applyClipMask = function(maskObj)
  {
    // if empty array was passed as mask definition then reset clip to full canvas
    if (!maskObj.drawCmds.length)
    {
      this.resetClip();
      return;
    }

    const ysl = (this.yDown)? this.xscl: -this.xscl,
          WCtoPX = identityMatrix.translate(this.vpOrgX+this.xoffset, this.vpOrgY+this.yoffset)
                              .scaleNonUniform(this.xscl, ysl)
                              .multiply(maskObj.netTfm);

    this.ctx.save();   // save current context
    this.clipCount += 1;
    this.ctx.save();   // save current context
    // make a scaled path that will render onto raw pixel scaling so lineWidth doesn't get distorted by non-iso scaling
    this.ctx.transform(WCtoPX.a, WCtoPX.b, WCtoPX.c, WCtoPX.d, WCtoPX.e, WCtoPX.f);
    this.ctx.beginPath();
    maskObj.drawCmds.forEach((dCmd)=>{
      this.ctx[cvsCmds[dCmd.type]].apply(this.ctx, dCmd.values); // add the path segment
    });
    this.ctx.closePath();    // clip only works if path closed
    this.ctx.restore();  
    this.ctx.clip(maskObj.fillRule);

    // FF 52 bugfix: force clip to take effect
    //============================================================================================
    // Workaround for Firefox 52 bug: "clip doesn't clip radial gradient fills"
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.0)";
    this.ctx.fillRect(0,0,1,1);   // any fill call will do will do
    //============================================================================================
  };

  Cango.prototype.resetClip = function()
  {
    while (this.clipCount > 0)
    {
      this.ctx.restore();
      this.clipCount--;
    }
  };

  Cango.prototype.paintText = function(txtObj)
  {
    const ysl = (this.yDown)? this.xscl: -this.xscl,
          WCtoPX = identityMatrix.translate(this.vpOrgX + this.xoffset, this.vpOrgY + this.yoffset)   //  viewport offset
                                 .scaleNonUniform(this.xscl, ysl)     // world coords to pixels
                                 .multiply(txtObj.netTfm)
                                 .scaleNonUniform(1/this.xscl, 1/ysl);       // app transforms
    // if Obj2D fontWeight or fontSize undefined use Cango default
    const fntWt = txtObj.fontWeight || this.fontWeight,
          fntSz = txtObj.fontSizeZC,        // font size in pixels corrected for any zoom scaling factor
          fntFm = txtObj.fontFamily || this.fontFamily;

    this.ctx.save();   // save raw canvas no transforms no dropShadow
    this.ctx.setTransform(WCtoPX.a, WCtoPX.b, WCtoPX.c, WCtoPX.d, WCtoPX.e, WCtoPX.f);
    // if a bgFillColor is specified then fill the bounding box before rendering the text
    if (typeof txtObj.bgFillColor === "string")
    {
      // create the bounding box path
      this.ctx.save();
      this.ctx.fillStyle = txtObj.bgFillColor;
      this.ctx.strokeStyle = txtObj.bgFillColor;
      this.ctx.lineWidth = 0.10*fntSz;  // expand by 5% (10% width gives 5% outside outline)
      this.ctx.beginPath();
      txtObj.drawCmds.forEach((dCmd)=>{
        this.ctx[cvsCmds[dCmd.type]].apply(this.ctx, dCmd.values); // add the path segment
      });
      this.ctx.fill();
      this.ctx.stroke();  // stroke the outline
      this.ctx.restore();
    }
    // now draw the text
    this.ctx.font = fntWt+" "+fntSz+"px "+fntFm;
    this.ctx.fillStyle = txtObj.fillCol || this.paintCol;
    this.ctx.fillText(txtObj.txtStr, txtObj.imgLorgX, txtObj.imgLorgY); // imgLorgX,Y are in pixels for text
    if (txtObj.border)
    {
      this.dropShadow(); // clear dropShadow, dont apply to the border (it will be on top of fill)
      // support for zoom and pan changing lineWidth
      if (txtObj.lineWidthWC)
      {
        this.ctx.lineWidth = txtObj.lineWidthWC*this.xscl;
      }
      else
      {
        this.ctx.lineWidth = txtObj.lineWidth || this.penWid;
      }
      // if properties are undefined use Cango default
      this.ctx.strokeStyle = txtObj.strokeCol || this.penCol;
      this.ctx.lineCap = txtObj.lineCap || this.lineCap;
      this.ctx.strokeText(txtObj.txtStr, txtObj.imgLorgX, txtObj.imgLorgY);
    }
    // undo the transforms
    this.ctx.restore();
    if (txtObj.dragNdrop !== null)
    {
      // update dragNdrop layer to match this canavs
      const currLr = getLayer(this);
      if (currLr !== txtObj.dragNdrop.layer)
      {
        if (txtObj.dragNdrop.layer)  // if not the first time rendered
        {
          // remove the object reference from the old layer
          const aidx = txtObj.dragNdrop.layer.dragObjects.indexOf(this);
          if (aidx !== -1)
          {
            txtObj.dragNdrop.layer.dragObjects.splice(aidx, 1);
          }
        }
      }
      txtObj.dragNdrop.cgo = this;
      txtObj.dragNdrop.layer = currLr;
      // now push it into Cango.dragObjects array, its checked by canvas mousedown event handler
      if (!txtObj.dragNdrop.layer.dragObjects.includes(txtObj))
      {
        txtObj.dragNdrop.layer.dragObjects.push(txtObj);
      }
    }
  };

  Cango.prototype.drawPath = function(pathDef, options)
  {
    const pathObj = new Path(pathDef, options);

    this.render(pathObj);
  };

  Cango.prototype.drawShape = function(pathDef, options)
  {
    // outline the same as fill color
    const pathObj = new Shape(pathDef, options);

    this.render(pathObj);
  };

  Cango.prototype.drawText = function(str, options)
  {
    const txtObj = new Text(str, options);

    this.render(txtObj);
  };

  Cango.prototype.drawImg = function(imgRef, options)  // just load img then call render
  {
    const imgObj = new Img(imgRef, options);

    this.render(imgObj);
  };

  Cango.prototype.clearShape = function(pathDef, options)
  {
    // outline the same as fill color
    const pathObj = new Shape(pathDef, options);

    // set fillColor as tranparent
    pathObj.fillCol = "rgba(0,0,0,1.0)"
    // set the clear flag for paintShape
    pathObj.clearFlag = true;
    this.render(pathObj);
  };

  Cango.prototype.createLayer = function()
  {
    const w = this.rawWidth,
          h = this.rawHeight,
          nLyrs = this.bkgCanvas.layers.length;  // bkg is layer 0 so at least 1

    // do not create layers on overlays or offscreen canvases - only an background canvases
    if (this.cgoType === "OVL" || this.cgoType === "OS")
    {
      // this is an overlay canvas - can't have overlays itself
      console.log("offscreen canvases and layers cannot create layers");
      return "";
    }

    const ovlId = this.cId+"_ovl_"+this.getUnique();
    const ovlHTML = "<canvas id='"+ovlId+"' style='position:absolute' width='"+w+"' height='"+h+"'></canvas>";
    const topCvs = this.bkgCanvas.layers[nLyrs-1].cElem;  // eqv to this.cnvs.layers since only bkgCanavs can get here
    topCvs.insertAdjacentHTML('afterend', ovlHTML);
    const newCvs = document.getElementById(ovlId);
    newCvs.style.backgroundColor = "transparent";
    newCvs.style.left = (this.bkgCanvas.offsetLeft+this.bkgCanvas.clientLeft)+'px';
    newCvs.style.top = (this.bkgCanvas.offsetTop+this.bkgCanvas.clientTop)+'px';
    // make it the same size as the background canvas
    newCvs.style.width = this.bkgCanvas.offsetWidth+'px';
    newCvs.style.height = this.bkgCanvas.offsetHeight+'px';
    const newL = new Layer(ovlId, newCvs);
    // save the ID in an array to facilitate removal
    this.bkgCanvas.layers.push(newL);

    return ovlId;    // return the new canvas id for call to new Cango(id)
  };

  Cango.prototype.deleteLayer = function(ovlyId)
  {
    for (let i=1; i<this.bkgCanvas.layers.length; i++)
    {
      if (this.bkgCanvas.layers[i].id === ovlyId)
      {
        let ovlNode = this.bkgCanvas.layers[i].cElem;
        if (ovlNode)
        {
          // in case the CangoHTMLtext extension is used
          if (ovlNode.alphaOvl && ovlNode.alphaOvl.parentNode)
          {
            ovlNode.alphaOvl.parentNode.removeChild(ovlNode.alphaOvl);
          }
          ovlNode.parentNode.removeChild(ovlNode);
        }
        // now delete layers array element
        this.bkgCanvas.layers.splice(i,1);       // delete the id
      }
    }
  };

  Cango.prototype.deleteAllLayers = function()
  {
    for (let i = this.bkgCanvas.layers.length-1; i>0; i--)   // don't delete layers[0] its the bakg canavs
    {
      let ovlNode = this.bkgCanvas.layers[i].cElem;
      if (ovlNode)
      {
        // in case the CangoHTMLtext extension is used
        if (ovlNode.alphaOvl && ovlNode.alphaOvl.parentNode)
        {
          ovlNode.alphaOvl.parentNode.removeChild(ovlNode.alphaOvl);
        }
        ovlNode.parentNode.removeChild(ovlNode);
      }
      // now delete layers array element
      this.bkgCanvas.layers.splice(i,1);
    }
  };

  // copy the basic graphics context values (for an overlay)
  Cango.prototype.dupCtx = function(src_graphCtx)
  {
    // copy all the graphics context parameters into the overlay ctx.
    this.yDown = src_graphCtx.yDown;      // set by setWorldCoordsRHC or setWorldCoordsSVG to signal coord system
    this.vpW = src_graphCtx.vpW;          // vp width in pixels
    this.vpH = src_graphCtx.vpH;          // vp height in pixels
    this.vpOrgYsvg = src_graphCtx.vpOrgYsvg;  // needed when switching between RHC and SVG and back
    this.vpOrgYrhc = src_graphCtx.vpOrgYrhc;  //   "
    this.vpOrgX = src_graphCtx.vpOrgX;    // vp lower left from canvas left in pixels
    this.vpOrgY = src_graphCtx.vpOrgY;    // vp lower left from canvas top
    this.xscl = src_graphCtx.xscl;        // world x axis scale factor
    this.yscl = src_graphCtx.yscl;        // world y axis scale factor
    this.xoffset = src_graphCtx.xoffset;  // world x origin offset from viewport left in pixels
    this.yoffset = src_graphCtx.yoffset;  // world y origin offset from viewport bottom in pixels
    this.savWC = clone(src_graphCtx.savWC);
    this.penCol = src_graphCtx.penCol.slice(0);   // copy value not reference
    this.penWid = src_graphCtx.penWid;    // pixels
    this.lineCap = src_graphCtx.lineCap.slice(0);
    this.paintCol = src_graphCtx.paintCol.slice(0);
    this.fontSize = src_graphCtx.fontSize;
    this.fontWeight = src_graphCtx.fontWeight;
    this.fontFamily = src_graphCtx.fontFamily.slice(0);
  };

  /*----------------------------------------------------------
   * 'initZoomPan' creates a Cango context on the overlay
   * canvas whose ID is passed as 'zpControlId'.
   * All the Cango context that is to be zoomed or panned
   * is passed in 'gc'. 'gc' may be an array of Cango contexts
   * if more than one canvas layer needs zooming.
   * The user defined function 'redraw' will be called to
   * redraw all the Cobjs on all the canvases in the new
   * zoomed or panned size or position.
   *---------------------------------------------------------*/
  initZoomPan = function(zpControlsId, gc, redraw)
  {
    const gAry = (Array.isArray(gc))? gc : [gc],
          arw = ['m',-7,-2,'l',7,5,7,-5],
          crs = ['m',-6,-6,'l',12,12,'m',0,-12,'l',-12,12],
          pls = ['m',-7,0,'l',14,0,'m',-7,-7,'l',0,14],
          mns = ['m',-7,0,'l',14,0];

    function zoom(z)
    {
      gAry.forEach((g)=>{
        const org = g.toPixelCoords(0, 0),
              cx = g.rawWidth/2 - org.x,
              cy = g.rawHeight/2 - org.y;

        g.xoffset += cx - cx/z;
        g.yoffset += cy - cy/z;
        g.xscl /= z;
        g.yscl /= z;
      });
      redraw();
    }

    function pan(sx, sy)
    {
      gAry.forEach((g)=>{
        g.xoffset -= sx;
        g.yoffset -= sy;
      });
      redraw();
    }

    function resetZoomPan()
    {
      gAry.forEach((g)=>{
        g.xscl = g.savWC.xscl;
        g.yscl = g.savWC.yscl;
        g.xoffset = g.savWC.xoffset;
        g.yoffset = g.savWC.yoffset;
      });
      redraw();
    }

    const zpGC = new Cango(zpControlsId);
    // Zoom controls
    zpGC.clearCanvas();
    zpGC.setWorldCoordsRHC(-zpGC.rawWidth+44,-zpGC.rawHeight+44);

    // make a shaded rectangle for the controls
    zpGC.drawShape(rectangle(114, 80), {x:-17, y:0, fillColor: "rgba(0, 50, 0, 0.12)"});

    const rst = new Shape(rectangle(20, 20, 2), {fillColor:"rgba(0,0,0,0.2)"});
    rst.enableDrag(null, null, resetZoomPan);
    zpGC.render(rst);

    const rgt = new Shape(rectangle(20, 20, 2), {x:22, y:0, fillColor:"rgba(0,0,0,0.2)"});
    // must always enable DnD before rendering !
    rgt.enableDrag(null, null, function(){pan(50, 0);});
    zpGC.render(rgt);

    const up = new Shape(rectangle(20, 20, 2), {x:0, y:22, fillColor:"rgba(0,0,0,0.2)"});
    up.enableDrag(null, null, function(){pan(0, -50);});
    zpGC.render(up);

    const lft = new Shape(rectangle(20, 20, 2), {x:-22, y:0, fillColor:"rgba(0,0,0,0.2)"});
    lft.enableDrag(null, null, function(){pan(-50, 0);});
    zpGC.render(lft);

    const dn = new Shape(rectangle(20, 20, 2), {x:0, y:-22, fillColor:"rgba(0,0,0,0.2)"});
    dn.enableDrag(null, null, function(){pan(0, 50);});
    zpGC.render(dn);

    const zin = new Shape(rectangle(20, 20, 2), {x:-56, y:11, fillColor:"rgba(0,0,0,0.2)"});
    zin.enableDrag(null, null, function(){zoom(1/1.2);});
    zpGC.render(zin);

    const zout = new Shape(rectangle(20, 20, 2), {x:-56, y:-11, fillColor:"rgba(0,0,0,0.2)"});
    zout.enableDrag(null, null, function(){zoom(1.2);});
    zpGC.render(zout);

    zpGC.drawPath(arw, {x:0, y:22, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(arw, {degs:-90, x:22, y:0, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(arw, {degs:90, x:-22, y:0, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(arw, {degs:180, x:0, y:-22, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(pls, {x:-56, y:11, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(mns, {x:-56, y:-11, strokeColor:"white", lineWidth:2});
    zpGC.drawPath(crs, {strokeColor:"white", lineWidth:2});
  };

  return Cango;
}());
