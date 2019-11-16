generateColor = (function(){
    var gamma = (Math.sqrt( 5)-1)/2;
    var alpha  = Math.sqrt(3)-1;
    var beta   = Math.sqrt(2) - 1;
    function _generateColor(index, brightnessFactor){
        var n = 1 + index;
        var nAlpha = n * alpha;
        var nBeta  = n * beta;
        var nGamma = n * gamma;
        var _r = nAlpha - Math.floor(nAlpha);
        var _g = nBeta  - Math.floor(nBeta);
        var _b = nGamma - Math.floor(nGamma);
        var expo = 1/brightnessFactor;
        var _R = Math.pow(_r, expo);
        var _G = Math.pow(_g, expo);
        var _B = Math.pow(_b, expo);
        var r = Math.floor(255.999999 * _R);
        var g = Math.floor(255.999999 * _G);
        var b = Math.floor(255.999999 * _B);
        return 'rgb(' + [r,g,b].join(', ') + ')';
    }
    return _generateColor;
})();