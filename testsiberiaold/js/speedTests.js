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
					inner(stack.concat(arr[i]));
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
function uncleified_complete_binary_tree(depth){
	return uncleify(completeBinaryTree(depth));
}
function nephewified_complete_binary_tree(depth){
	return nephewify(completeBinaryTree(depth));
}
function make_complete_graph(size){
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
}
function make_double_linked_list(size){
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
}
function create_create_test(remove_cycles_func, restore_cycles_func){
	return function(inputGeneratorFunction){
		return function(depth){
			try {
			    var inputObject = inputGeneratorFunction(depth);
			    var start = performance.now();
			    var cycleFree = remove_cycles_func(inputObject);
			    var end1 = performance.now();
			    var duration1 = Math.round(1000*(end1 - start))/1000;
			    var length = JSON.stringify(cycleFree).length;
			    start = performance.now();
			    var roundTrip = restore_cycles_func(cycleFree);
			    var end2 = performance.now();
			    var duration2 = Math.round(1000*(end2 - start))/1000;
			    return [depth, duration1, length, duration2];
			} catch(e){
				console.log(e);
				return [depth, 'error', 'error', 'error'];
			}
		}
	};
}
function factoryMaker(tagName){
	// ripping the heart out of my unfinished letThereBe library, so you can run the tests without the library.
	return function (){
		var retval = document.createElement(tagName);
		function append(item){
			var type = typeof item;
			if (type==='string'||type==='number'){
				retval.appendChild(document.createTextNode(item));
			} else {
				if (Array.isArray(item)){
					item.forEach(append);
				} else {
					retval.appendChild(item);
				}
			}
		}
		for(var i=0; i<arguments.length; i++){
			append(arguments[i]);
		}
		return retval;
	}
}
var h1      = factoryMaker('h1');
var hr      = factoryMaker('hr');
var table   = factoryMaker('table');
var tr      = factoryMaker('tr');
var th      = factoryMaker('th');
var td      = factoryMaker('td');
var caption = factoryMaker('caption');
var a       = factoryMaker('a');
var button  = factoryMaker('button');

function Task(action, actionArgs, onFinish){
	this.action = action;
	this.actionArgs = actionArgs;
	this.onFinish = onFinish;
}
Task.prototype.perform = function(){
	var actionResult = this.action.apply(null, this.actionArgs);
	this.onFinish(actionResult);
}

