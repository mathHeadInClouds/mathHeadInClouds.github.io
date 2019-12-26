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
function makeInputTree(depth){
	return nephewify(completeBinaryTree(depth));
}
function create_test(remove_cycles_func, restore_cycles_func){
	return function(depth){
	    var inputTree = makeInputTree(depth);
	    var start = performance.now();
	    var cycleFree = remove_cycles_func(inputTree);
	    var end1 = performance.now();
	    var duration1 = Math.round(1000*(end1 - start))/1000;
	    var length = JSON.stringify(cycleFree).length;
	    start = performance.now();
	    var roundTrip = restore_cycles_func(cycleFree);
	    var end2 = performance.now();
	    var duration2 = Math.round(1000*(end2 - start))/1000;
	    return [depth, duration1, length, duration2];
	}
}
function factoryMaker(tagName){
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

var Tasks = [];
function Task(action, actionArgs, onFinish){
	this.action = action;
	this.actionArgs = actionArgs;
	this.onFinish = onFinish;
}
Task.prototype.perform = function(){
	var actionResult = this.action.apply(null, this.actionArgs);
	this.onFinish(actionResult);
}
var currentTaskIndex = 0;
function executeNextTask(){
	if (currentTaskIndex >= Tasks.length) {
		afterDone();
		return;
	}
	Tasks[currentTaskIndex].perform();
	++currentTaskIndex;
	window.setTimeout(executeNextTask, 1);
}

var siberianTable, crockfordianTable, ratiosTable;
var siberianMaxDepth = 16;
var crockfordianMaxDepth = 16;

function runSpeedTest(){
	var body = document.body;
	var siberianTest = create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify);
	var crockfordianTest = create_test(JSON.decycle, JSON.retrocycle);
	siberianTable = table(
		caption('siberia'),
		tr(th('depth')),
		tr(th('duration decycle (ms)')),
		tr(th('size after decyle (string length)')),
		tr(th('duration retrocycle (ms)'))
	);
	crockfordianTable = table(
		caption("Douglas Crockford's cycle.js"),
		tr(th('depth')),
		tr(th('duration decycle (ms)')),
		tr(th('size after decyle (string length)')),
		tr(th('duration retrocycle (ms)'))
	);
	ratiosTable = table(
		caption("ratios"),
		tr(th('depth')),
		tr(th('decycle ratio')),
		tr(th('retrocycle ratio')),
		tr(th('decycle + retrocycle ratio')),
		tr(th('string length ratio'))
	);
	body.appendChild(h1('complete binary tree with nephew pointers'));
	body.appendChild(siberianTable);
	for (var depth=1; depth<siberianMaxDepth; depth++){
		Tasks.push(new Task(siberianTest, [depth], function(testResult){
			siberianTable.childNodes[1].appendChild(th(testResult[0]));
			siberianTable.childNodes[2].appendChild(td(testResult[1]));
			siberianTable.childNodes[3].appendChild(td(testResult[2]));
			siberianTable.childNodes[4].appendChild(td(testResult[3]));
		}));
	}
	body.appendChild(hr());
	body.appendChild(crockfordianTable);
	for (var depth=1; depth<crockfordianMaxDepth; depth++){
		Tasks.push(new Task(crockfordianTest, [depth], function(testResult){
			crockfordianTable.childNodes[1].appendChild(th(testResult[0]));
			crockfordianTable.childNodes[2].appendChild(td(testResult[1]));
			crockfordianTable.childNodes[3].appendChild(td(testResult[2]));
			crockfordianTable.childNodes[4].appendChild(td(testResult[3]));
		}));
	}
	body.appendChild(hr());
	executeNextTask();
}

function round(x){
	if (x<=10) return Math.round(10*x)/10;
	return Math.round(x);
}
function afterDone(){
	var body = document.body;
	var maxDepth = Math.min(siberianMaxDepth, crockfordianMaxDepth);
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
	var anchorBack = a('back to speed tests');
	anchorBack.setAttribute('href', 'speedTest.html');
	body.appendChild(anchorBack);
}