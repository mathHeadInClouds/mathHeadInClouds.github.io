var Lib;
var testRunner = null;
function TestRunner(lib, nodes, testName, selectedSizes, doug_active, siberia_active){
	this.errorSymbol = lib.errorSymbolSVG(0.2).template();
	this.lib = lib;
	this.nodes = nodes;
	this.testIdx = -1;
	this.callbackHandle = [];
	this.testName = testName;
	this.selectedSizes = selectedSizes;
	this.doug_active = doug_active;
	this.siberia_active = siberia_active;
	var colCount =  selectedSizes.length;
	var algoCount = (siberia_active ? 1 : 0) + (doug_active ? 1 : 0);
	var testCount = colCount * algoCount;
	this.testCount = testCount;
	var whichAlgo = [];
	var whichSize = [];
	function doug_only_each(idx){
		whichAlgo.push('doug');
		whichSize.push(selectedSizes[idx]);
	}
	function siberia_only_each(idx){
		whichAlgo.push('siberia');
		whichSize.push(selectedSizes[idx]);
	}
	function both_each(idx){
		whichAlgo.push(idx % 2 ===0 ? 'siberia' : 'doug');
		var size_idx = Math.floor(idx/2);
		whichSize.push(selectedSizes[size_idx]);
	}
	fiat.util.range(testCount).forEach(
		algoCount===2
			? both_each
			: (doug_active ? doug_only_each : siberia_only_each)
	);
	this.whichAlgo = whichAlgo;
	this.whichSize = whichSize;
}
TestRunner.prototype.action = function(){
	var nodes = this.nodes;
	function makeCallback_afterFreeze(algorithmName, theSize, self){
		return function(error, duration, length){
			var _nodes = nodes[algorithmName];
			nodes.feedback.phase.textContent = 'thaw';
			var cell = _nodes.freeze[size];
			if (error===null){
				cell.classList.remove('error');
				cell.removeAttribute('title');
				cell.textContent = format.time(duration);
				_nodes.length[size].textContent = format.int(length);
			} else {
				while (cell.firstChild) cell.removeChild(cell.firstChild);
				cell.classList.add('error');
				cell.appendChild(self.errorSymbol.DATA(error).E('click', 'errorSymbolClick').$())
				cell.setAttribute('title', error.message);
				_nodes.length[size].textContent = 'n/a';
			}
		};
	}
	function makeCallback_afterThaw(algorithmName, theSize, self){
		return function(error, isOK, duration){
			var _nodes = nodes[algorithmName];
			nodes.feedback.phase.textContent = 'freeze';
			var cell = _nodes.thaw[size];
			if (error===null){
				cell.classList.remove('error');
				cell.removeAttribute('title');
				cell.textContent = format.time(duration);
				if (!isOK){
					debugger;
					alert('unexpected: failed deep equality test');
					throw new Error('not deep equal');
				}
			} else {
				if (error==='n/a'){
					_nodes.thaw[size].textContent = Unicode.infinity;
				} else {
					while (cell.firstChild) cell.removeChild(cell.firstChild);
					cell.classList.add('error');
					cell.appendChild(self.errorSymbol.DATA(error).E('click', 'errorSymbolClick').$())
					cell.setAttribute('title', error.message);
				}
				
			}
			window.setTimeout(function(){ self.action(); }, 1)
		};
	}
	++this.testIdx;
	if (this.testIdx>=this.testCount){
		this.lib.togglers.goButtons[this.testName].show();
		this.lib.togglers.testFeedback[this.testName].hide();
	} else {
		var testName = this.testName;
		var size = this.whichSize[this.testIdx];
		var algo = this.whichAlgo[this.testIdx];
		nodes.feedback.testIndex.textContent = 1+this.testIdx;
		nodes.feedback.testCount.textContent = this.testCount;
		nodes.feedback.testName.textContent = testName;
		nodes.feedback.testSize.textContent = size;
		nodes.feedback.algorithmName.textContent = algo;
		nodes.feedback.phase.textContent = 'freeze';
		var testData = DataGenerator[testName](size);
		var innerRunner = new ({
			siberia: Runner_Siberia,
			doug   : Runner_Doug
		})[algo](
			testData, makeCallback_afterFreeze(algo, size, this), makeCallback_afterThaw(algo, size, this)
		);
		window.setTimeout(function(){ innerRunner.run(); }, 1)
	}
};
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
var format = {
	int: function(x){
		if (x<=9999) return '' + x;
		if (x<=9999999) return Math.round(x/1000) + 'K';
		if (x<=9999999999) return Math.round(x/1000000) + 'M';
		return Math.round(x/1000000000) + 'G';
	},
	time: function(x){
		if (x<1) return '<1ms';
		if (x<10) return "%3.1f".sprintf(x) + 'ms';
		if (x<1000) return Math.round(x) + 'ms';
		if (x<10000) return  "%3.1f".sprintf(x/1000) + 's';
		if (x<600000) return Math.round(x/1000) + 's';
		return Math.round(x/60000) + 'min';
	}
};
function createLibrary(){
	return fiat.dom.fiat([{
		activeTest: null,
		draggedHandle: null,
		dragStartLocation: null,
		testParameters : {
			uncles: {
				key: 'uncles',
				sizes: [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
				colStart: 0.5, colEnd: 5.5
			}, 
			complete: {
				key: 'complete', title: 'complete graph',
				sizes: [20,25,30,40,50,60,80,100,120,150,200,250,300,400,500,600,800,1000,1200,1500,2000,2500,3000,4000,5000,6000,8000],
				colStart: 1.5, colEnd: 9.5
			}, 
			dll: {
				key: 'dll', title: 'double linked list',
				sizes:  [100,150,250,400,600,1000,1500,2500,4000,6000,10000,15000,25000,40000,60000,100000,150000,250000,400000,600000,1000000],
				colStart: -0.5, colEnd: 13.5
			},
			nephews : {
				key: 'nephews',
				sizes: [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
				colStart: 0.5, colEnd: 9.5
			}
		},
		errorSymbolClick: function(){
			return function(evt, elt, lib, key, ancestorData){
				var errorObject = ancestorData[0];
				console.log(errorObject);
				console.log(elt.parentElement);
			};
		},
		algorithmCheckChange: function(){
			return function(evt, elt, lib, key, ancestorData){
				var testName      = key[0];
				var algorithmName = key[1];
				var parameters    = lib.testParameters[testName];
				var otherAlgo     = ({doug: 'siberia', siberia: 'doug'})[algorithmName];
				var otherCheck    = lib.instance.nodes[testName][otherAlgo].check;
				if ((!elt.checked) && (!otherCheck.checked)){
					otherCheck.checked = true;
				}
				lib.hiliteSelectedColumns(testName, parameters.colStart, parameters.colEnd);
			};
		},
		goButtonClick: function(){
			return function(evt, elt, lib, key, ancestorData){
				var testName    = key[0];
				var parameters  = lib.testParameters[testName];
				var colStart    = parameters.colStart;
				var colEnd      = parameters.colEnd;
				var sizes       = parameters.sizes;
				var colCount    = colEnd - colStart;
				var selectedSizes = fiat.util.range(1/2+colStart, colEnd).map(function(idx){ return sizes[idx]; });
				var nodes = lib.instance.nodes[testName];
				var doug_active    = nodes.doug.check.checked;
				var siberia_active = nodes.siberia.check.checked;
				testRunner = new TestRunner(lib, nodes, testName, selectedSizes, doug_active, siberia_active);
				lib.togglers.goButtons[testName].hide();
				lib.togglers.testFeedback[testName].show();
				testRunner.action();
			}
		},
		computeEventInfo: function($lib){
			return function(evt){
				if ($lib.dragStartLocation===null) return null;
				var mySpeedTestTable = (function(parent_of_target){
					while (true){
						var tagName = parent_of_target.tagName.toLowerCase();
						if (tagName==='table') {
							return parent_of_target.classList.contains('speedTest') ? parent_of_target : null;
						}
						parent_of_target = parent_of_target.parentElement;
						if (!parent_of_target) return null;
						if (!parent_of_target.tagName) return null;
					}
				})(evt.target);
				var result = {
					outOfTable: (mySpeedTestTable===null),
					dx        : evt.pageX - $lib.dragStartLocation[0]
				};
				result.testName = result.outOfTable ? $lib.activeTest : mySpeedTestTable.____data.key;
				return result;
			}
		},
		computeSelectedColumns: function($lib){
			return function(testName, whichHandle, dx, outOfTableFlag){
				var testParams   = $lib.testParameters[testName];
				var nodes        = $lib.instance.nodes[testName];
				if (!nodes) debugger;
				var draggedSVG   = nodes[whichHandle];
				var draggedInner = draggedSVG.parentElement;
				var draggedOuter = draggedInner.parentElement;
				var boure        = draggedInner.getBoundingClientRect();
				var currentX     = boure.x + boure.width/2;
				var colIdx       = (function(xs){
					for (var i=0; i<xs.length; i++){
						if (xs[i]>currentX) return i - 1/2;
					}
					return xs.length - 1/2;
				})(testParams.th_x_list);
				var newColStartEnd = (function(){
					function compareNumbers(a,b){
						return Number(a)-Number(b);
					}
					if (whichHandle==='rightHandle'){
						return [testParams.colStart, colIdx].sort(compareNumbers);
					}
					if (whichHandle==='leftHandle'){
						return [colIdx, testParams.colEnd].sort(compareNumbers);
					}
					debugger;
					throw new Error('unexpected');
				})();
				var newColStart = newColStartEnd[0];
				var newColEnd   = newColStartEnd[1];
				if (newColEnd===newColStart){
					if (whichHandle==='rightHandle'){
						if (newColStart>=0){ newColStart--; } else { newColEnd++; }
					} else {
						if (newColEnd<=testParams.sizes.length-1){ newColEnd++; } else { newColStart--; }
					}
				}
				return {
					start: newColStart,
					end  : newColEnd
				};
			};
		},
		hiliteSelectedColumns: function($lib){
			return function(testName,start,end){
				var nodes = $lib.instance.nodes[testName];
				var siberia_active = nodes.siberia.check.checked;
				var doug_active    = nodes.doug.check.checked;
				Object.keys(nodes.colHead).forEach(function(size, i){
					var th = nodes.colHead[size];
					var td_s1 = nodes.siberia.freeze[size];
					var td_s2 = nodes.siberia.thaw[size];
					var td_s3 = nodes.siberia.length[size];
					var td_d1 = nodes.doug.freeze[size];
					var td_d2 = nodes.doug.thaw[size];
					var td_d3 = nodes.doug.length[size];
					var columnSelected = (i>start) && (i<end);
					var remadd_s = siberia_active&&columnSelected ? 'add' : 'remove';
					var remadd_d =    doug_active&&columnSelected ? 'add' : 'remove';
					td_s1.classList[remadd_s]('selected');
					td_s2.classList[remadd_s]('selected');
					td_s3.classList[remadd_s]('selected');
					td_d1.classList[remadd_d]('selected');
					td_d2.classList[remadd_d]('selected');
					td_d3.classList[remadd_d]('selected');
				});
				var colCount =  end - start;
				var algoCount = (siberia_active ? 1 : 0) + (doug_active ? 1 : 0);
				var testCount = colCount * algoCount;
				nodes.goButton.textContent = ['run', testCount, 'speed tests'].join(' ');
			};
		},
		tabHeadClick: function(div){
			return function(evt, elt, lib, key, ancestorData){
				var choice = key[1];
				if (choice===lib.activeTest) return;
				var heads = lib.instance.nodes.tabHead;
				Object.keys(heads).forEach(function(k){
					var _elt = heads[k];
					_elt.classList.add(   _elt===elt ?   'active' : 'inactive');
					_elt.classList.remove(_elt===elt ? 'inactive' :   'active');
				});
				//console.log(choice);
				if (lib.activeTest){
					lib.togglers.descriptions[lib.activeTest].hide();
					lib.togglers.speedTestTables[lib.activeTest].hide();
					lib.togglers.goButtons[lib.activeTest].hide();
				}
				lib.activeTest = choice;
				lib.togglers.outerContainer.show();
				lib.togglers.descriptions[choice].show();
				lib.togglers.speedTestTables[choice].show();
				lib.togglers.goButtons[choice].show();
				lib.instance.nodes.descriptionHeading.textContent = Unicode.bigDownTriangle + Unicode.nbsp + 'description';
			};
		},
		toggleDescription: function(){
			return function(evt, elt, lib, key, ancestorData){
				if (!lib.activeTest) return;
				var toggler = lib.togglers.descriptions[lib.activeTest];
				if (toggler.isvisible()){
					toggler.hide();
					elt.textContent = Unicode.bigRightTriangle + Unicode.nbsp + 'description';
				} else {
					toggler.show();
					elt.textContent = Unicode.bigDownTriangle + Unicode.nbsp + 'description';
				}
			};
		},
		depthPickerHandleSVG: function($wrap){
			return $wrap(Assets.icon_downTriag()).template();
		},
		errorSymbolSVG: function($NS$SVG, path,g,circle,svg){
			return function(scale){
				var size = 25;
				var pathElt = path.dxy().vars({a:size,x:100,y:100-size}).x('x','aaAaAAAAaAaa').y('y','AaaaaAaAAAAa').z()().A({fill: 'white', stroke: 'none'});
				return svg.A({width:200*scale, height: 200*scale})(
					g.scale(scale)(
						circle.A({r:100,cx:100,cy:100,fill:'rgb(255,96,96)',stroke:'none'})
						,pathElt
					)
				);
			};
		},
		checkHandles: function($lib){
			return function(testName){
				var nodes = $lib.instance.nodes[testName];
				function test(whichHandle){
					var inner = nodes[whichHandle].parentElement;
					var outer = inner.parentElement;
					if (inner.style.left) return { which: whichHandle, dx: parseFloat(inner.style.left) };
					if (outer.style.left) return { which: whichHandle, dx: parseFloat(outer.style.left) };
				}
				var result;
				result = test('leftHandle'); if (result) return result;
				result = test('rightHandle'); if (result) return result;
				return null;
			};
		},
		dragHandleMouseDown: function(){
			return function(evt, elt, lib, key, ancestorData){
				var xy = [evt.pageX, evt.pageY];
				lib.dragStartLocation = xy;
				lib.draggedHandle = elt;
				var testParams = ancestorData[4];
				var testName = testParams.key;
				var nodes = lib.instance.nodes[testName];

				var check = lib.checkHandles(testName);
				if (check!==null){
					console.log("shouldn't have happened, but no harm done....");
					lib.commitColumnSelectionChange(testName, check.which, check.dx, true);
				}

				var colHeadCenterXlist = Object.keys(nodes.colHead).map(function(size){
					var th = nodes.colHead[size];
					var re = th.getBoundingClientRect();
					var centerX = re.x + re.width/2;
					return centerX;
				});
				testParams.th_x_list = colHeadCenterXlist;
			};
		},
		mousemove: function($lib){
			return function(evt){
				if (evt.which!==1) {
					$lib.draggedHandle = null;
					return;
				}
				var eventInfo     = $lib.computeEventInfo(evt); if (eventInfo    ===null) return;
				var draggedHandle = $lib.draggedHandle        ; if (draggedHandle===null) return;
				var whichHandle   = draggedHandle.firstChild.dataset.key1;
				var selcols       = $lib.computeSelectedColumns(eventInfo.testName, whichHandle, eventInfo.dx, eventInfo.outOfTable);
				$lib.hiliteSelectedColumns(eventInfo.testName, selcols.start, selcols.end);
				var sty      = draggedHandle.parentElement.style;
				sty.position = 'relative';
				sty.left     = eventInfo.dx + 'px';
			};
		},
		commitColumnSelectionChange: function($lib){
			function reset(elt){
				elt.parentElement.style.position = 'relative';
				elt.parentElement.style.left = '';
				elt.style.position = 'relative';
				elt.style.left = '';
			}
			function noColspan(elt){
				elt.removeAttribute('colspan');
				elt.classList.remove('handle');
			}
			function setColspan(elt, colsp){
				elt.setAttribute('colspan', colsp);
				elt.classList.add('handle');
				return elt;
			}
			return function(testName, whichHandle, dx, outOfTable){
				var nodes         = $lib.instance.nodes[testName];
				var draggedHandle = nodes[whichHandle].parentElement;
				var testParams    = $lib.testParameters[testName];
				var selcols       = $lib.computeSelectedColumns(testName, whichHandle, dx, outOfTable);
				$lib.hiliteSelectedColumns(testName, selcols.start, selcols.end);
				var theTable      = nodes.theTable;
				var firstTR       = theTable.firstChild;
				if ( (selcols.start===testParams.colStart) && (selcols.end===testParams.colEnd) ){
					reset(draggedHandle);
				} else {
					var innerLeft  = nodes.leftHandle.parentElement , outerLeft  = innerLeft.parentElement , thLeft  = outerLeft.parentElement,
						innerRight = nodes.rightHandle.parentElement, outerRight = innerRight.parentElement, thRight = outerRight.parentElement,
						diff       = selcols.end - selcols.start;
					reset(innerLeft); reset(innerRight); noColspan(thLeft); noColspan(thRight);
					testParams.colStart = selcols.start;
					testParams.colEnd   = selcols.end;
					if (diff >= 2){
						setColspan(firstTR.childNodes[2 + Math.floor(selcols.start)], 2).appendChild(outerLeft );
						setColspan(firstTR.childNodes[1 + Math.floor(selcols.end  )], 2).appendChild(outerRight);
					} else {
						if (diff === 1){
							var th3 = firstTR.childNodes[1 + Math.floor(selcols.end)];
							setColspan(th3, 3).appendChild(outerLeft); th3.appendChild(outerRight);
						} else {
							debugger;
						}
					}
				}
			};
		},
		mouseup: function($lib){
			return function(evt){
				var eventInfo     = $lib.computeEventInfo(evt); if (eventInfo    ===null) return;
				var draggedHandle = $lib.draggedHandle        ; if (draggedHandle===null) return;
				var whichHandle   = draggedHandle.firstChild.dataset.key1;
				var testName      = eventInfo.testName;
				var dx            = eventInfo.dx;
				var outOfTable    = eventInfo.outOfTable;
				$lib.commitColumnSelectionChange(testName, whichHandle, dx, outOfTable);
				$lib.draggedHandle = null;
			};
		},
		speed: function(table,tr,td,th,div,span,a,p,img,h1,h2,h3,h4,h5,br,input,button,$lib){
			function tabHead(testName){
				var params = $lib.testParameters[testName];
				var key = params.key;
				var title = 'title' in params ? params.title : key;
				var lnk = a.A({href: 'javascript:void(0)'})(title);
				return td(lnk).K('tabHead', key).E('click', 'tabHeadClick').C('tabHead')
			}
			function IMG(src){
				return img.a('src')('../../img/' + src);
			}
			function i(txt){
				return span(txt).s('font-style')('italic');
			}
			function crock(){
				return [
					"Douglas Crockford's ",
					a.a('href')('https://github.com/douglascrockford/JSON-js/blob/master/cycle.js')('cycle.js')
				];
			}
			function speedTestTable(testName){
				var params = $lib.testParameters[testName];
				var sizes = params.sizes;
				function th_freeze(){ return th(Assets.icon_SnowFlake(1,1,1,true,5,0.8)); }
				function th_thaw(){ return th(Assets.icon_fire(40).K('fire')); }
				function th_length(){ return th('length').C('borderbot'); }
				function th_column(size){
					return th.C(['columnHead', 'borderbot']).DATA(size).K(testName, 'colHead', size)(size);
				}
				function pickerHandleTH(key){
					return th.A({colspan:2})(
						div.C('outer')(
							div.C('inner')(
								$lib.depthPickerHandleSVG().K(testName, key)
							).E('mousedown', 'dragHandleMouseDown')
						)
					).C('handle');
				}
				function th_picker(p){
					if (p===Math.ceil(params.colStart)) return null;
					if (p===Math.floor(params.colStart)) return pickerHandleTH('leftHandle');
					if (p===Math.ceil(params.colEnd)) return null;
					if (p===Math.floor(params.colEnd)) return pickerHandleTH('rightHandle');
					return th;
				}
				var thbobo     = th.C('borderbot').template();
				var thRowspan3 = thbobo.a('rowspan')(3).template();
				function checkboxTH(key){
					return thRowspan3(
						input.A({type:'checkbox'})
						.K(testName, key, 'check')
						.p('checked')(key==='siberia'||key==='doug')
						.E('change','algorithmCheckChange')
					);
				}
				function mapper(algorithmName, methodName, className){
					return className
						? function(s){ return td(Unicode.nbsp).K(testName, algorithmName, methodName, s).C(className); }
						: function(s){ return td(Unicode.nbsp).K(testName, algorithmName, methodName, s)             ; }
				}
				return table.C('speedTest').DATA(params).K(testName, 'theTable')(
					tr(th.A({colspan: 2})(Unicode.downArrow + ' select ' + Unicode.rightArrow).C('topLeftCorner'))
						.M(th_picker)(fiat.util.range(-1, sizes.length+1))
					,tr(thbobo('depth').a('colspan')(3))
						.M(th_column)(sizes)
					,tr(checkboxTH('doug'),thRowspan3(IMG('douglasCrockford.png')),th_freeze())
						.M(mapper('doug', 'freeze'))(sizes)
					,tr(th_thaw())
						.M(mapper('doug', 'thaw'))(sizes)
					,tr(th_length())
						.M(mapper('doug', 'length', 'borderbot'))(sizes)
					,tr(checkboxTH('siberia'), thRowspan3(Assets.icon_Siberia(120)), th_freeze())
						.M(mapper('siberia', 'freeze'))(sizes)
					,tr(th_thaw())
						.M(mapper('siberia', 'thaw'))(sizes)
					,tr(th_length())
						.M(mapper('siberia', 'length', 'borderbot'))(sizes)
				).toggler('speedTestTables',testName);
			}
			function goButton(testName){
				return button('run speed tests').E('click','goButtonClick').C('goButton').K(testName,'goButton').toggler('goButtons', testName);
			}
			function testFeedback(testName){
				var p = [testName, 'feedback'];
				return div.K(p, 'parent')(
					'running test '
					, span.K(p, 'testIndex')
					, ' of '
					, span.K(p, 'testCount')
					, ' ( '
					, span.K(p, 'testName')
					, ' / '
					, span.K(p, 'testSize')
					, ' / '
					, span.K(p, 'algorithmName')
					, ' / '
					, span.K(p, 'phase')
					, ' )'
				).toggler('testFeedback', testName);
			}
			var main = div(
				a.A({href: 'https://github.com/mathHeadInClouds/siberia'})(h2('goto github repository / readme')),
				h1('speed tests'),
				table(tr.M(tabHead)(Object.keys($lib.testParameters))),
				div.K('outerContainer')(
					h1(Unicode.bigDownTriangle + Unicode.nbsp + 'description')
						.K('descriptionHeading')
						.C('descriptionHeading')
						.E('click', 'toggleDescription')
					,div.K('descriptions', 'uncles').C('description')(
						p('In the asexual world of computer science trees, ', i('the'), ' uncle is ', i('the'), ' sibling of ', i('the'), ' parent.', br,
							'Safe for the root and the direct kids thereof, it exists, and there is never more than one.', br,
							'Each node can have 0, 1, or 2 ', i('nephews'),
							' i.e.,', ' nodes of which it is uncle.'
						),
						IMG('whatsAnUncle.png'),
						p('In this test, we generate a complete binary tree of some depth ', i('n'), ', and then ', i('uncleify'), br, ' it completely,',
							' by adding a pointer to the uncle for each node having such.',br,
							"siberia's run time is compared to the run time of ", crock(), "."
							//, " On my", br, 'machine, at depth 15, siberia beats cycle.js by factor 160 (run time) and factor 25 (space).',br,
							//"forestify and unforestify are labelled decycle and retrocycle, which is Crockford's terminology."
						)
					).toggler('descriptions', 'uncles')
					,div.K('descriptions', 'complete').C('description')(
						p('in order to see what happens if there are "as many cycles as possible", we test complete graphs',br,
							"with various node counts up to a thousand. cycle.cs can't finish the test with 1,000 nodes though,",br,
							'because the maximum string length of JavaScript (about one billion - year 2020, my machine)',br,
							'is exceeded. cycle.js will, around 500 nodes, use up about 1000 times more space compared to siberia.',br,
							'The run time is more benign here, only a 2 digit factor.'
						)
					).toggler('descriptions', 'complete')
					,div.K('descriptions', 'dll').C('description')(
						p('now going, so to speak, in the other direction - many many nodes, not so many cycles;',br,
							'a double linked list seems suitable - you know, that thing with the N nodes and 2N-2 edges...'
						),
						p('again, cycle.js is first to chocke and crash - this time not because of the string length',br,
							'but because of the maximum call stack size. speed and space improvements both in the 3 digits range.'
						)
					).toggler('descriptions', 'dll')

					,div.K('descriptions', 'nephews').C('description')(
						p('if we reverse the pointer direction in the uncles example above, we get an object graph',br,
							"containing no directed cycle, but undirected cycles. You can't go in circles, unless you",br,
							'swim against the current at some point. That means that we can use plain JSON.stringify again;',br,
							"it won't crash - only directed cycles make it crash."
						),
						p('so we ', i('can'), ' use plain JSON.stringify. But ', i('should'), ' we? Well, plain JSON has no', br,
							'concept of (or, modeling ability of), for example, node.right.rightNephew and node.left.right', br,
							"being the same (subtree - the encircled 5 in the picture shown under uncles test).", br,
							"In the 'JSON worldview', it's one giant tree, with data only at the leaves, and 'internal object equality'", br,
							"is unintelligible gibberish and/or sacrilegious emperor's clothes denialism."
						),
						p('And if node.right.rightNephew and node.left.right cannot be "pointer-equal", but only "deep value equal",',br,
							'then whole sub tree under node.left.right will have to be cloned in order to have something suitable',br,
							"to put into node.right.rightNephew. Hence, we'll get ", i('extremely'), ' bad space requirements in plain JSON',br,
							'if the object graph has lots of undirected cycles.'
						),
						p("before we test siberia against plain JSON, let's test it against cycle.js one last time,",br,
							'with the nephewified complete binary trees. Results: At depth 18, siberia takes under one second,',br,
							'and cycle.js takes over half an hour. But the space is actually not so bad: cycle.js stays under',br,
							'5 times siberias space requirements.'
						)
					).toggler('descriptions', 'nephews')

					,speedTestTable('uncles')
					,speedTestTable('complete')
					,speedTestTable('dll')
					,speedTestTable('nephews')

					,goButton('uncles')
					,goButton('complete')
					,goButton('dll')
					,goButton('nephews')
					
					,testFeedback('uncles')
					,testFeedback('complete')
					,testFeedback('dll')
					,testFeedback('nephews')
					



				).toggler('outerContainer')
			);
			return {
				main: main
			};
		},
		init: function($lib){
			return function(){
				$lib.togglers.outerContainer.hide();
				Object.keys($lib.togglers.descriptions).forEach(function(testName){
					$lib.togglers.descriptions[testName].hide();
					$lib.togglers.speedTestTables[testName].hide();
					$lib.togglers.goButtons[testName].hide();
					$lib.togglers.testFeedback[testName].hide();
					var parameters = $lib.testParameters[testName];
					$lib.hiliteSelectedColumns(testName, parameters.colStart, parameters.colEnd)
				});
				document.addEventListener('mousemove', $lib.mousemove);
				document.addEventListener('mouseup', $lib.mouseup);
			}
		}
	}]);
}
function bodyOnload(){
	var QSO = QueryStringObject();
	//console.log(QSO);
	Lib = createLibrary();
	Lib.speed.main.setRoot('main');
	Lib.speed.main.$append(document.body);
	Lib.init();

	//console.log(frozChief);

}
// $NS$SVG,svg,g,path,circle,text,line,rect,foreignObject,tspan,ellipse,
// http://127.0.0.1/web/d3/dusty/ver01/willitFit01.html
// https://stackoverflow.com/questions/32793484/test-deep-equality-with-sharing-of-javascript-objects
// 10.192.154.146
