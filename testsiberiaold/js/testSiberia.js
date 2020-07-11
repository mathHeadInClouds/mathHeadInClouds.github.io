function bodyOnload(){
	f = JSON.Siberia.forestify(InventorsData);
	d = JSON.Siberia.unforestify(f);
	eq = deepEqual(InventorsData, d);
	console.log(f)
	console.log(d);
	console.log(eq);
}
