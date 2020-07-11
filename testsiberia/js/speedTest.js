function stackInfo(){
	var eee = new Error('');
	return eee.stack.split('\n').slice(2).map(function(str){
	    var i1=str.indexOf('at '),i2=str.indexOf('http://');
	    var name = str.slice(3+i1,i2-2);
	    return name + str.slice(i2).split(':').slice(-2).join(',').replace(')','').split(',').map(function(x){return +x}).join('/')
	});
}
function stackDepth(){
	var eee = new Error('');
	return eee.stack.split('\n').length-2;
}
var DataGenerator = (function(){
	function range(start, stop, step) {
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
	function multiForEach(func) {
		return function(arr2d) {
			var LEVEL = arr2d.length;
			function inner(stack) {
				var level = stack.length;
				if (level >= LEVEL) {
					func(stack);
				} else {
					var arr = arr2d[level];
					for (var i = 0; i < arr.length; i++) {
						inner(stack.concat([arr[i]]));
					}
				}
			}
			inner([]);
		}
	};
	function completeBinaryTree(depth) {
		var root = {};
		multiForEach(function(arr) {
			var node = root;
			var value = '';
			for (var i = 0; i < arr.length; i++) {
				var a = arr[i];
				value = value + a;
				if (!(a in node)) {
					node[a] = {};
				}
				node = node[a];
			}
			node.value = value;
		})(range(depth).map(function() {
			return ['L', 'R'];
		}));
		return root;
	}
	function uncleify(tree){
	    if (!tree) return;
	    if (typeof tree !== 'object') return;
	    function inflate(node, sibling){
	        var  hasL = (typeof    node.L === 'object');
	        var  hasR = (typeof    node.R === 'object');
	        var _hasL = (typeof sibling.L === 'object');
	        var _hasR = (typeof sibling.R === 'object');
	        if ( hasL){    node.L.uncle = sibling; }
	        if ( hasR){    node.R.uncle = sibling; }
	        if (_hasL){ sibling.L.uncle = node;    }
	        if (_hasR){ sibling.R.uncle = node;    }
	        if ( hasL &&  hasR){ inflate(   node.L,    node.R); }
	        if (_hasL && _hasR){ inflate(sibling.L, sibling.R); }
	    }
	    var hasL = (typeof tree.L === 'object');
	    var hasR = (typeof tree.R === 'object');
	    if (hasL && hasR) { inflate(tree.L, tree.R); }
	    return tree;
	}
	function nephewify(tree){
	    if (!tree) return;
	    if (typeof tree !== 'object') return;
	    function inflate(node, sibling){
	        var  hasL = (typeof    node.L === 'object');
	        var  hasR = (typeof    node.R === 'object');
	        var _hasL = (typeof sibling.L === 'object');
	        var _hasR = (typeof sibling.R === 'object');
	        if ( hasL){    sibling.leftNephew  = node.L; }
	        if ( hasR){    sibling.rightNephew = node.R; }
	        if (_hasL){ node.leftNephew  = sibling.L;    }
	        if (_hasR){ node.rightNephew = sibling.R;    }
	        if ( hasL &&  hasR){ inflate(   node.L,    node.R); }
	        if (_hasL && _hasR){ inflate(sibling.L, sibling.R); }
	    }
	    var hasL = (typeof tree.L === 'object');
	    var hasR = (typeof tree.R === 'object');
	    if (hasL && hasR) { inflate(tree.L, tree.R); }
	    return tree;
	}
	var g = {
		uncles : function(depth){
			return uncleify(completeBinaryTree(depth));
		},
		complete : function(size){
			var nodes = [];
			var i, j;
			for (i=0; i<size; i++){
				nodes[i] = { links: [] };
			}
			for (i=0; i<size; i++){
				for (j=0; j<size; j++){
					if (j!==i){
						nodes[i].links.push(nodes[j]);
					}
				}
			}
			return nodes;
		},
		dll: function(size){
			var nodes = [];
			var i;
			for (i=0; i<size; i++){
				nodes[i] = { index: i, prev: null, next: null };
			}
			for (i=0; i<size-1; i++){
				nodes[i].next = nodes[i+1];
				nodes[i+1].prev = nodes[i];
			}
			return nodes;
		},
		nephews : function(depth){
			return nephewify(completeBinaryTree(depth));
		}
	};

	return g;

})();

function Runner_Siberia(data, callback1, callback2){
	this.data      = data;
	this.callback1 = callback1;
	this.callback2 = callback2;
}
Runner_Siberia.prototype.run = function(){
	var time_0, time_1, froz, duration_freeze, str, length;
	var THIS = this;
	try {
		time_0 = performance.now();
		froz = JSON.Siberia.forestify(this.data);
		time_1 = performance.now();
		duration_freeze = time_1 - time_0;
		str = JSON.Siberia.stringify(froz);
		length = str.length;
		this.callback1(null, duration_freeze, length);
		window.setTimeout(function(){
			THIS.part2(froz);
		}, 1);
	} catch(e){
		this.callback1(e);
		this.callback2('n/a');
	}
};
Runner_Siberia.prototype.part2 = function(froz){
	var time_0, time_1, thawed, duration_thaw;
	try {
		time_0 = performance.now();
		thawed = JSON.Siberia.unforestify(froz);
		time_1 = performance.now();
		duration_thaw = time_1 - time_0;
		this.callback2(null, JSON.Siberia.deepEqual(this.data, thawed), duration_thaw);
	} catch(e){
		this.callback2(e);
	}
};

function Runner_Doug(data, callback1, callback2){
	this.data      = data;
	this.callback1 = callback1;
	this.callback2 = callback2;
}

Runner_Doug.prototype.run = function(){
	var time_0, time_1, froz, duration_freeze, str, length;
	var THIS = this;
	try {
		time_0 = performance.now();
		froz = JSON.decycle(this.data);
		time_1 = performance.now();
		duration_freeze = time_1 - time_0;
		str = JSON.stringify(froz);
		length = str.length;
		this.callback1(null, duration_freeze, length);
		window.setTimeout(function(){
			THIS.part2(froz);
		}, 1);
	} catch(e){
		this.callback1(e);
		this.callback2('n/a');
	}
};
Runner_Doug.prototype.part2 = function(froz){
	var time_0, time_1, thawed, duration_thaw;
	try {
		time_0 = performance.now();
		thawed = JSON.retrocycle(froz);
		time_1 = performance.now();
		duration_thaw = time_1 - time_0;
		this.callback2(null, JSON.Siberia.deepEqual(this.data, thawed), duration_thaw);
	} catch(e){
		this.callback2(e);
	}
};
// https://stackoverflow.com/questions/32793484/test-deep-equality-with-sharing-of-javascript-objects
// https://stackoverflow.com/questions/7826992/browser-javascript-stack-size-limit

function deepEqual_AndersKaseorg(a, b) {
    let left = new Map(), right = new Map(), has = Object.prototype.hasOwnProperty;
    function visit(a, b) {
        if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null)
            return a === b;
        if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
            return false;
        if (left.has(a))
            return left.get(a) === b
        if (right.has(b))
            return right.get(b) === a
        for (let k in a)
            if (has.call(a, k) && !has.call(b, k))
                return false;
        for (let k in b)
            if (has.call(b, k) && !has.call(a, k))
                return false;
        left.set(a, b);
        right.set(b, a);
        for (let k in a)
            if (has.call(a, k) && !visit(a[k], b[k]))
                return false;
        return true;
    }
    return visit(a, b);
}

