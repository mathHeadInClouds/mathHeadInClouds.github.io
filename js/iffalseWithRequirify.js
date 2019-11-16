var loadInterval = 2500;

var scriptElt = document.createElement('script');
scriptElt.type = 'text/javascript';
scriptElt.src = 'https://s3.amazonaws.com/s3.mathisonian.com/javascripts/requirify-browser.js';
scriptElt.onload = function(){
	require('esprima', 'esprima');
  require('estraverse', 'estraverse');
	require('escodegen', 'escodegen');
  require('escope', 'escope');
  var afterEsprimaLoaded = function afterEsprimaLoaded(){
	var func = function test(a,b,c){
	var lorem = 1;
	var ipsum = 2;
	var dolor = 3;
	var sit   = 4;
	var amet  = 5;
  function anotherFunction(){
		var notInScope_where_varClickme_is_declared = 43;
  }
	function infiniteLoop(){
		infiniteLoop();
		var clickMe = 42;
	}
	inner();
};
    document.body.innerHTML = 'click on the code to generate helper code<br>' +
    'disabling browser automization making closure vars invisible<br>';
    codeContainer = document.createElement('pre');
    document.body.appendChild(codeContainer);
    swatchesParent = document.createElement('div');
    document.body.appendChild(swatchesParent);
    document.body.appendChild(document.createElement('br'));
    CONSOLE = document.createElement('pre');
    document.body.appendChild(CONSOLE);
    initCodeContainer(func.toString());
  };
  var checkEsprimaLoaded = function checkEsprimaLoaded(){
  	var T = document.body.textContent;
  	var type1 = typeof esprima;
  	var type2 = typeof estraverse;
  	var type3 = typeof escodegen;
  	var type4 = typeof escope;
    var OK1 = (type1==='object');
    var OK2 = (type2==='object');
    var OK3 = (type3==='object');
    var OK4 = (type4==='object');
    if (OK1&&OK2&&OK3&&OK4){
    	afterEsprimaLoaded();
    } else {
    	document.body.textContent = T + '*';
    	window.setTimeout(checkEsprimaLoaded, loadInterval);
    }
  };
  document.body.textContent = 'stand by, loading esprima,estraverse,escodegen,escope...'
  checkEsprimaLoaded();
}
document.head.appendChild(scriptElt);
