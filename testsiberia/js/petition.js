var Lib;
function scaleObject(obj, scale){
	var result = {};
	Object.keys(obj).forEach(function(key){
		result[key] = scale * obj[key];
	});
	return result;
}
function createLibrary(){
	return fiat.dom.fiat([{
		arrowHead: function($NS$SVG, path){
			return function(color, x1,y1,x2,y2){
				var L1 = 16, L2 = 7, L = L1 + L2;
				var R = 0.5*L;
				var dx = x2 - x1;
				var dy = y2 - y1;
				var d2x = dx*dx, d2y = dy*dy, hyp2 = d2x+d2y, hyp = Math.sqrt(hyp2);
				var _x = dx/hyp;
				var _y = dy/hyp;
				var qx = x2 - L1*_x;
				var qy = y2 - L1*_y;
				var sx = x2 + L2*_x;
				var sy = y2 + L2*_y;
				var p1x = qx - R*_y;
				var p1y = qy + R*_x;
				var p2x = qx + R*_y;
				var p2y = qy - R*_x;
				var arrowHead = path.xy().x([p1x,sx,p2x,p1x]).y([p1y,sy,p2y,p1y])().a('stroke')('none').a('fill')(color);
				//var retval = arrowHead.$append(appendTo);
				return arrowHead;
			};
		},
		lineWithArrowHead: function($NS$SVG, g,line, $lib){
			return function(color,x1,y1,x2,y2,strokeWidth){
				return g(
					line.A({stroke:color,'stroke-width':strokeWidth,x1:x1,y1:y1,x2:x2,y2:y2})
					,$lib.arrowHead(color,x1,y1,x2,y2)
				);
			};
		},
		nutBoltDirectedCycle: function(table,tr,td,th, $NS$SVG, svg,g,path,text,$lib){
			var S=80;
			var vars = scaleObject({a: 8, b:1, c: 1, d: 4, e: 1.5, x: 0, y: 1}, S/12);
			var arrowAtts = {fill: 'black', stroke: 'none'};
			var sty = {fontSize: (S/3) + 'px', fontWeight: 'bold'};
			var TH = th.S(sty).template();
			var arrowsSVG2 = svg.A({width: 1.2*S, height: 1.3*S})(
				g.translate(S/10, S/8)(path.dxy().vars(vars).x('x', 'a.dD.A.').y('y', '.CeeC.B').z()().A(arrowAtts))
				//,text('needs').A({x: 0.24*S, y: 0.5*S, 'font-size': S/5, 'font-weight': 'normal', fill: 'black'})
				,g.translate(1.1*S, 0.65*S)(path.dxy().vars(vars).x('x', 'A.Dd.a.').y('y', '.CeeC.B').z()().A(arrowAtts))
				//,text('needs').A({x: 0.5*S, y: 1.01*S, 'font-size': S/5, 'font-weight': 'normal', fill: 'black'})
			);
			return table(
				tr( td(Assets.icon_nut(S)), td.A({rowspan: 2})(arrowsSVG2), td(Assets.icon_bolt(S)) ),
				tr( TH(), TH() )
			).template();
		},
		nodeHouse: function($NS$SVG,svg,g,rect,line,text){
			return svg.A({width: 140, height: 80})(
				rect.A({fill:'transparent',stroke:'black','stroke-width':4,x:2,y:2,width:136,height:76})
				,line.A({stroke:'black','stroke-width':4,x1:74,x2:74,y1:0,y2:80})
				,line.A({stroke:'black','stroke-width':4,x1:74,x2:140,y1:40,y2:40})
				,g.translate(1,3)(Assets.icon_house(74))
				,text('nut').A({fill:'black',stroke:'none','font-size':25,x:86,y:30})
				,text('bolt').A({fill:'black',stroke:'none','font-size':25,x:84,y:70})
			).template();
		},
		nodeNut: function($NS$SVG,svg,g,rect,line,text){
			return svg.A({width: 170, height: 80})(
				rect.A({fill:'transparent',stroke:'black','stroke-width':4,x:2,y:2,width:166,height:76})
				,line.A({stroke:'black','stroke-width':4,x1:78,x2:78,y1:0,y2:80})
				,line.A({stroke:'black','stroke-width':4,x1:78,x2:170,y1:40,y2:40})
				,g.translate(6,6)(Assets.icon_nut(68))
				,text('name').A({fill:'black',stroke:'none','font-size':25,x:91,y:30})
				,text('needs').A({fill:'black',stroke:'none','font-size':25,x:89,y:70})
			).template();
		},
		nodeBolt: function($NS$SVG,svg,g,rect,line,text){
			return svg.A({width: 140, height: 80})(
				rect.A({fill:'transparent',stroke:'black','stroke-width':4,x:2,y:2,width:136,height:76})
				,line.A({stroke:'black','stroke-width':4,x1:48,x2:48,y1:0,y2:80})
				,line.A({stroke:'black','stroke-width':4,x1:48,x2:140,y1:40,y2:40})
				,g.translate(8,6)(Assets.icon_bolt(68))
				,text('name').A({fill:'black',stroke:'none','font-size':25,x:61,y:30})
				,text('needs').A({fill:'black',stroke:'none','font-size':25,x:59,y:70})
			).template();
		},
		nodeBolt_noneed: function($NS$SVG,svg,g,rect,line,text){
			return svg.A({width: 140, height: 80})(
				rect.A({fill:'transparent',stroke:'black','stroke-width':4,x:2,y:2,width:136,height:76})
				,line.A({stroke:'black','stroke-width':4,x1:48,x2:48,y1:0,y2:80})
				,g.translate(8,6)(Assets.icon_bolt(68))
				,text('name').A({fill:'black',stroke:'none','font-size':25,x:61,y:30})
			).template();
		},
		cyclicShed: function($NS$SVG,svg,g,rect,line,text,path,ellipse,$lib){
			return svg.A({width: 550, height: 270})(
				g.translate(5,75)($lib.nodeHouse())
				,g.translate(250,5)($lib.nodeNut())
				,g.translate(280,145)($lib.nodeBolt())
				,g($lib.lineWithArrowHead('black',142,98,243,42,4))
				,g($lib.lineWithArrowHead('black',142,132,273,182,4))
				,g($lib.lineWithArrowHead('black',340,82,315,138,4))
				,path.A({fill:'none',stroke:'black','stroke-width':4,d:'M350 224A80 40 0 1 1 191.9 215.3L255 92'})
				,g($lib.arrowHead('black',191.9,215.3,255,92))
				,ellipse.A({cx:510,cy:25,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"nut"').A({x:510,y:33,'font-size':20,fill:'black','text-anchor':'middle'})
				,ellipse.A({cx:510,cy:170,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"bolt"').A({x:510,y:178,'font-size':20,fill:'black','text-anchor':'middle'})
				,g($lib.lineWithArrowHead('black',420,25,466,25,4))
				,g($lib.lineWithArrowHead('black',420,170,466,170,4))
			);
		},
		dagShed: function($NS$SVG,svg,g,rect,line,text,path,ellipse,$lib){
			return svg.A({width: 550, height: 230})(
				g.translate(5,75)($lib.nodeHouse())
				,g.translate(250,5)($lib.nodeNut())
				,g.translate(280,145)($lib.nodeBolt_noneed())
				,g($lib.lineWithArrowHead('black',142,98,243,42,4))
				,g($lib.lineWithArrowHead('black',142,132,273,182,4))
				,g($lib.lineWithArrowHead('black',340,82,315,138,4))
				,ellipse.A({cx:510,cy:25,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"nut"').A({x:510,y:33,'font-size':20,fill:'black','text-anchor':'middle'})
				,ellipse.A({cx:510,cy:170,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"bolt"').A({x:510,y:178,'font-size':20,fill:'black','text-anchor':'middle'})
				,g($lib.lineWithArrowHead('black',420,25,466,25,4))
				,g($lib.lineWithArrowHead('black',420,170,466,170,4))
			);
		},
		corruptedShed: function($NS$SVG,svg,g,rect,line,text,path,ellipse,$lib){
			return svg.A({width: 550, height: 310})(
				g.translate(5,75)($lib.nodeHouse())
				,g.translate(250,5)($lib.nodeNut())
				,g.translate(210,145)($lib.nodeBolt_noneed())
				,g.translate(390,145)($lib.nodeBolt_noneed())
				,g($lib.lineWithArrowHead('black',142,98,243,42,4))
				,g($lib.lineWithArrowHead('black',142,132,203,182,4))
				,ellipse.A({cx:510,cy:25,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"nut"').A({x:510,y:33,'font-size':20,fill:'black','text-anchor':'middle'})
				,ellipse.A({cx:298,cy:292,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,ellipse.A({cx:478,cy:292,rx:39,ry:16,stroke:'none',fill:'rgb(240,240,192)'})
				,text('"bolt"').A({x:298,y:300,'font-size':20,fill:'black','text-anchor':'middle'})
				,text('"bolt"').A({x:478,y:300,'font-size':20,fill:'black','text-anchor':'middle'})
				,g($lib.lineWithArrowHead('black',420,25,466,25,4))
				,g($lib.lineWithArrowHead('black',300,225,300,270,4))
				,g($lib.lineWithArrowHead('black',480,225,480,270,4))
				,g($lib.lineWithArrowHead('black',390,82,410,138,4))
			);
		},		
		ourUndirectedCycle: function($NS$SVG,svg,g,rect,line,text,path,ellipse,$lib){
			var size = 70;
			return svg.A({width:200,height:210})(
				g.translate(0,70)(Assets.icon_house(size))
				,g.translate(110,0)(Assets.icon_nut(size))
				,g.translate(130,140)(Assets.icon_bolt(size))
				,g($lib.lineWithArrowHead('black',55,90,106,53,4))
				,g($lib.lineWithArrowHead('black',146,73,146,129,4))
				,g($lib.lineWithArrowHead('black',64,125,121,174,4))
			);
		},
		makeToolshed_code: function(pre,code,span){
			return pre(
				code.C('has-line-data')(
					span.C('hljs-function')(
						span.C('hljs-keyword')('function'), ' ',
						span.C('hljs-title')('makeToolshed'),
						'(', span.C('hljs-params'), ')'
					),
					'{\n    ',
					span.C('hljs-keyword')('var'),
					' nut = {name: ',
					span.C('hljs-string')('\'nut\''),
					'}, bolt = {name: ',
					span.C('hljs-string')('\'bolt\''),
					'};\n    nut.needs = bolt; bolt.needs = nut;\n    ',
					span.C('hljs-keyword')('return'),
					' { nut: nut, bolt: bolt };\n}\n'
				)
			);
		},
		makeToolshedDAG_code: function(pre,code,span){
			return pre(
				code.C('has-line-data')(
					span.C('hljs-function')(
						span.C('hljs-keyword')('function'), ' ',
						span.C('hljs-title')('makeToolshedDAG'),
						'(', span.C('hljs-params'), ')'
					),
					'{\n    ',
					span.C('hljs-keyword')('var'),
					' nut = {name: ',
					span.C('hljs-string')('\'nut\''),
					'}, bolt = {name: ',
					span.C('hljs-string')('\'bolt\''),
					'};\n    nut.needs = bolt;\n    ',
					span.C('hljs-keyword')('return'),
					' { nut: nut, bolt: bolt };\n}\n'
				)
			);
		},
		PETITION: function(table,tr,td,th,div,span,fieldset,legend,code,em,h1,h2,h3,h4,h5,p,strong,pre,img,br,$NS$SVG,svg,g,path,rect,line,text,ellipse,$lib){
			var main = div(
				fieldset.C('petition')(
					legend('The JSON Petition, Part 1'),
					code('JSON.stringify'), ' should throw an error more often.',
					' In the current implementation (July 2020), ',
					'an error is thrown whenever a ', em('directed'), ' cycle is detected in the first argument.',
					' That should be changed to an error being thrown whenever ', em('any'), ' cycle (directed or undirected) is detected.',
					' Moreover, a second function called ', code('JSON.stringify.lenient'), ' (or ', code('.lax'), ' or ', code(' .tolerant'),
					' or the like) should be addded, which behaves in the exact way ', code('JSON.stringify'), ' is behaving now.'
				),
				h1('Claim'),
				p.C('rant')(
					'On the upside, above change will help detect an ', strong('enormous'), ' amount of bugs caused by applying ',
					code('JSON.parse'), ' to the result of ', code('JSON.stringify'),
					' and expecting a result different from the one returned - see below.',
					' On the downside, if no errors were caused, the amount of additional work is either negligible ',
					'(just adding ', code('.lenient'), ' here and there) or -much more often- zero (if there were no (undirected) cycles to begin with,',
					' no changes in code will be necessary.)',
					' In terms of programmer\'s working time, the upside will outweigh the downside by several orders of magnitude.'
				),
				h1('Discussion'),
				p.C('rant')(
					'To show how undirected cycles (when current JSON get it\'s fingers on them) cause trouble, we introduce the toolshed data structure.',
					' To get started, here is a version with a directed cycle:'
				),
				$lib.makeToolshed_code(),
				$lib.cyclicShed(),
				p.C('rant')('Due to the directed cycle,'),
				$lib.nutBoltDirectedCycle(),
				p.C('rant')('If we log the object to the console, we never get to the end...'),
				img.A({src:'../../img/boltNutBoltNutBoltNutBoltNut.png'}),
				p.C('rant')('And ', code('JSON.stringify'), ' (being designed to stringify trees, and this isn\'t one) rightfully rejects the input:'),
				img.A({src:'../../img/errorConvertingCircularStructureToJSON.png'}),
				p.C('rant')(
					'All this is exactly how it should be. But now, on to the bad part. Which is: ', code('JSON'), ' pretending to be able to properly ',
					code('stringify'), ' something which isn\'t a tree.'
				),
				p.C('rant')(
					'If we remove the ', code('needs'), ' property for bolt, but keep it for nut, we don\'t have a ', em('directed'), ' cycle any more,',
					' but we ', em('do'), ' have an ', em('undirected'), ' cycle now. Thus, our data structure now isn\'t cyclic any more, but it isn\'t a tree either ',
					Unicode.dash, ' it\'s a thing usually being called a DAG (directed acyclic graph). And ', code('JSON.stringify'), ' does ', em('the worst'),
					' thing it could possibly do: return something wrong but kind of close, thus maximally misleading.'
				),
				$lib.makeToolshedDAG_code(),
				$lib.dagShed(),
				p.C('rant')('Here is our undirected cycle:'),
				$lib.ourUndirectedCycle(),
				p.C('rant')(
					'what ', em('undirected cycle in a directed graph'), ' means is: there is more than one way of getting from some node to some different node.',
					' Here, there is more than one way to get from root to bolt: directly, and via nut.',
					' Call me Spekulatius, but a hunch tells me that the non-existence of a single scholarly word for "undirected cycle in a directed graph" is what brought us into this mess.',
					' Let\'s call it ', em('uncydir'), ', then a the definition of ', em('directed tree'), ' is: "directed graph without any uncydirs". And directed trees are exactly what ', code('JSON'),
					' is able to properly ', code('stringify'), ' while DAGs are what ', code('JSON'), ' must stop pretending being able to properly ', code('stringify'), '.'
				),
				p.C('rant')('Now, let\'s watch ', code('JSON'), ' put it\'s foot in it.'),
				img.A({src:'../../img/hasTheOriginalUncydir.png'}),
				p.C('rant')(' what\'s really cursed is that you ', em('cannot'), ' find the deficiency by logging the objects to console:'),
				img.A({src:'../../img/theCursedThingIsThatYouCantSeeIt.png'}),
				p.C('rant')('So you log them to console, think they\'re equal, and later, when you assign new properties, you\'re in for a very unpleasant surprise: they ', em('weren\'t'), ' equal!'),
				img.A({src:'../../img/dagNutNeedsNowSmack.png'}),
				p.C('rant')('Here is the corrupted shed which ', code('JSON'), ' vomited onto us:'),
				$lib.corruptedShed(),
				p.C('rant')(
					'Here is a chart showing for 3 objects we considered (shed with cyclic references, DAG shed, and corrupted shed, where the bolt got doubled)',
					' how they are turned into directed trees containing the same information, using the 2 serialization algorithms we\'re considering here:'
				),
				img.A({src:'../../img/comparison_shed_dag_corrupt_2.png'}),
				br,
				'work in progress; notes follow',
				h1('schizophrenic object amitosis phenomenon'),
				h1('nephews test'),
				h1('JSONs object model'),
				h1('rant: inter-language comminication protocol must be simple and human readable without spec'),
				h3('serialize/unserialize pair of bijections. Dont nitpick, though (NaN example), see "simple" above')
				/*
				p.C('rant')(
					'Serializing and deserializing (if they are living up to their respective names) are supposed to be a pair of ', em('bijections'), ' being inverses of each other.',
					' It follows from that mathematically (that is first semester math), that first deserializing, then serializing is the identity function on a suitable subset of the strings',
					' and that first serializing, then deserializing is the identity function on a suitable subset of objects. ',
					code('JSON.stringify'), ' and ', code('JSON.parse'), ' do indeed live up to that ', Unicode.dash, ' that is, ', strong(em('***IF***')), ' we make the domain of objects the ',
					em('directed trees'), '.'
				),
				p.C('rant')(
					'Talking of bijections: we shouldn\'t be overzealous; ', code('JSON'), 'is not meant to be a JavaScript library, but an abstract, quasi-mathematical notation designed to work for most programming',
					' languages, and to be especially useful in inter-language comminication. And the last thing we\'d need in ', code('JSON'), ' is some kind of "feature creep" trying to cover',
					' every quirk of every language. One must not be made to embark on enless meandering, starting with questions like, just what the "natural" translation of JavaScripts ',
					code('NaN'), ' to some other language (say C) might be. Now, throwing an error at each encounter of ', code('NaN'), ' (which is what, strictly speaking, we ought to do',
					' if we\'re dead-serious about that bijection thing, once it is decided that ', code('NaN'), ' is not "part of the model"), if it forces us to spend long hours making those',
					' errors go away, when we would have been happy with a "gappy" serialization ', Unicode.dash, ' that would be overzealous.'
				),
				p.C('rant')(
					'Now, though, don\'t give me that "overzealous" argument when it comes to issue at hand; don\'t tell me above JS objects ', em('dag'), ' and ', em('corrupted'),
					' are "the same to you". I do not buy that you even think that. That\'s not you, that\'s the spirit of the Asch conformity experiment talking, having possessed',
					' your body. The object graph of ', em('dag'), ' has 3 nodes, and the object graph of ', em('corrupted'), ' has 4 nodes. That settles the matter.',
					' No, you don\'t have a "difference of opinion" with me, if you claim those objects are "the same to you". If you ', em('really'), ' think that',
					' (which you sure don\'t), you have a "difference of opinion" with reality or mathematics or god, or however you want to call it, in other words, you got a screw loose.'
				),
				p.C('rant')(
					'We saw above how the "bolt" node of the object graph of ', em('dag'), ' got "doubled". I\'d like to refer to this doubling as ', Unicode.dash,
					' excuse the weird word ', Unicode.dash, ' "', em('unsaming'), '". ', code('root.nut.needs'), ' and ', code('root.bolt'), ' used to be ', em('the same'), ', and after applying',
					' the buggy ', code("JSON.stringify"), ' and then ', code("JSON.parse"), ' they (or it) aren\'t ', em('the same'), ' any more; they performed some kind of "amitosis"',
					' like a schizophrenic splitting into Dr. Jeykill and Mr. Hide.', 
					' On 2nd thought, I think I\'m just gonna call it "schizophrenic amitosis".'
				),
				p.C('rant')(
					'The "schizophrenic amitosis" phenomenon does not ', em('necessarily'), ' lead to malfunctioning code. It might for example be that the corrupted object is treated as if it were ',
					em('read-only'), '. But whenever it\'s not read-only (if you do assignments), it\'s virtually certain that your code ', em('WILL'), ' malfunction.',
					' Thus the claim of enormity, concerning the amount of bugs this nonsense is responsible for.'
				),
				p.C('rant')(
					'But even if the corrupted objects are treated as read-only (that is the best-case we\'re talking about here): the code, then, won\'t malfunction, but it will',
					' waste space. We\'ll now turn to the question of how bad this wasting of space can become. The answer is, very bad indeed (unbounded factor.)'
				)
				*/
			);
			return {
				main: main
			};
		}
	}]);
}
function bodyOnload(){
	Lib = createLibrary();
	Lib.PETITION.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.PETITION.main.$append(document.body);
}
function makeToolshed(){
    var nut = {name: 'nut'}, bolt = {name: 'bolt'};
    nut.needs = bolt; bolt.needs = nut;
    return { nut: nut, bolt: bolt };
}
function makeToolshedDAG(){
    var nut = {name: 'nut'}, bolt = {name: 'bolt'};
    nut.needs = bolt;
    return { nut: nut, bolt: bolt };
}
function hasTheOriginalUncydir(shed){ return shed.nut.needs === shed.bolt; }
/*
dag = makeToolshedDAG();
corrupted = JSON.parse(JSON.stringify(dag));
[hasTheOriginalUncydir(dag), hasTheOriginalUncydir(corrupted)]
...
dag.nut.needs.now = 'smack'; corrupted.nut.needs.now = 'smack';
[dag.bolt.now, corrupted.bolt.now]
...
*/
// https://mathheadinclouds.github.io/img/albanBertaEntangSmall.png