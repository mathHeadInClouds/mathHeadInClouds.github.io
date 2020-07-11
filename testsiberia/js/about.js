var Lib;
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
		JJAOP: function(table,tr,td,div,span, $NS$SVG, svg,g,path,circle,text,line,rect,foreignObject,tspan,ellipse,$lib){
			function SVG(){ return svg.A({width: 50, height: 50}); }
			var sty = {fontSize: '32px', fontWeight: 'bold'};
			var mainCol = table(
				tr(td.S(sty)('Joe'), td(Assets.icon_Joe())),
				tr(td.S(sty)('Jane'), td(Assets.icon_Jane())),
				tr(td.S(sty)('Apple'), td(Assets.icon_Apple())),
				tr(td.S(sty)('Orange'), td(Assets.icon_Orange())),
				tr(td.S(sty)('Pear'), td(Assets.icon_Pear()))
			);
			var nbsp = Unicode.nbsp;
			var nbsp2 = nbsp + nbsp;
			function TD(str){
				return td.S({fontSize: '28px', fontWeight: 'bold', textAlign: 'center'})(nbsp2 + str + nbsp2);
			}
			// .S({textAlign: 'center', align: 'center'})
			function tc(content){
				return td.A({align: 'center'})(content)
			}
			var main = table(
				tr(TD('Joe'), TD('Jane'), TD('Apple'), TD('Orange'), TD('Pear')),
				tr(tc(Assets.icon_Joe), tc(Assets.icon_Jane), tc(Assets.icon_Apple), tc(Assets.icon_Orange), tc(Assets.icon_Pear))
			);
			return {
				main: main
			};
		},
		readme: function(BODY,H1,H3,A,DIV,P,IMG,CODE,BR,PRE,SPAN,EM,STRONG){
			function h1(start, end){
				return H1.C('code-line').D({line: {start: start, end: end}});
			}
			function h3(start, end){
				return H3.C('code-line').D({line: {start: start, end: end}});
			}
			function p(start, end){
				return P.C('has-line-data').D({line: {start: start, end: end}});
			}
			function img(src){
				var source = '../../img/' + src;
				return IMG.a('src')(source).a('alt')(src.split('.')[0]);
			}
			var body = 	BODY(
				h1(0,1)( A.a('id')('siberia_package_0'), 'siberia package' ),
				p(2,3)( 'serializing cyclical data structures in JavaScript.' ),
				h3(4,5)( A.a('id')('algorithm_4'), 'algorithm' ),
				p(6,7)('Our example\u2019s cyclical data structure centers around 2 people and 3 fruits, each having an icon.'),
				p(8,9)(img('JJAOP.png')),
				p(10,11)( 'Joe Brit likes apples and oranges, while Jane Kraut likes apples and pears.' ),
				p(12,13)(img('JoeLikes_JaneLikes.png')),
				p(14,15)(
					'You can see here on the right hand side in which way we are visualizing arrays. ',
					'In order to make the data structure cyclic,', BR,
					' in addition to the people having ',
					CODE('.likes'), ', the fruits have ', CODE('.likedBy'), '. For example,'
				),
				p(16,17)(img('AppleEaters.png')),
				p(18,19)( 'Here is the JavaScript code generating our data structure' ),
				PRE(
					CODE.a('class')('has-line-data').a('data-line-start')('21').a('data-line-end')('36')(
						SPAN.a('class')('hljs-keyword')('var'),
						' Joe = { name: ',
						SPAN.a('class')('hljs-string')('\'Joe\''), ' };\n',
						SPAN.a('class')('hljs-keyword')('var'),
						' Jane = { name: ',
						SPAN.a('class')('hljs-string')('\'Jane\''), ' };\n',
						SPAN.a('class')('hljs-keyword')('var'),
						' Apple = { name: ', SPAN.a('class')('hljs-string')('\'Apple\''), ' };\n',
						SPAN.a('class')('hljs-keyword')('var'),
						' Orange = { name: ',
						SPAN.a('class')('hljs-string')('\'Orange\''), ' };\n',
						SPAN.a('class')('hljs-keyword')('var'),
						' Pear = { name: ',
						SPAN.a('class')('hljs-string')('\'Pear\''), ' };\n',
						SPAN.a('class')('hljs-function')(
							SPAN.a('class')('hljs-keyword')('function'),
							' ',
							SPAN.a('class')('hljs-title')('addlike'),
							'(',
							SPAN.a('class')('hljs-params')('person, fruit'), ')'
						),
						'{\n    person.likes = person.likes || [];\n    fruit.likedBy = fruit.likedBy || [];\n    person.likes.push(fruit);\n    fruit.likedBy.push(person);\n}',
						'\naddlike(Joe, Apple); addlike(Joe, Orange);\naddlike(Jane, Apple); addlike(Jane, Pear);\n',
						SPAN.a('class')('hljs-keyword')('var'),
						' myData = { people: [Joe, Jane], fruits: [Apple, Orange, Pear] };\n'
					)
				),
				p(37,38)('This gives us the following object graph (the root object, ', EM('myData'), ', is the tree with the crown, center left)'),
				p(39,40)(img('ObjectGraph.png')),
				p(41,42)( 'To serialize, we have to find a way of encoding the information contained in our object graph in a non-cyclical fashion.' ),
				p(43,44)(
					'When we determine the object graph by applying the a recusive ', CODE('discover'),
					' function to the root object (', CODE('discover'),
					' is essentially depth first search with an added stop condition for already seen objects), we can easily \u201ccount\u201d the nodes (objects) of the object graph,',
					' i.e., label them with consecutive integers, starting at zero (zero always being the label for the root).',
					' We\u2019ll then also \u201ccount\u201d the encountered non-objects (or \u201catoms\u201d); they\u2019ll get the negative integers as labels.',
					' In our example, all atoms are strings.',
					' [A more general example would contain other atom types - such as numbers and \u201cquasi-atomic objects\u201d, e.g. regular expressions or date objects',
					' (JavaScript builtin objects having a standard way of stringifying them)].',
					' For example, the pear gets number 8 simply because it\u2019s the 8th object discovered by our search algorithm.',
					' Here is the object graph again with those integer labels added.'
				),
				p(45,46)(img('ObjectGraphWithLabels.png')),
				p(47,48)(
					'With the integer labels, serializing is easy. The \u201cfrozen version\u201d of each object is an object with the same keys,',
					' but each of the values replaced by some integer. Each of these integers is an index into some table; either the objects table,',
					' or, in case the of a negative number, the atoms table.'
				),
				p(49,50)( 'Here is the objects table of our example.' ),
				p(51,52)(img('the13objects.png')),
				p(53,54)( 'And the atoms table' ),
				p(55,56)(img('the5atoms.png')),
				p(57,58)(
					'For example, the frozen version of the pear object (which has ',
					CODE('.name = "Pear"'), ' and ', CODE('.likedBy'), ' = ', EM('array containing Jane'),
					') is the object ', CODE('{name: -4, likedBy: 9}'),
					', because the atoms table has string \u201cPear\u201d in slot 4, and the objects table has an array containing Jane in slot 9.'
				),
				p(59,60)(
					'A slightly simplified version of the serialization algorithm',
					' (namely, one which does everything except deal with typing the atoms;',
					' especially, it will work for our example data structure) has only 32 lines of code, here it is:'
				),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('62').a('data-line-end')('95')(
					SPAN.a('class')('hljs-function')(
						SPAN.a('class')('hljs-keyword')('function'),
						' ',
						SPAN.a('class')('hljs-title')('forestify_aka_decycle'),
						'(',
						SPAN.a('class')('hljs-params')('root'),
						')'
					),
					'{\n    ',
					SPAN.a('class')('hljs-keyword')('var'),
					' objects = [], inverseObjects = ',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('WeakMap'),
					'(), forest = [];\n    ',
					SPAN.a('class')('hljs-keyword')('var'),
					' atomics = {}, atomicCounter = ',
					SPAN.a('class')('hljs-number')('0'),
					';\n    ',
					SPAN.a('class')('hljs-function')(
						SPAN.a('class')('hljs-keyword')('function'),
						' ',
						SPAN.a('class')('hljs-title')('discover'),
						'(',
						SPAN.a('class')('hljs-params')('obj'),
						')'
					),
					'{\n        ',
					SPAN.a('class')('hljs-keyword')('var'),
					' currentIdx = objects.length;\n        inverseObjects.set(obj, currentIdx);\n        objects.push(obj);\n        forest[currentIdx] = ',
					SPAN.a('class')('hljs-built_in')('Array'),
					'.isArray(obj) ? [] : {};\n        ',
					SPAN.a('class')('hljs-built_in')('Object'), '.keys(obj).forEach(',
					SPAN.a('class')('hljs-function')(
						SPAN.a('class')('hljs-keyword')('function'),
						'(',
						SPAN.a('class')('hljs-params')('key'), ')'
					),
					'{\n            ', SPAN.a('class')('hljs-keyword')('var'),
					' val = obj[key], type = ',
					SPAN.a('class')('hljs-keyword')('typeof'),
					' val;\n            ',
					SPAN.a('class')('hljs-keyword')('if'),
					' ((type===',
					SPAN.a('class')('hljs-string')(
						'\'object\''
					),
					')&&(val!==',
					SPAN.a('class')('hljs-literal')('null'),
					')){\n                ',
					SPAN.a('class')('hljs-keyword')('if'),
					' (inverseObjects.has(val)){ ',
					SPAN.a('class')('hljs-comment')(
						'// known object already has index'
					),
					'\n                    forest[currentIdx][key] = inverseObjects.get(val);\n                } ',
					SPAN.a('class')('hljs-keyword')('else'),
					' {                      ',
					SPAN.a('class')('hljs-comment')(
						'// unknown object, must recurse'
					),
					'\n                    forest[currentIdx][key] = discover(val);\n                }\n            } ',
					SPAN.a('class')('hljs-keyword')('else'),
					' {\n                ',
					SPAN.a('class')('hljs-keyword')('if'),
					' (!(val ', SPAN.a('class')('hljs-keyword')('in'),
					' atomics)){\n                    ++atomicCounter;                 ',
					SPAN.a('class')('hljs-comment')(
						'// atoms table new entry'
					),
					'\n                    atomics[val] = atomicCounter;\n                }\n                forest[currentIdx][key] = -atomics[val];      ',
					SPAN.a('class')('hljs-comment')(
						'// rhs negative'
					),
					'\n            }\n        });\n        ',
					SPAN.a('class')('hljs-keyword')('return'),
					' currentIdx;\n    }\n    discover(root);\n    ',
					SPAN.a('class')('hljs-keyword')('return'),
					' {\n        objectsTable: forest,\n        atomsTable  : [',
					SPAN.a('class')('hljs-literal')('null'), '].concat(', SPAN.a('class')('hljs-built_in')('Object'),
					'.keys(atomics))\n    };\n}\n')
				),
				p(96,98)(
					'The objects table, being an array which in each slot contains a simple key-value pair list (with is a depth 1 tree), is called the forest, thus the name.', BR,
					'\nAnd since the trees of the forest are frozen, \u201csiberia\u201d was chosen as the name of the algorithm.'
				),
				p(99,100)(
					'The reverse process (', CODE('unforestify'),
					' aka retrocycle) in even more straightforward: First, for each tree in the forest, generate either an empty array, or an empty plain object.',
					' Then, in a double loop over trees of the forest, and keys of the tree, do an obvious assignment,',
					' the right hand side of which is a \u201cthawed\u201d tree in the thawed forest we\u2019re just constructing, or a atom fetched from the atmoics table.'
				),
				h3(101,102)(
					A.a('id')('Douglas_Crockford_101'),
					'Douglas Crockford'
				),
				p(103,104)(
					STRONG('Why siberia is faster than Douglas Crockford\u2019s decycle.js (2018 version), by an unbounded factor'),
					': First, a similarity. Above ',
					CODE('discover'),
					' function is similar to the function ', CODE('derez'), ', which occurs inside of ', CODE('.decycle'),
					'. Just as ', CODE('discover'), ', ', CODE('derez'),
					' is essentially depth first search with an additional stop condition if a previously encountered object is encountered once again, and in both cases, ES6 feature ',
					CODE('WeakMap'), ' is used to generate a lookup table of known objects. In both cases, the domain of the ', CODE('WeakMap'),
					' consists of the nodes of the object graph (i.e., objects discovered so far.) But those objects are mapped to different things in ',
					CODE('discover'), ' vs ', CODE('derez'), '. In ', CODE('discover'),
					', it\u2019s the object index, and in ', CODE('derez'),
					' it\u2019s the path from the root to the object. That path is JavaScript code, which is later fed to ',
					CODE('eval'), ', when we deserialize again.'
				),
				p(105,106)(
					'For example, we already saw that our pear object is mapped (by ',
					CODE('discover'),
					') to the number 8, because it\u2019s the 8th object being discovered. Let\u2019s look at above depiction of the object graph,',
					' and trace the path from root to pear, i.e. 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8. We encounter objects',
					' root -> AllPeople -> Joe -> JoesFruits -> Apple -> AppleEaters -> Jane -> JanesFruits -> Pear. The keys (edge labels) we see between those objects are',
					' \u201cpeople\u201d, 0, \u201clikes\u201d, 0, \u201clikedBy\u201d, 1, \u201clikes\u201d, 1.'
				),
				p(107,108)(img('root2pear.png')),
				p(109,110)( 'Now, in the Douglas Crockford version, we can do' ),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('112').a('data-line-end')('115')(
					'dougsFridge = ', SPAN.a('class')('hljs-built_in')('JSON'),
					'.decycle(myData)\ndougsFridge.fruits[',
					SPAN.a('class')('hljs-number')('2'), '].$ref\n')
				),
				p(116,117)( 'The result will be following string:' ),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('119').a('data-line-end')('121')(
					'$[',
					SPAN.a('class')('hljs-string')('"people"'),
					'][',
					SPAN.a('class')('hljs-number')('0'),
					'][',
					SPAN.a('class')('hljs-string')('"likes"'),
					'][',
					SPAN.a('class')('hljs-number')('0'),
					'][',
					SPAN.a('class')('hljs-string')('"likedBy"'),
					'][',
					SPAN.a('class')('hljs-number')('1'),
					'][',
					SPAN.a('class')('hljs-string')('"likes"'),
					'][',
					SPAN.a('class')('hljs-number')('1'),
					']\n')
				),
				p(122,123)(
					'It is not surprising at all that of the many possible paths from root to pear, siberia and Douglas Crockfords algorithm found the same route.',
					' After all, both are depth first search with \u201cseen already\u201d stop condition added, garnished with storing some stuff.'
				),
				p(124,125)(
					'The difference: Storing the the path takes up space which is linear in the number of nodes involved, which is unbounded, and in the other direction,',
					' from path to thawed object, that then has runtime which is linear in the number of nodes involved. On the other hand, in ',
					EM('siberia'),
					', storing the information of the path takes constant space (just one integer is stored),',
					' and going back from that integer to the thawed object is just an array lookup, which takes constant time.'
				),
				p(126,127)( 'On top of that, ', CODE('eval'),
					' and regular expressions are used, which can be slow (especially the latter), further degrading runtime performance. (This being by far not as bad as the other problem.)'
				),
				h3(128,129)(
					A.a('id')('implementation_128'),
					'implementation'
				),
				p(130,131)( 'For our example data structure,' ),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('133').a('data-line-end')('135')(
					SPAN.a('class')('hljs-built_in')('JSON'),
					'.Siberia.forestify(myData)\n')
				),
				p(136,137)('gives'),
				p(138,139)(img('JsonSiberiaForestifyMyData.png')),
				p(140,141)(
					CODE('.forest'),
					' is the objects table, and ',
					CODE('.flatValues'),
					' is the atomics table (as described in the algorithm section). ',
					CODE('.typeRegular'),
					' and ', CODE('.typeSingletons'),
					' are better explained when the atomics will have more than one type. Let\u2019s look at an example.'
				),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('143').a('data-line-end')('154')(
					'obj = {\n    re : ',
					SPAN.a('class')('hljs-regexp')('/d+/g'), ',\n    now : ',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('Date'),
					'(),\n    yesterday: ',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('Date'),
					'(',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('Date'), '()-',
					SPAN.a('class')('hljs-number')('24'),
					'*',
					SPAN.a('class')('hljs-number')('60'),
					'*',
					SPAN.a('class')('hljs-number')('60'),
					'*',
					SPAN.a('class')('hljs-number')('1000'),
					'),\n    tomorrow: ',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('Date'),
					'((',
					SPAN.a('class')('hljs-keyword')('new'),
					' ',
					SPAN.a('class')('hljs-built_in')('Date'),
					'()-',
					SPAN.a('class')('hljs-number')('0'), ')+',
					SPAN.a('class')('hljs-number')('24'),
					'*',
					SPAN.a('class')('hljs-number')('60'), '*',
					SPAN.a('class')('hljs-number')('60'), '*',
					SPAN.a('class')('hljs-number')('1000'),
					'),\n    almostEvil : ',
					SPAN.a('class')('hljs-number')('665.9'),
					',\n    computahEsplode : ',
					SPAN.a('class')('hljs-built_in')('Math'),
					'.sqrt(-', SPAN.a('class')('hljs-number')('1'),
					'),\n    emperorsGarments : ',
					SPAN.a('class')('hljs-literal')('null'),
					'\n}\nforestified = ',
					SPAN.a('class')('hljs-built_in')('JSON'),
					'.Siberia.forestify(obj);\n')
				),
				p(155,156)(img('forestifiedAtomicPlethora.png')),
				p(157,158)(
					CODE('forestified.typeRegular'), ' tells us that the array ', CODE('forestified.flatValues'),
					' has numbers from 6 inclusive to 7 exclusive, Date objects from 7 inclusive to 10 exclusive, and RegExp objects from 10 inclusive til the end.',
					' That means, the flatValues array is grouped by type (or, to be more exact, by constructor), and typeRegular array tells us which types are found in which section of the array. ',
					CODE('forestified.typeSingletons'), ' is similar to ', CODE('forestified.typeRegular'),
					', except that the corresponding \u201ctype\u201d has only one possible value. The 7 supported (values of) singleton types are'
				),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('160').a('data-line-end')('163')(
					'[',
					SPAN.a('class')('hljs-literal')('null'), ', ',
					SPAN.a('class')('hljs-literal')('undefined'), ', ',
					SPAN.a('class')('hljs-literal')('true'), ', ',
					SPAN.a('class')('hljs-literal')('false'), ', ',
					SPAN.a('class')('hljs-literal')('NaN'), ', ',
					SPAN.a('class')('hljs-literal')('Infinity'),
					', -', SPAN.a('class')('hljs-literal')('Infinity'),
					']\n',
					SPAN.a('class')('hljs-comment')(
						'// 1      2        3      4     5       6         7'
					),
					'\n'
				)),
				p(164,165)(
					'And the singletons are always (if they occur at all) at the same index (e.g., Infinity is always at position 6, if it occurs in the flatValues array at all.)',
					' If not all singletons occur, the \u201cregular\u201d types will start earlier. Gaps (unused slots) in the flatValues array can only occur from 1 to 7 (and there is always a gap at zero.)'
				),
				p(166,167)(
					'Thanks to the type information, with siberia, first serializing and then deserializing are much closer to emulating \u201ctrue cloning\u201d than doing the same with plain JSON.',
					' (siberia isn\u2019t perfect either; functions with variables depending on closures won\u2019t work properly, to give one example).'
				),
				PRE(
					CODE.a('class')('has-line-data').a('data-line-start')('169').a('data-line-end')('176')(
						'forestified = ',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.Siberia.forestify(obj);\nstringified = ',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.Siberia.stringify(forestified);\nunstr = ',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.Siberia.unstringify(stringified);\nsiberianClone = ',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.Siberia.unforestify(unstr);\n[siberianClone.re, siberianClone.computahEsplode, siberianClone.emperorsGarments, siberianClone.now.getFullYear()]\n',
						SPAN.a('class')('hljs-comment')('// result : [/d+/g, NaN, null, 2020]'), '\n'
					)
				),
				p(177,178)(
					CODE('JSON.Siberia.stringify'), ' is almost the same as ', CODE('JSON.stringify'), ', and ',
					CODE('JSON.Siberia.unstringify'), ' is almost the same as JSON.parse. The difference is ',
					CODE('JSON.Siberia.stringify'), ' expects the argument object to be (like) a result of calling ',
					CODE('JSON.Siberia.forestify'), ', and will use the type information appropriately. For example, for a ',
					CODE('RegExp'), ' object, the ', CODE('.toString'), ' method is called to properly turn the object into a string. Similarly, ',
					CODE('JSON.Siberia.unstringify'), ' expects the argument string to have the appropriate format and, again, uses the type information appropriately; for example, for a stringified ',
					CODE('RegExp'), ' object, ', CODE('eval'), ' is called on the string, so the string is turned into a ',
					CODE('RegExp'), ' again.'
				),
				p(179,180)(img('arrows.png')),
				p(181,182)(
					CODE('forestify'), ' and ', CODE('unforestify'),
					' are the equivalents of what in Douglas Crockfords version is called ',
					CODE('decycle'), ' and ', CODE('retrocycle'),
					' - meaning, turning an arbitrary object into another object which doesn\u2019t have any cycles, and reversing this process, respectively.',
					' Those are the first step in freezing, and the second step in thawing, respectively.',
					' The second step in freezing and the first step in thawing (dealing with strings) were discussed in the preceding paragraph. Doing the two steps at once is called ',
					CODE('.serialize'), ' and ', CODE('.unserialize'),
					', as the black diagram shows. Furthermore, Doing the round trip (', CODE('.forestify'), ', then ', CODE('.unforestify'), ') is called ', CODE('.clone'), '.'
				),
				PRE(
					CODE.a('class')('has-line-data').a('data-line-start')('184').a('data-line-end')('188')(
						'inferiorClone = ',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.parse(',
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.stringify(obj))\n[inferiorClone.re, inferiorClone.computahEsplode, inferiorClone.emperorsGarments, ',
						SPAN.a('class')('hljs-keyword')('typeof'),
						' inferiorClone.now]\n',
						SPAN.a('class')('hljs-comment')('// result: [{}, null, null, "string"]')
					)
				),
				p(189,190)(
					'Note that the serialization result is \u201cself contained\u201d, and thus suitable for communication from JavaScript to non-JavaScript.',
					' A, say, Python programmer does not have to read some JavaScript spec to interpret a siberian serialization result - it is human readable ',
					EM('without'),
					' a spec, that is important. It would be a bad idea to move some information from the serialized string \u201cto the spec\u201d (such as NaN is 5),',
					' in order to save a couple of bytes. The string should have an obvious interpretation. So it does, I\u2019d say - If you see how it can be even more obvious, tell me.'
				),
				h3(191,192)(
					A.a('id')('options_191'),
					'options'
				),
				PRE(
					CODE.a('class')('has-line-data').a('data-line-start')('194').a('data-line-end')('197')(
						SPAN.a('class')('hljs-built_in')('JSON'),
						'.Siberia.getOptions().nullify\n',
						SPAN.a('class')('hljs-comment')('// result: {functions: false, symbols: false, RegExp: false}')
					)
				),
				p(198,199)(
					'nullify is the only thing that has options in this version. Here, you can decide if functions, Symbols,',
					' and regular expressions should be turned into nulls (as functions and Symbols are by ',
					CODE('JSON.stringify'), '), or if they should be stringified.'
				),
				p(200,201)( 'You change options like this:' ),
				PRE(CODE.a('class')('has-line-data').a('data-line-start')('203').a('data-line-end')('206')(
					SPAN.a('class')('hljs-built_in')('JSON'), '.Siberia.setOptions.nullify.functions.true()   ',
					SPAN.a('class')('hljs-comment')('// function serialized to string\n'),
					SPAN.a('class')('hljs-built_in')('JSON'), '.Siberia.setOptions.nullify.functions.false()  ',
					SPAN.a('class')('hljs-comment')('// function serialized to null')
				)),
				h3(207,208)(
					A.a('id')('todo__soon_207'),
					'todo - soon'
				),
				p(209,210)(
					'There is some support (work in progress) for the usage in visualizing cyclical data structures. Calling ',
					CODE('.forestify'),
					' multiple times for several objects which are \u201cconnected\u201d (hence have the same object graph, only with a different root) is not good enough;',
					' there must be a forestified data structure which is shared between those various nodes, such that you can do a \u201croot switch\u201d.',
					' The readme will describe this part in more detail once the code is more stable. Use ',
					CODE('.analyzeObjectGraph'),
					' at your own risk (maybe better not quite yet). To be on the safe side, just use the 6 methods in the above black box, plus the ',
					CODE('.clone'), ' method.'
				),
				p(211,212)( 'manually adding custom \u201cquasi atomic objects\u201d' ),
				p(213,214)( 'tutorial \u201cmovie\u201d or slides, walking through the steps of the algorithm, with our example data structure.' ),
				h3(215,216)(
					A.a('id')('todo__maybe_later_maybe_never_215'),
					'todo - maybe later, maybe never'
				),
				p(217,218)( 'serializing functions depending on variables in closures' ),
				p(219,220)( 'supporting constructors other than Array, plain object.' ),
				p(221,222)( 'DOM objects??' ),
				p(223,224)(
					'language-specific objects in non-JavaScript languages. Consistent system to construct an \u201cobvious human readable\u201d standard.',
					' If that can\u2019t be done, don\u2019t do DOM objects.'
				)
			);
			return {
				body: body
			};
		}
	}]);
}
function bodyOnload(){
	var QSO = QueryStringObject();
	Lib = createLibrary();
	Lib.readme.body.setRoot('body');
	//Lib.readme.body.$unify(document.body);
	Lib.readme.body.$replace(document.body);
}