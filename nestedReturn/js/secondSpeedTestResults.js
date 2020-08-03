var Lib;

var code_sample_1 = `
function pointless_ThrowCatch(x,y){   // insane
    try {
        throw(x+y);
    } catch(e){
        return e;
    }
}
function add(x,y){ return x+y; }    // sane
// call sane or insane a million times
function million_blahblah(){
    for(var x=0; x<1000; x++){
        for(var y=0; y<1000; y++){
            blahblah(x,y);
        }
    }
}
`;
var code_sample_2 = `
function pointless_ThrowCatch(x,y){
    try {
        var myCustomError = new Error('Rumpelstielschen');
        myCustomError.data = x+y;
        throw(myCustomError);
    } catch(e){
        return e.data;
    }
}
// rest of test exactly as before
`;

function createLibrary(){
	return fiat.dom.fiat([{
		SECONDTEST: function(div,a,p,code,pre,img,em,br,h2,$lib){
			var main = div(
				p("the ", a.A({href: "firstSpeedTestResults.html"})("first speed test")
					, " I did (see my other answer) got me curious. How expensive is a ", code('throw')
					, " actually?"
				),
				p("You see, in that first test, I do many many millions of operations, and then a single throw. "
				, em("Even if"), " that single ", code("throw"), " is expensive, you wouldn't find out from that test."
				," So I did another test. I compare the sane way of adding two numbers ", code("x,y => x+y")
				, " and an insane version with a completely pointless ", code("throw/catch"), ". Just to see how expensive the ", code("throw"), " is.")
				, pre.coloredCode()(code_sample_1)
				, p("Result: the insane version is 3000 times slower. As you can see in screenshot below, the number of operations per second for doing a million throws is 0.5. That means, a single throw takes about 2 microseconds or 0.002 milliseconds. A single arithmetic operation costs roughly about 1/3000 of that.")
				, a.A({href: "https://jsperf.com/pointlessthrowcatchtest"})("test on jsperf")
				, br
				, img.A({src: "../../img/POINTLESS_THROW_CATCH.png"})
				, p("Whether or not something that takes 2 microseconds is \"too expensive\" or not, that depends on the context.")
				, p("You shouldn't use ", code("throw/catch"),
					' "just for the heck of it", maybe because you find it stylish or something. That much is true.'
				)
				, h2("update")
				, p("So it indeed is in a way \"expensive\". 3000 times more expensive than an arithmetic operation, according to the above."
					, " Actually, I correct myself. It's about 10,000 times more expensive. Because of the arithmetic operations from the inner for-loop."
					, " Anyway, about 2 microseconds. If you throw ", em("the result")
					, ". No problem ", a.A({href: "https://mathheadinclouds.github.io/throwCatchWolframRemark.txt"})("whatsoever")
					, " to throw something which isn't an error. Don't get the silly idea to wrap your data into an artificial error,"
					, " just because you think you're more \"standards compliant\" then, because technically, \"you only threw what decent people throw\" - errors."
					, " Doing that is ", em("worse than pointless"), ". You actually make a (normally small-ish) problem a little bit bigger. You see, throwing an "
					, em("error"), " costs ", em("more"), " than throwing something which isn't an error. If the \"throwee\" (excuse my intentionally perverted English)"
					, " is an error, there are additional things to be done (afaik the stuff making later console log of the stack trace etc possible). Here is a test confirming what I just told you."
				)
				, pre.coloredCode()(code_sample_2)
				, a.A({href: "https://jsperf.com/pointlessthrowcatchwitherror"})("test on jsperf")
				, br
				, img.A({src: "../../img/POINTLESS_THROW_CATCH_WITH_ERROR.png"})
				, p("As you can see, the number of operations per second went down from 0.5 to 0.1. Throwing "
					, em("an error"), " takes 10 microseconds, as opposed to throwing ", em("anything else"), " taking 2 microseconds."
				)
				, p("I'd like to thank the anonymous person who told me about this performance difference in throwing errors vs. non-errors. I think that person doesn't want my thanks because of our disagreement on throwing non-errors being a good idea in some relatively rare cases, or never. So I don't want to tell you who it is. It's a competent helpful person from SO, let's leave it at that.")
				, h2('older browsers')
				, p("I also know from the anonymous source that in older browsers the time for a "
					, code("throw/catch"), " (of an error) was a lot worse than the 10 microseconds it takes today. Why am I not surprised?"
				)
				,a.A({href: "https://stackoverflow.com/questions/63089089/transpiler-battle-breaking-out-of-nested-function-with-vs-without-throw/"})("back to question")
			);
			return { main: main };
		}
	}]);
}
function bodyOnload(){
	Lib = createLibrary();
	Lib.SECONDTEST.main.setRoot('main');
	console.log(Lib.instance.root);
	Lib.SECONDTEST.main.$append(document.body);
}