/*This software is published under the Lysander Spooner license.

That means, if you have ever sued someone for copyright violation (as an agent/lawyer or initiator/lawyer's client),
or sentenced someone for it (as a judge) ever in your life, you are not allowed to use this software.

Furthermore, if you work for the CIA, MI5, Mossad, FSB, etc, or any other organization of assholes, who think of themselves
as some sort of super humans with special priviledges and a license to kill, you are not allowed to use this software.
The same holds for other organizations whose members think of themselves as some sort of super humans with special priviledges
and a license to molest, harass and rob people, such as MPAA or GEMA, and any other organization who describe
what they are doing as 'upholding copyright law'.

Furthermore, if the above copyright notice is illegal in your country, then no one in your country is allowed to use this software.

If, due to the above, no one in your country is allowed to use this software, then I hope and wish that you do it anyway.
Because I want you to join me taking a huge dump on the disgusting contraption of "copyright law",
and the reputation of the despicable bunch of assholes who created it and maintains it.

I hope the prequel makes it clear enough that I do not consider mentioned 'despicable bunch' of being in charge of
taking ANY action whatsoever on my behalf, especially not if they call it 'defending my copyright'.

Thus, this notice isn't even a copyright notice - it does not contain instructions on what those individuals should be doing -
to 'uphold my copyright' or otherwise;
well, other than, to either drop dead or else at least step out of the way and get a job.

This notice must be retai... LMFAO - do you do everything you're told?
Feel free to retain this notice, with swearwords removed, or more added, however you like.
*/
var generateColor = (function(){
    // alpha, beta, gamma must all be between 0 and 1,
    // they must be irrational, and their respective ratios must be irrational also.
    // further, when written as a continued fraction, the integer coefficients of that
    // should be small, such as, all ones and twos. Then, with below method, you get
    // a stream of colors which are "as different as possible to each other", loosely speaking.
      var gamma = (Math.sqrt(5)-1)/2;
      var alpha = Math.sqrt(3)-1;
      var beta  = Math.sqrt(2)-1;
      var brightnessFactor = 4; // positive floating point number; the larger the brighter; for dark colors, make it less than 1
      function _generateColor(index){
          var n = 1 + index;
          var nAlpha = n * alpha;
          var nBeta  = n * beta;
          var nGamma = n * gamma;
          var _r = nAlpha - Math.floor(nAlpha);
          var _g = nBeta  - Math.floor(nBeta);
          var _b = nGamma - Math.floor(nGamma);
          var expo = 1/brightnessFactor;
          var _R = Math.pow(_r, expo);
          var _G = Math.pow(_g, expo);
          var _B = Math.pow(_b, expo);
          var r = Math.floor(255.999999 * _R);
          var g = Math.floor(255.999999 * _G);
          var b = Math.floor(255.999999 * _B);
          return 'rgb(' + [r,g,b].join(', ') + ')';
      }
      return _generateColor;
  })();
    
  var theTextArea, ast, codeContainer, analysis, colors, codeSpans, activeSpan, swatchesParent, CONSOLE, tokens, button;
  colors = [];
  
      function findPathAtPosition(pos){
          var result = [];
          function process(node){
              result.push(node);
              function isSubNode(key){
                  // caution/todo: I strongly suspect that there are one or more fringe cases
                  // I haven't considered, and this function is buggy. But it works most of the time ...
                  var child = node[key];
                  if (child===null) return false;
                  var ty = typeof child;
                  if (ty!=='object') return false;
                  if (child.constructor===Array) return ( key!=='range' );
                  if (child.constructor===RegExp) return false;
                  if (key==='loc') return false;
                  if ('type' in child){
                      if (child.type in esprima.Syntax) return true;
                          throw new Error('unexpected');
                  }
                  if (
                      (node.type === 'Literal') &&
                      (typeof node.value==='object') &&
                      (node.value.constructor===RegExp) &&
                      (typeof child.pattern==='string') &&
                      (typeof child.flags==='string')
                  ){ return false; } else {
                          throw new Error('unexpected');
                  }
              }
              var oKeys = Object.keys(node).filter(isSubNode);
              var arrayKeys = [];
              var nonArrayKeys = [];
              var i, j, k, oKey, key, child, arrayChild, cRange, childOfArray, downChild, upChild;
              for (i=0; i<oKeys.length; i++){
                  oKey = oKeys[i];
                  child = node[oKey];
                  if (child.constructor===Array){
                      arrayKeys.push(oKey);
                  } else {
                      nonArrayKeys.push(oKey);
                  }
              }
              for (j=0; j<nonArrayKeys.length; j++){
                  key    = nonArrayKeys[j];
                  child  = node[key];
                  cRange = child.range;
                  if (Array.isArray(cRange)){
                      if ( (pos >= cRange[0]) && (pos < cRange[1]) ){
                          return process(child);
                      }
                  } else {
                          throw new Error('unexpected');
                  }
              }
              for (k=0; k<arrayKeys.length; k++){
                  key        = arrayKeys[k];
                  arrayChild = node[key];
                  if (Array.isArray(arrayChild)){
                      if (arrayChild.length > 0){
                          for (i=-1/2; i<arrayChild.length; i+=1/2){
                              var iDown = Math.floor(i), iUp = Math.ceil(i);
                              if (iDown === iUp){
                                  childOfArray = arrayChild[i];
                                  if (childOfArray===null){
                                  } else {
                                      if ( (pos >= childOfArray.range[0]) && (pos < childOfArray.range[1]) ){
                                          return process(childOfArray);
                                      }
                                  }
                              } else {
                                  downChild = iDown >= 0              ? arrayChild[iDown] : null;
                                  upChild   = iUp < arrayChild.length ? arrayChild[iUp  ] : null;
                                  if (downChild===null){
                                      if (upChild!==null){
                                          if (pos < upChild.range[0]){ return node; }
                                      }
                                  } else {
                                      if (upChild===null){
                                          if (downChild===null){
                                              if (pos >= downChild.range[1]){ return node; }
                                          }
                                      } else {
                                          if ( (pos >= downChild.range[1]) && (pos < upChild.range[0]) ){
                                              return node;
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
              return node;
          }
          process(ast);
          return result;
      }
  
  function inScopeAt(position){
      var scopesList = analysis.scopes.filter(function(scope){
          var r = scope.block.range; return position >= r[0] && position < r[1];
      }).reverse();
      return scopesList.map(function(scope){ return scope.variables });
  }
  
  function spanOfAstNode(astNode){
      if ((typeof astNode)!=='object') throw new Error('only call on ast nodes');
      if ((typeof astNode.type)!=='string') throw new Error('only call on ast nodes');
      return codeSpans[astNode.range[0]];
  }
  function toggleHilite(astNode, onOff){
      var span = spanOfAstNode(astNode);
      span.style.backgroundColor = onOff ? 'red' : '';
      return span;
  }
  function hilite(astNode){ return toggleHilite(astNode, true ) }
  function lolite(astNode){ return toggleHilite(astNode, false); }
  function loliteAll(){
      Object.keys(codeSpans).forEach(function(startPos){
          var sty = codeSpans[startPos].style;
          sty.backgroundColor = '';
          sty.border = '';
      });
  }
  
  function scopeDepth(scope){
      var result = 0;
      while (true){
          if (scope===null) return result;
          ++result;
          scope = scope.upper;
      }
  }
  function scopeChainMaxLength(analysis){
      return Math.max.apply(null, analysis.scopes.map(scopeDepth));
  }
  
  function generateVarNamesArray2D(node, inScope, colorize){
      var clickedName = '';
      var foundAt = null;
      if (node.type === 'Identifier'){
          clickedName = node.name;
      }
      var allVarsObj = {};
      var varNamesArray2D = [];
      for (var i=0; i<inScope.length; i++){
          var atLevel = inScope[i];
          var varNamesArray = atLevel.map(function(VAR){
              if (!('identifiers' in VAR)) debugger;
              if (VAR.identifiers.length > 1) debugger;
              var varName = VAR.name;
              if (VAR.identifiers.length === 0) {
                  if (varName==='arguments'){
                      return 'arguments';
                  } else { debugger; }
              }
              var ident = VAR.identifiers[0];
              var span = spanOfAstNode(ident);
              var sty = span.style;
              var clicked = false;
              if (clickedName.length > 0){
                  if (ident === node){
                      clicked = true;
                      foundAt = {i: i, varName : varName, ref: false};
                  } else {
                      var referencesToClicked = VAR.references.filter(function(ref){
                          return ref.identifier === node;
                      });
                      if (referencesToClicked.length > 0){
                          if (referencesToClicked.length > 1){ debugger; }
                          clicked = true;
                          foundAt = {i: i, varName : varName, ref: true};
                      }
                  }
              }
              if (varName in allVarsObj){
                  if (colorize){
                      sty.backgroundColor = '';
                      sty.border = '2px solid red';
                  }
                  return '(' + varName + ')'
              } else {
                  if (colorize){
                      sty.backgroundColor = colors[i];
                      sty.border = clicked ? '2px solid black' : '';
                  }
                  allVarsObj[varName] = i;
                  return varName;
              }
          });
          varNamesArray2D.push(varNamesArray);
      }
      return varNamesArray2D;
  }
  
  function coloringAction(elt, evt){
      if (!(elt instanceof Element)) return;
      if (elt.tagName !== 'SPAN') return;
      if (activeSpan){ activeSpan.style.backgroundColor = ''; }
      loliteAll();
      activeSpan = elt;
      activeSpan.style.backgroundColor = 'rgb(234,234,234)';
      var position = +elt.dataset.sourceFrom;
      var inScope = inScopeAt(position);
      var clickedAstPath = findPathAtPosition(position);
      var clickedAstNode = clickedAstPath[clickedAstPath.length-1];
      var varNamesArray2D = generateVarNamesArray2D(clickedAstNode, inScope, true);
      var verbose = true;
      if (verbose){
          CONSOLE.textContent =  varNamesArray2D.map(function(varNames, level){
              return '' + level + ': ' + varNames.join(', ');
          }).join('\n');
      }
  }
  
  function spanMouseEnter(evt){ coloringAction(this, evt); }
  
  function codeContainerMouseLeave(evt){
      loliteAll();
      activeSpan = null;
  }
  
  function clearCodeContainer(){ while (codeContainer.lastChild) { codeContainer.removeChild(codeContainer.lastChild); } }
  function clearSwatches(){ while (swatchesParent.lastChild) { swatchesParent.removeChild(swatchesParent.lastChild); }  }
  function clearConsole(){ while (CONSOLE.lastChild) { CONSOLE.removeChild(CONSOLE.lastChild); } }
  
  function initCodeContainer(sourceString){
      codeSpans = {};
      activeSpan = null;
      clearCodeContainer();
      ast = esprima.parse(sourceString, {range: true, tokens: true, sourceType: 'script'});
      tokens = ast.tokens;
      analysis = escope.analyze(ast);
      var positionsObj = {};
      positionsObj[0] = null;
      positionsObj[sourceString.length] = null;
      estraverse.traverse(ast, {
          enter: function(node, parent){
              positionsObj[node.range[0]] = null;
              positionsObj[node.range[1]] = null;
          }
      });
      tokens.forEach(function(token){
          var r = token.range;
          positionsObj[r[0]] = null;
          positionsObj[r[1]] = null;
      });
      var positions = Object.keys(positionsObj).map(function(p){ return +p; });
      var i;
      for (i=0; i<positions.length-1; i++){
          var startPos = positions[i];
          var endPos = positions[i+1];
          var codePortion = sourceString.slice(startPos, endPos);
          var span = document.createElement('span');
          span.textContent = codePortion;
          codeContainer.appendChild(span);
          span.dataset.sourceFrom = startPos;
          span.dataset.sourceTo   = endPos;
          span.addEventListener('mouseenter', spanMouseEnter);
          codeSpans[startPos] = span;
      }
      clearSwatches();
      var numColorsNeeded = scopeChainMaxLength(analysis);
      while (colors.length < numColorsNeeded){
          colors.push(generateColor(colors.length));
      }
      for (i=0; i<numColorsNeeded; i++){
          var div = document.createElement('div');
          div.classList.add('swatch');
          div.style.backgroundColor = colors[i];
          div.textContent = i;
          swatchesParent.appendChild(div);
      }
  }
  
  
  var initialTestFunction = function test(p){
      var v = 11;
      function a(pa){
          var va = 13;
          function aa(paa){
              var vaa = 14;
          }
          function ab(pab){
              var vab = 16;
          }	
      }
      function b(pb){
          var vb = 18;
          function ba(pba){
              var vba = 20;
          }
          function bb(pbb){
              var vbb = 22;
          }
          return (function(x, y){
              return ba(x, x) + bb(x, (function(u,v){return u+v;})(1,1));
          })(42,43);
      }
      return b(p1, 0);
  };

  function performAnalysis(){
      initCodeContainer(theTextArea.value, true, false);
  }
  function bodyOnload(){
      theTextArea    = document.getElementById('theTextArea');
      codeContainer  = document.getElementById('codeContainer');
      swatchesParent = document.getElementById('swatchesParent');
      CONSOLE        = document.getElementById('CONSOLE');
      button         = document.getElementById('button');
      button.addEventListener('click', performAnalysis);
      codeContainer.addEventListener('mouseleave', codeContainerMouseLeave);
      theTextArea.value = initialTestFunction.toString();
  }
  