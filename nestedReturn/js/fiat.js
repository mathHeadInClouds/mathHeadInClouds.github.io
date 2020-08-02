"use strict";
(function(root){
    function getKeySetsUpto(object, depth){
        function unaryPlus(x){ return +x; }
        if (depth===0) return [];
        if (depth<0) throw new Error('illegal argument');
        var keySets    = new Array(depth);
        var arrayAtLvl = new Array(depth);
        for (var i=0; i<depth; i++){
            keySets[i] = {};
            arrayAtLvl[i] = true;
        }
        function inner(node, level){
            if (!node) return;
            if (typeof node !== 'object') return;
            var keys    = Object.keys(node);
            var keySet  = keySets[level];
            var arrHere = Array.isArray(node);
            var arrAll  = arrayAtLvl[level] && arrHere;
            if (arrAll){
                var i=-1;
                var L = keys.length;
                while (true){
                    ++i;
                    if (i>=L) break;
                    var _key = keys[i];
                    var  key = +_key;
                    if (isNaN(key)||(key<0)||(key===Infinity)) break;
                    if (Math.round(key)!==key) break;
                    keySet[_key] = null;
                }
                if (i<L){
                    arrAll = false;
                    for(;i<L;i++){
                        keySet[keys[i]] = null;
                    }
                }
            } else {
                keys.forEach(function(key){
                    keySet[key] = null;
                });
            }
            arrayAtLvl[level] = arrAll;
            if (level < depth-1){
                keys.forEach(function(key){
                    inner(node[key], level+1);
                });
            }
        }
        inner(object, 0);
        var result = new Array(depth);
        for (var i=0; i<depth; i++){
            var keys = Object.keys(keySets[i]);
            if (arrayAtLvl[i]){
                result[i] = keys.map(unaryPlus);
            } else {
                result[i] = keys;
            }
        }
        return result;
    }
    function unaryPlus(x){
        var result = +x;
        if (isNaN(result)){ debugger; throw new Error('perverted Array encountered'); }
        return result;
    }
    function getKeySet(object){
        if (!object) return [];
        var _keySet = Object.keys(object);
        return Array.isArray(object) ? _keySet.map(unaryPlus) : _keySet;
    }
    var generateColor = (function(){
        // alpha, beta, gamma must all be between 0 and 1,
        // they must be irrational, and their respective ratios must be irrational also.
        // further, when written as a continued fraction, the integer coefficients of that
        // should be small, such as, all ones and twos. Then, with below method, you get
        // a stream of colors which are "as different as possible to each other", loosely speaking.
        var gamma = (Math.sqrt(5)-1)/2;
        var alpha = Math.sqrt(3)-1;
        var beta  = Math.sqrt(2)-1;
        var brightnessFactor = 0.125; // positive floating point number; the larger the brighter; for dark colors, make it less than 1
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
    function esprima_traverse(root, enter, leave){
        function visitEachAstNode(root, enter, leave){
            function visit(node, parent, grandParent){
                function isSubNode(key){
                    var child = node[key];
                    if (child===null) return false;
                    var ty = typeof child;
                    if (ty!=='object') return false;
                    if (Array.isArray(child)) return ( key!=='range' );
                    if (key==='loc') return false;
                    if ('type' in child){
                        if (child.type in esprima.Syntax) return true;
                        debugger; throw new Error('unexpected');
                    } else {
                        return false;
                    }
                }
                var isTarget = !Array.isArray(node);
                var P = null;
                if (isTarget){
                    if ( (parent===null) || Array.isArray(parent) ){
                        P = grandParent;
                    } else {
                        P = parent;
                    }
                }
                if (isTarget){ enter(node, P); }
                var keys = Object.keys(node);
                var subNodeKeys = keys.filter(isSubNode);
                for (var i=0; i<subNodeKeys.length; i++){
                    var key = subNodeKeys[i];
                    visit(node[key], node, parent);
                }
                if (isTarget){ leave(node, P); }
            }
            visit(root, null, null);
        }
        visitEachAstNode(root,
            typeof enter==='function' ? enter : function(){},
            typeof leave==='function' ? leave : function(){}
        );
    }
    function esprima_TRAVERSE(root, onEnter, onLeave){
        function visitEachAstNode(root, enter, leave){
            function visit(node, stack, keyStack){
                function isSubNode(key){
                    var child = node[key];
                    if (child===null) return false;
                    var ty = typeof child;
                    if (ty!=='object') return false;
                    if (Array.isArray(child)) return ( key!=='range' );
                    if (key==='loc') return false;
                    if ('type' in child){
                        if (child.type in esprima.Syntax) return true;
                        debugger; throw new Error('unexpected');
                    } else {
                        return false;
                    }
                }
                var isTarget = !Array.isArray(node);
                if (isTarget){ enter(node, stack, keyStack); }
                var keys = Object.keys(node);
                var subNodeKeys = keys.filter(isSubNode);
                for (var i=0; i<subNodeKeys.length; i++){
                    var key = subNodeKeys[i];
                    visit(node[key], stack.concat([node]), keyStack.concat([key]));
                }
                if (isTarget){ leave(node, stack, keyStack); }
            }
            visit(root, [], []);
        }
        visitEachAstNode(root,
            typeof onEnter==='function' ? onEnter : function(){},
            typeof onLeave==='function' ? onLeave : function(){}
        );
    }
    var identity = function(x){ return x; };
    var ascendingSortComparator = function(a,b){return Number(a)-Number(b);}
    var throwError = function(msg){ throw new Error(msg); };
    var UTIL = {};
    var ASSERT = {};
    var theFiatNamespace = 'mathheadinclouds.com/fiat';
    function ghostElement(){
        return document.createElementNS(theFiatNamespace, 'ghost');
    }
    function isGhost(domElement){
        return (domElement.namespaceURI === theFiatNamespace) && (domElement.tagName === 'ghost');
    }
    function catalogueItem(catalogueName){
        var returnValue = document.createElementNS(theFiatNamespace, 'catalogue_item');
        if (catalogueName !== null){
			returnValue.setAttribute('catalogue', catalogueName);
		}
        return returnValue;
    }
    function isCatalogueItem(domElement){
        return (domElement.namespaceURI === theFiatNamespace) && (domElement.tagName === 'catalogue_item');
    }
    function getCatalogueName(domElement){
        if (isCatalogueItem(domElement)){
			if (domElement.hasAttribute('catalogue')){
				return domElement.getAttribute('catalogue');
			}
            var ancestor = domElement;
            while (true){
				ancestor = ancestor.parentElement;
				if (!ancestor) return null;
				if (ancestor.dataset && ('catalogue_target' in ancestor.dataset)){
					return ancestor.dataset.catalogue_target;
				}
			}
        }
        eval('debugger'); throw new Error('not an abstract catalogue item');
    }
    function assertLC(str){
        if (str !== str.toLowerCase()){
            //throw new Error('only lower case allowed');
            //console.warn(str);
        }
        return str;
    }
    var josefK = {};
    var youAreNumberSix = {};
    var HandsOff = new Error('fiat internals - hands off');
    function TheLaw(notNow){
        return function(visitor){
            if (visitor===josefK) return notNow;
            throw HandsOff;
        };
    }
    function ImNaN_Im_WDT(){}
    function ImNaN_Im_FWDT(){}
    function makeTypeChecker(type_of_free_man){
        return function(item){
            if ((typeof item) !== 'function') return false;
            if ((typeof item.____) !== 'function') return false;
            try {
                item.____();
                return false;
            } catch(e){
                if (e===HandsOff){
                    var notNow = item.____(josefK);
                    try {
                        notNow.proveIdentity(youAreNumberSix);
                    } catch(freeMan){
                        return ( freeMan instanceof type_of_free_man );
                    }
                } else {
                    return false;
                }
            }
        };
    }
    var isWrappedDomTree  = makeTypeChecker(ImNaN_Im_WDT);
    var isFunctionIntoWDT = makeTypeChecker(ImNaN_Im_FWDT);

    function injectParams(func, params){
        func.____ = TheLaw({
            proveIdentity: function(arg){
                if (arg===youAreNumberSix) throw new ImNaN_Im_FWDT();
            }
        });
        func.typeof = 'PFWDT';
        func.getParameterNames = function(){ return params; };
    }
    function setType_FWDT(func){
        func.____ = TheLaw({
            proveIdentity: function(arg){
                if (arg===youAreNumberSix) throw new ImNaN_Im_FWDT();
            }
        });
        func.typeof = 'FWDT';
    }

    var namespacesCatalogue = {
        SVG : 'http://www.w3.org/2000/svg'
    };

    function keyOfDomElt(node){
        var keyArray = [];
        if (!node) debugger;
        var data = node.dataset;
        if (!data) debugger;
        if (isCatalogueItem(node)) return null;
        if (isGhost(node)) return null;
        if (!data){
            eval('debugger');
            return null;
        }
        while (true){
            var level = keyArray.length;
            var k     = 'key' + level;
            var ki    = k + 'i';
            var hasKey_string = k  in data;
            var hasKey_number = ki in data;
            var hasKey = hasKey_string || hasKey_number;
            var key;
            if (hasKey){
                if (hasKey_string){
                    key = data[k];
                } else {
                    key = +data[ki];
                    if (isNaN(key)           ) throw new Error('numerical keys must be integer - NaN encountered');
                    if (key < 0              ) throw new Error('numerical keys must be integer - negative encountered');
                    if (key===Infinity       ) throw new Error('numerical keys must be integer - Infinity encountered');
                    if (key!==Math.round(key)) throw new Error('numerical keys must be integer');
                }
                keyArray.push(key);
            } else {
                return keyArray;
            }
        }
    }

    function camelSetter(callback){
        return function(data){
            function nextPrefix(currentCamel){
                return function (nameChunk){
                    var x = assertLC(nameChunk);
                    return currentCamel + x.charAt(0).toUpperCase() + x.slice(1);
                }
            }
            function setData(subData, calcPrefixed){
                for (var name in subData){
                    var value = subData[name];
                    var type  = typeof value;
                    var camel = calcPrefixed(name);
                    if (type==='object'){
                        if (value!==null){
                            setData(value, nextPrefix(camel));
                        }
                    } else {
                        callback(camel, value);
                    }
                }
            }
            setData(data, assertLC);
        }
    }
    function dashSetter(callback){
        return function(data){
            function nextPrefix(currentDashyName){
                return function (nameChunk){
                    return currentDashyName + '-' + nameChunk;
                }
            }
            function setData(subData, calcPrefixed){
                for (var name in subData){
                    var value = subData[name];
                    var type  = typeof value;
                    var dashyName = calcPrefixed(name);
                    if (type==='object'){
                        if (value!==null){
                            setData(value, nextPrefix(dashyName));
                        }
                    } else {
                        callback(dashyName, value);
                    }
                }
            }
            setData(data, assertLC);
        }
    }

    function __destructureMaker__(result, localGhost, stringBufferWithSeparator){
        function specFunc(spec){
            function dataFunc(arg){
                var objectGraph = JSON.Siberia.objectGraph(arg);
                var objects        = objectGraph.objects;
                var inverseObjects = objectGraph.inverseObjects;
                var forest         = objectGraph.forest;
                var atoms          = objectGraph.atoms;
                var types          = objectGraph.types;
                var rootIdx        = objectGraph.rootIdx;
                var data           = rootIdx >= 0 ? objects[rootIdx] : atoms[-rootIdx];
                var nodeStack      = [];
                var treeIndexStackObject = {};
                var treeIndexSeen  = {};
                function inner(treeIdx, stack, idxStack, treeIdxStack, parentHasRepetitions){
                    var dataNode, tree;
                    if (treeIdx>=0){
                        dataNode = objects[treeIdx]; tree = forest[treeIdx];
                    } else {
                        dataNode = atoms[-treeIdx];  tree = null;
                    }
                    var type = typeof dataNode, level = stack.length;
                    nodeStack[level] = dataNode;
                    if (!spec) debugger;
                    var cycleStart  = treeIdx in treeIndexStackObject;
                    var repeat      = treeIdx in treeIndexSeen;
                    var repeatStart = repeat && (!parentHasRepetitions);
                    var childHasRepetitions = repeat || parentHasRepetitions;
                    var advanced = {
                        cycleStart    : cycleStart,
                        repeatStart   : repeatStart,
                        treeIdxStack  : treeIdxStack,
                        treeIndexSeen : treeIndexSeen
                    };
                    var action = spec(objects,inverseObjects,forest,atoms,types,treeIdx,dataNode,stack,idxStack,nodeStack,advanced,localGhost,stringBufferWithSeparator);
                    var keySet = action.keySet;
                    var f      = action.f;
                    var isWDT  = isWrappedDomTree(f);
                    if (keySet===null){
                        if (isWDT){
                            if (action.stop){
                                return f;
                            } else {
                                return f.F(dataNode);
                            }
                        }
                        return f.apply(data, [dataNode].concat(stack).concat([idxStack]).concat([keySets]).concat([data]));
                    } else {
                        try {
                            var values = (dataNode===null) ? [] : MAP_INNER(dataNode, keySet, stack, idxStack, treeIdxStack, treeIdx, childHasRepetitions);
                            if (isWDT){
                                return f.template().apply(data, values);
                            }
                            return f.apply(data, stack.concat([idxStack]).concat([keySet]).concat([data])).apply(data, values);
                        } catch(e){
                            if (e.message==='cycle'){
                                var E = document.createElement('span'); E.appendChild(document.createTextNode('CYCLE'));
                                E.style.fontWeight = 'bold'; E.style.color = 'red';
                                return E;
                            } else {
                                throw(e);
                            }
                        }
                    }
                }
                function MAP_INNER(dataNode, keySet, stack, idxStack, treeIdxStack, treeIdx, seen){
                    treeIndexSeen[treeIdx] = null;
                    var numRepeats;
                    if (treeIdx in treeIndexStackObject){
                        numRepeats = ++treeIndexStackObject[treeIdx];
                    } else {
                        numRepeats = treeIndexStackObject[treeIdx] = 0;
                    }
                    var newTreeIdxStack = treeIdxStack.concat(treeIdx);
                    function call_inner(key, idx){
                        if (false){ console.log(dataNode,keySet,stack,idxStack,treeIdxStack,treeIdx,seen,treeIndexSeen,numRepeats,treeIndexStackObject,newTreeIdxStack,objectGraph,objects,inverseObjects,forest,atoms,types,rootIdx,data,nodeStack); }
                        var newTreeIdx = forest[treeIdx][key],
                            newStack = stack.concat(key),
                            newIdxStack = idxStack.concat(idx);
                        return inner(newTreeIdx, newStack, newIdxStack, newTreeIdxStack, seen);
                    }
                    if (numRepeats <= 1){
                        var retv = keySet.map(function(key, idx){
                            return call_inner(key, idx);
                        });
                        if (numRepeats<=0){
                            delete treeIndexStackObject[treeIdx];
                        } else {
                            --treeIndexStackObject[treeIdx];
                        }
                        return retv;
                    }
                    throw new Error('cycle');
                }
                return result(inner(rootIdx, [], [], [], false));
            }
            setType_FWDT(dataFunc);
            return dataFunc;
        }
        return specFunc;
    }

	function __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, useOGA, gappy, full, depths){
		return function(){
			var outer = result.template();
			var functions = [outer];
			var isWDT = [true];
			var depth = arguments.length;
			var argi, func, type;
			for (var i=0; i<depth; i++){
				argi = arguments[i];
				var type = typeof argi;
				if (argi===null) {
					func = localGhost();
				} else {
					if (type==='string'){
						func = stringBufferWithSeparator(argi);
					} else {
						if (type==='function'){
							func = argi;
						} else {
							eval('debugger'); throw new Error('illegal argument');
						}
					}
				}
				isWDT[i+1] = isWrappedDomTree(func);
				functions[i+1] = isWDT[i+1] ? func.template() : func;
			}
			if (gappy){
				depths = UTIL.constantArray(1, depth);
			} else {
				if (full){
					depths = [depth];
				}
			}
			var accuDepths = [0];
			depths.forEach(function(entry){
				var previous = accuDepths[accuDepths.length-1];
				var next = previous + entry;
				accuDepths.push(next);
			});
			var keySetsComputationDepth = UTIL.constantArray(0, depth);
			for (var z=0; z<accuDepths.length-1; z++){
				keySetsComputationDepth[accuDepths[z]] = depths[z];
			}
            return function(PIVOT){
                var keySets = [];
                var data = useOGA ? PIVOT.get() : PIVOT;
                function inner(pivot, stack, idxStack){
                    var dataNode = useOGA ? pivot.get() : pivot;
                    var level = stack.length;
                    var ksDrillDepth = keySetsComputationDepth[level];
                    if (ksDrillDepth > 0){
                        var newKeySets = useOGA ? pivot.keySetsUpto(ksDrillDepth) : getKeySetsUpto(dataNode, ksDrillDepth);
                        for (var v=0; v<ksDrillDepth; v++){
                            keySets[level+v] = newKeySets[v];
                        }
                    }
                    var f = functions[level];
                    if (level===depth){
                        if (isWDT[level]){
                            return f.F(dataNode);
                        }
                        return f.apply(PIVOT, [pivot].concat([stack]).concat([idxStack]).concat([keySets]).concat([PIVOT]));
                    } else {
                        var keySet = keySets[level];
                        var values = (dataNode===null) ? [] : keySet.map(function(key, idx){
                            var nextPivot = useOGA ? pivot.getChild(key) : ( (key in dataNode) ? dataNode[key] : null );
                            return inner(nextPivot, stack.concat(key), idxStack.concat(idx));
                        });
                        if (isWDT[level]){
                            return f.apply(PIVOT, values);
                        }
                        return f.apply(PIVOT, [stack].concat([idxStack]).concat([keySets]).concat([PIVOT])).apply(PIVOT, values);
                    }
                }
                return inner(PIVOT, [], []);
            };
		};
	}
	function __mapMaker__(result, localGhost, stringBufferWithSeparator, useOGA, gappy, full, depths){
		var reverse_wrapping_order = false;
		var CATEGORIES = {key:null,index:null,all:null,node:null};
		var automaticArgNames = false;
		var verboseArgNames = false;
		return function(argumentsCatalogue){
			var flatArgumentsCatalogue = {};
			var inverseCatalogue = {};
			if (!argumentsCatalogue) argumentsCatalogue = {};
			var acType = typeof argumentsCatalogue;
			if (acType==='string'){
				if (argumentsCatalogue==='auto'){
					automaticArgNames = true;
				} else {
					if (argumentsCatalogue==='verbose'){
						verboseArgNames = automaticArgNames = true;
					} else {
						debugger; throw new Error('illegal argument');
					}
				}
			} else {
				if (acType==='object'){
					Object.keys(argumentsCatalogue).forEach(function(category){
						if (!(category in CATEGORIES)){
							console.error(category);
							debugger; throw new Error('unknown category');
						}
						var positions = argumentsCatalogue[category];
						if (!(positions&&(typeof positions==='object'))){ debugger; throw new Error('illegal argument'); }
						inverseCatalogue[category] = [];
						Object.keys(positions).forEach(function(argumentName){
							if (argumentName in CATEGORIES){
								debugger; throw new Error('category name not allowed here');
							}
							var position = +positions[argumentName];
							inverseCatalogue[category][position] = argumentName;
							if (isNaN(position)){ debugger; throw new Error('illegal argument'); }
							if (argumentName in flatArgumentsCatalogue){
								debugger; throw new Error('duplicate name encountered');
							}
							flatArgumentsCatalogue[argumentName] = {
								category: category,
								position: position
							};
						});
					});
					Object.keys(CATEGORIES).forEach(function(category){
						flatArgumentsCatalogue[category] = {
							category: category,
							position: 'all'
						};
					});
				} else {
					debugger; throw new Error('illegal argument');
				}
			}
			function getParameterNames(func){
				if ( isFunctionIntoWDT(func) ){
					if ( func.typeof === 'PFWDT' ){ return func.getParameterNames(); }
					if ( func.typeof ===  'FWDT' ){ return null; }
					throw new Error('unexpected');
				}
				var ast = esprima.parse('(' + func.toString() + ')');
				var funcExpr = ast.body[0].expression;
                var fty = funcExpr.type;
                var OK = funcExpr.body && (
                    (fty==='FunctionExpression') &&  Array.isArray(funcExpr.body.body) ||
                    (fty==='ArrowFunctionExpression')
                );
                if (!OK){
                    debugger; throw new Error('function expected');
                }
				if ( !(Array.isArray(funcExpr.params)) ){
					debugger; throw new Error('unexpected');
				}
				return funcExpr.params.map(function(param){
					if (param.type !== 'Identifier'){
						debugger; throw new Error('unexpected');
					}
					return param.name;
				});
			}
			var re_key   = verboseArgNames ? /key(\d+)/   : /k(\d+)/;
			var re_index = verboseArgNames ? /index(\d+)/ : /i(\d+)/;
			var re_all   = verboseArgNames ? /all(\d+)/   : /a(\d+)/;
			var re_node  = verboseArgNames ? /node(\d+)/  : /n(\d+)/;
			function constructParameterSemantics(func){
				var parameterSemantics;
				var paramNames = getParameterNames(func);
				if (paramNames===null){
					return 'bruijn';
				} else {
					if (automaticArgNames){
						parameterSemantics = paramNames.map(function(pName){
							if (typeof pName==='string'){
								var matchKey  = pName.match(re_key  ); if (matchKey ) { return {category: 'key'  , position: +matchKey[1]};  }
								var matchIdx  = pName.match(re_index); if (matchIdx ) { return {category: 'index', position: +matchIdx[1]};  }
								var matchAll  = pName.match(re_all  ); if (matchAll ) { return {category: 'all'  , position: +matchAll[1]};  }
								var matchNode = pName.match(re_node ); if (matchNode) { return {category: 'node' , position: +matchNode[1]}; }
								if (pName in CATEGORIES) { return {category: pName, position: 'all'}; }
								debugger; throw new Error('not an automatic argument name');
							} else {
								eval('debugger'); throw new Error('unexpected');
							}
						});
					} else {
						parameterSemantics = paramNames.map(function(pName){
							if (typeof pName==='string'){
								if (pName in flatArgumentsCatalogue){
									return flatArgumentsCatalogue[pName];
								} else {
									console.error(pName); console.error(func); console.error(flatArgumentsCatalogue);
									debugger; throw new Error('argument name not found in catalogue');
								}
							} else {
								eval('debugger'); throw new Error('unexpected');
							}
						});
					}
				}
				return parameterSemantics;
			}
			function wrapperFrom(func){
				return isWrappedDomTree(func)
					? { func  : func.template(), parameterSemantics : null }
					: { func  : func, parameterSemantics : constructParameterSemantics(func) }
			}
			function modifierFlagsFrom(name){
				var first=false, last=false, separator=false, all=false,
					roundUp=false, roundDown=false, exact=false;
				var tokens = name.split('$');
				tokens.forEach(function(token){
					token = token.toLowerCase();
					if (token==='all'      ){ first = true; last = true; separator = true; all = true; return; }
					if (token==='first'    ){ first = true; return; }
					if (token==='last'     ){ last = true; return; }
					if (token==='separator'){ separator = true; return; }
					if (token==='ceil'     ){ roundUp = true; return; }
					if (token==='floor'    ){ roundDown = true; return; }
					if (token==='exact'    ){ exact = true; return; }
					debugger; throw new Error('illegal token');
				});
				if ( !( roundUp || roundDown || exact ) ){
					if (first===last){
						exact = true;
					} else {
						if (first){ roundUp = true; } else { roundDown = true; }
					}
				}
				var roundingFunc = exact ? identity : roundUp ? Math.ceil : roundDown ? Math.floor : (function(){throw new Error('unexpected')})()
				return {
					first: first, last: last, separator: separator, all: all, roundingFunc: roundingFunc
				}
			}
			function modifier_functions(funcOrFuncs){
				var theFunctions = [];
				function addOne(item){
					if (Array.isArray(item)){
						addAll(item);
					} else {
						var type = typeof item;
						if (type==='function'){
							theFunctions.push(item);
						} else {
							if ( (type==='string')||(type==='number')||(type==='boolean') ){
								theFunctions.push(localGhost(item));
							} else {
								debugger; throw new Error('illegal argument');
							}
						}
					}
				}
				function addAll(array){ array.forEach(addOne); }
				addOne(funcOrFuncs);
				return theFunctions.map(function(f){
					return { func: f };
				});
			}
			function extract_andthen(array){
				if (!Array.isArray(array)){
					debugger; throw new Error('illegal argument');
				}
				return array.map(function(stageObj){
					if ( (!stageObj) || ((typeof stageObj)!=='object') ){debugger; throw new Error('illegal argument');}
					var wrappers = {};
					var obj = {wrappers: [], before: null, after: null};
					Object.keys(stageObj).forEach(function(key){
						var func = stageObj[key];
						var _key = +key;
						if (isNaN(_key)){
							if (key==='before'){
								obj.before = modifier_functions(func);
							} else {
								if (key==='after'){
									obj.after = modifier_functions(func);
								} else {
									eval('debugger'); throw new Error('illegal argument');
								}
							}
						} else {
							if ( (_key===-Infinity) || (_key===Infinity) || (Math.round(_key)!==_key) ){
								debugger; throw new Error('integer expected');
							}
							if ((typeof func)!=='function'){ debugger; throw new Error('illegal argument'); }
							wrappers[_key] = wrapperFrom(func);
						}
					});
					var sortedKeys = Object.keys(wrappers).map(unaryPlus).sort(ascendingSortComparator);
					if (reverse_wrapping_order) { sortedKeys = sortedKeys.reverse(); }
					sortedKeys.forEach(function(key, index){
						obj.wrappers.push(wrappers[key]);
					});
					['before', 'after'].forEach(function(blah){
						var modifier = obj[blah];
						if (modifier){
							modifier.forEach(function(mofu){
								if (isWrappedDomTree(mofu.func)){
									mofu.func = mofu.func.template();
									mofu.parameterSemantics = null;
								} else {
									mofu.parameterSemantics = constructParameterSemantics(mofu.func);
								}
							});
						}
					});
					return obj;
				});
			}
			return function(){
				var levelData = [];
				levelData.push({ wrappers : [], andThen: null });
				levelData[0].wrappers.push({
					func  : result.template(),
					parameterSemantics : null
				});
				var depth = arguments.length;
				function digestOneArgument(inputForOneLevel){
					var obj = { wrappers: [], andThen : null };
					var modifiers = [];
					var andThen = null;
					if (inputForOneLevel){
						var type = typeof inputForOneLevel;
						if (type==='function'){
							obj.wrappers.push(wrapperFrom(inputForOneLevel));
						} else {
							if (type==='object'){
								var wrappers = {};
								Object.keys(inputForOneLevel).forEach(function(key){
									var func = inputForOneLevel[key];
									var _key = +key;
									if (isNaN(_key)){
										if (key==='andthen'){
											andThen = extract_andthen(func);
										} else {
											var modifier = modifierFlagsFrom(key);
											modifier.functions = modifier_functions(func);
											modifiers.push(modifier);
										}
									} else {
										if ( (_key===-Infinity) || (_key===Infinity) || (Math.round(_key)!==_key) ){
											debugger; throw new Error('integer expected');
										}
										if ((typeof func)!=='function'){ debugger; throw new Error('illegal argument'); }
										wrappers[_key] = wrapperFrom(func);
									}
								});
								var sortedKeys = Object.keys(wrappers).map(unaryPlus).sort(ascendingSortComparator);
								if (reverse_wrapping_order) { sortedKeys = sortedKeys.reverse(); }
								sortedKeys.forEach(function(key, index){
									obj.wrappers.push(wrappers[key]);
								});
							} else {
								if (type==='string'){
									var sbws = stringBufferWithSeparator(inputForOneLevel);
									obj.wrappers.push(wrapperFrom(sbws));
								} else {
									eval('debugger'); throw new Error('illegal argument');
								}
							}
						}
					} else {
						if (inputForOneLevel===''){
							obj.wrappers.push(wrapperFrom(stringBufferWithSeparator('')));
						} else {
							obj.wrappers.push(wrapperFrom(localGhost()));
						}
					}
					modifiers.forEach(function(modifier){
						if (modifier.first){
							if ('modFirst' in obj){
								if (modifier.all===obj.modFirst.all){
									console.error(obj.modFirst); console.error(modifier); debugger; throw new Error('conflict of jurisdiction. role: first');
								} else {
									if (obj.modFirst.all){ obj.modFirst = modifier; }
								}
							} else {
								obj.modFirst = modifier;
							}
						}
						if (modifier.last){
							if ('modLast' in obj){
								if (modifier.all===obj.modLast.all){
									console.error(obj.modLast); console.error(modifier); debugger; throw new Error('conflict of jurisdiction. role: last');
								} else {
									if (obj.modLast.all){ obj.modLast = modifier; }
								}
							} else {
								obj.modLast = modifier;
							}
						}
						if (modifier.separator){
							if ('modSeparator' in obj){
								if (modifier.all===obj.modSeparator.all){
									console.error(obj.modSeparator); console.error(modifier); debugger; throw new Error('conflict of jurisdiction. role: separator');
								} else {
									if (obj.modSeparator.all){ obj.modSeparator = modifier; }
								}
							} else {
								obj.modSeparator = modifier;
							}
						}
					});
					['modFirst', 'modLast', 'modSeparator'].forEach(function(blah){
						var modifier = obj[blah];
						if (modifier){
							modifier.functions.forEach(function(mofu){
								if (isWrappedDomTree(mofu.func)){
									mofu.func = mofu.func.template();
									mofu.parameterSemantics = null;
								} else {
									mofu.parameterSemantics = constructParameterSemantics(mofu.func);
								}
							});
						}
					});
					obj.andThen = andThen;
					levelData.push(obj);
				}
				for (var i=0; i<depth; i++){
					digestOneArgument(arguments[i]);
				}
				// keySets computation init
				if (gappy){
					depths = UTIL.constantArray(1, depth);
				} else {
					if (full){
						depths = [depth];
					}
				}
				var accuDepths = [0];
				depths.forEach(function(entry){
					var previous = accuDepths[accuDepths.length-1];
					var next = previous + entry;
					accuDepths.push(next);
				});
				var keySetsComputationDepth = UTIL.constantArray(0, depth);
				for (var z=0; z<accuDepths.length-1; z++){
					keySetsComputationDepth[accuDepths[z]] = depths[z];
				}
				return function(PIVOT){
					var keySets = [];
                    var data = useOGA ? PIVOT.get() : PIVOT;
					var dataNodeStack = [];
                    var pivotStack = [];
					function constructArgumentsArray(requestedParams, stack, idxStack){
						if (Array.isArray(requestedParams)) {
							var _arguments_ = [];
							requestedParams.forEach(function(parameterInfo){
								var cat   = parameterInfo.category;
								var pos   = parameterInfo.position;
								var type  = typeof pos;
								var level = stack.length;
								var errMsg = 'loop intrusion error: trying to access a loop variable from outside that loop';
								var actions;
								if (type==='number'){
									actions = {
										key   : function(){ if (pos>=level){eval('debugger');throw new Error(errMsg);}   _arguments_.push(stack[pos]);         },
										index : function(){ if (pos>=level){eval('debugger');throw new Error(errMsg);}   _arguments_.push(idxStack[pos]);      },
										all   : function(){ /*todo*/                                                     _arguments_.push(keySets[pos]);       },
										node  : function(){ if (pos>=level+1){eval('debugger');throw new Error(errMsg);} _arguments_.push(dataNodeStack[pos]); }
									};
								} else {
									if (pos==='all'){
										actions = {
											key   : function(){ _arguments_.push(stack);         },
											index : function(){ _arguments_.push(idxStack);      },
											all   : function(){ _arguments_.push(keySets);       },
											node  : function(){ _arguments_.push(dataNodeStack); }
										};
									} else {
										debugger; throw new Error('unexpected');
									}
								}
								if (cat in actions){
									actions[cat]();
								} else {
									debugger; throw new Error('unexpected');
								}
							});
							return _arguments_;
						} else {
							if ((typeof requestedParams)==='string'){
								if (stack.length===depth){
									return [pivotStack[stack.length]].concat(stack).concat([idxStack]).concat([keySets]).concat([PIVOT]);
								} else {
									return [stack].concat([idxStack]).concat([keySets]).concat([PIVOT])
								}
							} else {
								eval('debugger'); throw new Error('illegal argument');
							}
						}
					}
					function multiWrap(previousItem, wrappers, stack, idxStack){
						var item;
						for (var j=0; j<wrappers.length; j++){
							var wrapper = wrappers[j];
							var func = wrapper.func;
							var req = wrapper.parameterSemantics;
							var f = req ? func.apply(PIVOT, constructArgumentsArray(req, stack, idxStack)) : func;
							item = f.apply(PIVOT, previousItem);
							previousItem = [item];
						}
						return item;
					}
					function inner(pivot, stack, idxStack){
                        var dataNode = useOGA ? pivot.get() : pivot;
						var level = stack.length;
						// keySets computation step
						var ksDrillDepth = keySetsComputationDepth[level];
						if (ksDrillDepth > 0){
                            var newKeySets = useOGA ? pivot.keySetsUpto(ksDrillDepth) : getKeySetsUpto(dataNode, ksDrillDepth);
							for (var v=0; v<ksDrillDepth; v++){
								keySets[level+v] = newKeySets[v];
							}
						}
						dataNodeStack[level] = dataNode;
                        pivotStack[level] = pivot;
						var leda  = levelData[level]; if (!leda) debugger;
						var wrappers = leda.wrappers; if (!wrappers) debugger; if (!wrappers.length) debugger; // todo: ghost
						var item, previousItem;
						if (level===depth){
							for (var i=0; i<wrappers.length; i++){
								var wrapper = wrappers[i];
								var func = wrapper.func;
								var req = wrapper.parameterSemantics;
								if (i===0){
									item = func.apply(PIVOT, req
										? constructArgumentsArray(req, stack, idxStack)
										: [pivot]
									);
								} else {
									previousItem = [item];
									var f = req ? func.apply(PIVOT, constructArgumentsArray(req, stack, idxStack)) : func;
									item = f.apply(PIVOT, previousItem);
								}
							}
							return item;
						} else {
							var nextLeda = levelData[1+level];
							var keySet = keySets[level];
							var values = [];
							var L = keySet.length, lastIdx = L-1;
							var idx, key, up, down;
							function push(modifier){
								var roundedIdx = modifier.roundingFunc(idx);
								key = modifier.exact ? {prev: keySet[down] || null, next: keySet[up] || null} : keySet[roundedIdx];
								var newStack = stack.concat(key);
								var newIdxStack = idxStack.concat(roundedIdx);
								modifier.functions.forEach(function(mofu){
									var func = mofu.func;
									var req  = mofu.parameterSemantics;
									if (req){
										values.push(func.apply(PIVOT, constructArgumentsArray(req, newStack, newIdxStack)));
									} else {
										values.push(func);
									}
								});
							}
							for (idx=-0.5; idx<L; idx+=0.5){
								up = Math.ceil(idx); down = Math.floor(idx);
								if (up===down){
									// regular item
									if (dataNode!==null){
										key = keySet[idx];
                                        var nextPivot = useOGA ? pivot.getChild(key) : ( (key in dataNode) ? dataNode[key] : null );
										values.push(inner(nextPivot, stack.concat(key), idxStack.concat(idx)));
									}
								} else {
									// custom mod item
									if (idx < 0){
										if (nextLeda.modFirst){ push(nextLeda.modFirst); }              // before-first
									} else {
										if (idx > lastIdx){
											if (nextLeda.modLast){ push(nextLeda.modLast); }            // after-last
										} else {
											if (nextLeda.modSeparator){ push(nextLeda.modSeparator); }  // separator
										}
									}
								}
							}
							item = multiWrap(values, wrappers, stack, idxStack)
							if (leda.andThen){
								leda.andThen.forEach(function(stageObj){
									var kids = [];
									if (stageObj.before){
										stageObj.before.forEach(function(mofu){
											var func = mofu.func;
											var req  = mofu.parameterSemantics;
											if (req){
												kids.push(func.apply(PIVOT, constructArgumentsArray(req, stack, idxStack)));
											} else {
												kids.push(func);
											}
										});
									}
									kids.push(item);
									if (stageObj.after){
										stageObj.after.forEach(function(mofu){
											var func = mofu.func;
											var req  = mofu.parameterSemantics;
											if (req){
												kids.push(func.apply(PIVOT, constructArgumentsArray(req, stack, idxStack)));
											} else {
												kids.push(func);
											}
										});
									}
									item = multiWrap(kids, stageObj.wrappers, stack, idxStack);
								});
							}
							return item;
						}
					}
					return inner(PIVOT, [], []);
				};    // function(data)
			};    // 'main' function
		};    // function(argumentsCatalogue)
	}     // mapMaker

    function __wrappedString__(sacredBuffer, isTemplate, lib, separator){
		function localGhost(){
			var g = ghost(lib);
			return g.apply(g, arguments);
		}
		function stringBufferWithSeparator(sep){
			return wrappedString([], true, lib).separator(sep);
		}
		function compress(buff){
			var str = buff.join(separator);
			return (str.length > 0) ? [str] : [];
		}
		function getBuffer(){
			if (isTemplate){
				return compress(sacredBuffer);
			} else {
				return sacredBuffer;
			}
		}
		var result = function(){
			var buffer = getBuffer();
            function addChild(child){
                if (child===null) return;
                if (child===undefined) return;
                if (Array.isArray(child)){
                    addChildren(child);
                } else {
                    var type = typeof child;
                    if  ( (type==='string') || (type==='number') || (type==='boolean') ){
                        buffer.push(String(child));
                    } else {
                        if (type==='function'){
                            if (isWrappedDomTree(child)){
								if (child.is.string()){
									buffer.push(child.getValue());
								} else {
									if (child.is.ghost()){
										var g = child.$();
										if (g.childNodes.length===0){
											buffer.push('');
										} else {
											for (var i=0; i<g.childNodes.length; i++){
												var kid = g.childNodes[i];
												if (kid instanceof Text){
													buffer.push(kid.textContent);
												} else {
													eval('debugger'); throw new Error('only strings allowed in wrappedString');
												}
											}
										}
									} else {
										eval('debugger'); throw new Error('only strings allowed in wrappedString');
									}
								}
                            } else {
								eval('debugger'); throw new Error('only strings allowed in wrappedString');
                            }
                        } else {
                            if (type==='object'){
                                if ( child instanceof Text ){
									buffer.push(child.textContent);
                                }
                            } else {
								eval('debugger'); throw new Error('only strings allowed in wrappedString');
							}
                        }
                    }
                }
            }
            function addChildren(children){
                for (var i=0; i<children.length; i++){
                    addChild(children[i]);
                }
            }
            for (var i=0; i<arguments.length; i++){
                addChild(arguments[i]);
            }
            return isTemplate ? __wrappedString__(compress(buffer), false, lib, separator) : result;
		};
        result.____ = TheLaw({
            proveIdentity: function(arg){
                if (arg===youAreNumberSix) throw new ImNaN_Im_WDT();
            }
        });
        result.typeof = 'WDTstring';
		result.is = function(){ throw new Error('usage: result.is.whatever()'); };
		result.is.string = function(){ return true; };
		result.is.ghost = function(){ return false; };
        result.template = function(){
            if (isTemplate) return result;
            return __wrappedString__(compress(sacredBuffer), true, lib, separator);
        };

		result.getValue = function(){
			return sacredBuffer.join(separator);
		};
		result.$ = function(){
			return document.createTextNode(result.getValue());
		};
		result.F = function(arg){
			return __wrappedString__(compress(sacredBuffer), false, lib, separator)(arg);
		};
        // function __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, useOGA, gappy, full, depths)
        result.M = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, true);
        result.M.full = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, false, true);

        result.M.useOGA = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, true);
        result.M.useOGA.full = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, false, true);
        result.M.full.useOGA = result.M.useOGA.full;

        result.M.depths = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, false, false, depths);
        }
        result.M.depths.useOGA = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, false, false, depths);
        }
        result.M.useOGA.depths = result.M.depths.useOGA;

        result.map = __mapMaker__(result, localGhost, stringBufferWithSeparator, false, true);
        result.map.full = __mapMaker__(result, localGhost, stringBufferWithSeparator, false, false, true);

        result.map.useOGA = __mapMaker__(result, localGhost, stringBufferWithSeparator, true, true);
        result.map.useOGA.full = __mapMaker__(result, localGhost, stringBufferWithSeparator, true, false, true);
        result.map.full.useOGA = result.map.useOGA.full;

        result.map.depths = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __mapMaker__(result, localGhost, stringBufferWithSeparator, false, false, false, depths);
        }
        result.map.depths.useOGA = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __mapMaker__(result, localGhost, stringBufferWithSeparator, true, false, false, depths);
        }
        result.map.useOGA.depths = result.map.depths.useOGA;

		return result;
	}

	function wrappedString(sacredBuffer, isTemplate, lib){
		var returnValue = __wrappedString__(sacredBuffer, isTemplate, lib, '');
		returnValue.separator = function(separator){
			return __wrappedString__(sacredBuffer, isTemplate, lib, separator);
		};
		return returnValue;
	}
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
/*****************************************************************************************************************************/
    function wrapDomTreeWithXXX(domTree, isTemplate, lib){
        return wrapDomTreeGeneral(domTree, isTemplate, true, lib);
    }
    function wrapDomTreeNoXXX(domTree, isTemplate, lib){
        return wrapDomTreeGeneral(domTree, isTemplate, false, lib);
    }
    function wrapDomTreeGeneral(domTree, isTemplate, installXXX, lib){
		function localGhost(){
			var g = ghost(lib);
			return g.apply(g, arguments);
		}
		function stringBufferWithSeparator(sep){
			return wrappedString([], true, lib).separator(sep);
		}
		function cloneWithListeners(tree){
			var returnValue = tree.cloneNode(true);
			// https://stackoverflow.com/questions/4789342/textnode-addeventlistener
			function processNode(source, target){
				if (source.____listeners && Array.isArray(source.____listeners)){
					source.____listeners.forEach(function(entry){
						var eventName = entry.event;
						var handlerName = entry.handler;
						var listener = lib.____listeners[handlerName];
						target.addEventListener.call(target, eventName, listener);
					});
                    target.____listeners = source.____listeners;
				}
				if (source.____data){
					target.____data = source.____data;
				}
				for (var i=0; i<source.childNodes.length; i++){
                    if (source.childNodes[i].nodeType === source.ELEMENT_NODE){
                        processNode(source.childNodes[i], target.childNodes[i]);
                    }
				}
			}
			processNode(tree, returnValue);
			return returnValue;
		}
        function getDomTree(){
            if (isTemplate){
                return cloneWithListeners(domTree);
            } else {
                return domTree;
            }
        }
        var result = function(){
            var retval = getDomTree();
            function addChild(child){
                if (child===null) return;
                if (child===undefined) return;
                if (Array.isArray(child)){
                    addChildren(child);
                } else {
                    var type = typeof child;
                    if  ( (type==='string') || (type==='number') || (type==='boolean') ){
                        retval.appendChild(document.createTextNode(child));
                    } else {
                        if (type==='function'){
                            if (isWrappedDomTree(child)){
								if (child.is.ghost()){
									var g = child.$();
									while (g.firstChild){ retval.appendChild(g.firstChild); }
								} else {
									retval.appendChild(child().$());
								}
                            } else {
                                if (child === catalogueItem){
									retval.appendChild( catalogueItem(null) );
									return;
								}
								eval('debugger');
								throw new Error('unknown special function');
                            }
                        } else {
                            if (type==='object'){
                                if ( (child instanceof Element) || (child instanceof Text) ){
                                    retval.appendChild(child);
                                }
                            } else {
                                if (type==='symbol'){
                                    debugger; throw new Error('SYMBOL: todo');
                                }
                            }
                        }
                    }
                }
            }
            function addChildren(children){
                for (var i=0; i<children.length; i++){
                    addChild(children[i]);
                }
            }
            for (var i=0; i<arguments.length; i++){
                addChild(arguments[i]);
            }
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        }
        result.riffle = function(totalItemCount){
            return function(){
                var numLists = arguments.length;
                var lists = [];
                var positions = [];
                for (var i=0; i<numLists; i++){
                    var list = arguments[i];
                    if (Array.isArray(list)){
                        lists.push(list);
                        positions.push(-1);
                    } else {
                        debugger; throw new Error('riffle: all arguments must be arrays');
                    }
                }
                var args = [];
                var which = 0;
                while (true){
                    ++positions[which];
                    if (positions[which]>=lists[which].length) positions[which] = 0;
                    args.push(lists[which][positions[which]]);
                    if (args.length >= totalItemCount) break;
                    ++which;
                    if (which>=numLists) which = 0;
                }
                return result.apply(result, args);
            };
        };
        result.is = function(){ throw new Error('usage: result.is.whatever()'); };
        result.is.string = function(){ return false; };
        result.is.ghost = function(){
			return isGhost(domTree);
		};
        result.each = function(wrapper){
            var t_wrapper = wrapper.template();
            return function(){
                var buffer = [];
                for (var i=0; i<arguments.length; i++){
                    buffer.push(t_wrapper(arguments[i]));
                }
                return result.apply(result, buffer);
            };
        };
        result.gheach = function(){
            var tRes = result.template();
            var buffer = [];
            function addOne(item){
                if (item===null) return;
                if (item===undefined) return;
                if (Array.isArray(item)){
                    addAll(item);
                } else {
                   buffer.push(tRes(item));
                }
            }
            function addAll(items){
                items.forEach(function(item){
                    addOne(item);
                });
            }
            for (var i=0; i<arguments.length; i++){
                addOne(arguments[i]);
            }
            var g = ghost(lib);
            return g.apply(null, buffer);
        };
        result.each.flat = function(wrapper){
            var t_wrapper = wrapper.template();
            return function(){
                var buffer = [];
                function addOne(item){
                    if (item===null) return;
                    if (item===undefined) return;
                    if (Array.isArray(item)){
                        addAll(item);
                    } else {
                       buffer.push(t_wrapper(item));
                    }
                }
                function addAll(items){
                    items.forEach(function(item){
                        addOne(item);
                    });
                }
                for (var i=0; i<arguments.length; i++){
                    addOne(arguments[i]);
                }
                return result.apply(result, buffer);
            };
        };
        function curryConstructor_2(func){
            return function(){
                var args0=[]; for (var a0=0;a0<arguments.length;a0++){args0.push(arguments[a0]);}
                return function(){
                    var args1=[]; for (var a1=0;a1<arguments.length;a1++){args1.push(arguments[a1]);}
                    return func(args0, args1);
                };
            };
        }
        function curryConstructor_3(func){
            return function(){
                var args0=[]; for (var a0=0;a0<arguments.length;a0++){args0.push(arguments[a0]);}
                return function(){
                    var args1=[]; for (var a1=0;a1<arguments.length;a1++){args1.push(arguments[a1]);}
                    return function(){
                        var args2=[]; for (var a2=0;a2<arguments.length;a2++){args2.push(arguments[a2]);}
                        return func(args0, args1, args2);
                    };
                };
            };
        }
        function curryConstructor_4(func){
            return function(){
                var args0=[]; for (var a0=0;a0<arguments.length;a0++){args0.push(arguments[a0]);}
                return function(){
                    var args1=[]; for (var a1=0;a1<arguments.length;a1++){args1.push(arguments[a1]);}
                    return function(){
                        var args2=[]; for (var a2=0;a2<arguments.length;a2++){args2.push(arguments[a2]);}
						return function(){
							var args3=[]; for (var a3=0;a3<arguments.length;a3++){args3.push(arguments[a3]);}
							return func(args0, args1, args2, args3);
						};
                    };
                };
            };
        }
        function drill(object, derrick){
            var subObj = object;
            derrick.forEach(function(name){
                if (!(name in subObj)){
                    eval('debugger'); throw new Error('drill error: not found');
                }
                subObj = subObj[name];
            });
            return subObj;
        }
        result.template = function(withXXX){
            if (withXXX || installXXX){
                if (isTemplate && installXXX) return result;
                return wrapDomTreeWithXXX(domTree, true, lib);
            } else {
                if (isTemplate) return result;
                return wrapDomTreeNoXXX(domTree, true, lib);
            }
        };
        function splitArguments(args, lengths){
            var arr2d = [];
            var u = -1;
            for (var i=0; i<lengths.length; i++){
                var arr = [];
                var len = lengths[i];
                for (var j=0; j<len; j++){
                    ++u;
                    arr.push(args[u]);
                }
                arr2d.push(arr);
            }
            return arr2d;
        }
        function make_lambda_installer(result_arg, stack, flat){
            return function(retval){
                retval.L0 = curryConstructor_2(function(methodNameParts, params){
                    var start = result_arg.template();
                    var nextStack = stack.concat();
                    nextStack.push({
                        type: 0,
                        methodNameParts: methodNameParts,
                        params         : params
                    });
                    var nextFlat = flat.concat(params);
                    var innerRetval = lambda_helper(start, nextStack);
                    injectParams(innerRetval, nextFlat);
                    make_lambda_installer(start, nextStack, nextFlat)(innerRetval);
                    return innerRetval;
                });
                retval.L1 = curryConstructor_3(function(methodNameParts, methodParams, params){
                    var start = result_arg.template();
                    var nextStack = stack.concat();
                    nextStack.push({
                        type: 1,
                        methodNameParts: methodNameParts,
                        methodParams   : methodParams,
                        params         : params
                    });
                    var nextFlat = flat.concat(params);
                    var innerRetval = lambda_helper(start, nextStack);
                    injectParams(innerRetval, nextFlat);
                    make_lambda_installer(start, nextStack, nextFlat)(innerRetval);
                    return innerRetval;
                });
                retval.L1.data = function(name){
                    return retval.L1('d')(name)(name);
                };
            };
        }
        function lambda_helper(start, stack){
            var lengths = stack.map(function(stackEntry){ return stackEntry.params.length; });
            return function(){
                var argsArr2d = splitArguments(arguments, lengths);
                var obj  = start;
                var nextObj = null, intermediate = null;
                for (var i=0; i<stack.length; i++){
                    var stackEntry      = stack[i];
                    var type            = stackEntry.type;
                    var methodNameParts = stackEntry.methodNameParts;
                    var params          = stackEntry.params;
                    var methodParams    = (type===1) ? stackEntry.methodParams : null;
                    var method          = drill(obj, methodNameParts);
                    if (type===0){
                        nextObj = method.apply(obj, argsArr2d[i]);
                    } else {
                        if (type===1){
                            intermediate = method.apply(obj, methodParams);
                            nextObj      = intermediate.apply(intermediate, argsArr2d[i]);
                        } else {
                            debugger; throw new Error('todo/unimplemented');
                        }
                    }
                    obj = nextObj;
                }
                return obj;
            };
        }
        make_lambda_installer(result, [], [])(result);

        function make_bruijn_installer(result_arg, stack){
            return function(retval){
                retval.B0 = curryConstructor_2(function(methodNameParts, argumentIdxList){
                    var start = result_arg.template();
                    var nextStack = stack.concat();
                    nextStack.push({
                        type: 0,
                        methodNameParts: methodNameParts,
                        argumentIdxList: argumentIdxList
                    });
                    var innerRetval = bruijn_helper(start, nextStack);
                    setType_FWDT(innerRetval);
                    make_bruijn_installer(start, nextStack)(innerRetval);
                    return innerRetval;
                });
                retval.B1 = curryConstructor_3(function(methodNameParts, methodParams, argumentIdxList){
                    var start = result_arg.template();
                    var nextStack = stack.concat();
                    nextStack.push({
                        type: 1,
                        methodNameParts: methodNameParts,
                        methodParams   : methodParams,
                        argumentIdxList: argumentIdxList
                    });
                    var innerRetval = bruijn_helper(start, nextStack);
                    setType_FWDT(innerRetval);
                    make_bruijn_installer(start, nextStack)(innerRetval);
                    return innerRetval;
                });
            };
        }
        function bruijn_helper(start, stack){
            return function(){
                var ARGS = arguments;
                var obj  = start;
                var nextObj = null, intermediate = null;
                for (var i=0; i<stack.length; i++){
                    var stackEntry      = stack[i];
                    var type            = stackEntry.type;
                    var methodNameParts = stackEntry.methodNameParts;
                    var argumentIdxList = stackEntry.argumentIdxList;
                    var methodParams    = (type===1) ? stackEntry.methodParams : null;
                    var method          = drill(obj, methodNameParts);
                    var pickedArgs      = argumentIdxList.map(function(argpos){
                        if (Array.isArray(argpos)){
                            return UTIL.drill(ARGS, argpos);
                        }
                        return ARGS[argpos];
                    });
                    if (type===0){
                        nextObj = method.apply(obj, pickedArgs);
                    } else {
                        if (type===1){
                            intermediate = method.apply(obj, methodParams);
                            nextObj      = intermediate.apply(intermediate, pickedArgs);
                        } else {
                            debugger; throw new Error('todo/unimplemented');
                        }
                    }
                    obj = nextObj;
                }
                return obj;
            };
        }
        make_bruijn_installer(result, [])(result);

        result.string = function(){
            var ARGS = [];
            function one(arg){
                if (arg===null) return;
                if (arg===undefined) return;
                if (Array.isArray(arg)) { all(arg); return; }
                var type = typeof arg;
                if ( (type==='string') || (type==='number') || (type==='boolean') ){
                    ARGS.push(arg);
                } else {
                    eval('debugger'); throw new Error('illegal argument');
                }
            }
            function all(array){ array.forEach(one); }
            for (var i=0; i<arguments.length; i++){ one(arguments[i]); }
            return result(ARGS.join(''));
        };
        result.string.join = function(separator){
            return function(){
                var ARGS = [];
                function one(arg){
                    if (arg===null) return;
                    if (arg===undefined) return;
                    if (Array.isArray(arg)) { all(arg); return; }
                    var type = typeof arg;
                    if ( (type==='string') || (type==='number') || (type==='boolean') ){
                        ARGS.push(arg);
                    } else {
                        eval('debugger'); throw new Error('illegal argument');
                    }
                }
                function all(array){ array.forEach(one); }
                for (var i=0; i<arguments.length; i++){ one(arguments[i]); }
                return result(ARGS.join(separator));
            };
        };
        result.string.printf = function(formatString){
            var t_result = result.template();
            return function(){
                return t_result(String.prototype.sprintf.apply(formatString, arguments));
            };
        };

        result.func = function(func){
            return function(arg){
                return result(func(arg));
            };
        };
        result.func.upperc = result.func(function(string){ return (''+string).toUpperCase(); });
        result.func.lowerc = result.func(function(string){ return (''+string).toLowerCase(); });
        result.func.stringify = result.func(JSON.stringify);

        result.L = result.L0();
        result.L.o = function(that){
            if (isFunctionIntoWDT(that)){
                var retval = function(){
                    return result(that.apply(that, arguments));
                };
                if (that.typeof === 'PFWDT'){
                    injectParams(retval, that.getParameterNames());
                } else {
                    setType_FWDT(retval);
                }
                return retval;
            } else {
                eval('debugger'); throw new Error('illegal argument');
            }
        };
        result.L1.data = function(name){
            return result.L1('d')(name)(name);
        };


        function catalogueMaker(){
            return function(){
                var catObj = {};
                function Item(name, content){
                    var type = typeof name;
                    if ( (type==='string') || (type==='number') || (type==='boolean') ){
                        this.name = name;
                    } else {
                        debugger; throw new Error('illegal argument');
                    }
                    this.content = content;
                }
                function addItem(name, content){
                    var item = new Item(name, content);
                    if (item.name in catObj){
                        eval('debugger'); throw new Error('duplicate name');
                    }
                    catObj[item.name] = item.content;
                    return addItem;
                }
                addItem.end = function(catalogueName, initiallySelectedItemName){
                    lib.catalogues = lib.catalogues || {};
                    var itemName_0 = arguments.length >= 2 ? initiallySelectedItemName : null;
                    lib.catalogues[catalogueName] = {
                        itemCreators: catObj,
                        initialItem : itemName_0
                    };
                    var returnValue = result.d('catalogue_target')(catalogueName);
                    Object.keys(catObj).forEach(function(itemName){
                        catObj[itemName] = catObj[itemName].d('catalogue')(catalogueName).d('item_name')(itemName);
                    });
                    return returnValue;
                };
                return addItem.apply(result, arguments);
            };
        }
        result.catalogue = catalogueMaker();

        // function __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, useOGA, gappy, full, depths)
        result.M = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, true);
        result.M.full = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, false, true);

        result.M.useOGA = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, true);
        result.M.useOGA.full = __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, false, true);
        result.M.full.useOGA = result.M.useOGA.full;

        result.M.depths = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, false, false, false, depths);
        }
        result.M.depths.useOGA = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __simpleMapMaker__(result, localGhost, stringBufferWithSeparator, true, false, false, depths);
        }
        result.M.useOGA.depths = result.M.depths.useOGA;

        result.map = __mapMaker__(result, localGhost, stringBufferWithSeparator, false, true);
        result.map.full = __mapMaker__(result, localGhost, stringBufferWithSeparator, false, false, true);

        result.map.useOGA = __mapMaker__(result, localGhost, stringBufferWithSeparator, true, true);
        result.map.useOGA.full = __mapMaker__(result, localGhost, stringBufferWithSeparator, true, false, true);
        result.map.full.useOGA = result.map.useOGA.full;

        result.map.depths = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __mapMaker__(result, localGhost, stringBufferWithSeparator, false, false, false, depths);
        }
        result.map.depths.useOGA = function(){
            var depths = [];
            for (var i=0; i<arguments.length; i++){
                var a = arguments[i];
                if (!Number.isInteger(a)){ eval('debugger'); throw new Error('illegal argument'); }
                depths[i] = a;
            }
            return __mapMaker__(result, localGhost, stringBufferWithSeparator, true, false, false, depths);
        }
        result.map.useOGA.depths = result.map.depths.useOGA;

        result.destructure = __destructureMaker__(result, localGhost, stringBufferWithSeparator);
        /*result.mapString = function(sep){
			var sbws = stringBufferWithSeparator(sep);
			var returnValue = curryConstructor_3(function(args0, args1, args2){
				var _1 = sbws.map.apply(sbws, args0);
				var _2 = _1.apply(_1, args1);
				var _3 = _2.apply(_2, args2);
				return result(_3);
			});
			returnValue.full = curryConstructor_3(function(args0, args1, args2){
				var _1 = sbws.map.full.apply(sbws, args0);
				var _2 = _1.apply(_1, args1);
				var _3 = _2.apply(_2, args2);
				return result(_3);
			});
			returnValue.depths = curryConstructor_4(function(args0, args1, args2, args3){
				var _1 = sbws.map.depths.apply(sbws, args0);
				var _2 = _1.apply(_1, args1);
				var _3 = _2.apply(_2, args2);
				var _4 = _3.apply(_3, args3);
				return result(_4);
			});
			return returnValue;
		};*/

        result.F = function(arg){
            var newTree = cloneWithListeners(domTree);
            return wrapDomTreeNoXXX(newTree, false, lib)(arg);
        };
        setType_FWDT(result.F);
        result.D = function(data){
            // todo: check for forbidden names (key)
            // todo: check if existing name is overwritten
            var retval = getDomTree();
            camelSetter(function(camel, value){
                retval.dataset[camel] = value;
            })(data);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.d = function(name){
            return function(value){
                var o = {};
                o[name] = value;
                return result.D(o);
            };
        };
        result.data = function(name){
        	return function(value){
        		var retval = getDomTree();
        		retval.____data = retval.____data || {};
        		retval.____data[name] = value;
        		return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        	};
        };
        result.DATA = function(data){
        	var retval = getDomTree();
        	retval.____data = data;
        	return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.K = function(){
            var retval = getDomTree();
            var index = 0;
            function addOne(arg){
                if (Array.isArray(arg)){
                    addAll(arg);
                } else {
                    var type = typeof arg;
                    var nameTrunk = 'key' + index;
                    if (type==='number'){
                        if (isNaN(arg)           ) throw new Error('numerical keys must be integer - NaN encountered');
                        if (arg < 0              ) throw new Error('numerical keys must not be negative');
                        if (arg===Infinity       ) throw new Error('numerical keys must be integer - Infinity encountered');
                        if (arg!==Math.round(arg)) throw new Error('numerical keys must be integer');
                        retval.dataset[nameTrunk + 'i'] = arg;
                    } else {
                        retval.dataset[nameTrunk] = arg;
                    }
                    index++;
                }
            }
            function addAll(arr){
                arr.forEach(addOne);
            }
            for (var i=0; i<arguments.length; i++){
                addOne(arguments[i]);
            }
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.removeKeys = function(){
            var retval = getDomTree();
            function rem(node){
                var index = 0;
                while (true){
                    var trunk = 'key' + index;
                    var trunk_i = trunk + 'i';
                    var found = (trunk in node.dataset) || (trunk_i in node.dataset);
                    if (!found) return node;
                    delete node.dataset[trunk];
                    delete node.dataset[trunk_i];
                    ++index;
                }
            }
            function removeRec(node){
                for (var i=0; i<node.childNodes.length; i++){
                    var z = node.childNodes[i];
                    if (z.nodeType===z.ELEMENT_NODE){
                        removeRec(z);
                    }
                }
                rem(node);
            }
            removeRec(retval);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        function createListener(handlerName){
        	var handlerNameParts = handlerName.split('.');
        	return function(evt){
	            var handler = UTIL.drill(lib, handlerNameParts);
	            if (!handler){
	                console.error(handlerName);
	                debugger; throw new Error('handler not found in library');
	            }
                handler.call(lib.instance || lib.council, evt, this, lib, keyOfDomElt(this), lib.fn.getAncestorData(this));
            } // evt, elt, lib, key, ancestorData
        }
        result.E = function(eventName, handlerName){
            if (lib===null){ debugger; throw new Error('library not found'); }
            var retval = getDomTree();
            lib.____listeners = lib.____listeners || {};
            var known = handlerName in lib.____listeners;
            if (!known){
            	lib.____listeners[handlerName] = createListener(handlerName);
            }
            var listener = lib.____listeners[handlerName];
            retval.addEventListener.call(retval, eventName, listener);
            retval.____listeners = retval.____listeners || [];
            var listenerData = {event: eventName, handler: handlerName};
            if (arguments.length >= 3){
                var xtra = arguments[2];
                if (xtra){
                    var type = typeof xtra;
                    if (type === 'boolean'){
                        listenerData.triggerOnCreate = true;
                    } else {
                        debugger;
                        throw new Error('todo / unimplemented');
                    }
                }
            }
            retval.____listeners.push(listenerData);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        /*result.EEE = function(){
        	var retval = getDomTree();
        	retval.addEventListener('click', testHandler);
            return result;
        };*/
        result.E.simple = function(){
            var retval = getDomTree();
            retval.addEventListener.apply(retval, arguments);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.C = function(){
            var retval = getDomTree();
            function addOne(thing){
                if (Array.isArray(thing)){
                    addAll(thing);
                    return;
                }
                var type = typeof thing;
                if (type==='string'){
                    var parts = thing.split(' ');
                    for (var p=0; p<parts.length; p++){
                        var part = parts[p];
                        if (part.length>0){
                            retval.classList.add(part);
                        }
                    }
                } else {
                    if (type==='number'){
                        retval.classList.add(thing);
                    } else {
                        debugger; throw new Error('illegal argument');
                    }
                }
            }
            function addAll(array){
                for (var i=0; i<array.length; i++){
                    addOne(array[i]);
                }
            }
            for (var i=0; i<arguments.length; i++){
                addOne(arguments[i]);
            }
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.p = function(propertyName){
            return function(propertyValue){
                var retval = getDomTree();
                retval[propertyName] = propertyValue;
                return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
            };
        };
        result.a = function(attName){
            return function(attValue){
                var retval = getDomTree();
                if (attName==='d'){
                    if (isNaN(parseFloat(attValue.trim().slice(1)))){
                        debugger;
                    }
                }
                if (attName==='transform'){
                    if (attValue.slice(0,9)==='translate'){
                        if (isNaN(parseFloat(attValue.slice(10)))){
                            debugger;
                        }
                    }
                }
                retval.setAttribute(attName, attValue);
                return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
            };
        };
        result.A = function(attributes){
            var retval = getDomTree();
            dashSetter(function(dashyName, value){
                retval.setAttribute(dashyName, value);
            })(attributes);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };
        result.a.fiat = function(attName){
            return function(attValue){
                var obj = {};
                obj[attName] = attValue;
                return result.A({fiat: obj});
            }
        };
        result.A.fiat = function(attributes){
            return result.A({fiat: attributes});
        };
        result.s = function(styleName){
            return function(styleValue){
                var retval = getDomTree();
                retval.style[styleName] = styleValue;
                return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
            };
        };
        result.S = function(styles){
            var retval = getDomTree();
            camelSetter(function(camel, value){
                retval.style[camel] = value;
            })(styles);
            return isTemplate ? wrapDomTreeNoXXX(retval, false, lib) : result;
        };


if (!isTemplate){
    result.toggler = function(){
        lib.togglers = lib.togglers || {};
        var togglerNode = lib.togglers;
        function addAll(array){
            array.forEach(addOne);
        }
        function addOne(arg){
            if (Array.isArray(arg)){
                addAll(arg);
                return;
            }
            var type = typeof arg;
            if (type !== 'string'){ debugger; throw new Error('string expected'); }
            togglerNode[arg] = togglerNode[arg] || {};
            togglerNode = togglerNode[arg];
        }
        for (var i=0; i<arguments.length; i++){
            addOne(arguments[i]);
        }
        var is_inited = false;
        var parent, myKey, placeholder;
        function init(){
            parent = domTree.parentNode;
            myKey = keyOfDomElt(domTree);
            placeholder = document.createComment(myKey.join(','));
            is_inited = true;
        }
        function show(){
            if (!is_inited) init();
            if (domTree.parentNode !== parent){
                parent.replaceChild(domTree, placeholder);
            }
            togglerNode.isvisible = isvisible;
        }
        function hide(){
            if (!is_inited) init();
            if (placeholder.parentNode !== parent){
                parent.replaceChild(placeholder, domTree);
            }
            togglerNode.isvisible = isvisible;
        }
        function toggle(value){
            if (value) show(); else hide();
        }
        function isvisible(){
            return ( domTree.parentNode === parent );
        }
        togglerNode.show = show;
        togglerNode.hide = hide;
        togglerNode.toggle = toggle;
        return result;
    };
}


        result.if0 = function(bool){
            if (bool){
                return function(methodName){
                    return function(){
                        return result[methodName].apply(result, arguments);
                    };
                };
            } else {
                return function(methodName){
                    return function(){
                        return result;
                    };
                };
            }
        };
        result.if1 = function(bool){
            if (bool){
                return function(methodName){
                    return function(){
                        var args = []; for (var i=0; i<arguments.length; i++) args.push(arguments[i]);
                        return function(){
                            var f = result[methodName].apply(result, args);
                            return f.apply(f, arguments);
                        };
                    };
                };
            } else {
                return function(methodName){
                    return function(){
                        return function(){
                            return result;
                        };
                    };
                };
            }
        };
        result.codeQuote = function(cases){
            var returnValue = function(arg){
                var type = typeof arg;
                var code;
                if (type==='function'){
                    code = escodegen.generate(esprima.parse(arg.toString()));
                } else {
                    if (type==='string'){
                        code = arg;
                    } else {
                        debugger; throw new Error('illegal argument');
                    }
                }
                var ast = esprima.parse(code, {range: true});
                var todo = [];
                function INFO(node){
                    if (node && (typeof node==='object')){
                        return node.type;
                    }
                    return 'NULL'
                }
                esprima_traverse(ast, function(node, parentOfNode){
                    //console.log(INFO(node), INFO(parentOfNode));
                    for (var i=0; i<cases.length; i++){
                        var _case_ = cases[i];
                        var test = _case_.condition;
                        if (test(node, parentOfNode)){
                            todo.push({
                                caseIdx : i,
                                from : node.range[0],
                                to   : node.range[1]
                            });
                            return;
                        }
                    }
                });
                var start = 0;
                var args = [];
                for (var j=0; j<todo.length;j++){
                    var item = todo[j];
                    args.push(code.slice(start, item.from));
                    args.push(cases[item.caseIdx].wrapper.template()(code.slice(item.from, item.to)));
                    start = item.to;
                }
                args.push(code.slice(start));
                return result(args);
            };
            return returnValue;
        };
        result.coloredCode = function(colorSpec){
            var wrapper, WRAP;
            if (domTree.namespaceURI===namespacesCatalogue.SVG){
                WRAP = wrapDomTreeNoXXX(document.createElementNS(namespacesCatalogue.SVG, 'tspan'), true, lib);
                wrapper = function(color){ return WRAP.a('fill')(color); };
            } else {
                WRAP = wrapDomTreeNoXXX(document.createElement('span'), true, lib);
                wrapper = function(color){ return WRAP.s('color')(color); };
            }
            var returnValue = function(arg){
                var type = typeof arg;
                var code;
                if (type==='function'){
                    code = escodegen.generate(esprima.parse(arg.toString()));
                } else {
                    if (type==='string'){
                        code = arg;
                    } else {
                        debugger; throw new Error('illegal argument');
                    }
                }
                var ast = esprima.parse(code, {range: true});
                var todo = [];
                if (colorSpec){
                    esprima_TRAVERSE(ast, function(node, stack, keyStack){
                        var ty = node.type;
                        if (ty in colorSpec){
                            var color = colorSpec[ty](node, stack, keyStack);
                            todo.push({
                                color: color,
                                from : node.range[0],
                                to   : node.range[1]
                            });
                        }
                    });
                } else {
                    esprima_TRAVERSE(ast, function(node, stack, keyStack){
                        /*console.log(keyStack);
                        console.log(stack.concat([node]).map(function(entry){
                            if (Array.isArray(entry)) return "ARRAY";
                            return entry.type;
                        }));*/
                        if (node.type==='Identifier'){
                            todo.push({
                                color: generateColor(keyStack.length),
                                from : node.range[0],
                                to   : node.range[1]
                            });
                        }
                    });
                }
                var start = 0;
                var args = [];
                for (var j=0; j<todo.length;j++){
                    var item = todo[j];
                    args.push(code.slice(start, item.from));
                    args.push(wrapper(item.color)(code.slice(item.from, item.to)));
                    start = item.to;
                }
                args.push(code.slice(start));
                return result(args);

            };
            return returnValue;
        };
        if (!domTree) debugger;
        if (domTree.namespaceURI===namespacesCatalogue.SVG){
            result.translate = function(x,y){
                if (isNaN(x)) debugger;
                if (isNaN(y)) debugger;
                return this.a('transform')(['translate(', x, ' ', y, ')'].join(''));
            };
            result.rotDeg = function(angle){
                if (isNaN(angle)) debugger;
                return this.a('transform')('rotate(' +angle+ ')');
            };
            result.rotRad = function(angle){
                if (isNaN(angle)) debugger;
                var angleDeg = angle * 180 / Math.PI;
                return this.a('transform')('rotate(' +angleDeg+ ')');
            };
            result.scale = function(){
                var x, y;
                if (arguments.length===1){
                    x = arguments[0];
                    if (isNaN(x)) debugger;
                    return this.a('transform')(['scale(', x, ')'].join(''));
                }
                if (arguments.length===2){
                    x = arguments[0];
                    y = arguments[1];
                    if (isNaN(x)) debugger;
                    if (isNaN(y)) debugger;
                    return this.a('transform')(['scale(', x, ' ', y, ')'].join(''));
                }
                throw new Error('wrong number of arguments');
            };
            if (domTree.tagName==='path'){
                result.line = function(arrayOfPoints){
                     return result.a('d')('M'+arrayOfPoints.join('L'));
                };
                result.lineZ = function(arrayOfPoints){
                     return result.a('d')('M'+arrayOfPoints.join('L') + 'Z');
                };

                result.xy = function(){
                    var _x, _y;
                    var THIS = this;
                    var retval = function(){
                        var x = _x, y = _y;
                        if (x.length !== y.length){
                            debugger; throw new Error('unequal lengths');
                        }
                        var pts = UTIL.range(x.length).map(function(i){
                            return [x[i], y[i]];
                        });
                        return THIS.line(pts).apply(null, arguments);
                    };
                    retval.x = function(x){ _x = x; return retval; };
                    retval.y = function(y){ _y = y; return retval; };
                    return retval;
                };


result.dxy = function(){
    function totals(steps){
        var result = {};
        var wildCount = 0;
        for (var c=0; c<steps.length; c++){
            var entry = steps[c];
            var varName = entry.toLowerCase();
            var omit = (varName==='.');
            var wildcard = (varName==='*');
            if (omit){
                // do nothing
            } else {
                if (wildcard){
                    ++wildCount;
                } else {
                    if (!(varName in result)){ result[varName] = 0; }
                    var delta = (varName===entry) ? 1 : -1;
                    result[varName] += delta;
                }
            }
        }
        var hasWild = (wildCount!==0);
        var balanced = true;
        var varNames = Object.keys(result);
        (function(){
            for (var v=0; v<varNames.length; v++){
                if (result[varNames[v]]!==0){
                    balanced = false; return;
                }
            }
        })();
        var OK = (hasWild !== balanced);
        return {
            OK       : OK,
            balanced : balanced,
            wildCount: wildCount,
            totals   : result
        };
    }
    var THIS = this;
    var closePath = false;
    var allVars = {};
    var x = [], y = [];
    function storeVars(args){
        for (var i=0; i<args.length; i++){
            var arg = args[i];
            Object.keys(arg).forEach(function(key){
                var val = arg[key];
                allVars[key] = val;
            });
        }
	}
	storeVars(arguments);
    function next(key, wildValue){
        if (key in allVars) return allVars[key];
        if (key==='.') return 0;
        if (arguments.length >= 2){
            if (key==='*') return wildValue;
        }
        var loki = key.toLowerCase();
        if (loki in allVars) return -allVars[loki];
        debugger; throw new Error('not found');
    }
    var wild = {};
    function getPoints(){
        if ( (arguments.length>0) && arguments[0] && ((typeof arguments[0])==='object') ){
            if (!isNaN(wild.x)) { arguments[0].x = wild.x; }
            if (!isNaN(wild.y)) { arguments[0].y = wild.y; }
        }
        return  UTIL.range(x.length).map(function(i){ return [x[i], y[i]]; });
    }
    var retval = function(){
        var pts = getPoints();
        return THIS[closePath ? 'lineZ' : 'line'](pts).apply(null, arguments);
    };
    retval.vars = function(){
		storeVars(arguments);
        return retval;
    };
    function make_xy(X_or_Y, symbol){
        return function(start, steps){
            var checkup = totals(steps);
            if (!checkup.OK){
                //console.warn(checkup);
                //debugger; throw new Error(checkup.balanced ? 'wildcards only allowed if imbalanced' : 'imbalanced - wildcard required');
            }
            var wildCount = checkup.wildCount;
            var counts = checkup.totals;
            var wildValue = NaN;
            if (wildCount){
                wildValue = -Object.keys(counts).reduce(function(bequest, item){ return bequest + counts[item] * allVars[item] }, 0)/wildCount;
            }
            wild[symbol] = wildValue;
            var current, delta;
            current = 0;
            delta = next(start);
            current += delta;
            X_or_Y.push(current);
            for (var c=0; c<steps.length; c++){
                delta = next(steps[c], wildValue);
                current += delta;
                X_or_Y.push(current);
            }
            return retval;
        };
    }
    retval.x = make_xy(x, 'x');
    retval.y = make_xy(y, 'y');
    retval.z = function(){ closePath = true; return retval; }
    retval.getPoints = getPoints;
    return retval;
};

result.xy_vars = function(){
    var THIS = this;
    var _vars, xStr, yStr, xShift, yShift, closePath;

    function generate_points(_xStr_, _yStr_, _xShift_, _yShift_, _closePath_){
        var x, y;
        ASSERT.object(_vars);
        if ((typeof _xStr_)==='string'){
            UTIL.range(_xStr_.length).forEach(function(i){ if (!(_xStr_.charAt(i) in _vars)){ debugger; throw new Error('variable not found ' + _xStr_.charAt(i)); } });
            x = UTIL.range(_xStr_.length).map(function(i){ return _vars[_xStr_.charAt(i)]; });
            if ((typeof _yStr_)==='string'){
                if (_xStr_.length !== _yStr_.length){
                    debugger; throw new Error('unequal lengths encountered');
                }
                UTIL.range(_yStr_.length).forEach(function(i){ if (!(_yStr_.charAt(i) in _vars)){ debugger; throw new Error('variable not found ' + _yStr_.charAt(i)); } });
                y = UTIL.range(_yStr_.length).map(function(i){ return _vars[_yStr_.charAt(i)]; });
            } else {
                if ((typeof _yShift_)==='number'){
                    var ysh = _yShift_ % _xStr_.length;
                    y = x.slice(ysh).concat(x.slice(0,ysh));
                } else {
                    debugger; throw new Error("missing input");
                }
            }
        } else {
            if ((typeof _yStr_)==='string'){
                UTIL.range(_yStr_.length).forEach(function(i){ if (!(_yStr_.charAt(i) in _vars)){ debugger; throw new Error('variable not found ' + _yStr_.charAt(i)); } });
                y = UTIL.range(_yStr_.length).map(function(i){ return _vars[_yStr_.charAt(i)]; });
                if ((typeof _xShift_)==='number'){
                    var xsh = _xShift_ % _yStr_.length;
                    x = y.slice(xsh).concat(y.slice(0,xsh));
                } else {
                    debugger; throw new Error("missing input");
                }
            } else {
                debugger; throw new Error("missing input");
            }

        }
        if (closePath){
            x.push(x[0]); y.push(y[0]);
        }
        var pts = UTIL.range(x.length).map(function(i){
            return [x[i], y[i]];
        });
        return pts;
    }

    var retval = function(){
        var pts = generate_points(xStr, yStr, xShift, yShift, closePath);
        return THIS.line(pts).apply(null, arguments);
    };
    retval.vars = function(vars){
        ASSERT.object(vars);
        var v = Object.keys(vars);
        for (var i=0; i<v.length; i++){
            if (v[i].length !== 1){
                debugger; throw new Error("only variable names of string length 1 allowed");
            }
        }
        _vars = vars;
        return retval;
    };
    retval.subtract = function(){
        var minus_xStr, minus_yStr, minus_xShift, minus_yShift, minus_closePath;
        var innerRetval = function(){
            if (false) console.log(_vars);
            if (false) console.log(retval);
            if (false) console.log(THIS);
            var outer = generate_points(xStr, yStr, xShift, yShift, closePath);
            var inner = generate_points(minus_xStr, minus_yStr, minus_xShift, minus_yShift, minus_closePath);
            var d = 'M' + outer.join('L') + 'M' + inner.reverse().join('L');
            return result.A('d', d).apply(null, arguments);
        };
        innerRetval.x = function(x){ minus_xStr = ASSERT.string(x); return innerRetval; };
        innerRetval.y = function(y){ minus_yStr = ASSERT.string(y); return innerRetval; };
        innerRetval.xShift = function(xs){ minus_xShift = ASSERT.integer(xs);  return innerRetval; };
        innerRetval.yShift = function(ys){ minus_yShift = ASSERT.integer(ys);  return innerRetval; };
        innerRetval.Z = function(){ minus_closePath = true; return innerRetval; };
        return innerRetval;
    };
    retval.x = function(x){ xStr = ASSERT.string(x);  return retval; };
    retval.y = function(y){ yStr = ASSERT.string(y);  return retval; };
    retval.xShift = function(xs){ xShift = ASSERT.integer(xs);  return retval; };
    retval.yShift = function(ys){ yShift = ASSERT.integer(ys);  return retval; };
    retval.Z = function(){ closePath = true; return retval; };
    return retval;
};






            }  // (domTree.tagName==='path')
            result.getTranslate = function(){
                function asNumber(arg){
                    var re = +arg;
                    if (isNaN(re)){ debugger; return 0; }
                    return re;
                }
                var dt = getDomTree();
                if (dt.hasAttribute('transform')){
                    var att = dt.getAttribute('transform');
                    if (att.slice(0,10)!=='translate(') return [0, 0];
                    if (att.slice(-1)!==')') return [0, 0];
                    var trnslArgs = att.slice(10,-1);
                    var parts = trnslArgs.split(trnslArgs.indexOf(',')>0 ? ',' : /\s+/);
                    if (parts.length===1) return [asNumber(parts[0]), 0];
                    if (parts.length===2) return [asNumber(parts[0]), asNumber(parts[1])];
                    debugger; return [0, 0];
                } else {
                    return [0, 0];
                }
            }
            result.getScale  = function(){
                function asNumber(arg){
                    var re = +arg;
                    if (isNaN(re)){ debugger; return 1; }
                    return re;
                }
                var dt = getDomTree();
                if (dt.hasAttribute('transform')){
                    var att = dt.getAttribute('transform');
                    if (att.slice(0,6)!=='scale(') return [1, 1];
                    if (att.slice(-1)!==')') return [1, 1];
                    var trnslArgs = att.slice(6,-1);
                    var parts = trnslArgs.split(trnslArgs.indexOf(',')>0 ? ',' : /\s+/);
                    if (parts.length===1) { var s = asNumber(parts[0]); return [s,s]; }
                    if (parts.length===2) return [asNumber(parts[0]), asNumber(parts[1])];
                    debugger; return [1, 1];
                } else {
                    return [1, 1];
                }
            }
        }  // (domTree.namespaceURI===namespacesCatalogue.SVG)
        result.toAST = function(discardText, discardAllWithSpace){
            return fiat.js.fiat(function(Identifier, CallExpression, Literal, MemberExpression){
                function convert(domNode){
                    if (domNode instanceof Element){
                        var tagName = domNode.tagName;
                        var kids = domNode.childNodes;
                        var callee = Identifier(tagName);
                        var atts = domNode.attributes;
                        //console.log(callee);
                        if (atts.length>0){
                            for (var a=0; a<atts.length; a++){
                                var nodeName = atts[a].nodeName;
                                var nodeValue = atts[a].nodeValue;
                                if (discardAllWithSpace){
                                    nodeValue = nodeValue.replace(/\s/g,'');
                                }
                                //console.log(nodeName, nodeValue);
                                callee = CallExpression(
                                    CallExpression(
                                        MemberExpression(callee, Identifier('a')),
                                        [Literal(nodeName)]
                                    ),
                                    [Literal(nodeValue)]
                                );
                                //console.log(callee);
                            }
                        }
                        if (kids.length>0){
                            var args = [];
                            for (var i=0; i<kids.length; i++){
                                var child = kids[i];
                                var cc = convert(child);
                                if (cc!==null){
                                    args.push(cc);
                                }
                            }
                            return CallExpression(callee, args);
                        } else {
                            return callee;
                        }
                    } else {
                        if (domNode instanceof Text){
                            if (discardText){
                                return null;
                            } else {
                                return Literal(domNode.textContent);
                            }
                        }
                    }
                }
                return convert(domTree);
            });
        };
        result.toJS = function(discardText, discardAllWithSpace){
            return escodegen.generate(result.toAST(discardText, discardAllWithSpace));
        };

        if (installXXX){
            result.XXX = {};
            result.XXX.setTextContent = function(textContent){
                var retval = getDomTree();
                retval.textContent = textContent;
                return isTemplate ? wrapDomTreeWithXXX(retval, false, lib) : result;
            };
            result.XXX.drain = function(){
                var retval = getDomTree();
                while (retval.lastChild){ retval.removeChild(retval.lastChild); }
                return isTemplate ? wrapDomTreeWithXXX(retval, false, lib) : result;
            };
        }

        result.____ = TheLaw({
            proveIdentity: function(arg){
                if (arg===youAreNumberSix) throw new ImNaN_Im_WDT();
            }
        });
        result.typeof = 'WDT';

        if (!isTemplate){
            result.$ = function(){
                var tree = getDomTree();
                return tree;
            };
        }
        result.$refill = function(into){
            return UTIL.dom.refill(into, result.$());
        };
        result.$append = function(into){
            return UTIL.dom.append(into, result.$());
        };
        result.$replace = function(tobeReplaced){
            var replaceBy = result.$();
            UTIL.dom.replace(tobeReplaced, replaceBy);
            return replaceBy;
        };
        result.$unify = function(alterEgo){
            var ego = result.$();
            if (ego.tagName === alterEgo.tagName){
                UTIL.dom.drain(alterEgo);
                while (ego.firstChild){
                    alterEgo.appendChild(ego.firstChild);
                }
                // todo: copy attributes ego -> alterEgo (and styles)
                return ego;
            } else {
                debugger; throw new Error('trying to unify incompatible elements');
            }
        };
        /******************************************************************************************************/
        function gatherNodes(domRoot){
            var nodePathList = [];
            function traverse_0(node){
                var keyArray = keyOfDomElt(node);
                if (keyArray){
                    if (keyArray.length>0) {
                        nodePathList.push({
                            key : keyArray,
                            node: node
                        });
                    }
                }
                for (var i=0; i<node.children.length; i++){
                    var child = node.children[i];
                    traverse_0(child);
                }
            }
            traverse_0(domRoot);
            if (nodePathList.length===0) return null;
            var keyTreeRoot = { numerical: true };
            var nodesParent = {};
            var keyTreeNode;
            for (var pathIdx=0; pathIdx<nodePathList.length; pathIdx++){
                var path    = nodePathList[pathIdx].key;
                var node    = nodePathList[pathIdx].node;
                keyTreeNode = keyTreeRoot;
                for (var idx=0; idx<path.length; idx++){
                    var key = path[idx];
                    keyTreeNode.children = keyTreeNode.children || {};
                    if (!(key in keyTreeNode.children)){
                        keyTreeNode.children[key] = {
                            numerical: true
                        };
                    }
                    if ((typeof key)!=='number'){
                        keyTreeNode.numerical = false;
                    }
                    keyTreeNode = keyTreeNode.children[key];
                }
                keyTreeNode.node = node;
            }
            function traverseKeyTree(node, outNodeParent, name){
                if ('children' in node){
                    if (node.numerical){
                        outNodeParent[name] = [];
                    } else {
                        outNodeParent[name] = {};
                    }
                    Object.keys(node.children).forEach(function(childKey){
                        traverseKeyTree(node.children[childKey], outNodeParent[name], childKey);
                    });
                    if ('node' in node){
                        debugger; throw new Error('illegal - a node container cannot be a node at the same time.');
                    }
                } else {
                    if ('node' in node){
                        outNodeParent[name] = node.node;
                    } else {
                        debugger; throw new Error('very very very unexpected');
                    }
                }
            }
            traverseKeyTree(keyTreeRoot, nodesParent, 'nodes');
            return nodesParent.nodes;
        }
        function gatherCatalogues(domRoot){
            var catalogueTargets = {};
            var catalogueItems = {};
            function traverseDom(node){
                if (isCatalogueItem(node)){
                    var catalogueName = getCatalogueName(node);
                    if (catalogueName in catalogueItems){
                        eval('debugger'); throw new Error('multiple instances of catalogue item')
                    }
                    catalogueItems[catalogueName] = node;
                }
                if ( node.dataset && ('catalogue_target' in node.dataset) ) {
                    catalogueTargets[node.dataset.catalogue_target] = node;
                }
                for (var i=0; i<node.children.length; i++){
                    var child = node.children[i];
                    traverseDom(child);
                }
            }
            traverseDom(domRoot);
            var catalogues = {};
            Object.keys(lib.catalogues).forEach(function(catName){
                var cat = lib.catalogues[catName];
                var kat = cat.itemCreators;
                catalogues[catName] = {
                    target: catalogueTargets[catName],
                    items : {},
                    selected : catalogueItems[catName] || null
                };
                Object.keys(kat).forEach(function(itemName){
                    catalogues[catName].items[itemName] = kat[itemName].$();
                });
                catalogues[catName].placeholder = catalogues[catName].selected || catalogueItem(catName);
            });
            return catalogues;
        }
        /******************************************************************************************************/
        function install_movie_methods(heir){
            function Movie(set, lowPosition, highPosition){
                this.set = set;
                this.lowPosition = lowPosition;
                this.highPosition = highPosition;
                this.app = heir;
            }
            Movie.prototype.intervalLength = function(){
                return this.highPosition - this.lowPosition;
            };
            Movie.prototype.setLow = function(){
                this.set(this.lowPosition);
            };
            Movie.prototype.setHigh = function(){
                this.set(this.highPosition);
            };
            Movie.prototype.setWRT = function(timePos, sceneItem){
                this.set(this.lowPosition + this.intervalLength() * timePos / sceneItem.duration);
            };
            Movie.prototype.createScreening = function(options){
                var timePosition, position, duration, forwards;
                var theMovie     = this;
                var callbackId   = undefined;
                var startTime    = undefined;
                var previousPosition = undefined;
                var lowP         = theMovie.lowPosition;
                var highP        = theMovie.highPosition;
                var movieIntervalLength = theMovie.intervalLength();
                var reuse_old_dom = !!options.reuse_old_dom;
                timePosition = 0;
                position     = lowP;
                forwards     = true;
                if ((typeof options.duration)!=='number') throw new Error('missing option: duration');
                duration     = options.duration;
                var newDuration = null;
                var onFinish = ((typeof options.onFinish)==='function') ? options.onFinish : function(){};
                var onUpdate = ((typeof options.onUpdate)==='function') ? options.onUpdate : function(){};
                function screening(){ return screening; }
                function RAF(){
                    callbackId = requestAnimationFrame(updateMovie);
                }
                function CAF(){
                    if (callbackId !== undefined){
                        cancelAnimationFrame(callbackId);
                        startTime = undefined;
                        callbackId = undefined;
                    }
                }
                function calculateTimePosition(){
                    return duration/movieIntervalLength * ( forwards ? position - lowP : highP - position );
                }
                function TP(){ timePosition = calculateTimePosition(); }
                function calculatePosition(){
                    var k = movieIntervalLength/duration;
                    return forwards ? lowP + timePosition*k : highP - timePosition*k;
                }
                function movieSetContent(){
                    theMovie.set(position, reuse_old_dom, previousPosition);
                    previousPosition = position;
                }
                function updateMovie(now){
                    if (startTime===undefined){
                        TP(); startTime = now - timePosition;
                    } else {
                        timePosition = now - startTime;
                        if (newDuration !== null){
                            var durationChangeFactor = newDuration.value / duration;
                            timePosition *= durationChangeFactor;
                            startTime = now - timePosition;
                            duration = newDuration.value;
                            newDuration = null;
                        }
                        position = calculatePosition();
                    }
                    movieSetContent();
                    onUpdate(false);
                    var shouldRequest = forwards ? (position < highP) : (lowP < position);
                    if (shouldRequest){
                        RAF();
                    } else {
                        callbackId = undefined;
                        screening.toggleDirection();
                        timePosition = 0;
                        onFinish();
                    }
                }
                screening.isForwards = function(){ return forwards; };
                screening.isPlaying  = function(){ return (callbackId !== undefined); };
                screening.getPosition = function(){ return position; };
                screening.getTimePosition = function(){ return forwards ? timePosition : duration - timePosition; };
                screening.getStartTime = function(){ return startTime; };
                screening.getDuration = function(){ return duration; };
                screening.getCallbackId = function(){ return callbackId; };
                screening.toggleDirection = function(){
                    forwards = !forwards;
                    startTime = undefined;
                    timePosition = duration - timePosition;
                };
                screening.togglePlay = function(){
                    if (screening.isPlaying()){
                        CAF();
                    } else {
                        RAF();
                    }
                }
                screening.setPosition = function(newPosition){
                    position = newPosition;
                    startTime = undefined;
                    movieSetContent();
                    TP();
                    onUpdate(true);
                };
                screening.setTimePosition = function(newTimePosition){
                    timePosition = newTimePosition;
                    position = calculatePosition();
                    startTime = undefined;
                    movieSetContent();
                    onUpdate(false);
                };
                screening.setDuration = function(value){
                    if (screening.isPlaying()){
                        newDuration = { value : value };
                    } else {
                        var durationChangeFactor = value / duration;
                        timePosition *= durationChangeFactor;
                        duration = value;
                    }
                    onUpdate(true);
                };
                return screening;
            }
            function WrappedScrollItem(items, headingForNext, itemHeight){
                this.items = items;
                this.headingForNext = headingForNext;
                this.itemHeight = itemHeight;
            }
            function installScrollerGroupAndGetHeight(item){
                var retval = item.getBoundingClientRect().height;
                var g = fiat.dom('g', 'SVG').A.fiat({role: 'scrollerGroup'}).$();
                while (item.firstChild){
                    g.appendChild(item.firstChild);
                }
                item.appendChild(g);
                return retval;
            }
            function WSIsingleton(item){
                var str_headingForNext = item.getAttribute('fiat-scroll-heading') || 0;
                var height = installScrollerGroupAndGetHeight(item);
                return new WrappedScrollItem([item], +str_headingForNext, height);
            }
            function WSIgroup(items, groupName, container){
                var str_headingForNext = container.getAttribute('fiat-scroll-heading') || 0;
                var heights = items.map(installScrollerGroupAndGetHeight);
                var height = Math.max.apply(null, heights);
                return new WrappedScrollItem(items, +str_headingForNext, height);
            }
            function WSI(item){
                if (!item){ debugger; throw new Error('illegal argument'); }
                if ((typeof item)!=='object'){ debugger; throw new Error('illegal argument'); }
                if (item instanceof Element){
                    if ((item.tagName==='svg') && (item.namespaceURI===namespacesCatalogue.SVG)){
                        return WSIsingleton(item);
                    } else {
                        var scrollGroupName = item.getAttribute('fiat-scroll-container_for');
                        if (scrollGroupName){
                            var groupItems = [];
                            UTIL.dom.traverse(item, function(node){
                                var forGroup = node.getAttribute('fiat-scroll-item_for');
                                if (forGroup===scrollGroupName){
                                    groupItems.push(node);
                                }
                            })
                            return WSIgroup(groupItems, scrollGroupName, item);
                        } else {
                            debugger; throw new Error('illegal argument');
                        }
                    }
                } else {
                    debugger; throw new Error('illegal argument');
                }
            }
            heir.fn.movie = function(set){
                var argCount = arguments.length;
                if (argCount===0) throw new Error('missing argument/s');
                if (argCount===1){ return new Movie(set, 0, 1); }
                if (argCount===2){ return new Movie(set, 0, arguments[1]); }
                if (argCount===3){ return new Movie(set, arguments[1], arguments[2]); }
                throw new Error('too many arguments');
            };
            heir.fn.isMovie = function(thing){
                return thing && ((typeof thing)==='object') && (thing instanceof Movie);
            }
            heir.fn.movie.turnKnob = function(node, method, start, finish, options){
                var target = (function(){
                    if (isWrappedDomTree(node)) return node;
                    if (!(node instanceof Element)) throw new Error('illegal argument');
                    return wrapDomTreeNoXXX(node, false, lib);
                })();
                if (!options){ options = {}; }
                var wrapper, ow;
                if (ow=options.wrapper){
                    if (Array.isArray(ow)){
                        wrapper = function(x){
                            var returnValue = x;
                            ow.forEach(function(w){
                                if ((typeof w)!=='function'){ debugger; throw new Error('illegal argument: array of functions expected'); }
                                returnValue = w(returnValue);
                            });
                            return returnValue;
                        }
                    } else {
                        if ((typeof ow)==='function'){
                            wrapper = ow;
                        } else {
                            debugger; throw new Error('illegal argument: function or array of functions expected');
                        }
                    }
                } else {
                    wrapper = function(x){ return x; };
                }
                var difference = finish - start;
                function movie_set(position){
                    var p = (position<=0) ? 0 : (position>=1) ? 1 : position;
                    var value = start + p * difference;
                    if (options.roundToInt){
                        value = Math.round(value);
                    }
                    target[method](wrapper(value));
                }
                return new Movie(movie_set, 0, 1);
            };
            heir.fn.movie.attributeChange = function(node, attName, start, finish){
                var att = function(attVal){
                    var Att={};
                    Att[attName]=attVal;
                    return Att;
                }
                return heir.fn.movie.turnKnob(node, 'A', start, finish, {wrapper: att});
            };
            heir.fn.movie.greyLevelFade = function(node, attributeName, startValue, endValue){
                var target = (function(){
                    if (isWrappedDomTree(node)) return node;
                    if (!(node instanceof Element)) throw new Error('illegal argument');
                    return wrapDomTreeNoXXX(node, false, lib);
                })();
                var difference = endValue - startValue;
                function movie_set(position){
                    var p = (position<=0) ? 0 : (position>=1) ? 1 : position;
                    var value = startValue + p * difference;
                    var value_i = Math.floor(255.999999999*value);
                    var color = 'rgb(' + [value_i,value_i,value_i].join(',') + ')';
                    target.a(attributeName)(color);
                }
                return new Movie(movie_set, 0, 1);
            };
            heir.fn.movie.translate = function(node, x0, y0, x1, y1){
                var target = (function(){
                    if (isWrappedDomTree(node)) return node;
                    if (!(node instanceof Element)) throw new Error('illegal argument');
                    return wrapDomTreeNoXXX(node, false, lib);
                })();
                var dx = x1 - x0;
                var dy = y1 - y0;
                function movie_set(position){
                    var p = (position<=0) ? 0 : (position>=1) ? 1 : position;
                    var x = x0 + p * dx;
                    var y = y0 + p * dy;
                    target.translate(x, y);
                }
                return new Movie(movie_set, 0, 1);
            };
            heir.fn.movie.translate.alongLine = function(node, line, options){
                if (!options) options = {};
                var dx = 0;
                var dy = 0;
                if ((typeof options.dx)==='number'){ dx = options.dx; }
                if ((typeof options.dy)==='number'){ dy = options.dy; }
                var x1 = +line.getAttribute('x1') + dx;
                var y1 = +line.getAttribute('y1') + dy;
                var x2 = +line.getAttribute('x2') + dx;
                var y2 = +line.getAttribute('y2') + dy;
                return heir.fn.movie.translate(node, x1,y1, x2,y2);
            };
            heir.fn.movie.translate.alongLineRev = function(node, line, options){
                if (!options) options = {};
                var dx = 0;
                var dy = 0;
                if ((typeof options.dx)==='number'){ dx = options.dx; }
                if ((typeof options.dy)==='number'){ dy = options.dy; }
                var x1 = +line.getAttribute('x1') + dx;
                var y1 = +line.getAttribute('y1') + dy;
                var x2 = +line.getAttribute('x2') + dx;
                var y2 = +line.getAttribute('y2') + dy;
                return heir.fn.movie.translate(node, x2,y2, x1,y1);
            };
            heir.fn.movie.action = function(lowAction, highAction){
                function movie_set(position){
                    if (position >= 0){
                        highAction();
                    } else {
                        lowAction();
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.action.appendChild = function(parent, child){
                if (!child) debugger;
                function movie_set(position){
                    if (position >= 0){
                        if (!child.parentNode) { parent.appendChild(child); }
                    } else {
                        if ( child.parentNode) { parent.removeChild(child); }
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.action.addChild = function(child){
                var keyArray = keyOfDomElt(child) || [];
                var refugee = document.createComment(keyArray.join('.'));
                var parent = (arguments.length >= 2) ? arguments[1] : child.parentNode;
                if (!parent){ debugger; throw new Error('parent not found'); }
                if (!(parent instanceof Element)){ debugger; throw new Error('illegal parent'); }
                if (child.parentNode !== parent){
                    parent.appendChild(child);
                }
                function movie_set(position){
                    if (position >= 0){
                        if (refugee.parentNode) { parent.replaceChild(child, refugee); }
                    } else {
                        if (  child.parentNode) { parent.replaceChild(refugee, child); }
                    }
                }
                return new Movie(movie_set, -1, 10000);
            };
            heir.fn.movie.action.removeChild = function(child){
                var keyArray = keyOfDomElt(child) || [];
                var refugee = document.createComment(keyArray.join('.'));
                var parent = (arguments.length >= 2) ? arguments[1] : child.parentNode;
                if (!parent){ debugger; throw new Error('parent not found'); }
                if (!(parent instanceof Element)){ debugger; throw new Error('illegal parent'); }
                if (child.parentNode !== parent){
                    parent.appendChild(child);
                }
                function movie_set(position){
                    if (position >= 0){
                        if (  child.parentNode) { parent.replaceChild(refugee, child); }
                    } else {
                        if (refugee.parentNode) { parent.replaceChild(child, refugee); }
                    }
                }
                return new Movie(movie_set, -1, 10000);
            };
            heir.fn.movie.action.insertBefore = function(parent, child, before){
                function movie_set(position){
                    if (position >= 0){
                        parent.insertBefore(child, before);
                    } else {
                        if (child.parentNode===parent) parent.removeChild(child);
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.action.replaceLastChild = function(parent, childBefore, childAfter){
                function movie_set(position){
                    var currentLast = parent.lastChild;
                    if (position >= 0){
                        if (currentLast!==childAfter) {
                            parent.replaceChild(childAfter, currentLast);
                        }
                    } else {
                        if (currentLast!==childBefore) {
                            parent.replaceChild(childBefore, currentLast);
                        }
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.action.show = function(node){
                function movie_set(position){
                    if (position >= 0){
                        node.style.display = '';
                    } else {
                        node.style.display = 'none'
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.action.hide = function(node){
                function movie_set(position){
                    if (position >= 0){
                        node.style.display = 'none';
                    } else {
                        node.style.display = ''
                    }
                }
                return new Movie(movie_set, -1, 1);
            };
            heir.fn.movie.parallel2 = function(movie1, movie2){
                function movie_set(position){
                    movie1.set(position);
                    movie2.set(position);
                }
                return new Movie(movie_set, 0, 1);
            }
            heir.fn.movie.sequence = function(scenes, handlers, options){
                if (!Array.isArray(scenes)){ debugger; throw new Error('illegal argument: array expected'); }
                if (!handlers) { handlers = {}; }
                if ((typeof handlers)!=='object'){ debugger; throw new Error('illegal argument'); }
                var resultMovie    = null;
                var flatScenes     = null;
                var containerKeys  = null;
                var lastContainer  = null;
                var nodes          = null;
                var root           = null;
                var sceneNodes     = null;
                var superContainer = null;
                if ((typeof handlers.afterFinish)!=='function'){
                    handlers.afterFinish = function(){
                        if ( lastContainer ){
                            containerKeys.forEach(function(cKey){
                                if (!(cKey in sceneNodes)){
                                    debugger; throw new Error('scene not found');
                                }
                                if (cKey===lastContainer){
                                    if (!sceneNodes[cKey].parentNode){
                                        superContainer.appendChild(sceneNodes[cKey]);
                                    }
                                } else {
                                    if (sceneNodes[cKey].parentNode){
                                        sceneNodes[cKey].parentNode.removeChild(sceneNodes[cKey]);
                                    }
                                }
                            });
                        }
                        flatScenes.forEach(function(m){
                            if (m.movie) m.movie.setHigh();
                        });
                        // todo: call post ?!
                    };
                }
                if (!options){ options = {}; }
                var BS = UTIL.binarySearch(scenes);
                flatScenes = BS.flatItems;
                var containers = {};
                scenes.forEach(function(scene){
                    if ((typeof scene.container)==='string'){
                        containers[scene.container] = null;
                        lastContainer = scene.container;
                    }
                });
                containerKeys = Object.keys(containers);
                nodes      = heir.nodes;
                root       = heir.root;
                sceneNodes = options.containerPath
                    ? UTIL.drill(nodes, options.containerPath)
                    : nodes;
                superContainer = options.superContainer || root;
                function movie_set(position){
                    var app   = this.app;
                    var found = BS.GET(position);
                    if (found===null){
                        handlers.afterFinish();
                    } else {
                        var localPosition = found.localPosition;
                        var item = found.item;
                        var prev = found.previous;
                        var foll = found.following;
                        // if (string) item.container is given, make it so that nodes[item.container] is the only
                        // node among nodes[<.. scene containers ..>] which has a parent
                        // and that parent shall be superContainer
                        if ( lastContainer && ((typeof item.container)==='string') ){
                            containerKeys.forEach(function(cKey){
                                if (!(cKey in sceneNodes)){
                                    debugger; throw new Error('scene not found');
                                }
                                if (cKey===item.container){
                                    if (!sceneNodes[cKey].parentNode){
                                        superContainer.appendChild(sceneNodes[cKey]);
                                    }
                                } else {
                                    if (sceneNodes[cKey].parentNode){
                                        sceneNodes[cKey].parentNode.removeChild(sceneNodes[cKey]);
                                    }
                                }
                            });
                        }
                        if ( ((typeof item.handler)==='string') && ((typeof handlers[item.handler])==='function') ){
                            handlers[item.handler](localPosition, item, prev, foll, app);
                        } else {
                            if ((typeof options.pre)==='function'){
                                options.pre(position, found, BS, app);
                            }
                            prev.forEach(function(m){
                                if (m.movie) m.movie.setHigh();
                            });
                            foll.forEach(function(m){
                                if (m.movie) m.movie.setLow();
                            });
                            if (item.movie){
                                item.movie.setWRT(localPosition, item);
                            }
                            if ((typeof options.post)==='function'){
                                options.post(position, found, BS, app);
                            }
                        }
                    }
                }
                resultMovie = new Movie(movie_set, 0, BS.duration);
                return resultMovie;
            };
            heir.fn.movie.scroller = function(scrollItems, start, windowHeight0){
                var callback = (arguments.length >= 4)
                    ? arguments[3]
                    : function(){};
                var cutoffAtEnd = (arguments.length >= 5)
                    ? arguments[4]
                    : 0;
                if (!Array.isArray(scrollItems)){ debugger; throw new Error('illegal argument'); }
                var wrappedScrollItems = scrollItems.map(WSI);
                //console.log(wrappedScrollItems);
                //wrappedScrollItems.forEach(function(wsi){ console.log(wsi.items[0]); });
                var landmarks = (function(){
                    var itemCount = scrollItems.length;
                    var itemCountX = 1 + itemCount;
                    var itemActive = UTIL.range(itemCountX).map(function(){
                        return UTIL.constantArray(false, itemCountX);
                    });
                    var headingForNext = [0].concat(wrappedScrollItems.map(function(z){return z.headingForNext;}));
                    //console.log(headingForNext);
                    itemActive.forEach(function(array, idx){
                        var runLength = headingForNext[idx];
                        for (var j=idx; j<=idx+runLength; j++){
                            array[j] = true;
                        }
                    });
                    //console.log(itemActive);
                    var start0 = start - windowHeight0;
                    var itemHeights = [windowHeight0].concat(wrappedScrollItems.map(function(z){
                        return z.itemHeight;
                    }));
                    //console.log(itemHeights);
                    var windowHeights = itemHeights.map(function(height, idx){
                        var result =  windowHeight0;
                        for (var prev=0; prev<idx; prev++){
                            if (itemActive[prev][idx]){
                                result -= itemHeights[prev];
                            }
                        }
                        for (var follow=idx+1; follow<itemCount; follow++){
                            if (itemActive[idx][follow]){
                                result += itemHeights[follow];
                            }
                        }
                        return result;
                    });
                    //console.log(windowHeights);
                    var itemStart = start0;
                    var _landmarks = [];
                    for (var i=0; i<itemHeights.length; i++){
                        var itemHeight = itemHeights[i];
                        var windowHeight = windowHeights[i];
                        if (itemHeight <= windowHeight){
                            var fullyVizStart = itemStart + itemHeight;
                            var fullyVizEnd = itemStart + windowHeight;
                            var itemEnd = fullyVizEnd + itemHeight;
                            var mark = {
                                oversized : false,
                                start   : itemStart,
                                hiStart : fullyVizStart,
                                hiEnd   : fullyVizEnd,
                                end     : itemEnd
                            };
                            _landmarks.push(mark);
                        } else {
                            var coverStart = itemStart + windowHeight;
                            var coverEnd   = itemStart + itemHeight;
                            var itemEnd    = coverEnd  + windowHeight;
                            var mark = {
                                oversized : true,
                                start   : itemStart,
                                hiStart : coverStart,
                                hiEnd   : coverEnd,
                                end     : itemEnd
                            };
                            _landmarks.push(mark);
                        }
                        itemStart += itemHeight;
                    }
                    return _landmarks;
                })();
                var endAll = landmarks[landmarks.length-1].end;
                //console.log(landmarks);

                function movie_set(position){
                    var p = position;
                    var L0 = landmarks[0];
                    var L1 = landmarks[1];
                    var start0 = L0.start, hiStart0 = L0.hiStart, hiEnd0 = L0.hiEnd, end0 = L0.end;
                    var start1 = L1.start, hiStart1 = L1.hiStart, hiEnd1 = L1.hiEnd, end1 = L1.end;
                    var high0 = hiStart0 - start0, high1 = hiStart1 - start1;
                    var height0 = p<=start0 ? 0 : p<=hiStart0 ? p-start0 : p<=hiEnd0 ? high0 : p<=end0 ? end0-p : 0;
                    var height1 = p<=start1 ? 0 : p<=hiStart1 ? p-start1 : p<=hiEnd1 ? high1 : p<=end1 ? end1-p : 0;
                    var firstHeight = height0 + height1;
                    wrappedScrollItems[0].items.forEach(function(firstItem){
                        fiat.dom.wrap(firstItem).a('height')(firstHeight);
                        var $grp = firstItem.firstChild, grp = fiat.dom.wrap($grp);
                        if ($grp.getAttribute('fiat-role') !== 'scrollerGroup'){
                            debugger;
                            // h = installScrollerGroupAndGetHeight(firstItem)
                        }
                        grp.translate(0, p<=hiEnd0 ? windowHeight0 : p<=end0 ? hiEnd0+windowHeight0-p : p<=hiEnd1 ? 0 : hiEnd1-p);
                    });
                    for (var i=1; i<wrappedScrollItems.length; i++){
                        var itemData = landmarks[i+1];
                        var oversized = itemData.oversized;
                        var start = itemData.start, hiStart = itemData.hiStart, hiEnd = itemData.hiEnd, end = itemData.end;
                        var high = hiStart - start;
                        wrappedScrollItems[i].items.forEach(function(scrollItem){
                            fiat.dom.wrap(scrollItem).a('height')(p<=start ? 0 : p<=hiStart ? p-start : p<=hiEnd ? high : p<=end ? end-p : 0);
                            var grp = fiat.dom.wrap(scrollItem.firstChild);
                            if (grp.$().getAttribute('fiat-role') !== 'scrollerGroup'){
                                debugger;
                            }
                            if (oversized){
                                grp.translate(0, p<=hiStart ? 0 : hiStart-p);
                            } else {
                                grp.translate(0, p<=hiEnd ? 0 : hiEnd-p);
                            }
                        });
                    }
                    callback(p);
                }
                return new Movie(movie_set, 0, endAll - cutoffAtEnd);
            };
            heir.fn.movie.textWriter = function(domNode, setterFuncArg){
                if ((typeof domNode)!=='object'){ debugger; throw new Error('dom node expected'); }
                if (!(domNode instanceof Element)){ debugger; throw new Error('dom node expected'); }
                var setterFunc, theParent;
                var previousContent = domNode;
                if (setterFuncArg){
                    var type = typeof setterFuncArg;
                    if (type==='function'){
                        setterFunc = setterFuncArg;
                    } else {
                        if (type==='object'){
                            if (setterFuncArg instanceof Element){
                                setterFunc = function(content){
                                    fiat.util.dom.refill(setterFuncArg, content);
                                };
                            } else {
                                debugger; throw new Error('illegal argument');
                            }
                        } else {
                            debugger; throw new Error('illegal argument');
                        }
                    }
                } else {
                    theParent = domNode.parentElement;
                    if (theParent===null){
                        debugger; throw new Error('parent not found');
                    }
                    setterFunc = function defaultSetterFunction(content){
                        theParent.replaceChild(content, previousContent);
                        previousContent = content;
                    };
                }

                var template = domNode.cloneNode(true);
                var txtArray = [];
                var lengths = [];
                function prepare(target){
                    var type = target.nodeType;
                    if (type===target.TEXT_NODE){
                        var txt = target.textContent;
                        target.textContent = '';
                        target.____textContent = txt;
                        txtArray.push(txt);
                        lengths.push(txt.length);
                    } else {
                        if (type===target.ELEMENT_NODE){
                            for (var i=0; i<target.childNodes.length; i++){
                                prepare(target.childNodes[i]);
                            }
                            if (target.dataset && target.dataset.pause){
                                txtArray.push('');
                                lengths.push(+target.dataset.pause);
                                var emptyTxt = document.createTextNode('');
                                emptyTxt.____textContent = '';
                                target.appendChild(emptyTxt);
                            }
                        } else {
                            
                        }
                    }
                }
                prepare(template);
                var mileStones  = UTIL.range(1+txtArray.length).map(function(pivot){
                    var counter = 0;
                    var clone   = template.cloneNode(true);
                    var current = null;
                    var stack   = [];
                    var pathToPivotText = undefined;
                    function process(node, copy){
                        var type = node.nodeType;
                        if (type===node.TEXT_NODE){
                            copy.textContent = (counter < pivot) ? node.____textContent : '';
                            if (counter===pivot){
                                current = copy;
                                pathToPivotText = stack.concat();
                            }
                            counter++;
                        } else {
                            if (type===node.ELEMENT_NODE){
                                for (var i=0; i<node.childNodes.length; i++){
                                    stack.push(i);
                                    process(node.childNodes[i], copy.childNodes[i]);
                                    stack.pop();
                                }
                            } else {
                            }
                        }
                    }
                    process(template, clone);
                    return {
                        tree: clone,
                        pivotText: current,
                        pathToPivotText: pathToPivotText
                    };
                });
                var lookup = [];
                var total = 0;
                var totals = [total];
                lengths.forEach(function(length, idx){
                    total += length;
                    totals.push(total);
                    for(var i=0; i<length; i++){
                        lookup.push(idx);
                    }
                });
                lookup.push(lengths.length);
                function getWithReuse(p){
                    var position = p <= 0 ? 0 : p >= total ? total : Math.round(p);
                    var pivot = lookup[position];
                    var z = mileStones[pivot];
                    if (pivot < txtArray.length){
                        var innerPosition = position - totals[pivot];
                        z.pivotText.textContent = txtArray[pivot].slice(0, innerPosition);
                    }
                    return z.tree;
                }
                function getWithoutReuse(p){
                    var position = p <= 0 ? 0 : p >= total ? total : Math.round(p);
                    var pivot = lookup[position];
                    var z = mileStones[pivot];
                    var tree = z.tree.cloneNode(true);
                    if (pivot < txtArray.length){
                        var innerPosition = position - totals[pivot];
                        var node = tree;
                        var path = z.pathToPivotText;
                        for (var q=0; q<path.length; q++){
                            var idx = path[q];
                            node = node.childNodes[idx];
                        }
                        node.textContent = txtArray[pivot].slice(0, innerPosition);
                    }
                    return tree;
                }
                function textWriter_set(p, reuse_old_dom, previousPosition){
                    var content = reuse_old_dom ? getWithReuse(p) : getWithoutReuse(p);
                    setterFunc.call(this, content);
                }
                return new Movie(textWriter_set, 0, total);
            };
        }
        /******************************************************************************************************/
        result.gatherNodes = function(){
            if (!lib){ debugger; throw new Error('unexpected'); }
            if ((typeof lib)!=='object'){ debugger; throw new Error('unexpected'); }
            if (!lib.instance){ debugger; throw new Error('instance not found'); }
            var currentRoot = result.$();
            var currentNodes = gatherNodes(currentRoot);
            function eat(hunter, prey){
                Object.keys(prey).forEach(function(key){
                    var leaf = (key in hunter) ? (prey[key] instanceof Element) : true;
                    if (leaf){
                        hunter[key] = prey[key];
                    } else {
                        eat(hunter[key], prey[key]);
                    }
                });
            }
            try {
                eat(lib.instance.nodes, currentNodes);
            }
            catch(e){
                debugger;
            }
            return currentRoot;
        };

        result.addRoot = function(name){
            if (!name){
                debugger; throw new Error('missing argument');
            }
            return result.set_or_add_root(true, name);
        };
        if (!isTemplate){
            result.setRoot = function(){
                return result.set_or_add_root(false);
            };
        }
        /*************************************************** set_or_add_root *****************************/
        result.set_or_add_root = function(multi_instance){
            if (!lib){ debugger; throw new Error('unexpected'); }
            if ((typeof lib)!=='object'){ debugger; throw new Error('unexpected'); }
            var $name;
            if (multi_instance){
                $name = arguments[1];
                lib.$$name = lib.$$name || [];
                lib.$$name.push($name);
            } else {
                if (lib.instance){
                    debugger; throw new Error('trying to re-set root. root can be set only once.');
                }
                $name = this.____name;
                lib.$name = $name;
            }
            
            var theTree = getDomTree();
            var heir = {
                root       : theTree,
                nodes      : gatherNodes(theTree),
                catalogues : (lib.catalogues && (typeof lib.catalogues==='object')) ? gatherCatalogues(theTree) : null,
                library    : lib
            };

            function make_append_or_refill_func(theHeir, doDrain){
                return function(target){
                    if (target){
                        var type = typeof target;
                        if (type==='object'){
                            if (!(target instanceof Element)){
                                debugger; throw new Error('illegal argument');
                            }
                        } else {
                            if (type==='string'){
                                if ( (target in document) && (typeof document[target]==='object') && document[target] instanceof Element){
                                    target = document[target];
                                } else {
                                    debugger; throw new Error('illegal argument');
                                }
                            } else {
                                debugger; throw new Error('illegal argument');
                            }
                        }
                    } else {
                        target = document.body;
                    }
                    if (doDrain){
                        UTIL.dom.drain(target);
                    }
                    if (isGhost(theHeir.root)){
                        var newRoot = [];
                        var adoptee;
                        while (adoptee = theHeir.root.firstChild){
                            target.appendChild(adoptee);
                            newRoot.push(adoptee);
                        }
                        theHeir.root = newRoot;
                    } else {
                        if (Array.isArray(theHeir.root)){
                            theHeir.root.forEach(function(adoptee){
                                target.appendChild(adoptee);
                            });
                        } else {
                            if (theHeir.root instanceof Element){
                                target.appendChild(theHeir.root);
                            } else {
                                debugger; throw new Error('illegal type for root');
                            }
                        }
                    }
                    return theHeir;
                };
            }
            heir.fn = {
                append: make_append_or_refill_func(heir, false),
                refill: make_append_or_refill_func(heir, true ),
                get: function(path){
                    if (!Array.isArray(path)){ debugger; throw new Error('illegal argument'); }
                    var result = heir.nodes;
                    for (var i=0; i<path.length; i++){
                        var key = path[i];
                        if (key in result){
                            result = result[key];
                        } else {
                            return null;
                        }
                    }
                    return result;
                },
                keyParent: function(path){
                    if (!Array.isArray(path)){ debugger; throw new Error('illegal argument'); }
                    return this.get(path.slice(0, -1));
                },
                keySibling: function(path, name){
                    if (!Array.isArray(path)){ debugger; throw new Error('illegal argument'); }
                    return this.keyParent(path)[name];
                },
                setOnlyChild: function(target, child){
                    while (target.lastChild) { target.removeChild(target.lastChild); }
                    if (child){ target.appendChild(child); }
                },
                catalogue: {
                    refresh: function(catalogueName, itemName){
                        var cat = heir.catalogues[catalogueName];
                        var target = cat.target;
                        var oldSelected = cat.selected;
                        var newSelected = (itemName===null) ? cat.placeholder : cat.items[itemName];
                        if (oldSelected===newSelected) return;
                        if (oldSelected){
                            oldSelected.parentElement.replaceChild(newSelected, oldSelected);
                        } else {
                            while (target.lastChild) { target.removeChild(target.lastChild); }
                            target.appendChild(newSelected);
                        }
                        cat.selected = newSelected;
                    }
                },
                cropNodes: function(){
                    function crop(container){
                        Object.keys(container).forEach(function(key){
                            var node = container[key];
                            if (node instanceof Element){
                                if (!document.body.contains(node)){
                                    delete container[key];
                                }
                            } else {
                                crop(node);
                            }
                        });
                    }
                    var cropRoot = (arguments.length>0) ? UTIL.drill(heir.nodes, arguments[0]) : heir.nodes
                    crop(cropRoot);
                }
            };
            install_movie_methods(heir);
            lib.fn = {
                data: function(elt){
                    if (elt instanceof Element){
                        if ( !('____data' in elt) ){ elt.____data = {}; }
                        return elt.____data;
                    } else {
                        debugger; throw new Error('illegal argument');
                    }
                },
                traverse: function(traversionRoot, onEnter, onLeave){
                    var hasEnter = ((typeof onEnter)==='function');
                    var hasLeave = ((typeof onLeave)==='function');
                    function process(node){
                        if (hasEnter){ onEnter(node); }
                        for (var i=0; i<node.children.length; i++){
                            var child = node.children[i];
                            process(child);
                        }
                        if (hasLeave){ onLeave(node); }
                    }
                    process(traversionRoot);
                },
                getAncestorData: function(elt){
                    var d = [], target = elt;
                    while (target){
                        d.push(target.____data || null);
                        target = target.parentElement;
                    }
                    return d;
                }
            };
            if (lib.catalogues){
                Object.keys(lib.catalogues).forEach(function(catName){
                    heir.fn.catalogue.refresh(catName, lib.catalogues[catName].initialItem);
                });
            }
            if (multi_instance){
                lib.council = lib.council || {};
                if ($name in lib.council){
                    debugger; throw new Error('redef');
                } else {
                    lib.council[$name] = heir;
                }
            } else {
                lib.instance = heir;
            }
            lib.fn.traverse(heir.root, function(node){
                // todo: heir.root might be an array (if it ex-ghost)
                if (node.____listeners && Array.isArray(node.____listeners)){
                    node.____listeners.filter(function(listenerData){
                        return listenerData.triggerOnCreate;
                    }).forEach(function(listenerData){
                        var listener = lib.____listeners[listenerData.handler];
                        listener.apply(node, []);
                    });
                }
            });
            if ('$onCreate' in lib){
                var ty$onc = typeof lib.$onCreate;
                if (ty$onc==='function'){
                    lib.$onCreate(heir.root, heir.nodes, heir.catalogues, heir.fn, $name);
                } else {
                    if (ty$onc==='object'){
                        if ($name in lib.$onCreate){
                            lib.$onCreate[$name](lib, heir.root, heir.nodes, heir.catalogues, heir.fn);
                        } else {
                            /************************ console.log($name, 'no $onCreate'); ***********************/
                        }
                    } else {
                        debugger; throw new Error('wrong type for $onCreate');
                    }
                }
            }
            return heir;
        };
        /*************************************************** set_or_add_root END *****************************/
        return result;
    } // wrapDomTreeGeneral

    function dom_nodeFactory(tagName){
        var namespace = null;
        var library   = null;
        if (arguments.length >= 2){
            var namespaceArg = arguments[1];
            if (namespaceArg!==null){
                if (namespaceArg in namespacesCatalogue){
                    namespace = namespacesCatalogue[namespaceArg];
                } else {
                    console.error('namespace');
                    console.error(namespaceArg);
                    console.error('available namespaces');
                    console.error(namespacesCatalogue);
                    debugger; throw new Error('namespace not found in catalogue');
                }
            }
        }
        if (arguments.length >= 3){
            library = arguments[2];
        }
        try{
            var adam = namespace ? document.createElementNS(namespace, tagName) : document.createElement(tagName);
            return wrapDomTreeNoXXX(adam, true, library);
        } catch(e){
            debugger;
        }
    } // dom_nodeFactory

    function wrapDomTreeWithLibrary(library){
        return function(domTree){
            return wrapDomTreeNoXXX(domNodeOf(domTree), false, library);
        }
    }

    function ghost(){
        var library   = null;
        if (arguments.length >= 1){
            library = arguments[0];
        }
        var adam = ghostElement();
        return wrapDomTreeNoXXX(adam, true, library);
	}
	function STRING(){
        var library   = null;
        if (arguments.length >= 1){
            library = arguments[0];
        }
        var isTemplate = true;
        return wrappedString([], isTemplate, library);
	}

    function dom_interpret(item, thisObj){
        var type = typeof item;
        if (type==='function'){
            return dom_interpretFunction.call(this, item, thisObj || null);
        }
        if (type==='object'){
            return dom_interpretObject.call(this, item, thisObj);
        }
        debugger; throw new Error('not implemented yet');
    }
    var namespaceRegex = /^\$NS\$(.*)$/;
    function dom_interpretFunction(item, thisObj, FUNCNAME, DIRECTIVE){
        if (!FUNCNAME ) FUNCNAME  = {};
        if (!DIRECTIVE) DIRECTIVE = {};
        var ast = esprima.parse('(' + item.toString() + ')');
        var funcExpr = ast.body[0].expression;
        var fty = funcExpr.type;
        var OK = funcExpr.body && (
            (fty==='FunctionExpression') &&  Array.isArray(funcExpr.body.body) ||
            (fty==='ArrowFunctionExpression')
        );
        if (!OK){
            debugger; throw new Error('function expected');
        }
        var directive = null;
        if (fty==='FunctionExpression'){
            var statements = funcExpr.body.body;
            if (statements.length>0){
                var stmt0 = statements[0];
                if ( (stmt0.type==='ExpressionStatement') && stmt0.directive ){
                    directive = stmt0.directive;
                }
            }
        }
        DIRECTIVE.value = directive;
        var funcName = null;
        if ( funcExpr.id && ((typeof funcExpr.id)==='object') && funcExpr.id.name ){
            funcName = funcExpr.id.name;
        }
        FUNCNAME.value = funcName;
        var params = funcExpr.params.map(function(identifier){ return identifier.name; });
        var namespace = null;
        var lastCurry = -1;
        var curry = [];
        var parameterPosition = {};
        var importFromThis = false;
        var myArguments = params.map(function(tagName, idx){
            parameterPosition[tagName] = idx;
            if (tagName.slice(0,5)==='$ARGS'){
                curry.push([]);
                ++lastCurry;
                return tagName;
            }
            if (tagName.charAt(0)==='$') {
                if (tagName==='$ghost'){ return ghost(thisObj); }
                if (tagName==='$string'){ return wrappedString([], true, thisObj); }
                if (tagName==='$stringNL'){ return wrappedString([], true, thisObj).separator('\n'); }
                if (tagName==='$catalogueItem'){ return catalogueItem; }
                if (tagName==='$IMPORT'){ importFromThis = true; return tagName; }
                if (tagName==='$wrap'){
                    return wrapDomTreeWithLibrary(thisObj);
                }
                var nsMatch = tagName.match(namespaceRegex);
                if (nsMatch){ namespace = nsMatch[1]; return tagName; }
                // todo
                return thisObj || null;
            }
            if (importFromThis){
                if (tagName in thisObj){
                    return thisObj[tagName];
                } else {
                    console.error(tagName); console.error(thisObj); eval('debugger'); throw new Error('not found');
                }
            }
            if (lastCurry===-1){
                return dom_nodeFactory(tagName, namespace, thisObj);
            } else {
                curry[lastCurry].push(tagName);
            }
        });
        function curryStep(stack, currentThis){
            var stepIdx = stack.length;
            if (stepIdx > lastCurry){
                for (var s=0; s<stepIdx; s++){
                    var sEntry = stack[s];
                    for (var j=0; j<sEntry.length; j++){
                        var pos = sEntry[j].position;
                        var val = sEntry[j].value;
                        myArguments[pos] = val;
                    }
                }
                var returnValue = item.apply(currentThis || thisObj || null, myArguments);
                /**************** if (!item.name) console.log(item); ******************/
                var tyret = typeof returnValue;
                if (item.name&&returnValue&&(tyret==='function')) {
                    returnValue.____name = item.name;
                }
                return returnValue;
            }
            return function(){
                var c = curry[stepIdx];
                var stackEntry = [];
                for (var i=0; i<c.length; i++){
                    var argName  = c[i];
                    stackEntry.push({
                        position : parameterPosition[argName],
                        value    : arguments[i]
                    });
                }
                return curryStep(stack.concat([stackEntry]), this || thisObj || null);
            };
        }
        return curryStep([], null);
    }
    function dom_interpretArray(item, thisObj){
        var result = thisObj || {};
        var FUNCNAME  = {};
        var DIRECTIVE = {};
        for (var i=0; i<item.length; i++){
            var entry = item[i];
            var tyEntry = typeof entry;
            if (tyEntry==='function'){
                var broker = dom_interpretFunction.call(this, entry, result, FUNCNAME, DIRECTIVE);
                var funcName  = FUNCNAME.value;
                var directive = DIRECTIVE.value;
                if (funcName){
                    result[funcName] = broker;
                } else {
                    if (broker){
                        if ((typeof broker)==='object'){
                            if (directive==='template'){ // .filter(function(key){return key!=='____name'})
                                Object.keys(broker).forEach(function(key){
                                    var ty = typeof broker[key];
                                    if (broker[key]&&((ty==='object')||(ty==='function'))) {
                                        if (typeof broker[key].template==='function'){
                                            result[key] = broker[key].template();
                                        } else {
                                            debugger;
                                        }
                                    } else {
                                        debugger;
                                    }
                                });
                            } else { // .filter(function(key){return key!=='____name'})
                                Object.keys(broker).forEach(function(key){ result[key] = broker[key]; });
                            }
                        } else {
                            debugger; throw new Error('illegal or todo');
                        }
                    }
                }
            } else {
                if (tyEntry==='object'){
                    if (Array.isArray(entry)){
                        var p = entry[0];
                        var subResult = { parent: result };
                        result[p] = subResult;
                        for (var j=1; j<entry.length; j++){
                            var subEntry = entry[j];
                            var tySub = typeof subEntry;
                            if (tySub==='object'){
                                subResult = dom_interpretObject.call(this, subEntry, subResult);
                            } else {
                                if (tySub==='function'){
                                    debugger; throw new Error('todo');
                                } else {
                                    debugger; throw new Error('illegal');
                                }
                            }
                        }
                    } else {
                        result = dom_interpretObject.call(this, entry, result);
                    }
                } else {
                    debugger; throw new Error('illegal or todo');
                }
            }
        }
        return result;
    }
    function dom_interpretObject(item, thisObj){
        if (item===null) return null;
        if (item.constructor===Array){
            return dom_interpretArray.call(this, item, thisObj);
        }
        var THIS = this;
        var result = thisObj || {};
        Object.keys(item).forEach(function(key){
            var rhs = item[key];
            var tyRHS = typeof rhs;
            if (tyRHS==='function'){
                result[key] = dom_interpretFunction.call(THIS, rhs, result);
            } else {
                result[key] = rhs;
            }
        });
        return result;
    }

    root.fiat = {};
    root.fiat.dom = dom_nodeFactory;
    root.fiat.dom.fiat = dom_interpret;
    root.fiat.dom.key = keyOfDomElt;
    root.fiat.dom.hasKey = function(elt, testKey){
        var key = keyOfDomElt(elt);
        if (key===null) return testKey===null;
        if (testKey===null) return key===null;
        if (!Array.isArray(testKey)){ debugger; throw new Error('illegal argument'); }
        if (!Array.isArray(key)){ debugger; throw new Error('very very unexpected'); }
        if (testKey.length!==key.length) return false;
        for (var i=0; i<key.length; i++){
            if (key[i]!==testKey[i]) return false;
        }
        return true;
    };
    root.fiat.dom.hasRole = function(elt, roleName){
        return elt.getAttribute('fiat-role') === roleName;
    };
    root.fiat.dom.hasRole.scrollerGroup = function(elt){
        return elt.getAttribute('fiat-role') === 'scrollerGroup';
    };
    root.fiat.dom.wrap = function(domTree, isTemplate){
        var library = {};
        var wrapped = wrapDomTreeNoXXX(domTree, !!isTemplate, library);
        return wrapped;
    };
    root.fiat.dom.wrapXXX = function(domTree){
        var library = {};
        var wrapped = wrapDomTreeWithXXX(domTree, true, library);
        return wrapped;
    };

    UTIL.range = function range(start, stop, step) {
        // identical with d3.range implementation, copied from Bostock's d3 github page
        start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;
        var i = -1,
            n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
            range = new Array(n);
        while (++i < n) {
            range[i] = start + i * step;
        }
        return range;
    };
    UTIL.constantArray = function(item, repeat){
        if (!Number.isInteger(repeat)){ debugger; throw new Error('illegal argument'); }
        if (repeat<0){ debugger; throw new Error('illegal argument'); }
        var result = new Array(repeat);
        for (var i=0; i<repeat; i++){
            result[i] = item;
        }
        return result;
    };
    UTIL.shiftObject = function shiftObject(arr){
        var result = {};
        var L = arr.length;
        for (var i=0; i<L; i++){
            result[arr[i]] = arr[(i+1)%L];
        }
        return result;
    };
    UTIL.objectMap = function(obj, func){
        var result = {};
        Object.keys(obj).forEach(function(key){
            result[key] = func(obj[key], key);
        });
        return result;
    };
    UTIL.objectMap2 = function(obj, func){
        var result = {};
        Object.keys(obj).forEach(function(key){
            result[key] = {};
            Object.keys(obj[key]).forEach(function(innerKey){
                result[key][innerKey] = func(obj[key][innerKey], innerKey, key);
            });
        });
        return result;
    };
    UTIL.drill = function(object, derrick){
    	if (!Array.isArray(derrick)) throw new Error('illegal argument');
        var subObj = object;
        for (var i=0; i<derrick.length; i++){
        	var type = typeof subObj;
        	if ( (type==='object') || (type==='function') ){
	        	var name = derrick[i];
	        	if (name in subObj){
	        		subObj = subObj[name];
	        	} else {
	        		return null;
	        	}
        	} else {
        		return null;
        	}
        }
        return subObj;
    }

    UTIL.getKeySetsUpto = getKeySetsUpto;
    UTIL.getKeySet = getKeySet;

    UTIL.binarySearch = function(itemsArg){
        if (!Array.isArray(itemsArg)){ debugger; throw new Error('array expected')}
        function _EVENT_(name){
            this.name = name;
        }
        var all = [];
        function addAll(arr){
            arr.forEach(addOne);
        }
        function addOne(item){
            if (!item) return;
            if (Array.isArray(item)){
                addAll(item);
            } else {
                var type = typeof item;
                if (type==='number'){
                    all.push({duration: item});
                } else {
                    if (type==='object'){
                        all.push(item);
                    } else {
                        if (type==='string'){
                            all.push(new _EVENT_(item));
                        } else {
                            debugger; throw new Error('illegal argument');
                        }
                    }
                }
            }
        }
        addAll(itemsArg);
        var items = [];
        var events = {};
        var eventNames = [];
        var eventFromIdx = {};
        all.forEach(function(item, idx){
            item.indexAll = idx;
            if (item instanceof _EVENT_){
                var evtName = item.name;
                if (evtName in events){
                    debugger; throw new Error('event names must be unique');
                }
                events[evtName] = idx;
                eventNames.push(evtName);
                eventFromIdx[idx] = evtName;
            } else {
                items.push(item);
            }
        });
        var durations = items.map(function(item){
            var re = +item.duration;
            if (isNaN(re)){ debugger; throw new Error('invalid duration')}
            if (re<=0){ debugger; throw new Error('invalid duration')}
            if (re===Infinity){ debugger; throw new Error('invalid duration')}
            return re;
        });
        var sums = [0];
        var totalDuration = 0;
        durations.forEach(function(duration, index){
            totalDuration += duration;
            sums.push(totalDuration);
            items[index].index = index;
        });
        function findIndex(position){
            if (isNaN(position)){ debugger; throw new Error('illegal argument'); }
            if (position <= 0) return 0;
            if (position >= totalDuration) return Infinity;
            var lowIdx = 0, highIdx = durations.length;
            while (true){
                var midIdx = Math.floor((lowIdx + highIdx)/2);
                if (position < sums[midIdx]){
                    highIdx = midIdx;
                } else {
                    lowIdx = midIdx;
                }
                if (highIdx - lowIdx <= 1) return lowIdx;
            }
        }
        return {
            flatItems            : items,
            accumulatedDurations : sums,
            duration             : totalDuration,
            getIndex             : findIndex,
            get : function(position){
                var idx = findIndex(position);
                if (idx===Infinity) return null;
                return items[idx];
            },
            getLocalPosition: function(position){
                var idx = findIndex(position);
                if (idx===Infinity) return Infinity;
                return position - sums[idx];
            },
            GET: function(position){
                var idx = findIndex(position);
                if (idx===Infinity) return null;
                var idxAll = items[idx].indexAll;                
                var localPosition = position - sums[idx];
                var inTheFuture = {};
                eventNames.forEach(function(evtName){
                    var evtIdx = events[evtName];
                    inTheFuture[evtName] = ( evtIdx > idxAll );
                });
                return {
                    localPosition : localPosition,
                    item          : items[idx],
                    previous      : items.slice(0, idx),
                    following     : items.slice(idx+1),
                    inTheFuture   : inTheFuture
                };
            }
        };
    };

    UTIL.dom = {};
    UTIL.dom.drain = function drain(node){
		if (!node) debugger;
        while (node.lastChild){
            node.removeChild(node.lastChild);
        }
    };
    function domNodeOf(item){
        if (isWrappedDomTree(item)){
            return item.$();
        }
        if ( (item instanceof Element) || (item instanceof Text) ){
            return item;
        }
        if ( (typeof item)==='string' ){
            return document.createTextNode(item);
        }
        debugger; throw new Error('illegal argument');
    }
    function domNodeOfElement(item){
        if ( item instanceof Element ) { return item; }
        if (isWrappedDomTree(item)){ return item.$(); }
        debugger; throw new Error('illegal argument');
    }
    UTIL.dom.refill = function refill(containerArg, newContents){
        var container = domNodeOf(containerArg);
        UTIL.dom.drain(container);
        function addOne(item){
            if (Array.isArray(item)){
                return allAll(item);
            }
            var _item = domNodeOf(item);
            return container.appendChild(_item);
        }
        function allAll(items){
            return items.map(addOne);
        }
        return addOne(newContents);
    };
    UTIL.dom.append = function append(containerArg, newContents){
        var container = domNodeOf(containerArg);
        function addOne(item){
            if (Array.isArray(item)){
                return allAll(item);
            }
            var _item = domNodeOf(item);
            return container.appendChild(_item);
        }
        function allAll(items){
            return items.map(addOne);
        }
        return addOne(newContents);
    };
    UTIL.dom.replace = function(node, newContents){
        if (node.parentElement===null) debugger;
        return node.parentElement.replaceChild(domNodeOf(newContents), node);
    };
    UTIL.dom.traverse = function(traversionRoot, onEnter, onLeave){
        var hasEnter = ((typeof onEnter)==='function');
        var hasLeave = ((typeof onLeave)==='function');
        function process(node){
            if (hasEnter){ onEnter(node); }
            for (var i=0; i<node.children.length; i++){
                var child = node.children[i];
                process(child);
            }
            if (hasLeave){ onLeave(node); }
        }
        process(traversionRoot);
    };
    UTIL.dom.getTranslateFromTo = function(source, target){
        if ((typeof source.getCTM) !== 'function') { debugger; throw new Error('SVG element expected'); }
        if ((typeof target.getCTM) !== 'function') { debugger; throw new Error('SVG element expected'); }
        var sourceCTM = source.getCTM();
        var targetCTM = target.getCTM();
        var dx = targetCTM.e - sourceCTM.e;
        var dy = targetCTM.f - sourceCTM.f;
        var t = fiat.dom.wrap(source).getTranslate();
        var tx = t[0] + dx;
        var ty = t[1] + dy;
        return [tx, ty];
    };
    UTIL.dom.imgFromSVGnode = function(node){
        function setNS(elt, parentNS){
            var namespace = elt.namespaceURI;
            if (namespace!==parentNS){
                elt.setAttribute('xmlns', namespace);
            }
            for (var i=0; i<elt.childNodes.length; i++){
                setNS(elt.childNodes[i], namespace);
            }
        }
        setNS(node, null);
        var html = node.outerHTML;
        var dataURL = 'data:image/svg+xml,' + window.encodeURIComponent(html);
        var img = new Image();
        img.src = dataURL;
        return img;
    };
    // https://stackoverflow.com/questions/3173048/is-there-an-equivalent-of-canvass-todataurl-method-for-svg/
    // https://stackoverflow.com/questions/62109331/namespace-attributes-not-present-in-outerhtml
    UTIL.dom.imageFromSVGnode = function(node){
        function setNS(elt, parentNS){
            var namespace = elt.namespaceURI;
            if (namespace!==parentNS){
                elt.setAttribute('xmlns', namespace);
            }
            for (var i=0; i<elt.childNodes.length; i++){
                setNS(elt.childNodes[i], namespace);
            }
        }
        setNS(node, null);
        var html = node.outerHTML;
        var dataURL = 'data:image/svg+xml,' + window.encodeURIComponent(html);
        var image = document.createElementNS(namespacesCatalogue.SVG, 'image');
        image.setAttribute('href', dataURL);
        return image;
    };



    function extendOptions1(options, key, value){
        var optionsCopy = {};
        Object.keys(options).forEach(function(k){
            optionsCopy[k] = options[k];
        });
        optionsCopy[key] = value;
        return optionsCopy;
    }
    function extendOptions2(options, key1, value1, key2, value2){
        var optionsCopy = {};
        Object.keys(options).forEach(function(k){
            optionsCopy[k] = options[k];
        });
        optionsCopy[key1] = value1;
        optionsCopy[key2] = value2;
        return optionsCopy;
    }
    function extendOptions3(options, key1, value1, key2, value2, key3, value3){
        var optionsCopy = {};
        Object.keys(options).forEach(function(k){
            optionsCopy[k] = options[k];
        });
        optionsCopy[key1] = value1;
        optionsCopy[key2] = value2;
        optionsCopy[key3] = value3;
        return optionsCopy;
    }

    function Stepwise(steps, modifier){
        // value, time, value, time, value, time, value
        //   0      1     2      3     4      5     6
        if (!modifier){
            modifier = function(value){ return value; };
        }
        this.steps = steps;
        this.modifier = modifier;
    }
    Stepwise.prototype.func = function(pos){
        var steps = this.steps, modifier = this.modifier;
        var stepCount = steps.length;
        for (var i=0; i<stepCount; i+=2){
            var time = (i+1 >= stepCount) ? Infinity : steps[i+1];
            var value = steps[i];
            if (pos<time){
                return modifier(value, pos);
            }
        }
        debugger;
        throw new Error("won't happen");
    };
    function StepFunction(steps, modifier){
        var S = new Stepwise(steps, modifier);
        var _ret =  function(pos){
            return S.func(pos);
        };
        _ret.steps = S.steps;
        _ret.modifier = S.modifier;
        return _ret;
    }
    function TextContentSetter(node, func){
        this.node = node;
        this.func = func;
    }
    TextContentSetter.prototype.update = function(pos){
        var node = this.node, func = this.func;
        // if (node === Scenes.discover.nodes.step[7].keys[0].pivot.main.rhs){ console.log(pos, func(pos)); }
        node.textContent = func(pos);
    };
    function SetTextContent(node, func){
        return new TextContentSetter(node, func);
    }
    SetTextContent.toStepFunction = function(node, steps, modifier){
        var f = StepFunction(steps, modifier);
        return SetTextContent(node, f);
    };
    SetTextContent.toValue = function(node, valueAfter, time){
        var valueBefore = node.textContent;
        if (!(node.firstChild instanceof Text)){
            debugger; throw new Error('text node expected');
        }
        return SetTextContent.toStepFunction(node, [valueBefore, time, valueAfter]);
    };
    SetTextContent.fromValue = function(node, valueBefore, time){
        var valueAfter = node.textContent;
        return SetTextContent.toStepFunction(node, [valueBefore, time, valueAfter]);
    };

    function AttributeSetter(node, attName, func){
        this.node = node;
        this.attName = attName;
        this.func = func;
    }
    AttributeSetter.prototype.update = function(pos){
        var attVal = this.func(pos);
        if (attVal!==null){
            this.node.setAttribute(this.attName, attVal);
        }
        // todo: if this.func(pos) is special symbol (available in fiat.util.movie or fiat.movie), then removeAttribute
    };
    function SetAttribute(node, attName, func){
        return new AttributeSetter(node, attName, func);
    }
    SetAttribute.toStepFunction = function(node, attName, steps, modifier){
        var f = StepFunction(steps, modifier);
        return SetAttribute(node, attName, f);
    };
    SetAttribute.toValue = function(node, attName, valueAfter, time){
        if (!node) debugger;
        if (typeof node.getAttribute!=='function') debugger;
        var valueBefore = node.getAttribute(attName);
        return SetAttribute.toStepFunction(node, attName, [valueBefore, time, valueAfter]);
    };
    SetAttribute.fromValue = function(node, attName, valueBefore, time){
        var valueAfter = node.getAttribute(attName);
        return SetAttribute.toStepFunction(node, attName, [valueBefore, time, valueAfter]);
    };
    SetAttribute.toValue.between = function(node, attName, value, startTime, endTime){
        if (!node) debugger;
        if (typeof node.getAttribute!=='function') debugger;
        var normalValue = node.getAttribute(attName);
        return SetAttribute.toStepFunction(node, attName, [normalValue, startTime, value, endTime, normalValue]);
    };
    SetAttribute.fromValue.between = function(node, attName, value, startTime, endTime){
        if (!node) debugger;
        if (typeof node.getAttribute!=='function') debugger;
        var normalValue = node.getAttribute(attName);
        return SetAttribute.toStepFunction(node, attName, [value, startTime, normalValue, endTime, value]);
    };
    SetAttribute.toValue.between_multi = function(node, attName, value, array_of_fromTo){
        if (!node) debugger;
        if (typeof node.getAttribute!=='function') debugger;
        var normalValue = node.getAttribute(attName);
        var steps = [normalValue];
        array_of_fromTo.forEach(function(fromTo){
            var startTime = fromTo[0];
            var endTime   = fromTo[1];
            steps.push(startTime);
            steps.push(value);
            steps.push(endTime);
            steps.push(normalValue);
        });
        return SetAttribute.toStepFunction(node, attName, steps);
    };
    SetAttribute.fromValue.between_multi = function(node, attName, value, array_of_fromTo){
        if (!node) debugger;
        if (typeof node.getAttribute!=='function') debugger;
        var normalValue = node.getAttribute(attName);
        var steps = [value];
        array_of_fromTo.forEach(function(fromTo){
            var startTime = fromTo[0];
            var endTime   = fromTo[1];
            steps.push(startTime);
            steps.push(normalValue);
            steps.push(endTime);
            steps.push(value);
        });
        return SetAttribute.toStepFunction(node, attName, steps);
    };

    function ClassRemoverAndAdder(node, tobeRemoved, tobeAdded, func){
        this.node        = node;
        this.tobeRemoved = tobeRemoved;
        this.tobeAdded   = tobeAdded;
        this.func        = func;
    }
    ClassRemoverAndAdder.prototype.update = function(pos){
        var node = this.node, tobeRemoved = this.tobeRemoved, tobeAdded = this.tobeAdded, func = this.func;
        function addOne(name){
            if (Array.isArray(name)){ addAll(name); } else { node.classList.add(name); }
        }
        function allAll(arr){ arr.forEach(addOne); }
        function removeOne(name){
            if (Array.isArray(name)){ removeAll(name); } else { node.classList.remove(name); }
        }
        function removeAll(arr){ arr.forEach(removeOne); }
        if (func(pos)){
            removeOne(tobeRemoved);
            addOne(tobeAdded);
        } else {
            removeOne(tobeAdded);
            addOne(tobeRemoved);
        }
    };
    function RemoveAndAddClass(node, tobeRemoved, tobeAdded, func){
        return new ClassRemoverAndAdder(node, tobeRemoved, tobeAdded, func);
    }
    RemoveAndAddClass.At = function(node, tobeRemoved, tobeAdded, pivotTime){
        return RemoveAndAddClass(node, tobeRemoved, tobeAdded, after(pivotTime));
    };
    RemoveAndAddClass.Between = function(node, tobeRemoved, tobeAdded, startTime, endTime){
        return RemoveAndAddClass(node, tobeRemoved, tobeAdded, between(startTime, endTime));
    };
    function AddClass(node, classList, func){
        var tobeRemoved = [];
        var tobeAdded = classList;
        return new ClassRemoverAndAdder(node, tobeRemoved, tobeAdded, func);
    }
    AddClass.After = function(node, classList, pivotTime){
        return AddClass(node, classList, after(pivotTime));
    };
    AddClass.Before = function(node, classList, pivotTime){
        return AddClass(node, classList, before(pivotTime));
    };
    AddClass.Between = function(node, classList, startTime, endTime){
        return AddClass(node, classList, between(startTime, endTime));
    };
    function RemoveClass(node, classList, func){
        var tobeRemoved = classList;
        var tobeAdded = [];
        return new ClassRemoverAndAdder(node, tobeRemoved, tobeAdded, func);
    }
    RemoveClass.After = function(node, classList, pivotTime){
        return RemoveClass(node, classList, after(pivotTime));
    };
    RemoveClass.Before = function(node, classList, pivotTime){
        return RemoveClass(node, classList, before(pivotTime));
    };
    RemoveClass.Between = function(node, classList, startTime, endTime){
        return RemoveClass(node, classList, between(startTime, endTime));
    };


    function AttributeRamperX(node, attName, startValues, endValues, startTime, endTime, prefix, postfix, separator){
        this.node = node;
        this.attName = attName;
        this.startValues = startValues;
        this.endValues = endValues;
        this.startTime = startTime;
        this.endTime = endTime;
        this.prefix = prefix;
        this.postfix = postfix;
        this.separator = separator;
    }
    AttributeRamperX.prototype.update = function(pos){
        var node = this.node, attName = this.attName,
            startValues = this.startValues, endValues = this.endValues,
            startTime = this.startTime, endTime = this.endTime,
            prefix = this.prefix, postfix = this.postfix,
            dTime = endTime - startTime,
            separator = this.separator;
        var factors = UTIL.range(startValues.length).map(function(i){
            return (endValues[i] - startValues[i]) / dTime;
        });
        var values = (function(p){
            if (p<=startTime) return startValues;
            if (p>=endTime) return endValues;
            return UTIL.range(startValues.length).map(function(i){
                return startValues[i] + factors[i] * (p-startTime);
            });
        })(pos);
        var v = values.join(separator);
        var wrappedValue = prefix + v + postfix;
        node.setAttribute(attName, wrappedValue);
    };
    function RampAttributeX(node, attName, options){
        var startTime = ('startTime' in options) ? options.startTime : 0;
        var prefix    = ('prefix'    in options) ? options.prefix    : '';
        var postfix   = ('postfix'   in options) ? options.postfix   : '';
        var separator = ('separator' in options) ? options.separator : ' ';
        var endTime, startValues, endValues;
        if ('endTime'     in options){ endTime     = options.endTime;     } else { debugger; throw new Error('missing option: endTime');    }
        if ('startValues' in options){ startValues = options.startValues; } else { debugger; throw new Error('missing option: startValues'); }
        if ('endValues'   in options){ endValues   = options.endValues;   } else { debugger; throw new Error('missing option: endValues');   }
        if (!Array.isArray(startValues)) { debugger; throw new Error('Array expected: startValues'); }
        if (!Array.isArray(endValues)) { debugger; throw new Error('Array expected: endValues'); }
        if (startValues.length!==endValues.length) { debugger; throw new Error('Arrays must have same length: startValues, endValues'); }
        return new AttributeRamperX(node, attName, startValues, endValues, startTime, endTime, prefix, postfix, separator);
    }


    // translate
    RampAttributeX.translate = function(node, options){
        return RampAttributeX(node, 'transform', extendOptions2(options, 'prefix', 'translate(', 'postfix', ')'));
    };
    RampAttributeX.translate.toOrigin = function(node, options){
        return RampAttributeX.translate(node, extendOptions2(options, 'endValues', [0,0], 'startValues', fiat.dom.wrap(node).getTranslate()));
    };
    RampAttributeX.translate.fromOrigin = function(node, options){
        return RampAttributeX.translate(node, extendOptions2(options, 'startValues', [0,0], 'endValues', fiat.dom.wrap(node).getTranslate()));
    };
    RampAttributeX.translate.toXY = function(node, xy, options){
        return RampAttributeX.translate(node, extendOptions2(options, 'endValues', xy, 'startValues', fiat.dom.wrap(node).getTranslate()));
    }
    RampAttributeX.translate.fromXY = function(node, xy, options){
        return RampAttributeX.translate(node, extendOptions2(options, 'startValues', xy, 'endValues', fiat.dom.wrap(node).getTranslate()));
    };

    function AttributeRamper(node, attName, startValue, endValue, startTime, endTime, prefix, postfix){
        this.node = node;
        this.attName = attName;
        this.startValue = startValue;
        this.endValue = endValue;
        this.startTime = startTime;
        this.endTime = endTime;
        this.prefix = prefix;
        this.postfix = postfix;
    }
    AttributeRamper.prototype.update = function(pos){
        var node = this.node, attName = this.attName,
            startValue = this.startValue, endValue = this.endValue,
            startTime = this.startTime, endTime = this.endTime,
            prefix = this.prefix, postfix = this.postfix,
            dTime = endTime - startTime,
            dVal = endValue - startValue,
            factor = dVal/dTime;
        var v = (function(p){
            if (p<=startTime) return startValue;
            if (p>=endTime) return endValue;
            return startValue + factor * (p-startTime);
        })(pos);
        var wrappedValue = prefix + v + postfix;
        node.setAttribute(attName, wrappedValue);
    };
    function RampAttribute(node, attName, options){
        var startTime = ('startTime' in options) ? options.startTime : 0;
        var prefix    = ('prefix'    in options) ? options.prefix    : '';
        var postfix   = ('postfix'   in options) ? options.postfix   : '';
        var endTime, startValue, endValue;
        if ('endTime'    in options){ endTime    = options.endTime;    } else { debugger; throw new Error('missing option: endTime');    }
        if ('startValue' in options){ startValue = options.startValue; } else { debugger; throw new Error('missing option: startValue'); }
        if ('endValue'   in options){ endValue   = options.endValue;   } else { debugger; throw new Error('missing option: endValue');   }
        return new AttributeRamper(node, attName, startValue, endValue, startTime, endTime, prefix, postfix);
    }
    RampAttribute.toZero = function(node, attName, options){
        return RampAttribute(node, attName, extendOptions2(options, 'endValue', 0, 'startValue', +node.getAttribute(attName)));
    };
    RampAttribute.fromZero = function(node, attName, options){
        return RampAttribute(node, attName, extendOptions2(options, 'startValue', 0, 'endValue', +node.getAttribute(attName)));
    };
    RampAttribute.toValue = function(node, attName, value, options){
        return RampAttribute(node, attName, extendOptions2(options, 'endValue', value, 'startValue', +node.getAttribute(attName)));
    }
    RampAttribute.fromValue = function(node, attName, value, options){
        return RampAttribute(node, attName, extendOptions2(options, 'startValue', value, 'endValue', +node.getAttribute(attName)));
    };
    // scale
    RampAttribute.scale = function(node, options){
        return RampAttribute(node, 'transform', extendOptions2(options, 'prefix', 'scale(', 'postfix', ')'));
    };
    RampAttribute.scale.toZero = function(node, options){
        return RampAttribute.scale(node, extendOptions2(options, 'endValue', 0, 'startValue', fiat.dom.wrap(node).getScale()[0]));
    };
    RampAttribute.scale.fromZero = function(node, options){
        return RampAttribute.scale(node, extendOptions2(options, 'startValue', 0, 'endValue', fiat.dom.wrap(node).getScale()[0]));
    };
    RampAttribute.scale.toValue = function(node, value, options){
        return RampAttribute.scale(node, extendOptions2(options, 'endValue', value, 'startValue', fiat.dom.wrap(node).getScale()[0]));
    }
    RampAttribute.scale.fromValue = function(node, value, options){
        return RampAttribute.scale(node, extendOptions2(options, 'startValue', value, 'endValue', fiat.dom.wrap(node).getScale()[0]));
    };
    // fontSize
    RampAttribute.fontSize = function(node, options){
        return RampAttribute(node, 'font-size', options);
    };
    RampAttribute.fontSize.toZero = function(node, options){
        return RampAttribute.fontSize(node, extendOptions2(options, 'endValue', 0, 'startValue', +node.getAttribute('font-size')));
    };
    RampAttribute.fontSize.fromZero = function(node, options){
        return RampAttribute.fontSize(node, extendOptions2(options, 'startValue', 0, 'endValue', +node.getAttribute('font-size')));
    };
    RampAttribute.fontSize.toValue = function(node, value, options){
        return RampAttribute.fontSize(node, extendOptions2(options, 'endValue', value, 'startValue', +node.getAttribute('font-size')));
    }
    RampAttribute.fontSize.fromValue = function(node, value, options){
        return RampAttribute.fontSize(node, extendOptions2(options, 'startValue', value, 'endValue', +node.getAttribute('font-size')));
    };
    // opacity
    RampAttribute.opacity = function(node, options){
        return RampAttribute(node, 'opacity', options);
    };
    RampAttribute.opacity.toZero = function(node, options){
        return RampAttribute.opacity(node, extendOptions2(options, 'endValue', 0, 'startValue', node.hasAttribute('opacity') ? +node.getAttribute('opacity') : 1));
    };
    RampAttribute.opacity.fromZero = function(node, options){
        return RampAttribute.opacity(node, extendOptions2(options, 'startValue', 0, 'endValue', node.hasAttribute('opacity') ? +node.getAttribute('opacity') : 1));
    };
    RampAttribute.opacity.toValue = function(node, value, options){
        return RampAttribute.opacity(node, extendOptions2(options, 'endValue', value, 'startValue', node.hasAttribute('opacity') ? +node.getAttribute('opacity') : 1));
    }
    RampAttribute.opacity.fromValue = function(node, value, options){
        return RampAttribute.opacity(node, extendOptions2(options, 'startValue', value, 'endValue', node.hasAttribute('opacity') ? +node.getAttribute('opacity') : 1));
    };
    UTIL.movie = {};
    UTIL.movie.RampAttribute = RampAttribute;
    UTIL.movie.RampAttributeX = RampAttributeX;

    UTIL.movie.RemoveAndAddClass = RemoveAndAddClass;
    UTIL.movie.SetTextContent = SetTextContent;
    UTIL.movie.SetAttribute = SetAttribute;
    
    UTIL.StepFunction = StepFunction;

    function ShowHide(content, shouldShow){
        this.content = content;
        var contentKey = keyOfDomElt(content);
        this.parent = content.parentElement;
        this.placeholder = document.createComment(contentKey.join(','));
        this.shouldShow = shouldShow;
    }
    ShowHide.prototype.update = function(pos){
        if (this.shouldShow(pos)){
            if (this.content.parentElement !== this.parent){
                this.parent.replaceChild(this.content, this.placeholder);
            }
        } else {
            if (this.placeholder.parentElement !== this.parent){
                this.parent.replaceChild(this.placeholder, this.content);
            }
        }
    };
    function before(pivotTime){
        return function(position){
            return position <= pivotTime;
        };
    }
    function after(pivotTime){
        return function(position){
            return position >= pivotTime;
        };
    }
    function between(startTime, endTime){
        return function(position){
            return ( (startTime <= position) && (position < endTime) );
        }
    }
    function between_multi(array_of_fromTo){
        return function(position){
            for (var i=0; i<array_of_fromTo.length; i++){
                var ithStart = array_of_fromTo[i][0];
                var ithEnd   = array_of_fromTo[i][1];
                if ( (ithStart <= position) && (position < ithEnd) ) return true;
            }
            return false;
        }
    }
    function ShowBefore(elt, time){
        return new ShowHide(elt, before(time));
    }
    function ShowAfter(elt, time){
        return new ShowHide(elt, after(time));
    }
    function ShowBetween(elt, startTime, endTime){
        return new ShowHide(elt, between(startTime, endTime));
    }
    function ShowWhen(elt, shouldShow){
        return new ShowHide(elt, shouldShow);
    }
    function ShowBetweenMulti(elt, array_of_fromTo){
        return new ShowHide(elt, between_multi(array_of_fromTo));
    }
    function ShowNever(elt){
        return new ShowHide(elt, function(){return false; });
    }
    function ShowAlways(elt){
        return new ShowHide(elt, function(){return true; });
    }

    UTIL.movie.Show = {
        Before  : ShowBefore,
        After   : ShowAfter,
        Between : ShowBetween,
        When    : ShowWhen,
        Never   : ShowNever,
        Always  : ShowAlways,
        BetweenMulti : ShowBetweenMulti
    };

    function SetParent_last(content, parentFunction){
        this.content = content;
        this.parentFunction = parentFunction;
    }
    function SetParent_first(content, parentFunction){
        this.content = content;
        this.parentFunction = parentFunction;
    }
    function SetParent_only(content, parentFunction){
        this.content = content;
        this.parentFunction = parentFunction;
    }
    SetParent_last.prototype.update = function(pos){
        var parent = this.parentFunction(pos);
        if (parent===null){
            if (this.content.parentElement){
                this.content.parentElement.removeChild(this.content);
            }
        } else {
            if (parent instanceof Element){
                parent.appendChild(this.content);
                //if (this.content.parentElement!==parent){}
            } else {
                debugger; throw new Error("Element expected");
            }
        }
    };
    SetParent_first.prototype.update = function(pos){
        var parent = this.parentFunction(pos);
        if (parent===null){
            if (this.content.parentElement){
                this.content.parentElement.removeChild(this.content);
            }
        } else {
            if (parent instanceof Element){
                parent.insertBefore(this.content, parent.firstChild);
            } else {
                debugger; throw new Error("Element expected");
            }
        }
    };
    SetParent_only.prototype.update = function(pos){
        var parent = this.parentFunction(pos);
        if (parent===null){
            if (this.content.parentElement){
                this.content.parentElement.removeChild(this.content);
            }
        } else {
            if (parent instanceof Element){
                while(parent.lastChild){
                    parent.removeChild(parent.lastChild);
                }
                parent.appendChild(this.content);
            } else {
                debugger; throw new Error("Element expected");
            }
        }
    };
    UTIL.movie.SetParent = {};
    UTIL.movie.SetParent.lastChildOf = function(node, func){
        return new SetParent_last(node, func);
    };
    UTIL.movie.SetParent.firstChildOf = function(node, func){
        return new SetParent_first(node, func);
    };
    UTIL.movie.SetParent.onlyChildOf = function(node, func){
        return new SetParent_only(node, func);
    };
    UTIL.movie.SetParent.lastChildOf.toStepFunction = function(node, steps, modifier){
        var f = StepFunction(steps, modifier);
        return UTIL.movie.SetParent.lastChildOf(node, f);
    };
    UTIL.movie.SetParent.firstChildOf.toStepFunction = function(node, steps, modifier){
        var f = StepFunction(steps, modifier);
        return UTIL.movie.SetParent.firstChildOf(node, f);
    };
    UTIL.movie.SetParent.onlyChildOf.toStepFunction = function(node, steps, modifier){
        var f = StepFunction(steps, modifier);
        return UTIL.movie.SetParent.onlyChildOf(node, f);
    };

    UTIL.timeTable = function(){
        function timeTable(arr){
            var result = {};
            var time   = 0;
            var index  = 0;
            var len    = arr.length;
            function wrap(){
                var wrappedResult = function(){
                    return result;
                };
                wrappedResult.duration = time;
                wrappedResult.withDuration = function(duration){
                    var retval = {};
                    var factor = duration/time;
                    Object.keys(result).forEach(function(key){
                        retval[key] = factor * result[key];
                    });
                    return retval;
                };
                return wrappedResult;
            }
            if (arr.length===0) { debugger; throw new Error('empty array encountered')}
            function eat_numberOrArray(prey){
                var type = typeof prey;
                if (type==='number'){
                    if (isNaN(prey)){ debugger; throw new Error('NaN encountered')}
                    time += prey;
                } else {
                    if (Array.isArray(prey)){
                        var _tt = UTIL.timeTable(prey);
                        var tt = _tt();
                        Object.keys(tt).forEach(function(k){
                            if (k in result) { debugger; throw new Error('duplicate key encountered'); }
                            result[k] = time + tt[k];
                        });
                        time += _tt.duration;
                    } else {
                        debugger; throw new Error('number or array expected');
                    }
                }
            }
            var item0 = arr[0];
            var type0 = typeof item0;
            if (type0==='string'){
                // nothing to do
            } else {
                eat_numberOrArray(item0);
                index = 1;
            }
            while (true){
                if (index>=len) return wrap();
                var item = arr[index];
                var type = typeof item;
                if (type==='string'){
                    if (item in result){ debugger; throw new Error('duplicate key encountered'); }
                    result[item] = time;
                    if (index===len-1) return wrap();
                    eat_numberOrArray(arr[index+1]);
                } else {
                    if (Array.isArray(item)){
                        var _tt = UTIL.timeTable(item);
                        var tt = _tt();
                        var factor = 1;
                        var duration = _tt.duration;
                        if (index+1<len){
                            var nextItem = arr[index+1];
                            var nextType = typeof nextItem;
                            if (nextType==='number'){
                                if (!isNaN(nextItem)){ factor = nextItem/duration; }
                            } else {
                                debugger; throw new Error('number expected');
                            }
                        }
                        Object.keys(tt).forEach(function(k){
                            if (k in result) { debugger; throw new Error('duplicate key encountered'); }
                            result[k] = time + tt[k] * factor;
                        });
                        time += duration * factor;
                    } else {
                        debugger; throw new Error('string or array expected');
                    }
                }
                index += 2;
            }
        }
        if (arguments.length===1){
            if (Array.isArray(arguments[0])){
                return timeTable(arguments[0]);
            }
            throw new Error('array expected');
        }
        var args = [].slice.call(arguments);
        return UTIL.timeTable(args);
    };

(function(){
    var variables_in_about_blank_window = {
        caches: null,postMessage: null,blur: null,focus: null,close: null,frames: null,self: null,window: null,parent: null,opener: null,top: null,
        length: null,closed: null,location: null,document: null,origin: null,name: null,history: null,locationbar: null,menubar: null,personalbar: null,
        scrollbars: null,statusbar: null,toolbar: null,status: null,frameElement: null,navigator: null,applicationCache: null,customElements: null,
        external: null,screen: null,innerWidth: null,innerHeight: null,scrollX: null,pageXOffset: null,scrollY: null,pageYOffset: null,screenX: null,
        screenY: null,outerWidth: null,outerHeight: null,devicePixelRatio: null,clientInformation: null,screenLeft: null,screenTop: null,defaultStatus: null,
        defaultstatus: null,styleMedia: null,onanimationend: null,onanimationiteration: null,onanimationstart: null,onsearch: null,ontransitionend: null,
        onwebkitanimationend: null,onwebkitanimationiteration: null,onwebkitanimationstart: null,onwebkittransitionend: null,isSecureContext: null,
        onabort: null,onblur: null,oncancel: null,oncanplay: null,oncanplaythrough: null,onchange: null,onclick: null,onclose: null,oncontextmenu: null,oncuechange: null,
        ondblclick: null,ondrag: null,ondragend: null,ondragenter: null,ondragleave: null,ondragover: null,ondragstart: null,ondrop: null,ondurationchange: null,
        onemptied: null,onended: null,onerror: null,onfocus: null,oninput: null,oninvalid: null,onkeydown: null,onkeypress: null,onkeyup: null,onload: null,onloadeddata: null,
        onloadedmetadata: null,onloadstart: null,onmousedown: null,onmouseenter: null,onmouseleave: null,onmousemove: null,onmouseout: null,onmouseover: null,
        onmouseup: null,onmousewheel: null,onpause: null,onplay: null,onplaying: null,onprogress: null,onratechange: null,onreset: null,onresize: null,onscroll: null,
        onseeked: null,onseeking: null,onselect: null,onstalled: null,onsubmit: null,onsuspend: null,ontimeupdate: null,ontoggle: null,onvolumechange: null,
        onwaiting: null,onwheel: null,onauxclick: null,ongotpointercapture: null,onlostpointercapture: null,onpointerdown: null,onpointermove: null,onpointerup: null,
        onpointercancel: null,onpointerover: null,onpointerout: null,onpointerenter: null,onpointerleave: null,onafterprint: null,onbeforeprint: null,onbeforeunload: null,
        onhashchange: null,onlanguagechange: null,onmessage: null,onmessageerror: null,onoffline: null,ononline: null,onpagehide: null,onpageshow: null,onpopstate: null,
        onrejectionhandled: null,onstorage: null,onunhandledrejection: null,onunload: null,performance: null,stop: null,open: null,alert: null,confirm: null,prompt: null,
        print: null,requestAnimationFrame: null,cancelAnimationFrame: null,requestIdleCallback: null,cancelIdleCallback: null,captureEvents: null,releaseEvents: null,
        getComputedStyle: null,matchMedia: null,moveTo: null,moveBy: null,resizeTo: null,resizeBy: null,getSelection: null,find: null,webkitRequestAnimationFrame: null,
        webkitCancelAnimationFrame: null,fetch: null,btoa: null,atob: null,setTimeout: null,clearTimeout: null,setInterval: null,clearInterval: null,createImageBitmap: null,
        scroll: null,scrollTo: null,scrollBy: null,onappinstalled: null,onbeforeinstallprompt: null,crypto: null,ondevicemotion: null,ondeviceorientation: null,
        ondeviceorientationabsolute: null,indexedDB: null,webkitStorageInfo: null,sessionStorage: null,localStorage: null,chrome: null,visualViewport: null,
        speechSynthesis: null,webkitRequestFileSystem: null,webkitResolveLocalFileSystemURL: null,openDatabase: null,onselectstart: null,
        onselectionchange: null,queueMicrotask: null,regeneratorRuntime: null, onformdata: null, onpointerrawupdate: null,
        __BROWSERTOOLS_CONSOLE: null,
        __BROWSERTOOLS_CONSOLE_BREAKMODE_FUNC: null,
        __BROWSERTOOLS_CONSOLE_SAFEFUNC: null,
        __BROWSERTOOLS_DEBUGGER: null,
        __BROWSERTOOLS_DOMEXPLORER_ADDED: null,
        __BROWSERTOOLS_EMULATIONTOOLS_ADDED: null,
        __BROWSERTOOLS_MEMORYANALYZER_ADDED: null
    };
    function _glob_(win){
        var keys = Object.keys(win || self || root);
        return keys.filter(function(key){
            return (!(key in variables_in_about_blank_window));
        });
    }
    UTIL.globals = _glob_;
    UTIL.generateColor = generateColor;

    ASSERT = {};   // todo
    ASSERT.integer = function(x){return x;};
    ASSERT.string = function(x){return x;};
    ASSERT.object = function(x){return x;};

})();

    root.fiat.util = UTIL;
    root.fiat.dom.ghost = ghost;
    root.fiat.dom.isWDT   = isWrappedDomTree;
    root.fiat.dom.isFWDT  = isFunctionIntoWDT;
    root.fiat.dom.catalogueItem = catalogueItem;
    root.fiat.dom.string = STRING(null);
    root.fiat.dom.namespacesCatalogue = namespacesCatalogue;

/*****************************************************************************************************************************************
***************************************************** JAVASCRIPT AST *********************************************************************
*****************************************************************************************************************************************/

function findConstructor(code, categoryIdx, name, paramsObj){
    var ss = {sourceType: 'script'};
    var ast = esprima.parse(code, ss);
    var categories = [
        function(){
            var node = ast.body[0];
            if (node.type===name){ return node.constructor; }
            throw new Error('unexpected');
        },
        function(){
            var node = ast.body[0].expression;
            if (node.type===name){ return node.constructor; }
            throw new Error('unexpected');
        },
        function(){
            var node = ast.body[0].body.body[0];
            if (node.type===name){ return node.constructor; }
            throw new Error('unexpected');
        },
        function(){
            var node = ast.body[0].handler;
            if (node.type===name){ return node.constructor; }
            throw new Error('unexpected');
        }
    ];
    var theConstructor = categories[categoryIdx]();
    var constructorAst = esprima.parse(theConstructor.toString(), ss);
    paramsObj[name] = constructorAst.body[0].params.map(function(ident){return ident.name});
    return theConstructor;
}
var esprimaConstructors = {};
var esprimaConstructorParams = {};
var esprimaConstructors_data = [
    ['function blah(){}', 0, 'FunctionDeclaration'],
    ['{}', 0, 'BlockStatement'],
    ['with(a){}', 0, 'WithStatement'],
    ['this', 0, 'ExpressionStatement'],
    ['this', 1, 'ThisExpression'],
    ['blah', 1, 'Identifier'],
    ['0'   , 1, 'Literal'],
    ['foo(bar)', 1, 'CallExpression'],
    ['a.b', 1, 'MemberExpression'],
    ['function anon(){ return 0; }', 2, 'ReturnStatement'],
    ['x+y', 1, 'BinaryExpression'],
    ['try { 0; } catch(e) { 1; }', 0, 'TryStatement'],
    ['try { 0; } catch(e) { 1; }', 3, 'CatchClause']
];
esprimaConstructors_data.forEach(function(entry){
    var code = entry[0], catIdx = entry[1], name = entry[2];
    esprimaConstructors[name] = findConstructor(code, catIdx, name, esprimaConstructorParams);
});

function js_nodeFactory(type){
    return function(){
        var a = [null].concat([].slice.call(arguments));
        return new (Function.prototype.bind.apply(esprimaConstructors[type], a));
    };
}
/*function js_nodeFactory(type){
    return function(){
        return new esprimaConstructors[type](...arguments);
    };
}*/
// https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
/*function js_nodeFactory(type){
    var C = esprimaConstructors[type];
    function F(argsArray){ return C.apply(this, argsArray); }
    F.prototype = C;
    return function(){ return new F(arguments); };
}*/

root.fiat.js = js_nodeFactory;

root.fiat.js.fiat = function(f){
    var ast      = esprima.parse('(' + f.toString() +')', {sourceType: 'script'});
    var funcExpr = ast.body[0].expression;
    var fty      = funcExpr.type;
    var OK = funcExpr.body && (
        (fty==='FunctionExpression') &&  Array.isArray(funcExpr.body.body) ||
        (fty==='ArrowFunctionExpression')
    );
    if (!OK){ debugger; throw new Error('function expected'); }
    var params = funcExpr.params.map(function(identifier){ return identifier.name; });
    return f.apply(null, params.map(js_nodeFactory));
}
root.fiat.js.constructors = esprimaConstructors;
root.fiat.js.constructorParams = esprimaConstructorParams;

})(window);


function outerXHTML(node){
    var nsx = "http://www.w3.org/1999/xhtml";
    var xdoc = document.implementation.createDocument(nsx, 'html');
    xdoc.documentElement.appendChild(node);
    return node.outerHTML;
}
function innerXHTML(node){
    var nsx = "http://www.w3.org/1999/xhtml";
    var xdoc = document.implementation.createDocument(nsx, 'html');
    xdoc.documentElement.appendChild(node);
    return node.innerHTML;
}
function html2xhtml(html){
    var nsx = "http://www.w3.org/1999/xhtml";
    var body = document.createElement('body');
    body.innerHTML = html;
    var xdoc = document.implementation.createDocument(nsx, 'html');
    xdoc.documentElement.appendChild(body);
    return body.innerHTML;
}
function xhtml2html(xhtml){
    var body = document.createElement('body');
    body.innerHTML = xhtml;
    var doc = document.implementation.createHTMLDocument();
    doc.documentElement.appendChild(body);
    return body.innerHTML;
}
