var AstWomb = (function(){
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
	        },
	        function(){
	            var node = ast.body[0].declarations[0];
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
	    ['try { 0; } catch(e) { 1; }', 3, 'CatchClause'],
	    ['var foo=5;', 0, 'VariableDeclaration'],
	    ['var foo=5;', 4, 'VariableDeclarator'],
	    ['throw foo', 0, 'ThrowStatement'],
	    ['if (true) foo=42', 0, 'IfStatement']
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
	
	var womb = function(f){
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
	womb.constructors = esprimaConstructors;
	womb.constructorParams = esprimaConstructorParams;
	womb.construct = js_nodeFactory;
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
