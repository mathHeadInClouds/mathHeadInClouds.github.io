var Lib;

var Joe = { name: 'Joe' }, Jane = { name: 'Jane' }, Apple = { name: 'Apple' }, Orange = { name: 'Orange' }, Pear = { name: 'Pear' };
function addlike(person, fruit){
    person.likes = person.likes || []; fruit.likedBy = fruit.likedBy || [];
    person.likes.push(fruit); fruit.likedBy.push(person);
}
addlike(Joe, Apple);addlike(Joe, Orange);addlike(Jane, Apple);addlike(Jane, Pear);
var Chief = { people: [Joe, Jane], fruits: [Apple, Orange, Pear] };

var InventorsAndInventions = (function(){
	var JAN=0, FEB=1, MAR=2, APR=3, MAY=4, JUN=5, JUL=6, AUG=7, SEP=8, OCT=9, NOV=10, DEC=11;
	var Inventors, Inventions;
	var wilhelm_2 = {
		shortName: 'Wilhelm II.',
		longName : 'Friedrich Wilhelm Viktor Albert von Preußen',
		born: new Date(1859, JAN, 27),
		died: new Date(1941, JUN, 4)
	};
	Inventors = [
		{
			names: ['Thomas', 'Alva', 'Edison'],
			born: new Date(1847, FEB, 11),
			died: new Date(1931, OCT, 18),
		},
		{
			names: ['Alexander', 'Graham', 'Bell'],
			born: new Date(1847, MAR, 3),
			died: new Date(1922, AUG, 2),
		},
		{
			names: ['Nikola', 'Tesla'],
			born: new Date(1856, JUL, 10),
			died: new Date(1943, JAN, 7)
		},
		{
			names: ['Alfred', 'Bernhard', 'Nobel'],
			born: new Date(1833, OCT, 21),
			died: new Date(1896, DEC, 10)
		},
		{
			names: ['Johannes', 'Gutenberg'],
			born: new Date(1400, JAN, 1),
			died: new Date(1468, FEB, 26)
		},
		{
			names: ['Konrad', 'Erst', 'Otto', 'Zuse'],
			born: new Date(1910, JUN, 22),
			died: new Date(1995, DEC, 18)
		},
		{
			names: ['James', 'Watt'],
			born: new Date(1736, JAN, 30),
			died: new Date(1819, AUG, 25)
		}
	];
	Inventions = [];
	Inventors.forEach(function(inventor){
		inventor.invented = [];
	});
	var Edison    = Inventors[0];
	var Bell      = Inventors[1];
	var Tesla     = Inventors[2];
	var Nobel     = Inventors[3];
	var Gutenberg = Inventors[4];
	var Zuse      = Inventors[5];
	var Watt      = Inventors[6];

	function invent(what, person){
		function inventOne(item){
			if (Array.isArray(item)){
				inventAll(item);
				return;
			}
			var invention = { name: item };
			Inventions.push(invention);
			person.invented.push(invention);
		}
		function inventAll(items){
			items.forEach(inventOne);
		}
		inventOne(what);
	}
	invent('light bulb', Edison);
	invent('telephone', Bell);
	invent(['alternating current', 'radio', 'electric motor', 'remote control'], Tesla);
	invent('dynamite', Nobel);
	invent('book print', Gutenberg);
	invent('computer', Zuse);
	invent('steam engine', Watt);
	Inventors.forEach(function(inventor){
		inventor.invented.forEach(function(invention){
			invention.inventedBy = inventor;
		});
	});

	return {
		Inventors: Inventors,
		Inventions : Inventions
	};
})();

/*
var Data = {
	nut: {name: 'nut'},
	bolt: {name: 'bolt'}
};
Data.nut.needs = Data.bolt;
Data.bolt.needs = Data.nut;
*/

//var Data = { latin: 'lorem ipsum', numb : 42 };

