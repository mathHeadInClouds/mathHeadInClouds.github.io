var Lib;
function multiDimensionalFind_ThrowCatch(isNeedle, haystack) {
    try {
        var LEVEL = haystack.length;
        function inner(stack) {
            var level = stack.length;
            if (level >= LEVEL) {
                if (isNeedle(stack)) throw stack;
            } else {
                var arr = haystack[level];
                for (var i = 0; i < arr.length; i++) {
                    inner(stack.concat([arr[i]]));
                }
            }
        }
        inner([]);
        return 'not found'
    } catch(e){
        if (e instanceof Error) throw e; else return e;
    }
}
function multiDimensionalFind_ObedientToLandru1(isNeedle, haystack) {
    var LEVEL = haystack.length;
    var the = {};
    function inner(stack) {
        if ('result' in the) return;
        var level = stack.length;
        if (level >= LEVEL) {
            if (isNeedle(stack)) { the.result = stack; }
        } else {
            var arr = haystack[level];
            for (var i = 0; i < arr.length; i++) {
                if ('result' in the) return;
                inner(stack.concat([arr[i]]));
            }
        }
    }
    inner([]);
    if ('result' in the) return the.result;
    return null;
}
function needleHaystack(){
var digits = [0,1,2,3,4,5,6,7,8,9]
var haystack = [digits,digits,digits,digits,digits,digits,digits]
function isNeedle(stack){
	return stack.reduce(function(b,i){ return 10*b+i; }, 0) === 1735296
}
}

function setupBenchmarkJs(){
function test_ThrowCatch(){ return multiDimensionalFind_ThrowCatch(isNeedle, haystack); }
function test_ObedientToLandru1(){ return multiDimensionalFind_ObedientToLandru1(isNeedle, haystack); }
function test_ObedientToLandru2(){ return multiDimensionalFind_ObedientToLandru2(isNeedle, haystack); }
function test_ObedientToLandru3(){ return multiDimensionalFind_ObedientToLandru3(isNeedle, haystack); }
suite = new Benchmark.Suite('nestedReturn')
suite.add('disobey', test_ThrowCatch);
suite.add('obey1', test_ObedientToLandru1);
suite.add('obey2', test_ObedientToLandru2);
suite.add('obey3', test_ObedientToLandru3);
suite.run();
}

function thenType(){ [suite[0].stats.mean, suite[1].stats.mean, suite[2].stats.mean, suite[3].stats.mean] }

function theyWorkCorrectly(){
multiDimensionalFind_ThrowCatch(isNeedle, haystack);
multiDimensionalFind_ObedientToLandru1(isNeedle, haystack);
multiDimensionalFind_ObedientToLandru2(isNeedle, haystack);
multiDimensionalFind_ObedientToLandru3(isNeedle, haystack);
// in all 4 cases, [1, 7, 3, 5, 2, 9, 6] is returned as result.
}

function createLibrary(){
	var howCompliantVersionWorks = document.getElementById('howCompliantVersionWorks').textContent;
	var emphasisRex = /\*[^\*]*\*/;
	var codeRex = /`[^`]*`/;
	var em = fiat.dom('em');
	var code = fiat.dom('code');
	var parts = howCompliantVersionWorks.split(emphasisRex);
	var howBucket = [];
	var position = 0;
	parts.forEach(function(part){
		howBucket.push(part);
		position += part.length;
		var match = howCompliantVersionWorks.slice(position).match(emphasisRex);
		if (match && match[0]){
			var emphTxt = match[0].slice(1,-1);
			howBucket.push(em(emphTxt));
			position += (2+emphTxt.length);
		}
	});
	howBucket = howBucket.map(function(z){
		if ((typeof z)!=='string') return z;
		var retVal = [];
		var subParts = z.split(codeRex);
		var pos = 0;
		subParts.forEach(function(subPart){
			retVal.push(subPart);
			pos += subPart.length;
			var match = z.slice(pos).match(codeRex);
			if (match && match[0]){
				var theCode = match[0].slice(1,-1);
				retVal.push(code(theCode));
				pos += (2+theCode.length);
			}
		});
		return retVal;
	})
	return fiat.dom.fiat([{
		FIRST: function(div,p,a,code,pre,img,$lib){
			var main = div(
				p("Using ", a.A({href:"https://benchmarkjs.com/"})("benchmark js"),
					" for the run time measurements - it seems to me that's standard, so I'm using that.")
				,p("Here is my awesome awesome \"evildoer\" function which I'm growing more and more proud of:")
				,pre.coloredCode()(multiDimensionalFind_ThrowCatch.toString())
				,p("And here is a respectable citizen:")
				,pre.coloredCode()(multiDimensionalFind_ObedientToLandru1.toString())
				,p(howBucket)
				,p("And here are the needle and haystack arguments we're going to work with:")
				,pre.coloredCode()(needleHaystack.toString().slice(26,-1))
				,p("The algorithm has to loop through over a million combinations (over 1 million calls to isNeedle), and that takes (on my machine) about half a second. ")
				,p("Benchmark js runs tests repeatedly, in order to get statistically reliable results. Here is how you set up the test suite:")
				,pre.coloredCode()(setupBenchmarkJs.toString().slice(28,-1))
				,p("It will take a minute or two or something until everything is finished, because the tests run repeatedly.")
				,p("Then, type")
				,pre.coloredCode()(thenType.toString().slice(21,-1))
				,p("to obtain the 4 average run times in an array.")
				,p("To save you the trouble of downloading Benchmark js and setting all this up on your machine, ",
					"I uploaded the exact 4 tests you see here to ", a.A({href: "https://jsperf.com/"})("jsperf.com"),
					" which is a website deisigned for exactly this purpose (sharing of speed tests)."
				)
				,img.A({src: "../../img/SO_POST_SPEED_TEST_1.png"})
				,p("In the green boxes, the meaning of the big number on top (2.00, 1.88, 2.01, 1.93) is how often per second the test case finishes. As I said, about half a second it takes, that's where the 2 comes from.")
				,p("I almost forgot. They all four work correctly.")
				,pre.coloredCode()(theyWorkCorrectly.toString().slice(29,-1))
				,a.A({href: "https://stackoverflow.com/questions/63089089/transpiler-battle-breaking-out-of-nested-function-with-vs-without-throw/"})("back to question")
			);
			return { main: main };
		}
	}]);
}
function bodyOnload(){
	Lib = createLibrary();
	Lib.FIRST.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.FIRST.main.$append(document.body);
}