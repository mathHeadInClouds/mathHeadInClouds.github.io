// creative commons copyright notice mathheadinclouds@stackoverflow goes here (please 'unzip' yourself)
var generateColor = (function(){
  // alpha, beta, gamma must all be between 0 and 1,
  // they must be irrational, and their respective ratios must be irrational also.
  // further, when written as a continued fraction, the integer coefficients of that
  // should be small, such as, all ones and twos. Then, with below method, you get
  // a stream of colors which are "as different as possible to each other", loosely speaking.
	var gamma = (Math.sqrt( 5)-1)/2;
	var alpha = Math.sqrt(3) - 1;
	var beta  = Math.sqrt(2) - 1;
	var brightnessFactor = 4; // the larger the brighter; for dark colors, make it less than 1
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
  
var ast, codeContainer, analysis, colors, codeSpans, activeSpan, swatchesParent, CONSOLE;
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


function coloringAction(elt, evt, verbose){
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
	var clickedName = '';
	var foundAt = null;
	if (clickedAstNode.type === 'Identifier'){
		clickedName = clickedAstNode.name;
	}
	var allVarsObj = {};
  var varNamesArray2D = [];
	for (var i=0; i<inScope.length; i++){
		var atLevel = inScope[i];
		var varNamesArray = atLevel.map(function(VAR){
			//if (!('identifiers' in VAR)) debugger;
			//if (VAR.identifiers.length > 1) debugger;
			var varName = VAR.name;
			if (VAR.identifiers.length === 0) {
				if (varName==='arguments'){
					return 'arguments';
				} else { /*debugger;*/ }
			}
			var ident = VAR.identifiers[0];
			var span = spanOfAstNode(ident);
			var sty = span.style;
			var clicked = false;
			if (clickedName.length > 0){
				if (ident === clickedAstNode){
					clicked = true;
					foundAt = {i: i, varName : varName, ref: false};
				} else {
					var referencesToClicked = VAR.references.filter(function(ref){
						return ref.identifier === clickedAstNode;
					});
					if (referencesToClicked.length > 0){
						//if (referencesToClicked.length > 1){ debugger; }
						clicked = true;
						foundAt = {i: i, varName : varName, ref: true};
					}
				}
			}
			if (varName in allVarsObj){
				//if (clicked) debugger;
				sty.backgroundColor = '';
				sty.border = '2px solid red';
				return '(' + varName + ')'
			} else {
				sty.backgroundColor = colors[i];
				sty.border = clicked ? '2px solid black' : '';
				allVarsObj[varName] = i;
				return varName;
			}
		});
    varNamesArray2D.push(varNamesArray);
	}
	if (verbose){
		/*CONSOLE.textContent =  varNamesArray2D.map(function(varNames){
			return varNames.join(', ');
		}).join('\n');*/
		var allVarsArray = Object.keys(allVarsObj).filter(function(v){
			return v != 'arguments';
		});
		var stmt = 'if(false) { console.log(' + allVarsArray.join(', ') + '); }';
		CONSOLE.textContent = stmt;
	}
}

function spanClick(evt){ coloringAction(this, evt, true); }
function spanMouseEnter(evt){ coloringAction(this, evt, false); }

function initCodeContainer(sourceString){
	codeSpans = {};
	activeSpan = null;
	while (codeContainer.lastChild) { codeContainer.removeChild(codeContainer.lastChild); }
	ast = esprima.parse(sourceString, {range: true, sourceType: 'script'});
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
		span.addEventListener('click', spanClick);
		span.addEventListener('mouseenter', spanMouseEnter);
		codeSpans[startPos] = span;
	}
  while (swatchesParent.lastChild) { swatchesParent.removeChild(swatchesParent.lastChild); }
  for (i=0; i<analysis.scopes.length; i++){
    if (i >= colors.length){
      colors[i] = generateColor(i);
    }
    var div = document.createElement('div');
    div.classList.add('swatch');
    div.style.backgroundColor = colors[i];
    div.textContent = i;
    swatchesParent.appendChild(div);
  }

}


var func = function test(a,b,c){
	var lorem = 1;
	var ipsum = 2;
	var dolor = 3;
	var sit   = 4;
	var amet  = 5;
  function anotherFunction(){
		var notInScope_where_varClickme_is_declared = 43;
  }
	function infiniteLoop(){
		infiniteLoop();
		var clickMe = 42;
	}
	inner();
};

function bodyOnload(){
	document.body.innerHTML = 'click on the code to generate helper code<br>' +
    'disabling browser automization making closure vars invisible<br>';
    codeContainer = document.createElement('pre');
    document.body.appendChild(codeContainer);
    swatchesParent = document.createElement('div');
    document.body.appendChild(swatchesParent);
    document.body.appendChild(document.createElement('br'));
    CONSOLE = document.createElement('pre');
    document.body.appendChild(CONSOLE);
	initCodeContainer(func.toString());
	document.body.appendChild(document.createElement('br'));
	document.body.appendChild(document.createElement('br'));
	var homeAnchor = document.createElement('a');
	homeAnchor.setAttribute('href', 'index.html');
	homeAnchor.textContent = 'home';
	document.body.appendChild(homeAnchor);
	document.body.appendChild(document.createElement('br'));
	var sourceAnchor = document.createElement('a');
	sourceAnchor.setAttribute('href', "https://github.com/mathHeadInClouds/mathHeadInClouds.github.io/blob/master/iffalseconsolelog.js");
	sourceAnchor.textContent = 'source';
	document.body.appendChild(sourceAnchor);
}