var cities4d = {
	Europe:{
		north:[
			{name:"Stockholm", population:1000000, temp:6},
			{name:"Helsinki", population:650000, temp:7.6}
		],
		south:[
			{name:"Madrid", population:3200000, temp:15},
			{name:"Rome", population:4300000, temp:15}
		]
	},
	America:{
		north:[
			{name:"San Francisco", population:900000, temp:14},
			{name:"Quebec", population:530000, temp:4}
		],
		south:[
			{name:"Rio de Janeiro", population:7500000, temp:24},
			{name:"Santiago", population:6300000, temp:14}
		]
	},
	Asia:{
		north:[
			{name:"Moscow", population:13200000, temp:6},
			{name:"Irkusk", population:620000, temp:1}
		],
		south:[
			{name:"Mumbai", population:15500000, temp:27},
			{name:"Manila", population:13000000, temp:28}
		]
	}
};

var teens = {
	Frank_D: {firstName: "Frank", lastName: "Doe", age: 12, hobby: "running", sex: "male"},
	Hank_B: {firstName: "Hank", lastName: "Blow", age: 13, hobby: "drumming", sex: "male"},
	Jenny_F: {firstName: "Jenny", lastName: "Foe", age: 11, hobby: "painting", sex: "female"},
	Mary_S: {firstName: "Mary", lastName: "Snow", age: 14, hobby: "ice scating", sex: "female"}
};

var Data = cities4d;

