function moronsDeepEqual(firstItem, secondItem){
	function eqAux(item1, item2){
        var type1 = typeof item1;
        var type2 = typeof item2;
        if (type1!==type2) return false;
        if ((type1==='number')&&isNaN(item1)&&isNaN(item2)) return true;
        if (type1!=='object') return (item1===item2);
        if (item1===null) return (item2===null);
        if (item2===null) return (item1===null);
        return 'maybe';
    }
    function innerMoronsDeepEQ(obj1, obj2){
        var seen1 = new WeakSet();
        var seen2 = new WeakSet();
        var maxDepth = 1;
        var foundNewObjects_1, foundNewObjects_2;
        function calcOwnKeys(node1, node2, ownKeys){
            var allKeys = {}, key;
            if (Object.getPrototypeOf(node1)!==Object.getPrototypeOf(node2)) return false;
            if (!seen1.has(node1)){ foundNewObjects_1 = true; seen1.add(node1); }
            if (!seen2.has(node2)){ foundNewObjects_2 = true; seen2.add(node2); }
            for (key in node1){ if (!(key in node2)) return false; allKeys[key] = null; }
            for (key in node2){ if (!(key in node1)) return false; allKeys[key] = null; }
            for (var key in allKeys){
                var own1 = node1.hasOwnProperty(key), own2 = node2.hasOwnProperty(key);
                if (own1!==own2) return false;
                if (own1) { ownKeys.push(key); }
            }
            return true;
        }
        function equalUpToMaxDepth(node1, node2, currentDepth){
        	var ownKeys = [], recurseFor = [];
            if (!calcOwnKeys(node1, node2, ownKeys)) return false;
            var key, val1, val2, i, j, comp;
            for (i=0; i<ownKeys.length; i++){
                key = ownKeys[i];
                val1 = node1[key]; val2 = node2[key];
                comp = eqAux(val1, val2);
                if ((typeof comp)==='boolean'){
                	if (!comp) return false;
                } else {
                	recurseFor.push(key);
                }
            }
            if (currentDepth<=maxDepth){
		        for (j=0; j<recurseFor.length; j++){
		            key = recurseFor[j];
		            val1 = node1[key]; val2 = node2[key];
		            if (!equalUpToMaxDepth(val1, val2, 1+currentDepth)) return false;
		        }
            }
            return true;
        }
        while (true){
		    foundNewObjects_1 = false;
		    foundNewObjects_2 = false;
        	if (!equalUpToMaxDepth(obj1, obj2, 0)) return false;
        	if ((!foundNewObjects_1)&&(!foundNewObjects_2)) return true;
        	maxDepth++;
        }
    }
    var ans = eqAux(firstItem, secondItem);
    if ((typeof ans)==='boolean') return ans;
    return innerMoronsDeepEQ(firstItem, secondItem);
}

function test1(){
	var o1 = [{},{}];
	var subItem = {};
	var o2 = [subItem, subItem];
	var o3 = [{}, {}];
	console.log('moronic', [moronsDeepEqual(o1,o2), moronsDeepEqual(o1,o3), moronsDeepEqual(o2,o3)]);
	console.log('sane', [JSON.Siberia.deepEqual(o1,o2), JSON.Siberia.deepEqual(o1,o3), JSON.Siberia.deepEqual(o2,o3)]);
}
function test2(){
	var o1 = []; o1.push(o1);
	var o2 = []; o2.push(o2);
	var o3 = [[]]; o3[0].push(o3);
	console.log('moronic', [moronsDeepEqual(o1,o2), moronsDeepEqual(o1,o3), moronsDeepEqual(o2,o3)]);
	console.log('sane', [JSON.Siberia.deepEqual(o1,o2), JSON.Siberia.deepEqual(o1,o3), JSON.Siberia.deepEqual(o2,o3)]);
}

function makeToolshed(){
	var nut = {name: 'nut'};
	var bolt = {name: 'bolt'};
	nut.needs = bolt;
	bolt.needs = nut;
	return {
		nut: nut,
		bolt: bolt
	};
}
function detangledToolsheds(){
	var alberts_shed = makeToolshed();
	var babsies_shed = makeToolshed();
	return {
		albert: alberts_shed,
		babsie: babsies_shed
	}
}
function entangledToolsheds(){
	var albert_nut  = {name: 'nut'};
	var babsie_nut  = {name: 'nut'};
	var albert_bolt = {name: 'bolt'};
	var babsie_bolt = {name: 'bolt'};
	albert_nut.needs = babsie_bolt;
	albert_bolt.needs = babsie_nut;
	babsie_nut.needs = albert_bolt;
	babsie_bolt.needs = albert_nut;
	var alberts_shed = {
		nut : albert_nut,
		bolt: albert_bolt
	};
	var babsies_shed = {
		nut : babsie_nut,
		bolt: babsie_bolt
	};
	return {
		albert: alberts_shed,
		babsie: babsies_shed
	}
}
////////////////////////////////////////
function makeToolshedDAG(){
	var nut = {name: 'nut'};
	var bolt = {name: 'bolt'};
	nut.needs = bolt;
	return {
		nut: nut,
		bolt: bolt
	};
}
function detangledToolshedsDAG(){
	var alberts_shed = makeToolshedDAG();
	var babsies_shed = makeToolshedDAG();
	return {
		albert: alberts_shed,
		babsie: babsies_shed
	}
}
function entangledToolshedsDAG(){
	var albert_nut  = {name: 'nut'};
	var babsie_nut  = {name: 'nut'};
	var albert_bolt = {name: 'bolt'};
	var babsie_bolt = {name: 'bolt'};
	albert_nut.needs = babsie_bolt;
	babsie_nut.needs = albert_bolt;
	var alberts_shed = {
		nut : albert_nut,
		bolt: albert_bolt
	};
	var babsies_shed = {
		nut : babsie_nut,
		bolt: babsie_bolt
	};
	return {
		albert: alberts_shed,
		babsie: babsies_shed
	}
}
function innerEqualities(item){
    return [
        item.albert.nut.needs === item.albert.bolt, item.albert.nut.needs === item.babsie.bolt,
        item.babsie.nut.needs === item.babsie.bolt, item.babsie.nut.needs === item.albert.bolt
    ];
}
function test3(){
	var det = detangledToolshedsDAG();
	var ent = entangledToolshedsDAG();
	console.log(JSON.stringify(det)===JSON.stringify(ent), moronsDeepEqual(ent, det), JSON.Siberia.deepEqual(ent, det));
	console.log(innerEqualities(det));
	console.log(innerEqualities(ent));
	console.log(innerEqualities(JSON.parse(JSON.stringify(det))));
}
