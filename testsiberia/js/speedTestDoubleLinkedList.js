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

function create_test(remove_cycles_func, restore_cycles_func){
	return function(size){
		try {
		    var inputObject = make_double_linked_list(size);
		    var start = performance.now();
		    var cycleFree = remove_cycles_func(inputObject);
		    var end1 = performance.now();
		    var duration1 = Math.round(1000*(end1 - start))/1000;
		    var length = JSON.stringify(cycleFree).length;
		    start = performance.now();
		    var roundTrip = restore_cycles_func(cycleFree);
		    var end2 = performance.now();
		    var duration2 = Math.round(1000*(end2 - start))/1000;
		    return [size, duration1, length, duration2];
		} catch(e){
			return [size, 'error', 'error', 'error'];
		}
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
var sizes  = [10,15,20,30,40,50,60,80,100,150,200,300,400,500,600,800,1000,1500,2000,3000,4000,5000];

function runSpeedTest(){
	var body = document.body;
	var siberianTest = create_test(JSON.Siberia.forestify, JSON.Siberia.unforestify);
	var crockfordianTest = create_test(JSON.decycle, JSON.retrocycle);
	siberianTable = table(
		caption('siberia'),
		tr(th('size')),
		tr(th('duration decycle (ms)')),
		tr(th('size after decyle (string length)')),
		tr(th('duration retrocycle (ms)'))
	);
	crockfordianTable = table(
		caption("Douglas Crockford's cycle.js"),
		tr(th('size')),
		tr(th('duration decycle (ms)')),
		tr(th('size after decyle (string length)')),
		tr(th('duration retrocycle (ms)'))
	);
	ratiosTable = table(
		caption("ratios"),
		tr(th('size')),
		tr(th('decycle ratio')),
		tr(th('retrocycle ratio')),
		tr(th('decycle + retrocycle ratio')),
		tr(th('string length ratio'))
	);
	body.appendChild(h1('double linked list'));
	body.appendChild(siberianTable);
	for (var i=0; i<sizes.length; i++){
		var size = sizes[i];
		Tasks.push(new Task(siberianTest, [size], function(testResult){
			siberianTable.childNodes[1].appendChild(th(testResult[0]));
			siberianTable.childNodes[2].appendChild(td(testResult[1]));
			siberianTable.childNodes[3].appendChild(td(testResult[2]));
			siberianTable.childNodes[4].appendChild(td(testResult[3]));
		}));
	}
	body.appendChild(hr());
	body.appendChild(crockfordianTable);
	for (var i=0; i<sizes.length; i++){
		var size = sizes[i];
		Tasks.push(new Task(crockfordianTest, [size], function(testResult){
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
	var anchorBack = a('back to speed tests');
	anchorBack.setAttribute('href', 'speedTest.html');
	body.appendChild(anchorBack);
}