var AstWomb = (function(){
	var NODE      = "NODE";
	var ARRAY     = "ARRAY";
	var BOOLEAN   = "BOOLEAN";
	var STRING    = "STRING";
	var _STRING   = "_STRING";
	var REGEX     = "REGEX";
	var HETEROGEN = "HETEROGEN";
	var OBJ       = "OBJ";
	var _OBJ      = "_OBJ";
	var typedParamsBook = {
		 FunctionDeclaration      : [{ id: NODE }, { params: ARRAY }, { body: NODE }, { generator: BOOLEAN }]
		,BlockStatement           : [{ body: ARRAY }]
		,WithStatement            : [{ object: NODE }, { body: NODE }]
		,ExpressionStatement      : [{ expression: NODE }]
		,ThisExpression           : []
		,Identifier               : [{ name: STRING }]
		,Literal                  : [{ value: HETEROGEN }, { raw: _STRING }]
		,CallExpression           : [{ callee: NODE }, { arguments: ARRAY }]
		,StaticMemberExpression   : [{ object: NODE }, { property: NODE }]
		,ComputedMemberExpression : [{ object: NODE }, { property: NODE }]
		,ReturnStatement          : [{ argument: NODE }]
		,BinaryExpression         : [{ operator: STRING }, { left: NODE }, { right: NODE }]
		,TryStatement             : [{ block: NODE }, { handler: NODE }, { finalizer: NODE }]
		,CatchClause              : [{ param: NODE }, { body: NODE }]
		,VariableDeclaration      : [{ declarations: ARRAY }, { kind: STRING }]
		,VariableDeclarator       : [{ id: NODE }, { init: NODE }]
		,ThrowStatement           : [{ argument: NODE }]
		,IfStatement              : [{ test: NODE }, { consequent: NODE }, { alternate: NODE }]
		,ArrayExpression          : [{ elements: ARRAY }]
		,ObjectExpression         : [{ properties: ARRAY }]
		,FunctionExpression       : [{ id: NODE }, { params: ARRAY }, { body: NODE }, { generator: BOOLEAN }]
		//,Program                  : [{ body: ARRAY }, { sourceType: STRING }] <-- ver 3.1.3
		,Script                   : [{ body: ARRAY }]
		,ConditionalExpression    : [{ test: NODE }, { consequent: NODE }, { alternate: NODE }]
		,NewExpression            : [{ callee: NODE }, { arguments: ARRAY }]
		,UpdateExpression         : [{ operator: STRING }, { argument: NODE }, { prefix: BOOLEAN }]
		,ForStatement             : [{ init: NODE }, { test: NODE }, { update: NODE }, { body: NODE }]
		,DebuggerStatement        : []
		,UnaryExpression          : [{ operator: STRING }, { argument: NODE }]
		,AssignmentExpression     : [{ operator: STRING }, { left: NODE }, { right: NODE }]
		,Property                 : [{ kind: STRING }, { key: NODE }, { computed: BOOLEAN }, { value: NODE }, { method: BOOLEAN }, { shorthand: BOOLEAN }]
		,WhileStatement           : [{ test: NODE }, { body: NODE }]
		,ForInStatement           : [{ left: NODE }, { right: NODE }, { body: NODE }]
		,BreakStatement           : [{ label: NODE }]
		,SequenceExpression       : [{ expressions: ARRAY }]
		,EmptyStatement           : []
		,SwitchStatement          : [{ discriminant: NODE }, { cases: ARRAY }]
		,SwitchCase               : [{ test: NODE }, { consequent: ARRAY }]
		,ContinueStatement        : [{ label: NODE }]
		,LabeledStatement         : [{ label: NODE }, { body: NODE }]
		,DoWhileStatement         : [{ body: NODE }, { test: NODE }]
		//,RegexLiteral             : [{ value: REGEX }, { raw: _STRING }, { regex: _OBJ }]   <-- ver 3.1.3
		,RegexLiteral             : [{ value: REGEX }, { raw: _STRING }, { pattern: _STRING }, { flags: _STRING }]
		,Directive                : [{ expression: NODE}, { directive: STRING }]
		,ArrowFunctionExpression  : [{ params: ARRAY }, { body: NODE }, { expression: BOOLEAN }]
		,RestElement              : [{ argument: NODE }]
		,SpreadElement            : [{ argument: NODE }]
		,ArrayPattern             : [{ elements: ARRAY }]
		,AssignmentPattern        : [{ left: NODE }, { right: NODE }]
	}
	var SubTypeOf = {
		 LogicalExpression : 'BinaryExpression'
	};
// todoList = Object.keys(esprima.Syntax).filter(function(key){ return !((key in AstWomb.syntax)||(key in AstWomb.__SubTypeOf)||(key in AstWomb.__specialCtors)); })
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// https://inui.io/es6-template-strings/
	var ctors = {};
	var syntax = {};
	var esprimaConstructorParams = {};

	function findConstructor(code, categoryIdx, name){
	    var ss = {sourceType: 'script'};
	    var ast = esprima.parse(code, ss);
	    var node, ctor, ctorName;
	    function __cat__(extractFrom){
	    	return function(){
	            node = extractFrom(ast);
	            ctor = node.constructor; ctorName = ctor.name;
	            if (name===ctorName){
	            	if (!(node.type in syntax)) { syntax[node.type] = {}; }
	            	return ctor;
	            }
	            debugger; throw new Error('unexpected');
	    	};
	    }
	    var categories = [
	    	/*00*/  __cat__(ast => ast.body[0])
	    	/*01*/ ,__cat__(ast => ast.body[0].expression)
	    	/*02*/ ,__cat__(ast => ast.body[0].body.body[0])
	    	/*03*/ ,__cat__(ast => ast.body[0].handler)
	    	/*04*/ ,__cat__(ast => ast.body[0].declarations[0])
	    	/*05*/ ,__cat__(ast => ast.body[0].expression.right)
	    	/*06*/ ,__cat__(ast => ast)
	    	/*07*/ ,__cat__(ast => ast.body[0].expression.properties[0])
	    	/*08*/ ,__cat__(ast => ast.body[0].cases[0])
	    	/*09*/ ,__cat__(ast => ast.body[0].declarations[0].init)
	    	/*10*/ ,__cat__(ast => ast.body[0].params[0])
	    	/*11*/ ,__cat__(ast => ast.body[0].expression.arguments[0])
	    ];
	    var theConstructor = categories[categoryIdx]();
	    var constructorAst = esprima.parse(theConstructor.toString(), ss);
	    var paramNames = constructorAst.body[0].params.map(function(ident){return ident.name});
		syntax[node.type][name] = paramNames;
	    esprimaConstructorParams[name] = paramNames;
	    if (!(name in typedParamsBook)){
	    	debugger; throw new Error('missing case in book');
	    }
	    var typedParams = typedParamsBook[name];
	    if (typedParams.length!==paramNames.length){
	    	debugger; throw new Error('parameter conflict: update book!');
	    }
	    for (var i=0; i<paramNames.length; i++){
	    	var paramName = paramNames[i];
	    	var typedParam = typedParams[i];
	    	var mustBeArrayOfOne = Object.keys(typedParam);
	    	if (mustBeArrayOfOne.length!==1){
	    		debugger; throw new Error('very unexpected');
	    	}
	    	var theKeyOfTyped = mustBeArrayOfOne[0];
	    	if (!(paramName in typedParam)){
	    		if ( (paramName==='args') && (theKeyOfTyped==='arguments') ){
	    			paramNames[i] = theKeyOfTyped;
	    		} else {
	    			debugger; throw new Error('unexpected');
	    		}
	    	}
	    }
	    return theConstructor;
	}
	var esprimaConstructors_data = [
	    ['function blah(){}', 0, 'FunctionDeclaration'],
	    ,['{}', 0, 'BlockStatement']
	    ,['with(a){}', 0, 'WithStatement']
	    ,['this', 0, 'ExpressionStatement']
	    ,['this', 1, 'ThisExpression']
	    ,['blah', 1, 'Identifier']
	    ,['0'   , 1, 'Literal']
	    ,['foo(bar)', 1, 'CallExpression']
	    ,['a.b', 1, 'StaticMemberExpression']
	    ,['a[0]', 1, 'ComputedMemberExpression']
	    ,['function anon(){ return 0; }', 2, 'ReturnStatement']
	    ,['x+y', 1, 'BinaryExpression']
	    ,['try { 0; } catch(e) { 1; }', 0, 'TryStatement']
	    ,['try { 0; } catch(e) { 1; }', 3, 'CatchClause']
	    ,['var foo=5;', 0, 'VariableDeclaration']
	    ,['var foo=5;', 4, 'VariableDeclarator']
	    ,['throw foo', 0, 'ThrowStatement']
	    ,['if (true) foo=42', 0, 'IfStatement']
	    ,['[]', 1, 'ArrayExpression']
	    ,['({})', 1, 'ObjectExpression']
	    ,['blah=function(){}', 5, 'FunctionExpression']
	    ,['0' , 6, 'Script']
	    ,['true ? 1 : 0', 1, 'ConditionalExpression']
	    ,['a=new Array()', 5, 'NewExpression']
	    ,['a++', 1, 'UpdateExpression']
	    ,['for (; z<2; z++) sum+=z', 0, 'ForStatement']
	    ,['debugger', 0, 'DebuggerStatement']
	    ,['typeof x', 1, 'UnaryExpression']
	    ,['a=5', 1, 'AssignmentExpression']
	    ,['({foo:"bar"})', 7, 'Property']
	    ,['while(false){}', 0, 'WhileStatement']
	    ,['for (foo in bar){}', 0, 'ForInStatement']
	    ,['while(true){break;}', 2, 'BreakStatement']
	    ,['1,2,3', 1, 'SequenceExpression']
	    ,[';', 0, 'EmptyStatement']
	    ,['switch(0){}', 0, 'SwitchStatement']
	    ,['switch(0){case 0: 0}', 8, 'SwitchCase']
	    ,['while(0){continue;}', 2, 'ContinueStatement']
	    ,['foo: 7', 0, 'LabeledStatement']
	    ,['do {} while(false)', 0, 'DoWhileStatement']
	    ,[(function(){ var x = /\\/g; }).toString().slice(12,26), 9, 'RegexLiteral']
	    ,['"5";', 0, 'Directive']
	    ,['x=>x', 1, 'ArrowFunctionExpression']
	    ,['function exarest(...lorem){}', 10, 'RestElement']
	    ,['fun(...[])', 11, 'SpreadElement']
	    ,['function foo(x=1){ return 10*x; }', 10, 'AssignmentPattern']
	];
	esprimaConstructors_data.forEach(function(entry){
	    var code = entry[0], catIdx = entry[1], name = entry[2];
	    ctors[name] = findConstructor(code, catIdx, name);
	});
	var specialCtors = {
		ArrayPattern : function(){
			var result = new ctors.ArrayExpression(arguments[0]);
			result.type = 'ArrayPattern';
			return result;
		}
		,AssignmentPattern: null
		/*,AssignmentPattern : function(){
			var result = new ctors.AssignmentExpression('=', arguments[0], arguments[1]);
			result.type = 'AssignmentPattern';
			return result;
		}*/
	};
	function js_nodeFactory(type){
		if (type in ctors){
		    return function(){
		        var a = [null].concat([].slice.call(arguments));
		        return new (Function.prototype.bind.apply(ctors[type], a));
		    };
		}
		if (type in specialCtors){
			return specialCtors[type];
		}
		debugger; throw new Error('constructor not found');
	}

	function gatherConstructors(ast){
		var usedCtors = {};
		function onEnter(node, stack, keyStack){
			if ( (node.type==='CallExpression') && (node.callee) && (node.callee.name) ){
				usedCtors[node.callee.name] = null;
			}
		}
		traverseAST(ast, onEnter);
		return Object.keys(usedCtors);
	}
	function isFunctionAst(ast){
	    return (ast.type==='FunctionExpression'||ast.type==='ArrowFunctionExpression')&&
	        (Array.isArray(ast.params))&&
	        ((typeof ast.body)==='object')&&
	        (ast.expression||Array.isArray(ast.body.body))
	}	
	function womb_fromFunction_lazy(func){
		if ((typeof func)!=='function') throw new Error('illegal argument: function expected');
	    var ast         = esprima.parse('(' + func.toString() +')', {sourceType: 'script'});
	    var funcExpr    = ast.body[0].expression;
	    if (!isFunctionAst(funcExpr)){ debugger; throw new Error('function expected'); }
	    var bodyNode    = funcExpr.body;
	    var namesBucket = {};
	    gatherConstructors(bodyNode).forEach(function(name){ namesBucket[name] = null; });
		funcExpr.params.forEach(function(identifier){ namesBucket[identifier.name] = null; });
		var arrayOfConstructorNames = Object.keys(namesBucket);
		var newParams = arrayOfConstructorNames.map(function(paramName){ return new AstWomb.ctors.Identifier(paramName); });
		funcExpr.params = newParams;
		var theFunc = eval('(' + escodegen.generate(funcExpr) + ')');
		var args = arrayOfConstructorNames.map(js_nodeFactory);
		return theFunc.apply(null, args);
	}

	function womb_fromFunction(func){
	    var ast      = esprima.parse('(' + func.toString() +')', {sourceType: 'script'});
	    var funcExpr = ast.body[0].expression;
	    if (!isFunctionAst(funcExpr)){ debugger; throw new Error('function expected'); }
	    var params = funcExpr.params.map(function(identifier){ return identifier.name; });
	    return func.apply(null, params.map(js_nodeFactory));
	}
	function womb_fromString(str){
		var bodyAST, arrayOfConstructorNames, theFunc;
		bodyAST = esprima.parse(str, {sourceType: 'script'});
		arrayOfConstructorNames = gatherConstructors(bodyAST);
		theFunc = new Function(arrayOfConstructorNames, 'return ' + str);
		return womb_fromFunction(theFunc);
	}

	var womb = function(arg){
		var type = typeof arg;
		if (type==='function') return womb_fromFunction(arg);
		if (type==='string'  ) return womb_fromString(  arg);
		throw new Error('illegal argument: function or string expected');
	}
	womb.__gatherConstructors = gatherConstructors;
	womb.lazy = womb_fromFunction_lazy;
	womb.ctors = ctors;
	womb.__specialCtors = specialCtors;
	womb.ctorParams = esprimaConstructorParams;
	womb.typedParams = typedParamsBook;
	womb.syntax = syntax;
	womb.__SubTypeOf = SubTypeOf;
	womb.construct = js_nodeFactory;
	womb.logTypes = function(){
		Object.keys(typedParamsBook).forEach(function(ctorName){
			var typedParams = typedParamsBook[ctorName];
			var info = [ctorName, typedParams.map(function(entry){
				var theKey = Object.keys(entry)[0];
				var theType = entry[theKey];
				return theType + '(' + theKey + ')';
			}).join(', ')].join(': ');
			console.log(info);
		});
	};
	womb.logSyntaxKeysWithMultipleCtors = function(){
		var syKeys = Object.keys(syntax);
		var multiCtorKeys = syKeys.filter(function(syKey){ return Object.keys(syntax[syKey]).length >= 2; });
		multiCtorKeys.forEach(function(syKey){
			console.log('*********   .syntax.' + syKey);
			var target = womb.syntax[syKey]
			Object.keys(target).forEach(function(ctorName){
				console.log(ctorName + Unicode.nbsp + Unicode.rightArrow + Unicode.nbsp + target[ctorName].join(', '));
			});
		});
	};
	function reverse(ast){
		var CallExpression   = js_nodeFactory('CallExpression');
		var Identifier       = js_nodeFactory('Identifier');
		var Literal          = js_nodeFactory('Literal');
		var ArrayExpression  = js_nodeFactory('ArrayExpression');
		var RegexLiteral     = js_nodeFactory('RegexLiteral');
		var ObjectExpression = js_nodeFactory('ObjectExpression');
		var Property         = js_nodeFactory('Property');
		var usedCtors = {};
		function NULL(){
			var L = Literal(null); delete L.raw; return L;
		}
		function revInner(node){
			if (false){ console.log(typedParamsBook, ctors, syntax, esprimaConstructorParams, womb, CallExpression, Identifier, Literal, ArrayExpression, RegexLiteral, usedCtors); }
			if (node===null) return NULL();
			if ((typeof node)!=='object'){ debugger; throw new Error('object expected'); }
			var nodeCtorName = node.constructor.name;
			var ctorName, ctor, paraTypes, argsArr;
			if (nodeCtorName==='Object'){

			} else {
				if (node.type===nodeCtorName){
					ctorName = nodeCtorName;
				} else {
					if ( (node.type in syntax) && (nodeCtorName in syntax[node.type]) ){
						ctorName = nodeCtorName;
					} else {
						if ( (node.type in SubTypeOf) && (SubTypeOf[node.type]===nodeCtorName) ){
							ctorName = nodeCtorName;
						} else {
							if (node.type in specialCtors){
								ctorName = node.type;
							} else {
								debugger; throw new Error('unexpected');
							}
						}
					}
				}
			}
			if (!( (ctorName in ctors) || (ctorName in specialCtors) )){
				debugger; throw new Error('constructor not found. probably malformed data.');
			}
			usedCtors[ctorName] = null;
			paraTypes = typedParamsBook[ctorName];
			argsArr = [];
			for (var i=0; i<paraTypes.length; i++){
				var o    = paraTypes[i];
				var prop = Object.keys(o)[0];
				var type = o[prop];
				var actionBook = {
					 NODE   : function(val){ return revInner(val); }
					,STRING : function(val){
						if ((typeof val)==='string'){ var L = Literal(val); delete L.raw; return L; }
						debugger; throw new Error('string expected');
					}
					,_STRING : function(val){
						if ((typeof val)==='string'){ var L = Literal(val); delete L.raw; return L; }
						debugger; throw new Error('string expected');
					}
					,BOOLEAN: function(val){
						if ((typeof val)==='boolean'){ var L = Literal(val); delete L.raw; return L; }
						debugger; throw new Error('boolean expected');
					}
					,ARRAY  : function(val){
						if (!Array.isArray(val)){ debugger; throw new Error('Arary expected'); }
						return ArrayExpression(val.map(revInner));
					}
					,HETEROGEN: function(val){
						var L = Literal(val); delete L.raw; return L;
					}
					,REGEX: function(val){
						if ( val && ((typeof val)==='object') && (val instanceof RegExp) ){
							var R = RegexLiteral(val); delete R.raw; delete R.regex; return R;
						}
						debugger; throw new Error('regular expression expected');
					}
					,_OBJ : function(val){
						if (node.constructor===ctors.RegexLiteral){
							if ((typeof node.value)==='object' && (node.value instanceof RegExp)){
								var pattern = Literal(node.value.source); delete pattern.raw;
								var flags   = Literal(node.value.flags);  delete flags.raw;
								return ObjectExpression([
									Property('init', Identifier('pattern'), false, pattern, false, false),
									Property('init', Identifier('flags'  ), false, flags  , false, false)
								]);
							} else {
								debugger; throw new Error('very unexpected');
							}
						} else {
							var args = Object.keys(val).map(function(key){
								var v = val[key];
								var _kind = 'init';
								var _key = Identifier(key);
								var _computed = false, _method = false, _shorthand = false;
								var _value = Literal(v); delete _value.raw;
								return Property(_kind, _key, _computed, _value, _method, _shorthand);
							});
							return ObjectExpression(args);
						}
					}
				};
				if (type in actionBook){
					if (prop in node){
						argsArr.push(actionBook[type](node[prop]));
					} else {
						if ((type==="STRING")&&(ctorName==="AssignmentExpression")&&(node.type==="AssignmentPattern")&&(prop==="operator")){
							debugger;
							argsArr.push(actionBook[type]('='));
						} else {
							debugger; throw new Error('property not found. probably malformed data.');
						}
					}
				} else {
					debugger; throw new Error('handler for type not found. probably malformed data.');
				}
			}
			return CallExpression(Identifier(ctorName), argsArr);
		}
		var metaAst = revInner(ast);
		var source = escodegen.generate(metaAst);
		var ctorNames = Object.keys(usedCtors);
		var func = new Function(ctorNames, 'return ' + source);
		return func;
	}
	womb.reverse = reverse;
	return womb;
})();
function traverseAST(root, onEnter, onLeave){
    function visitAll(root, enter, leave){
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
    visitAll(root,
        typeof onEnter==='function' ? onEnter : function(){},
        typeof onLeave==='function' ? onLeave : function(){}
    );
}
