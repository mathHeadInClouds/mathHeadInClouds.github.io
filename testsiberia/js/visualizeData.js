function visualizeData(data){
	var UTIL = letThereBe.util;
	return letThereBe.dom([
		function createCollapser(button, $ARGS1, currentCat, $ARGS2, evt, elt, lib, key, ancestorData){
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
			var alt             = evt&&evt.altKey;
			if (meatIsFunction || alt){
				console.log(meatOfTheMatter);
			} else {
				parentFS.replaceChild(btn, fs);
			}
		},
		function (){
			return {
				_collapse: {
					expanded : this.createCollapser('expanded'),
					tableForm: this.createCollapser('tableForm')
				}
			};
		},
		[
			'collapse', {
				expanded  : $ => $.parent.createCollapser('expanded'),
				tableForm : $ => $.parent.createCollapser('tableForm')
				//tableForm: function(){ return this.parent.createCollapser('tableForm'); }
			}
		],
		{
			spec: function(a,fieldset,legend,span, $ARGS,
					dataNode, stack, idxStack, objectGraphAnalysis, dataNodeStack, advanced, localGhost, stringBufferWithSeparator){
				//var cycleStart=advanced.cycleStart,repeatStart=advanced.repeatStart,treeIdxStack=advanced.treeIdxStack,treeIndexSeen=advanced.treeIndexSeen;
				var greySpan  = span.S({background: {color: '#ddd'}}).template();
				var treeIdx   = objectGraphAnalysis.getTreeIndex();
				var tree      = objectGraphAnalysis.getTree();
				var stackLast = (stack.length===0) ? '' : stack[stack.length-1];
				// cycleStart===( (treeIdx>=0) && treeIdxStack.indexOf(treeIdx)>=0 ) <-- TRUE
				if (advanced.cycleStart){
					return {
						f      : greySpan(stackLast + ':' + nbsp + '#' + treeIdx + nbsp + 'CYCLE'), 
						keySet : null
					};
				}
				
				var type = typeof dataNode;
				var _type;
				var STOP = false;
				var specialPrimitive = null;
				if (type==='object'){
					_type = (function(){
						if (dataNode===null) return 'NULL';
						if (dataNode instanceof Date   ) { specialPrimitive = 'Date'   ; return specialPrimitive; }
						if (dataNode instanceof Boolean) { specialPrimitive = 'Boolean'; return specialPrimitive; }
						if (dataNode instanceof Number ) { specialPrimitive = 'Number' ; return specialPrimitive; }
						if (dataNode instanceof RegExp ) { specialPrimitive = 'RegExp' ; return specialPrimitive; }
						if (dataNode instanceof String ) { specialPrimitive = 'String' ; return specialPrimitive; }
						return '???';
					})();
				} else {
					if (type==='function'){
						_type = 'function'; STOP = true;
					} else {
						if (type==='symbol'){
							_type = 'symbol'; STOP = true;
						} else {
							_type = (type==='string') ? 'string' : (type==='number') ? 'number' : (type==='boolean') ? 'boolean' : '???';
						}
					}
				}
				function makeLegend(){
					var linkText1 =  greySpan(
						(treeIdx>=0) ? '#' + treeIdx : _type
					);
					var linkText2 = nbsp + stackLast;
					var anchor = a.A({href: 'javascript:void(0)'})(linkText1, linkText2).E('click', 'collapse.expanded', advanced.repeatStart)
						//.if1(advanced.repeatStart)('d')('trigger_on_create')('click')
					return legend(anchor);
				}
				function makeContent(){
					if (specialPrimitive){
						if (specialPrimitive==='Date') return dataNode.toDateString();
						return dataNode.toString();
					}
					if (type==='symbol'){
						return dataNode.toString().slice(7,-1);
					}
					return null;
				}
				var returnValue = {};
				returnValue.f = fieldset
					.data('stack')(stack).data('dataNode')(dataNode).data('oga')(objectGraphAnalysis)
					(makeLegend(), makeContent());
				returnValue.keySet = (type==='object') ? (specialPrimitive ? null : UTIL.getKeySet(dataNode)) : null;
				returnValue.stop = STOP;
				return returnValue;
			},
			framedTable: function($this, fieldset,legend,table,tr,td,th,a,$ARGS, elt, parentFS, linkText, DATA){
				var tableData = DATA.dataNode;
				var stack = DATA.stack;
				var objectGraphAnalysis = DATA.oga;
				var content = fieldset(
					legend(a.A({href: 'javascript:void(0)'})(linkText).E('click', 'collapse.tableForm')),
					table.map.useOGA.full({key: {row: 0}, all: {headings: 1}})
						( {0: tr, first: tr(th).L1('M')(th)('headings') }, {0: td.destructure(this.spec), first: th.L('row') } )
						(objectGraphAnalysis)
				).data('dataNode')(tableData).data('stack')(stack).data('oga')(objectGraphAnalysis);
				parentFS.replaceChild(content.$(), elt);
			},
			expand: function($ARGS, elt, parentFS, linkText){
				var D = this.fn.data(parentFS);
				D.collapsed = D.collapsed || {};
				D.collapsed[linkText] = elt;
				parentFS.replaceChild(D.expanded[linkText], elt);
			},
			buttonClick: (fieldset, $ARGS, evt, elt, lib, key, ancestorData) => {
				var linkText = elt.textContent;
				var parentFS = elt.parentElement;
				if (evt.ctrlKey){
					lib.framedTable(elt, parentFS, linkText, ancestorData[0]);
				} else {
					lib.expand(elt, parentFS, linkText);
				}
			},
			body: ($this, div) => {
				return div.destructure($this.spec)(data);
			}
		}
	]).body.$$();
}
