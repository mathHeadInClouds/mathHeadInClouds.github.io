// errorCalculator.js
function ErrorPolynomial(a, b, d, e, f, abs, numPrimes, octPart){
    this.a = a;
    this.b = b;
    this.d = d;
    this.e = e;
    this.f = f;
    this.abs = abs;
    this.numPrimes = numPrimes;
    this.octavePartition = octPart; // needed for the buttonSpread, also calculated in this class
    this.findMinimum();
}
ErrorPolynomial.prototype.sumOfErrorWeights = [2, 5, 8, 11, 13.4, 15.8];
ErrorPolynomial.prototype.valueAt = function(tau1, tau2){
    var error = this.a*tau1*tau1 + this.d*tau2*tau2 + 2*(this.b*tau1*tau2 - this.e*tau1 - this.f*tau2) + this.abs;
    error /= this.sumOfErrorWeights[this.numPrimes-1];
    if ( error <= 0 ) return 0;
    error = Math.sqrt(error);
    return error;
}
ErrorPolynomial.prototype.findMinimum = function(){
    var a = this.a;
    var b = this.b;
    var d = this.d;
    var e = this.e;
    var f = this.f;
    var abs = this.abs;
    var numPrimes = this.numPrimes;
    var octPart = this.octavePartition;
    // solve (a b)(tau1)  = (e)
    //       (b d)(tau2)    (f)
    var det = a*d - b*b;
    this.tau1Opt = ( d*e - b*f)/det;
    this.tau2Opt = (-b*e + a*f)/det;
    this.minMse = this.valueAt(this.tau1Opt, this.tau2Opt);
    this.buttonSpread = Math.sqrt(d/this.sumOfErrorWeights[numPrimes-1]) * octPart;
    this.widthUnit = this.minMse/Math.sqrt(d);
}
ErrorPolynomial.prototype.findMinimumForFixedTau1 = function(tau1){
    // best value for tau2, given tau1
    return (this.f - this.b * tau1) / this.d;
}
ErrorPolynomial.prototype.findMinimumForFixedTau2 = function(tau2){
    // best value for tau1, given tau2
    return (this.e - this.b * tau2) / this.a;
}
ErrorPolynomial.prototype.findTau2Rats = function(numRats){
    var factor = 28;
    var factor2 = 13;
    var width = factor * this.widthUnit;
    var tempMin = Math.max(this.tau2Opt-width, this.widthUnit/2);
    var tempMax = Math.min(this.tau2Opt+width, 1/(2*this.octavePartition) - this.widthUnit/2);
    var op = this.octavePartition;
    if ( this.minMse > 0 ){
        var maxSPO = 50 + 1/(this.minMse);
        while ( true ){
            var candidates = Select(function(candidate){ return ( lcm(op, candidate.deno) <= maxSPO ) }, findRationalsBetween(tempMin, tempMax, maxSPO));
            if ( candidates.length >= 1.5 * numRats + 2 ) break;
            maxSPO *= 1.5;
        }
        for ( var i=0; i<candidates.length; i++ ){
            var cand = candidates[i];
            var spo = lcm(this.octavePartition, cand.deno); // steps per octave
            cand.score = spo * this.valueAt(1/this.octavePartition, cand.value());
        }
        mergeSortObjects2(candidates, function(arg1, arg2){ return ( arg1.score <= arg2.score ); } );
        var rats = candidates.slice(0, numRats);
        mergeSortObjects(rats);
        var tau2Min = Math.min(rats[0].value(), Math.max(this.tau2Opt - factor2*this.widthUnit, this.widthUnit/2));
        var tau2Max = Math.max(rats[rats.length-1].value(), Math.min(this.tau2Opt + factor2*this.widthUnit, 1/(2*this.octavePartition) - this.widthUnit/2));
        var t1r = Math.max(1200*20*this.minMse/Math.sqrt(this.a), 1.5*1200*Math.abs(this.tau1Opt - 1/this.octavePartition));
    } else {
        var tau2Min = this.tau2Opt *0.99;
        var tau2Max = this.tau2Opt *1.01;
        var t1r = 2;
        var rats = [];
    }
    return {
        tau2Min : tau2Min,
        tau2Max : tau2Max,
        tau2Rats : rats,
        tau1SliderRangeInCent : t1r
    }
}
function calculateErrorPolynomial(matrix, numPrimes){
    if ( arguments.length < 2 ){
        numPrimes = matrix.length;
    }
    var pList = primes.slice(0, numPrimes);
    var sigma = new Array(pList.length);
    for ( var i=0; i<sigma.length; i++ ){
        sigma[i] = (pList[i]+1)/(pList[i]-1);
    }
    function firstMatrixRow(){
        var result = new Array(numPrimes);
        for ( var i=0; i<result.length; i++ ){
            result[i] = matrix[i][0];
        }
        return result;
    }
    function secondMatrixRow(){
        var result = new Array(numPrimes);
        for ( var i=0; i<result.length; i++ ){
            result[i] = matrix[i][1];
        }
        return result;
    }
    function logsOfPrimes(){
        var result = new Array(numPrimes);
        for ( var i=0; i<result.length; i++ ){
            result[i] = Math.log(pList[i])*Math.LOG2E;
        }
        return result;
    }
    function calcCoeOld(coes1, coes2){
        function aux1(j){
            return (pList[j]+1)/(pList[j]-1);
        }
        function aux2(j){
            return 2*coes1[j]*coes2[j]*pList[j]*(pList[j]+1)/thirdPower((pList[j]-1));
        }
        var x = 1, y = 0;
        var newX, newY;
        for ( var j=pList.length-1; j>=0; j--){
            var f = aux1(j);
            var g = aux2(j);
            newX = f*x;
            newY = f*y + g*x;
            x = newX;
            y = newY;
        }
        return y;
    }
    function calcCoe(coes1, coes2){
        var sum = 0;
        var prod = 2;
        for ( var i=0; i<pList.length; i++ ){
            //prod *= (pList[i]+1)/(pList[i]-1);
            prod *= sigma[i];
            sum += (coes1[i]*coes2[i]*pList[i])/square(pList[i]-1);
        }
        var result = prod * sum;
        return result;
    }
    var rhs = logsOfPrimes();
    var row1 = firstMatrixRow();
    var row2 = secondMatrixRow();
    var aEnu = 0;
    var aDeno = 0;
    for ( var i=0; i<pList.length; i++ ){
        aEnu  += sigma[i]*row1[i]*row2[i];
        aDeno += sigma[i]*row2[i]*row2[i];
    }
    var optA = -aEnu / aDeno; // sucks!
    var result = new ErrorPolynomial(
        calcCoe(row1, row1),
        calcCoe(row1, row2),
        calcCoe(row2, row2),
        calcCoe(row1, rhs),
        calcCoe(row2, rhs),
        calcCoe(rhs, rhs),
        numPrimes,
        matrix[0][0],
        optA, optLatticeB
    );
    var gDeno = 0;
    var optA = result.tau2Opt * result.octavePartition;
    for ( var i=0; i<pList.length; i++ ){
        gDeno += sigma[i]*square(row1[i]+optA*row2[i]);
    }
    var C = 1;
    var optGamma = Math.pow(aDeno/(C*gDeno), 0.25);
    var optLatticeB = 1/square(optGamma);
    result.optOD = optGamma;
    return result;
}
