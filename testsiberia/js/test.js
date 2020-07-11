var Lib;

var teens = {
	Frank_D: {firstName: "Frank", lastName: "Doe", age: 12, hobby: "running", sex: "male"},
	Hank_B: {firstName: "Hank", lastName: "Blow", age: 13, hobby: "drumming", sex: "male"},
	Jenny_F: {firstName: "Jenny", lastName: "Foe", age: 11, hobby: "painting", sex: "female"},
	Mary_S: {firstName: "Mary", lastName: "Snow", age: 14, hobby: "ice scating", sex: "female"}
};

function createLibrary(){
	return fiat.dom.fiat([{
		spec: function(div){
			return function(){
				return {
					keySet: [],
					f: function(){return function(x){return x}}
				};
			};
		},
		MapTest: function(fieldset,legend,table,tr,td,th,a,$lib){
			var main0 = fieldset(
				legend(a.A({href: 'javascript:void(0)'})('linkText').E('click', 'collapse.tableForm')),
				table.map.full({key: {row: 0}, all: {headings: 1}})
					( {0: tr, first: tr(th).L1('M')(th)('headings') }, {0: td.destructure(this.spec), first: th.L('row') } )
					(teens)
			).data('dataNode')(teens).data('stack')([]);
			var main = table.M(tr,td)(teens);
			return {
				main: main
			};
		}
	}]);
}
function bodyOnload(){
	Lib = createLibrary();
	Lib.MapTest.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.MapTest.main.$append(document.body);
}