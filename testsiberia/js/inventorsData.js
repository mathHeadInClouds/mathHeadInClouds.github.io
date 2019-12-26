var InventorsData = (function(){
	var JAN=0, FEB=1, MAR=2, APR=3, MAY=4, JUN=5, JUL=6, AUG=7, SEP=8, OCT=9, NOV=10, DEC=11;

	var Edison    = {names: ['Thomas', 'Alva', 'Edison']      , born: new Date(1847, FEB, 11), died: new Date(1931, OCT, 18)};
	var Bell      = {names: ['Alexander', 'Graham', 'Bell']   , born: new Date(1847, MAR,  3), died: new Date(1922, AUG,  2)};
	var Tesla     = {names: ['Nikola', 'Tesla']               , born: new Date(1856, JUL, 10), died: new Date(1943, JAN,  7)};
	var Nobel     = {names: ['Alfred', 'Bernhard', 'Nobel']   , born: new Date(1833, OCT, 21), died: new Date(1896, DEC, 10)};
	var Gutenberg = {names: ['Johannes', 'Gutenberg']         , born: new Date(1400, JAN,  1), died: new Date(1468, FEB, 26)};
	var Zuse      = {names: ['Konrad', 'Erst', 'Otto', 'Zuse'], born: new Date(1910, JUN, 22), died: new Date(1995, DEC, 18)};
	var Watt      = {names: ['James', 'Watt']                 , born: new Date(1736, JAN, 30), died: new Date(1819, AUG, 25)};
	var Fake      = {names: ['Johannes', 'James', 'Thomas', 'Mac', 'Fakington'], born: 42, died: 52, pokedNose: 62, burped: 42, flag: true, foo: null};
	var Inventors = [Edison, Bell, Tesla, Nobel, Gutenberg, Zuse, Watt, Fake];

	Inventors.forEach(function(inventor){ inventor.invented = []; });
	var Inventions = [];
	function invent(what, person){
		function inventOne(item){
			if (Array.isArray(item)){
				inventAll(item); return;
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