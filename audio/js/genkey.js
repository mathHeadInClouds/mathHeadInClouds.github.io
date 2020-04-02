"use strict";
var App;
// https://www.karajanmusictech.com/
// https://www.karajanmusictech.com/speaker/
// https://t.me/joinchat/C08wpldQFk11B2v4imUr-w?mc_cid=65f8cec4fd&mc_eid=
// http://themindshift.tv/ entrepreneur's kitchen

function bodyOnload(){
	App = fiat.dom.fiat([{
		body: function(table,tr,td,th,div){
			return div(
				table(
					tr(td('foo'), td('bar')),
					tr(td('blah'), td('ipsum'))
				)
			);
		}
	}]).body.setRoot().fn.append(document.body);
}
