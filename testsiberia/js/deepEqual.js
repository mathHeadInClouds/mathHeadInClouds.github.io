function deepEqual(source, target, maxRuntimeMillis){
	if (arguments.length <= 2){
		maxRuntimeMillis = 100;
	}
	var startTime = performance.now();
	var maxDepth = 0;
	var currentTime, duration;
	function stop(){
		currentTime = performance.now();
		duration = currentTime - startTime;
		duration = Math.round(200*duration)/200;
	}
	var stack = [];
	var crashDepth;
	function testEqual(sourceNode, targetNode, depth){
		crashDepth = depth;
		var ty1 = typeof sourceNode;
		var ty2 = typeof targetNode;
		if (ty1!==ty2) throw {msg: 'type clash'};
		var type = ty1;
		if (type==='number'){
			if (isNaN(sourceNode)&&isNaN(targetNode)) return true;
		}
		if (sourceNode===targetNode) return true;
		if (type!=='object'){
			if (sourceNode!==targetNode) throw {msg: 'value clash', value1: sourceNode, value2: targetNode};
		}
		var null1 = (sourceNode===null);
		var null2 = (targetNode===null);
		if (null1 !== null2){
			throw {msg: 'nullness clash', source_null: null1, target_null: null2}
		}
		if (null1&&null2) return true;
		var keys1 = Object.keys(sourceNode);
		var keys2 = Object.keys(targetNode);
		var allKeysObj = {};
		keys1.forEach(function(key){ allKeysObj[key] = null; });
		keys2.forEach(function(key){ allKeysObj[key] = null; });
		var keyCount1 = keys1.length;
		var keyCount2 = keys2.length;
		var allKeys   = Object.keys(allKeysObj);
		var keyCount = allKeys.length;
		if (keyCount1<keyCount) throw {msg: 'keys clash', keys1: keys1, keys2: keys2};
		if (keyCount2<keyCount) throw {msg: 'keys clash', keys1: keys1, keys2: keys2};
		if (depth >= maxDepth) return true;
		for (var i=0; i<allKeys.length; i++){
			var key = allKeys[i];
			stack[depth] = key;
			testEqual(sourceNode[key], targetNode[key], depth+1);
		}
		return true;
	}
	try {
		while(true){
			testEqual(source, target, 0);
			stop();
			if (duration >= maxRuntimeMillis){
				return {
					result: true,
					maxDepth : maxDepth,
					duration : duration
				};
			}
			++maxDepth;
		}
	} catch(e){
		if (e instanceof Error){
			debugger;
			throw e;
		}
		stop();
		var retval = {
			result: false,
			maxDepth : maxDepth,
			duration : duration,
			depth    : crashDepth,
			stack    : stack.slice(0, crashDepth)
		};
		for (var key in e){
			retval[key] = e[key];
		}
		return retval;
	}
}