function Test(afterDone, run){
	this.Tasks = [];
	this.currentTaskIndex = 0;
	this.afterDone = afterDone;
	this.run = run;
}
Test.prototype.executeNextTask = function(){
	if (this.currentTaskIndex >= this.Tasks.length) {
		this.afterDone();
		return;
	}
	this.Tasks[this.currentTaskIndex].perform();
	++this.currentTaskIndex;
	var THIS = this;
	window.setTimeout(
		function(){ THIS.executeNextTask(); }, 1
	);
};
Test.prototype.addTask = function(action, actionArgs, onFinish){
	this.Tasks.push(new Task(action, actionArgs, onFinish));
};
function addClearButton(resultContainer){
	var b;
	var btns = resultContainer.querySelectorAll('button');
	if (btns.length > 0){
		resultContainer.appendChild(btns[0]);
	} else {
		b = button('clear'); resultContainer.appendChild(b);
		b.addEventListener('click', function(){
			resultContainer.innerHTML = '';
		});
	}
}
function prepare_uncles_test(resultContainer, maxDepth){
	return new Test(
		function uncles_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var maxDepth = Math.min(this.siberianMaxDepth, this.crockfordianMaxDepth);
			for (var depth=1; depth<maxDepth; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function uncles_run(){
			var siberianMaxDepth = this.siberianMaxDepth = 1 + maxDepth;
			var crockfordianMaxDepth = this.crockfordianMaxDepth = 1 + maxDepth;
			var siberianTest = create_create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify)(uncleified_complete_binary_tree);
			var crockfordianTest = create_create_test(JSON.decycle, JSON.retrocycle)(uncleified_complete_binary_tree);
			var siberianTable = table(
				caption('siberia'),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("Douglas Crockford's cycle.js"),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('depth')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			//resultContainer.appendChild(h1('complete binary tree with uncle pointers'));
			resultContainer.appendChild(siberianTable);
			for (var depth=1; depth<siberianMaxDepth; depth++){
				this.addTask(siberianTest, [depth], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var depth=1; depth<crockfordianMaxDepth; depth++){
				this.addTask(crockfordianTest, [depth], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}
function prepare_completGraph_test(resultContainer){
	var sizes  = [10,15,20,30,40,50,60,80,100,150,200,300,400,500,1000];
	return new Test(
		function completeGraph_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var L1 = siberianTable.childNodes[1].childNodes.length;
			var L2 = crockfordianTable.childNodes[1].childNodes.length;
			var L = Math.min(L1, L2);
			for (var depth=1; depth<L; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function completeGraph_run(){
			var siberianTest = create_create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify)(make_complete_graph);
			var crockfordianTest = create_create_test(JSON.decycle, JSON.retrocycle)(make_complete_graph);
			var siberianTable = table(
				caption('siberia'),
				tr(th('size')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("Douglas Crockford's cycle.js"),
				tr(th('size')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('size')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			resultContainer.appendChild(siberianTable);
			for (var i=0; i<sizes.length; i++){
				var size = sizes[i];
				this.addTask(siberianTest, [size], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var i=0; i<sizes.length; i++){
				var size = sizes[i];
				this.addTask(crockfordianTest, [size], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}
function prepare_doubleLinkedList_test(resultContainer){
	var sizes  = [10,15,20,30,40,50,60,80,100,150,200,300,400,500,600,800,1000,1500,2000,3000,4000,5000];
	return new Test(
		function doubleLinkedList_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var L1 = siberianTable.childNodes[1].childNodes.length;
			var L2 = crockfordianTable.childNodes[1].childNodes.length;
			var L = Math.min(L1, L2);
			for (var depth=1; depth<L; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function doubleLinkedList_run(){
			var siberianTest = create_create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify)(make_double_linked_list);
			var crockfordianTest = create_create_test(JSON.decycle, JSON.retrocycle)(make_double_linked_list);
			var siberianTable = table(
				caption('siberia'),
				tr(th('size')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("Douglas Crockford's cycle.js"),
				tr(th('size')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('size')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			resultContainer.appendChild(siberianTable);
			for (var i=0; i<sizes.length; i++){
				var size = sizes[i];
				this.addTask(siberianTest, [size], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var i=0; i<sizes.length; i++){
				var size = sizes[i];
				this.addTask(crockfordianTest, [size], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}

function prepare_nephews_test(resultContainer, maxDepth){
	return new Test(
		function nephews_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var maxDepth = Math.min(this.siberianMaxDepth, this.crockfordianMaxDepth);
			for (var depth=1; depth<maxDepth; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function nephews_run(){
			var siberianMaxDepth = this.siberianMaxDepth = 1 + maxDepth;
			var crockfordianMaxDepth = this.crockfordianMaxDepth = 1 + maxDepth;
			var siberianTest = create_create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify)(nephewified_complete_binary_tree);
			var crockfordianTest = create_create_test(JSON.decycle, JSON.retrocycle)(nephewified_complete_binary_tree);
			var siberianTable = table(
				caption('siberia'),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("Douglas Crockford's cycle.js"),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('depth')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			resultContainer.appendChild(siberianTable);
			for (var depth=1; depth<siberianMaxDepth; depth++){
				this.addTask(siberianTest, [depth], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var depth=1; depth<crockfordianMaxDepth; depth++){
				this.addTask(crockfordianTest, [depth], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}

function prepare_nephews_test_JSONplain(resultContainer, maxDepth){
	return new Test(
		function nephews_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var maxDepth = Math.min(this.siberianMaxDepth, this.crockfordianMaxDepth);
			for (var depth=1; depth<maxDepth; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function nephews_run(){
			var siberianMaxDepth = this.siberianMaxDepth = 1 + maxDepth;
			var crockfordianMaxDepth = this.crockfordianMaxDepth = 1 + maxDepth;
			var siberianTest = create_create_test(JSON.Siberia.serialize, JSON.Siberia.unserialize)(nephewified_complete_binary_tree);
			var crockfordianTest = create_create_test(JSON.stringify, JSON.parse)(nephewified_complete_binary_tree);
			var siberianTable = table(
				caption('siberia'),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("plain JSON"),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('depth')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			resultContainer.appendChild(siberianTable);
			for (var depth=1; depth<siberianMaxDepth; depth++){
				this.addTask(siberianTest, [depth], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var depth=1; depth<crockfordianMaxDepth; depth++){
				this.addTask(crockfordianTest, [depth], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}
function prepare_noCycles_test_JSONplain(resultContainer, maxDepth){
	return new Test(
		function nephews_afterDone(){
			function round(x){
				if (x<=10) return Math.round(10*x)/10;
				return Math.round(x);
			}
			var body              = this.resultContainer;
			var siberianTable     = this.siberianTable;
			var crockfordianTable = this.crockfordianTable;
			var ratiosTable       = this.ratiosTable;
			var maxDepth = Math.min(this.siberianMaxDepth, this.crockfordianMaxDepth);
			for (var depth=1; depth<maxDepth; depth++){
				var duration1_siberian     = +siberianTable.childNodes[2].childNodes[depth].textContent;
				var duration1_crockfordian = +crockfordianTable.childNodes[2].childNodes[depth].textContent;
				var duration2_siberian     = +siberianTable.childNodes[4].childNodes[depth].textContent;
				var duration2_crockfordian = +crockfordianTable.childNodes[4].childNodes[depth].textContent;
				var strLength_siberian     = +siberianTable.childNodes[3].childNodes[depth].textContent;
				var strLength_crockfordian = +crockfordianTable.childNodes[3].childNodes[depth].textContent;
				var totalDuration_siberian = duration1_siberian + duration2_siberian;
				var totalDuration_crockfordian = duration1_crockfordian + duration2_crockfordian;
				var ratio1 = duration1_crockfordian / duration1_siberian;
				var ratio2 = duration2_crockfordian / duration2_siberian;
				var ratioBoth = totalDuration_crockfordian / totalDuration_siberian;
				var ratioStrlength = strLength_crockfordian / strLength_siberian;

				ratiosTable.childNodes[1].appendChild(th(depth));
				ratiosTable.childNodes[2].appendChild(td(round(ratio1)));
				ratiosTable.childNodes[3].appendChild(td(round(ratio2)));
				ratiosTable.childNodes[4].appendChild(td(round(ratioBoth)));
				ratiosTable.childNodes[5].appendChild(td(round(ratioStrlength)));
			}
			body.appendChild(ratiosTable);
			addClearButton(body);
		},
		function nephews_run(){
			var siberianMaxDepth = this.siberianMaxDepth = 1 + maxDepth;
			var crockfordianMaxDepth = this.crockfordianMaxDepth = 1 + maxDepth;
			var siberianTest = create_create_test(JSON.Siberia.serialize, JSON.Siberia.unserialize)(completeBinaryTree);
			var crockfordianTest = create_create_test(JSON.stringify, JSON.parse)(completeBinaryTree);
			var siberianTable = table(
				caption('siberia'),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var crockfordianTable = table(
				caption("plain JSON"),
				tr(th('depth')),
				tr(th('duration decycle (ms)')),
				tr(th('size after decyle (string length)')),
				tr(th('duration retrocycle (ms)'))
			);
			var ratiosTable = table(
				caption("ratios"),
				tr(th('depth')),
				tr(th('decycle ratio')),
				tr(th('retrocycle ratio')),
				tr(th('decycle + retrocycle ratio')),
				tr(th('string length ratio'))
			);
			//resultContainer.appendChild(h1('complete binary tree with uncle pointers'));
			resultContainer.appendChild(siberianTable);
			for (var depth=1; depth<siberianMaxDepth; depth++){
				this.addTask(siberianTest, [depth], function(testResult){
					siberianTable.childNodes[1].appendChild(th(testResult[0]));
					siberianTable.childNodes[2].appendChild(td(testResult[1]));
					siberianTable.childNodes[3].appendChild(td(testResult[2]));
					siberianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			resultContainer.appendChild(crockfordianTable);
			for (var depth=1; depth<crockfordianMaxDepth; depth++){
				this.addTask(crockfordianTest, [depth], function(testResult){
					crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
					crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
					crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
					crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
				});
			}
			resultContainer.appendChild(hr());
			this.siberianTable = siberianTable;
			this.crockfordianTable = crockfordianTable;
			this.ratiosTable = ratiosTable;
			this.resultContainer = resultContainer;
			this.executeNextTask();
		}
	);
}