function QueryStringObject(){
	var decode = window.decodeURIComponent;
	var loc = window.location;
	if (loc.href.indexOf('?')===-1) return {};
	var s = loc.search.slice(1);
	var parts = s.split('&');
	var result = {};
	parts.forEach(function(part){
		if (!part.length) return;
		var z = part.split('=');
		var lhs = decode(z[0]);
		var rhs = undefined;
		if (z.length >= 2){
			rhs = decode(z[1]);
		}
		result[lhs] = rhs;
	});
	return result;
}
function createLibrary(){
	return fiat.dom.fiat([{
		createCollapser: function(button){
			return function(currentCat){
				return function(evt, elt, lib, key, ancestorData){
					var data = ancestorData[2];
					var fs = elt.parentElement.parentElement;
					var parentFS = fs.parentElement;
					var linkText = elt.textContent;
					var D = lib.fn.data(parentFS);
					D[currentCat] = D[currentCat] || {};
					D[currentCat][linkText] = fs;
					var btn = (D.collapsed && (linkText in D.collapsed))
						? D.collapsed[linkText]
						: button(linkText).E('click', 'buttonClick').DATA(data).$();
					var meatOfTheMatter = data.dataNode;
					var meatType        = typeof meatOfTheMatter;
					var meatIsFunction  = ( meatType ==='function' );
					var modClick        = evt&&(evt.altKey||evt.ctrlKey);
					if (meatIsFunction || modClick){
						console.log(meatOfTheMatter);
					} else {
						parentFS.replaceChild(btn, fs);
					}
				};
			};
		},
		collapse_expanded: function(button){
			return (function(currentCat){
				return function(evt, elt, lib, key, ancestorData){
					var data = ancestorData[2];
					var fs = elt.parentElement.parentElement;
					var parentFS = fs.parentElement;
					var linkText = elt.textContent;
					var D = lib.fn.data(parentFS);
					D[currentCat] = D[currentCat] || {};
					D[currentCat][linkText] = fs;
					var btn = (D.collapsed && (linkText in D.collapsed))
						? D.collapsed[linkText]
						: button(linkText).E('click', 'buttonClick').DATA(data).$();
					var meatOfTheMatter = data.dataNode;
					var meatType        = typeof meatOfTheMatter;
					var meatIsFunction  = ( meatType ==='function' );
					var modClick        = evt&&(evt.altKey||evt.ctrlKey);
					if (meatIsFunction || modClick){
						console.log(meatOfTheMatter);
					} else {
						parentFS.replaceChild(btn, fs);
					}
				};
			})('expanded');
		},
		collapse_tableForm: function(button){
			return (function(currentCat){
				return function(evt, elt, lib, key, ancestorData){
					var data = ancestorData[2];
					var fs = elt.parentElement.parentElement;
					var parentFS = fs.parentElement;
					var linkText = elt.textContent;
					var D = lib.fn.data(parentFS);
					D[currentCat] = D[currentCat] || {};
					D[currentCat][linkText] = fs;
					var btn = (D.collapsed && (linkText in D.collapsed))
						? D.collapsed[linkText]
						: button(linkText).E('click', 'buttonClick').DATA(data).$();
					var meatOfTheMatter = data.dataNode;
					var meatType        = typeof meatOfTheMatter;
					var meatIsFunction  = ( meatType ==='function' );
					var modClick        = evt&&(evt.altKey||evt.ctrlKey);
					if (meatIsFunction || modClick){
						console.log(meatOfTheMatter);
					} else {
						parentFS.replaceChild(btn, fs);
					}
				};
			})('tableForm');
		},
		framedTable: function(fieldset,legend,table,tr,td,th,a,$lib){
			return function(elt, parentFS, linkText, DATA){
				var tableData = DATA.dataNode;
				var stack = DATA.stack;
				var content = fieldset(
					legend(a.A({href: 'javascript:void(0)'})(linkText).E('click', 'collapse_tableForm')),
					table.map.full({key: {row: 0}, all: {headings: 1}})
						( {0: tr, first: tr(th).L1('M')(th)('headings') }, {0: td.destructure(this.spec), first: th.L('row') } )
						(tableData)
				).data('dataNode')(tableData).data('stack')(stack);
				parentFS.replaceChild(content.$(), elt);
			};
		},
		expand: function(){
			return function(elt, parentFS, linkText){
				var D = this.fn.data(parentFS);
				D.collapsed = D.collapsed || {};
				D.collapsed[linkText] = elt;
				parentFS.replaceChild(D.expanded[linkText], elt);
			};
		},
		buttonClick: function(fieldset){
			return function(evt, elt, lib, key, ancestorData){
				var linkText = elt.textContent;
				var parentFS = elt.parentElement;
				var modClick = evt&&(evt.altKey||evt.ctrlKey);
				if (modClick){
					lib.framedTable(elt, parentFS, linkText, ancestorData[0]);
				} else {
					lib.expand(elt, parentFS, linkText);
				}
			};
		},
		spec: function(a,fieldset,legend,span){
			return function(objects,inverseObjects,forest,atoms,types,treeIdx,dataNode,stack,idxStack,nodeStack,advanced,localGhost, stringBufferWithSeparator){
				var nbsp = Unicode.nbsp;
				var tree      = forest[treeIdx];
				var greySpan  = span.S({background: {color: '#ddd'}}).template();
				var stackLast = (stack.length===0) ? '' : stack[stack.length-1];
				if (advanced.cycleStart){
					return {
						f      : greySpan(stackLast + ':' + nbsp + '#' + treeIdx + nbsp + 'CYCLE'), 
						keySet : null
					};
				}
				var type = typeof dataNode;
				var _type;
				var specialPrimitive = null;
				if (type==='object'){
					_type = (function(){
						if (dataNode===null) return 'NULL';
						if (dataNode instanceof Date   ) { specialPrimitive = 'Date'   ; return specialPrimitive; }
						if (dataNode instanceof RegExp ) { specialPrimitive = 'RegExp' ; return specialPrimitive; }
						return '???';
					})();
				} else {
					_type = (type==='string') ? 'S' : (type==='number') ? 'N' : '???';
				}
				function makeLegend(){
					var linkText1 =  greySpan( (treeIdx>=0) ? '#' + treeIdx : _type );
					var linkText2 = nbsp + stackLast;
					var anchor = a.A({href: 'javascript:void(0)'})(linkText1, linkText2)
						.E('click', 'collapse_expanded', advanced.repeatStart);
						//.if1(advanced.repeatStart)('d')('trigger_on_create')('click')
					return legend(anchor);
				}
				function makeContent(){
					if (specialPrimitive){
						if (specialPrimitive==='Date') return dataNode.toDateString();
						return dataNode.toString();
					}
					return null;
				}
				var returnValue = {};
				returnValue.f = fieldset
					.data('stack')(stack).data('dataNode')(dataNode)
					(makeLegend(), makeContent());
				returnValue.keySet = (type==='object') ? (specialPrimitive ? null : fiat.util.getKeySet(dataNode)) : null;
				return returnValue;
			};
		},
		Browser: function(div, $lib){
			var main = div.destructure($lib.spec)(Data);
			return {
				main: main
			};
		}
	}]);
}
function bodyOnload(){
	var QSO = QueryStringObject();
	console.log(QSO);
	Lib = createLibrary();
	Lib.Browser.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.Browser.main.$append(document.body);
}