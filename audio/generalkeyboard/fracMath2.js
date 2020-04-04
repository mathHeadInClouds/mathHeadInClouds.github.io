// fracMath2.js

function makeFractionElt(enumerator, denominator){
    var div = document.createElement('div');
    var enumeratorElt = document.createElement('span');
    var denominatorElt = document.createElement('span');
    enumeratorElt.classList.add('enumerator');
    denominatorElt.classList.add('denominator');
    div.classList.add('fraction');
    enumeratorElt.textContent = enumerator;
    denominatorElt.textContent = denominator;
    div.appendChild(enumeratorElt);
    div.appendChild(denominatorElt);
    return div;
}

function frac(enu, deno, expons){
    // fraction enu/deno, with only certain prime factors
    // the exponents of those prime factors are stored in expons
    // zeroth entry of expons always refers to prime number 2
    // following entries usually (but not necessarily) refer to the following primes in sequence
    this.enu = enu;
    this.deno = deno;
    this.expons = expons;
    this.complexity = this.enu * this.deno;
    this.value = this.enu / this.deno; 
}
frac.prototype.toString = function(){
    return this.enu + "/" + this.deno;
}
frac.prototype.fromString = function(str, len){
    var f = fraction.prototype.fromString(str);
    if ( !f ) return null;
    return makeFrac(f.enu, f.deno, len);
}
frac.prototype.matrixFromString = function(str, len, transposeResult){
    var fs = fraction.prototype.fracArrayFromString(str, false);
    if ( !fs ){
        return null;
    }
    var len2 = fs.length;
    var result = new Array(len2);
    for ( var i=0; i<len2; i++ ){
        var f = fs[i];
        var ff = makeFrac(f.enu, f.deno, len);
        if ( !ff ){
            return null;
        }
        result[i] = ff.expons;
    }
    if ( transposeResult ){
        return transposeMat(result);
    } else {
        return result;
    }
}
frac.prototype.arrayFromString = function(str, len){
    var fs = fraction.prototype.fracArrayFromString(str, false);
    if ( !fs ){
        return null;
    }
    var len2 = fs.length;
    var result = new Array(len2);
    for ( var i=0; i<len2; i++ ){
        var f = fs[i];
        var ff = makeFrac(f.enu, f.deno, len);
        if ( !ff ){
            return null;
        }
        result[i] = ff;
    }
    return result;
}
function makeFrac(enu, deno, len){
    if ( len > primes.length ){
        return null;
    }
    if ( !len ){
        len = primes.length;
    }
    var result = new frac(enu, deno, null);
    result.expons = zeros(len);
    for ( var i=0; i<len; i++ ){
        var p = primes[i];
        while ( enu  % p == 0 ){ enu  /= p; result.expons[i]++; }
        while ( deno % p == 0 ){ deno /= p; result.expons[i]--; }
    }
    if ( enu != 1 ) return null;
    if ( deno != 1 ) return null;
    return result;
}
function fracFromExpons(expons){
    if ( expons.length > primes.length ){
        return null;
    }
    var enu = 1;
    var deno = 1;
    for ( var i=0; i<expons.length; i++ ){
        if ( expons[i] > 0 ){
            for ( var e=0; e<expons[i]; e++ ){
                enu *= primes[i];
            }
            continue;
        }
        for ( var e=0; e<-expons[i]; e++ ){
            deno *= primes[i];
        }
    }
    return new frac(enu, deno, expons);
}
frac.prototype.copy = function(){
    return new frac(this.enu, this.deno, arrayCopy(this.expons));
}
frac.prototype.timesPrimeAtPos = function(pos, primeList){
    if ( arguments.length <= 1 ){ primeList = primes; }
    var expons = arrayCopy(this.expons);
    expons[pos]++;
    return new frac(
        this.enu * primeList[pos],
        this.deno,
        expons
    );
}
frac.prototype.divByPrimeAtPos = function(pos, primeList){
    if ( arguments.length <= 1 ){ primeList = primes; }
    var expons = arrayCopy(this.expons);
    expons[pos]--;
    return new frac(
        this.enu,
        this.deno * primeList[pos],
        expons
    );
}
frac.prototype.twice = function(){
    // UNUSED !
    var result = this.copy();
    result.expons[0]++;
    if ( this.expons[0] < 0 ){
        // prime factor 2 occurs in denominator
        result.deno /= 2;
    } else {
        result.enu *= 2;
    }
    return result;
}
frac.prototype.half = function(){
    // UNUSED !
    var result = this.copy();
    result.expons[0]--;
    if ( this.expons[0] > 0 ){
        // prime factor 2 occurs in enumerator
        result.enu /= 2;
    } else {
        result.deno *= 2;
    }
    return result;
}
function fracBetween1andSqrt2(arg){
    return ( arg.value > 1 && arg.value < Math.sqrt(2) );
}
frac.prototype.normalize = function(){
    // UNUSED !
    // make it so that the fraction is between 1/sqrt(2) and sqrt(2)
    // by multiplying with a suitable power of 2
    // when this is called, enu and deno are both prime to 2
    if ( this.enu >= this.deno ){
        // greater 1, so definitely not too small
        while (true){
            if (this.enu < 2*this.deno){
                // we are between 1 and 2, so 0 or 1 step left
                if ( this.enu*this.enu >= 2*this.deno*this.deno ){
                    // greater than sqrt(2), make one final step
                    this.deno *= 2; this.expons[0]--;
                }
                return this;
            }
            this.deno *= 2; this.expons[0]--;
        }
    }
    if ( this.enu <= this.deno ){
        // less than 1, so definitely not too big
        while (true){
            if (2*this.enu > this.deno){
                // we are between 1/2 and 1, so 0 or 1 step left
                if ( 2*this.enu*this.enu <= this.deno*this.deno ){
                    // less than 1/sqrt(2), make one final step
                    this.enu *= 2; this.expons[0]++;
                }
                return this;
            }
            this.enu *= 2; this.expons[0]++;
        }
    }
}
frac.prototype.getCoords = function(matrix){
    var x = 0, y = 0;
    for ( var i=0; i<this.expons.length; i++ ){
        var e = this.expons[i];
        x += matrix[i][0] * e;
        y += matrix[i][1] * e;
    }
    return [x, y];
}
SortFrac = {
    byValue : function (that){
        return this.value <= that.value;
    },
    byComplexity : function (that){
        return this.complexity <= that.complexity;
    }
}
frac.prototype.lessEq = SortFrac.byComplexity;
frac.prototype.calculateConsistencyInterval = function(x, y, octavePartition){
    var logFr = Math.log(this.value)*Math.LOG2E;
    var tau1 = 1/octavePartition;
    if ( y == 0 ){
        // consistency does not depend on tau2
        if ( Math.abs(x*tau1 - logFr) < tau1/2 ){
            // consistent for all tau2
            this.consistencyInterval = [-Infinity, Infinity];
        } else {
            // never consistent, no matter what tau2, so empty interval
            this.consistencyInterval = [ Infinity,-Infinity];
        }
        return;
    }
    // err = y tau2 + x tau1 - logFr == 0 --> tau2 = (logFr-x tau1)/y
    var tau2Opt = (logFr-x*tau1)/y;
    /*
     err     = y    tau2 + x    tau1 - logFr
     errAlt  = yAlt tau2 + xAlt tau1 - logFr
    -errAlt  =-yAlt tau2 - xAlt tau1 + logFr
     err ==  errAlt --> tau2 = (xAlt-x)tau1/(y-yAlt) 
     err == -errAlt --> tau2 = (2logFr-(x+xAlt)tau1)/(y+yAlt) 
    */
    function intersect1(xAlt, yAlt){
        return (xAlt-x)*tau1/(y-yAlt);
    }
    function intersect2(xAlt, yAlt){
        return (2*logFr - (x+xAlt)*tau1)/(y+yAlt);
    }
    function intersect12(xAlt, yAlt){
        var i1 = intersect1(xAlt, yAlt);
        var i2 = intersect2(xAlt, yAlt);
        var low = Math.min(i1, i2);
        var hi  = Math.max(i1, i2);
        return [low, hi];
    }
    // errAlt  = yAlt tau2 + xAlt tau1 - logFr == 0 --> xAlt = (logFr-yAlt tau2)/tau1
    function xAltCand(yAlt){
        return Math.round((logFr-yAlt*tau2Opt)*octavePartition);
    }
    var lower = -Infinity;
    var upper = Infinity;
    var bounds, xAlt;
    function shrink(bounds){
        lower = Math.max(lower, bounds[0]);
        upper = Math.min(upper, bounds[1]);
    }
    var yAltStart = -Math.abs(y) + 1;
    var yAltEnd   =  Math.abs(y) - 1;
    for ( var yAlt=yAltStart; yAlt <= yAltEnd; yAlt++ ){
        xAlt = xAltCand(yAlt);
        bounds = intersect12(xAlt, yAlt);
        shrink(bounds);
    }
    xAlt = xAltCand(-y);
    var inter = intersect1(xAlt, -y);
    if ( inter > tau2Opt ){
        bounds = [-Infinity, inter];
    } else {
        bounds = [inter, Infinity];
    }
    shrink(bounds);
    this.consistencyInterval = [lower, upper];
}
/***********************************************************/
function fracErr(fr, err, consistent, ETconsistent){
    // fraction and error of that fraction + is it consitent (not consistent <==> there exists a closer button that approximates better)
    // ETconsistent : equal temperament consitent (best approx in the ET scale in question)
    this.fr = fr;
    this.err = err;
    this.consistent = consistent;
    this.ETconsistent = ETconsistent; 
}
SortFracErr = {
    byError : function (that){
        // want to sort errors decreasingly,
        // because the values should increase
        return this.err >= that.err;
    },
    byComplexity : function (that){
        return this.fr.lessEq(that.fr);
    }
}
//fracErr.prototype.lessEq = SortFracErr.byComplexity;
fracErr.prototype.lessEq = SortFracErr.byError;
/***********************************************************/
function bucketSort(fracArr){
    // UNUSED !
    // sort array of fractions by denominator, using bucket sort
    var buckets = [];
    var maxBucket = 1;
    // fill buckets
    for ( var i=0; i<fracArr.length; i++ ){
        var fr = fracArr[i];
        var d = fr.deno;
        if ( !buckets[d] ){
            buckets[d] = [];
            maxBucket = Math.max(d, maxBucket);
        }
        buckets[d].push(fr);
    }
    // collect buckets
    var result = [];
    for ( var b=1; b<=maxBucket; b++ ){
        if ( !buckets[b] ) continue;
        var bucket = buckets[b];
        for ( var c=0; c<bucket.length; c++ ){
            result.push(bucket[c]);
        }
    }
    assert(result.length == fracArr.length);
    return result;
}
function genFracs(maxComplexity, primeList){
    // maxComplexity: highest allowed product of enumerator and denominator
    if ( arguments.length <= 1 ){ primeList = primes; }
    var one = new frac(1, 1, zeros(primeList.length));
    var result = [];
    step(one, 0);
    mergeSortObjects(result);
    return result;
    function step(fr, pos){
        if ( pos == primeList.length ){
            result.push(fr.copy());
            return;
        }
        step(fr, pos+1);
        var newFrac = fr;
        while ( true ){
            newFrac = newFrac.timesPrimeAtPos(pos, primeList);
            if ( newFrac.complexity > maxComplexity ) break;
            step(newFrac, pos+1);
        }
        newFrac = fr;
        while ( true ){
            newFrac = newFrac.divByPrimeAtPos(pos, primeList);
            if ( newFrac.complexity > maxComplexity ) break;
            step(newFrac, pos+1);
        }
    }
}
/***********************************************************/
function gcd(x, y){
    // greatest common divisor
    while ( y != 0 ){
        var z = x % y;
        x = y;
        y = z;
    }
    return x;
}
function lcm(x, y){
    // least common multiple
    return x * y / gcd(x, y);
}
function continuedFraction(number, maxIter){
    var result = [];
    var count = 0;
    while ( number != 0 && count < maxIter ){
        var recip = 1/number;
        var appendMe = Math.floor(recip);
        number = recip - appendMe;
        result.push(appendMe);
        count++;
    }
    return result;
}
function fromContinuedFraction(coes){
    var uOld = 1, u = 0,
        vOld = 0, v = 1;
    for ( var i=0; i<coes.length; i++ ){
        var coe = coes[i];
        var uNext = uOld + coe * u;
        var vNext = vOld + coe * v;
        uOld = u; vOld = v;
        u = uNext; v = vNext;
    }
    return new fraction(u, v);
}
function fraction(enu, deno){
    // fraction enu/deno
    this.enu = enu;
    this.deno = deno;
}
fraction.prototype.value = function(){
    return this.enu / this.deno;
}
fraction.prototype.less = function(that){
    return this.enu*that.deno < this.deno*that.enu;
}
fraction.prototype.lessEq = function(that){
    return this.enu*that.deno <= this.deno*that.enu;
}
fraction.prototype.toString = function(){
    return this.enu + "/" + this.deno;
}
fraction.prototype.longToString = function(){
    var htmlCentSymbol = "&#162;";
    var inCent = 1200*Math.log(this.value())/Math.LN2;
    return this.enu + "/" + this.deno + " (" + "%5.3f".sprintf(inCent) + htmlCentSymbol + ")";
}
fraction.prototype.toCentString = function(){
    var htmlCentSymbol = "&#162;";
    var inCent = 1200*Math.log(this.value())/Math.LN2;
    return "%5.3f".sprintf(inCent) + htmlCentSymbol;
}
fraction.prototype.toCent = function(){
    return 1200*Math.log(this.value())/Math.LN2;
}
fraction.prototype.toString3Rows = function(){
    var br = "<br/>";
    var line1 = this.enu + br;
    var line2 = "";
    var enuNumDigits = 1 + Math.floor(Math.log(this.enu)/Math.LN10);
    var denoNumDigits = 1 + Math.floor(Math.log(this.deno)/Math.LN10);
    var maxNumDigits = Math.max(enuNumDigits, denoNumDigits);
    var line2Length = Math.round(1.45 * maxNumDigits);
    for ( var i=0; i<line2Length; i++ ){
        line2 += "-";
    }
    line2 += br;
    var line3 = this.deno;
    return line1 + line2 + line3;
}
fraction.prototype.toDom = function(){
    return makeFractionElt(this.enu, this.deno);
}
fraction.prototype.toHTML = function(){
    return this.toDom().outerHTML;
}
fraction.prototype.toLatex = function(){
    return "\\frac{" + this.enu + "}{" + this.deno + "}";
}
fraction.prototype.toStringSpecial = function(){
    return this.enu + "x" + this.deno;
}
fraction.prototype.equals = function(that){
    if ( that == null ) return false;
    if ( typeof that != "object" ) return false;
    if ( !(that instanceof fraction) ) return false;
    return ( this.enu == that.enu && this.deno == that.deno );
}
fraction.prototype.fromString = function(str){
    var ed = str.split("/");
    if ( ed.length != 2 ) return null;
    var enuStr = ed[0];
    var denoStr = ed[1];
    var enu = enuStr - 0;
    if ( isNaN(enu) ) return null;
    var deno = denoStr - 0;
    if ( isNaN(deno) ) return null;
    if ( deno === 0 ) return null;
    if ( enu != Math.round(enu) ) return null;
    if ( deno != Math.round(deno) ) return null;
    if ( deno < 0 ){
        deno *= -1;
        enu *= -1;
    }
    var g = gcd(Math.abs(enu), deno);
    enu /= g;
    deno /= g;
    return new fraction(enu, deno);
}
fraction.prototype.fracArrayFromString = function(str, sort){
    if ( str[0] != "[") return null;
    if ( str[str.length-1] != "]" ) return null;
    // remove first and last character
    str = str.slice(1, -1);
    var entries = str.split(",");
    var result = new Array(entries.length);
    for ( var i=0; i<result.length; i++ ){
        var f = this.fromString(entries[i]);
        if ( f == null ){
            return null;
        }
        result[i] = f;
    }
    if ( sort ){
        mergeSortObjects(result);
    }
    return result;
}
function numFromString(x){
    var asFrac = fraction.prototype.fromString(x);
    if ( asFrac ) return asFrac;
    var asEval = NaN;
    try {
        asEval = eval(x);
    } catch(e){}
    if ( !isNaN(asEval) ) return asEval;
    if ( !isNaN(x) ) return x - 0;
    return null;
}
function findRationalsBetween(minVal, maxVal, maxDenom){
    var epsilon = 0.0000000001;
    var coes = [];
    var num1 = minVal;
    var num2 = maxVal;
    while ( num1 != 0 && num2 != 0 ){
        var recip1 = 1/num1;
        var recip2 = 1/num2;
        var k1 = Math.floor(recip1);
        var k2 = Math.floor(recip2);
        if ( k1 != k2 ) break;
        coes.push(k1);
        num1 = recip1 - k1;
        num2 = recip2 - k2;
    }
    var left, right, leftValue, rightValue;
    if ( coes.length == 0 ){
        left = new fraction(0, 1);
        right = new fraction(1, 1);
        leftValue = 0;
        rightValue = 1;
    } else {
        var coes2 = arrayCopy(coes);
        coes2[coes.length-1]++;
        var f1 = fromContinuedFraction(coes);
        var f2 = fromContinuedFraction(coes2);
        var f1v = f1.value();
        var f2v = f2.value();
        if ( f1v < f2v ){
            left = f1;
            right = f2;
            leftValue = f1v;
            rightValue = f2v;
        } else {
            left = f2;
            right = f1;
            leftValue = f2v;
            rightValue = f1v;
        }
    }
    function calcMinM_standard(){
        return Math.max(1,
            Math.ceil(n*(minVal*d1-e1)/(e2-minVal*d2))
        );
    }
    function calcMinM_leftAndMinValVeryClose(){
        return 1;
    }
    function calcMaxM_standard(){
        return Math.min(
            Math.floor(n*(maxVal*d1-e1)/(e2-maxVal*d2)),
            Math.floor((maxDenom-n*d1)/d2)
        ); 
    }
    function calcMaxM_rightAndMaxValVeryClose(){
        return Math.floor((maxDenom-n*d1)/d2);
    }
    var result = [];
    var calcMinM = calcMinM_standard;
    var calcMaxM = calcMaxM_standard;
    if ( minVal - leftValue < epsilon ) {
        calcMinM = calcMinM_leftAndMinValVeryClose;
        result.push(left);
    }
    if ( rightValue - maxVal < epsilon ) {
        calcMaxM = calcMaxM_rightAndMaxValVeryClose;
        result.push(right);
    }
    var e1 = left.enu, d1 = left.deno,
        e2 = right.enu, d2 = right.deno;
    var maxN = Math.floor((maxDenom - d2)/d1);
    for ( var n=1; n<=maxN; n++ ){
        var minM = calcMinM();
        var maxM = calcMaxM();
        for ( var m=minM; m<=maxM; m++ ){
            if ( gcd(n, m) > 1 ) continue;
            result.push(new fraction(n*e1 + m*e2, n*d1 + m*d2));
        }
    }
    mergeSortObjects(result);
    return result;
}
/************************************************************************/


