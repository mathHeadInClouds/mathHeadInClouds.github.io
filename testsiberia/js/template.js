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
		foo: 42,
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
		}
	}]);
}
function bodyOnload(){
	var QSO = QueryStringObject();
	console.log(QSO);
	Lib = createLibrary();
	Lib.JJAOP.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.JJAOP.main.$append(document.body);
}