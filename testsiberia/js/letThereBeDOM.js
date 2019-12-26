"use strict";
(function(root){
    var identity = function(x){ return x; };
    var ascendingSortComparator = function(a,b){return Number(a)-Number(b);}
    var throwError = function(msg){ throw new Error(msg); };
    var UTIL = {};
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
    var getKeySetsUpto = JSON.Siberia.getKeySetsUpto;
    var theLetThereBeNamespace = 'mathheadinclouds.com/letThereBe';
    function ghostElement(){
        return document.createElementNS(theLetThereBeNamespace, 'ghost');
    }
    function isGhost(domElement){
        return (domElement.namespaceURI === theLetThereBeNamespace) && (domElement.tagName === 'ghost');
    }
    function catalogueItem(catalogueName){
        var returnValue = document.createElementNS(theLetThereBeNamespace, 'catalogue_item');
        if (catalogueName !== null){
			returnValue.setAttribute('catalogue', catalogueName);
		}
        return returnValue;
    }
    function isCatalogueItem(domElement){
        return (domElement.namespaceURI === theLetThereBeNamespace) && (domElement.tagName === 'catalogue_item');
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
            throw new Error('only lower case allowed');
        }
        return str;
    }
    var josefK = {};
    var youAreNumberSix = {};
    var HandsOff = new Error('letThereBe internals - hands off');
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
        var data = node.dataset;
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
                var oga  = JSON.Siberia.isObjectGraphAnalysis(arg) ? arg : JSON.Siberia.analyzeObjectGraph(arg);
                var data = oga.get();
                var nodeStack = [];
                var treeIndexStackObject = {};
                var treeIndexSeen = {};
                function inner(objectGraphAnalysis, stack, idxStack, treeIdxStack, parentHasRepetitions){
                    var dataNode = objectGraphAnalysis.get();
                    var tree     = objectGraphAnalysis.getTree();
                    var treeIdx  = objectGraphAnalysis.getTreeIndex();
                    var type     = typeof dataNode;
                    var level    = stack.length;
                    nodeStack[level] = dataNode;
                    if (!spec) eval('debugger');
                    //var cycleStart = (treeIdx>=0) && (treeIdxStack.indexOf(treeIdx)>=0);
                    var cycleStart = treeIdx in treeIndexStackObject;
                    var repeat     = treeIdx in treeIndexSeen;
                    var repeatStart = repeat && (!parentHasRepetitions);
                    var childHasRepetitions = repeat || parentHasRepetitions;
                    var advanced = {
                        cycleStart    : cycleStart,
                        repeatStart   : repeatStart,
                        treeIdxStack  : treeIdxStack,
                        treeIndexSeen : treeIndexSeen
                    };
                    var action = spec(dataNode, stack, idxStack, objectGraphAnalysis, nodeStack, advanced, localGhost, stringBufferWithSeparator);
                    var keySet = action.keySet;
                    var f      = action.f;
                    var isWDT  = isWrappedDomTree(f);
                    if (keySet===null){
                        if (isWDT){
                            return f.F(dataNode);
                        }
                        return f.apply(data, [dataNode].concat(stack).concat([idxStack]).concat([keySets]).concat([data]));
                    } else {
                        try {
                            var values = (dataNode===null) ? [] : MAP_INNER(keySet, objectGraphAnalysis, stack, idxStack, treeIdxStack, treeIdx, childHasRepetitions);
                            if (isWDT){
                                return f.template().apply(data, values);
                            }
                            return f.apply(data, stack.concat([idxStack]).concat([keySets]).concat([data])).apply(data, values);
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
                function MAP_INNER(keySet, objectGraphAnalysis, stack, idxStack, treeIdxStack, treeIdx, seen){
                    treeIndexSeen[treeIdx] = null;
                    var numRepeats;
                    if (treeIdx in treeIndexStackObject){
                        numRepeats = ++treeIndexStackObject[treeIdx];
                    } else {
                        numRepeats = treeIndexStackObject[treeIdx] = 0;
                    }
                    var newTreeIdxStack = treeIdxStack.concat(treeIdx);
                    function call_inner(key, idx){
                        var newOGA = objectGraphAnalysis.getChild(key),
                            newStack = stack.concat(key),
                            newIdxStack = idxStack.concat(idx);
                        return inner(newOGA, newStack, newIdxStack, newTreeIdxStack, seen);
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
                return result(inner(oga, [], [], [], false));
            };
            setType_FWDT(dataFunc);
            return dataFunc;
        };
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
    function wrapDomTree(domTree, isTemplate, lib){
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
				for (var i=0; i<source.children.length; i++){
					processNode(source.children[i], target.children[i]);
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
									retval.appendChild(child.$());
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
                            } else {}
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
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        }
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
        result.template = function(){
            if (isTemplate) return result;
            return wrapDomTree(domTree, true, lib);
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
                    var pickedArgs      = argumentIdxList.map(function(argpos){ return ARGS[argpos]; });
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
            return wrapDomTree(newTree, false, lib)(arg);
        };
        setType_FWDT(result.F);
        result.D = function(data){
            // todo: check for forbidden names (key)
            // todo: check if existing name is overwritten
            var retval = getDomTree();
            camelSetter(function(camel, value){
                retval.dataset[camel] = value;
            })(data);
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
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
        		return isTemplate ? wrapDomTree(retval, false, lib) : result;
        	};
        };
        result.DATA = function(data){
        	var retval = getDomTree();
        	retval.____data = data;
        	return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
        result.K = function(key){
            var retval = getDomTree();
            if (Array.isArray(key)){
                for (var i=0; i<key.length; i++){
                    var k = key[i];
                    var type = typeof k;
                    var nameTrunk = 'key' + i;
                    if (type==='number'){
                        if (isNaN(k)         ) throw new Error('numerical keys must be integer - NaN encountered');
                        if (k < 0            ) throw new Error('numerical keys must be integer - negative encountered');
                        if (k===Infinity     ) throw new Error('numerical keys must be integer - Infinity encountered');
                        if (k!==Math.round(k)) throw new Error('numerical keys must be integer');
                        retval.dataset[nameTrunk + 'i'] = k;
                    } else {
                        retval.dataset[nameTrunk] = k;
                    }
                }
            } else {
                debugger; throw new Error('keys must be arrays');
            }
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
        function createListener(handlerName){
        	var handlerNameParts = handlerName.split('.');
        	return function(evt){
                var heir = lib.heir || {};
	            var handler = UTIL.drill(lib, handlerNameParts);
	            if (!handler){
	                console.error(handlerName);
	                debugger; throw new Error('handler not found in library');
	            }
                handler.call(this, evt, keyOfDomElt(this), this, lib, heir.root, heir.nodes, heir.catalogues, heir.fn, heir.fn && heir.fn.getAncestorData(this));
            }
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
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
        /*result.EEE = function(){
        	var retval = getDomTree();
        	retval.addEventListener('click', testHandler);
            return result;        	
        };*/
        result.E.simple = function(){
            var retval = getDomTree();
            retval.addEventListener.apply(retval, arguments);
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
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
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
        result.p = function(propertyName){
            return function(propertyValue){
                var retval = getDomTree();
                retval[propertyName] = propertyValue;
                return isTemplate ? wrapDomTree(retval, false, lib) : result;
            };
        };
        result.a = function(attName){
            return function(attValue){
                var retval = getDomTree();
                retval.setAttribute(attName, attValue);
                return isTemplate ? wrapDomTree(retval, false, lib) : result;
            };
        };
        result.A = function(attributes){
            var retval = getDomTree();
            dashSetter(function(dashyName, value){
                retval.setAttribute(dashyName, value);
            })(attributes);
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
        result.s = function(styleName){
            return function(styleValue){
                var retval = getDomTree();
                retval.style[styleName] = styleValue;
                return isTemplate ? wrapDomTree(retval, false, lib) : result;
            };
        };
        result.S = function(styles){
            var retval = getDomTree();
            camelSetter(function(camel, value){
                retval.style[camel] = value;
            })(styles);
            return isTemplate ? wrapDomTree(retval, false, lib) : result;
        };
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
        result.____ = TheLaw({
            proveIdentity: function(arg){
                if (arg===youAreNumberSix) throw new ImNaN_Im_WDT();
            }
        });
        result.typeof = 'WDT';
        result.$ = function(){
            var tree = getDomTree();
            return tree;
        };
        result.$$ = function(){
            var theTree = result.$();
            var heir = { root: theTree };
            var nodePathList = [];
            var catalogueTargets = {};
            var catalogueItems = {};
            function traverse(node){
                if (isCatalogueItem(node)){
                    var catalogueName = getCatalogueName(node);
                    if (catalogueName in catalogueItems){
                        eval('debugger'); throw new Error('multiple instances of catalogue item')
                    }
                    catalogueItems[catalogueName] = node;
                }
                var keyArray = keyOfDomElt(node);
                if (keyArray){
                    if (keyArray.length>0) {
                        nodePathList.push({
                            key : keyArray,
                            node: node
                        });
                    }
                    if ('catalogue_target' in node.dataset){
                        catalogueTargets[node.dataset.catalogue_target] = node;
                    }
                    for (var i=0; i<node.children.length; i++){
                        var child = node.children[i];
                        traverse(child);
                    }
                }
            }
            traverse(theTree);
            var tempKeyTreeRoot = {
                numerical: true
            };
            if (lib && lib.catalogues){
                heir.catalogues = {};
                Object.keys(lib.catalogues).forEach(function(catName){
                    var cat = lib.catalogues[catName];
                    var kat = cat.itemCreators;
                    heir.catalogues[catName] = {
                        target: catalogueTargets[catName],
                        items : {},
                        selected : catalogueItems[catName] || null
                    };
                    Object.keys(kat).forEach(function(itemName){
                        heir.catalogues[catName].items[itemName] = kat[itemName].$();
                    });
                    heir.catalogues[catName].placeholder = heir.catalogues[catName].selected || catalogueItem(catName);
                });
            }
            var keyTreeNode;
            for (var pathIdx=0; pathIdx<nodePathList.length; pathIdx++){
                var path    = nodePathList[pathIdx].key;
                var node    = nodePathList[pathIdx].node;
                keyTreeNode = tempKeyTreeRoot;
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
            function traverseTempKeyTree(node, outNodeParent, name){
                if ('children' in node){
                    if (node.numerical){
                        outNodeParent[name] = [];
                    } else {
                        outNodeParent[name] = {};
                    }
                    Object.keys(node.children).forEach(function(childKey){
                        traverseTempKeyTree(node.children[childKey], outNodeParent[name], childKey);
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
            if (nodePathList.length>0){
                traverseTempKeyTree(tempKeyTreeRoot, heir, 'nodes');
            } else {
                heir.nodes = null;
            }
            heir.elder = lib;
            heir.fn = {
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
                append: function(appendee){
                    if (appendee){
                        var type = typeof appendee;
                        if (type==='object'){
                            if (!(appendee instanceof Element)){
                                debugger; throw new Error('illegal argument');
                            }
                        } else {
                            if (type==='string'){
                                if ( (appendee in document) && (typeof document[appendee]==='object') && document[appendee] instanceof Element){
                                    appendee = document[appendee];
                                } else {
                                    debugger; throw new Error('illegal argument');
                                }
                            } else {
                                debugger; throw new Error('illegal argument');
                            }
                        }
                    } else {
                        appendee = document.body;
                    }
                    if (isGhost(heir.root)){
						while (heir.root.firstChild){ appendee.appendChild(heir.root.firstChild); }
						heir.root = appendee;
					} else {
						appendee.appendChild(heir.root);
					}
                    return heir;
                },
                refill: function(target){
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
                    UTIL.dom.drain(target);
                    if (isGhost(heir.root)){
						while (heir.root.firstChild){ target.appendChild(heir.root.firstChild); }
						heir.root = target;
					} else {
						target.appendChild(heir.root);
					}
                    return heir;
                },
                getAncestorData: function(elt){
                	var d = [];
                	var target = elt;
                	while (true){
                		d.push(target.____data || null);
                		target = target.parentElement;
                		if (!target) return d;
                	}
                },
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
                }
            };
            if (lib && lib.catalogues){
                Object.keys(lib.catalogues).forEach(function(catName){
                    heir.fn.catalogue.refresh(catName, lib.catalogues[catName].initialItem);
                });
            }
            if ( lib && ((typeof lib)==='object') ) {
                lib.heir = heir;
                heir.fn.traverse(heir.root, function(node){
                    if (node.____listeners && Array.isArray(node.____listeners)){
                        node.____listeners.filter(function(listenerData){
                            return listenerData.triggerOnCreate;
                        }).forEach(function(listenerData){
                            var listener = lib.____listeners[listenerData.handler];
                            listener.apply(node, []);
                        });
                    }
                });
                if ( (typeof lib.$onCreate)==='function' ){
                    lib.$onCreate(heir.root, heir.nodes, heir.catalogues, heir.fn);
                }
            }
            return heir;
        }; // $$
        return result;
    } // wrapDomTree

    function nodeFactory(tagName){
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
        var adam = namespace ? document.createElementNS(namespace, tagName) : document.createElement(tagName);
        return wrapDomTree(adam, true, library);
    } // nodeFactory

    function ghost(){
        var library   = null;
        if (arguments.length >= 1){
            library = arguments[0];
        }
        var adam = ghostElement();
        return wrapDomTree(adam, true, library);
	}
	function STRING(){
        var library   = null;
        if (arguments.length >= 1){
            library = arguments[0];
        }
        var isTemplate = true;
        return wrappedString([], isTemplate, library);
	}

    function interpret(item, thisObj){
        var type = typeof item;
        if (type==='function'){
            return interpretFunction.call(this, item, thisObj || null);
        }
        if (type==='object'){
            return interpertObject.call(this, item, thisObj);
        }
        debugger; throw new Error('not implemented yet');
    }
    var namespaceRegex = /^\$NS\$(.*)$/;
    function interpretFunction(item, thisObj, FUNCNAME, DIRECTIVE){
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
                return nodeFactory(tagName, namespace, thisObj);
            } else {
                curry[lastCurry].push(tagName);
            }
        });
        function curryStep(stack){
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
                return item.apply(thisObj || null, myArguments);
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
                return curryStep(stack.concat([stackEntry]));
            };
        }
        return curryStep([]);
    }
    function interpretArray(item, thisObj){
        var result = thisObj || {};
        var FUNCNAME  = {};
        var DIRECTIVE = {};
        for (var i=0; i<item.length; i++){
            var entry = item[i];
            var tyEntry = typeof entry;
            if (tyEntry==='function'){
                var broker = interpretFunction.call(this, entry, result, FUNCNAME, DIRECTIVE);
                var funcName  = FUNCNAME.value;
                var directive = DIRECTIVE.value;
                if (funcName){
                    result[funcName] = broker;
                } else {
                    if (broker){
                        if ((typeof broker)==='object'){
                            if (directive==='template'){
                                Object.keys(broker).forEach(function(key){ result[key] = broker[key].template(); });
                            } else {
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
                                subResult = interpertObject.call(this, subEntry, subResult);
                            } else {
                                if (tySub==='function'){
                                    debugger; throw new Error('todo');
                                } else {
                                    debugger; throw new Error('illegal');
                                }
                            }
                        }
                    } else {
                        result = interpertObject.call(this, entry, result);
                    }
                } else {
                    debugger; throw new Error('illegal or todo');
                }
            }
        }
        return result;
    }
    function interpertObject(item, thisObj){
        if (item===null) return null;
        if (item.constructor===Array){
            return interpretArray.call(this, item, thisObj);
        }
        var THIS = this;
        var result = thisObj || {};
        Object.keys(item).forEach(function(key){
            var rhs = item[key];
            var tyRHS = typeof rhs;
            if (tyRHS==='function'){
                result[key] = interpretFunction.call(THIS, rhs, result);
            } else {
                result[key] = rhs;
            }
        });
        return result;
    }

    root.letThereBe = nodeFactory;
    root.letThereBe.dom = interpret;


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

    UTIL.dom = {};
    UTIL.dom.drain = function drain(node){
        while (node.lastChild){
            node.removeChild(node.lastChild);
        }
    };
    UTIL.dom.refill = function refill(node, newContents){
        // todo: type check and allow array for newContents
        UTIL.dom.drain(node);
        node.appendChild(newContents);
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
})();

    root.letThereBe.util = UTIL;
    root.letThereBe.ghost = ghost;
    root.letThereBe.isWDT   = isWrappedDomTree;
    root.letThereBe.isFWDT  = isFunctionIntoWDT;
    root.letThereBe.catalogueItem = catalogueItem;
    root.letThereBe.string = STRING(null);
})(window);
