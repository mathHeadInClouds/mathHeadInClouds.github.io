// voronoi.js
var onedivcos30  = 2/Math.sqrt(3);
function Lattice(a,b){
    this.a = a;
    this.b = b;
    this.intn = Voronoi.calcIntNeighb(a, b);
    this.sqrtB = Math.sqrt(b);
    this.iSqrtB = 1/this.sqrtB;
    this.shearMat = new Mat22(this.iSqrtB, a*this.iSqrtB, 0, this.sqrtB);
    this.mat = this.shearMat; // might be changed later (due to rotation, mirroring, zooming)
    this.trafoMat = new Mat22(this.intn[0][0], this.intn[1][0], this.intn[0][1], this.intn[1][1]);
}
Lattice.prototype.setMat = function(mat){
    this.mat = mat;
}
Lattice.prototype.calcNeighboursAndVertices = function(){
    var mat = this.mat;
    this.neighb = map(function(arg){ return mat.timesVec(arg); }, this.intn);
    this.vertices = new Array(this.neighb.length - 1);
    for ( var i=0; i<this.vertices.length; i++ ){
        this.vertices[i] = Voronoi.intersectPerpBisecs(this.neighb[i], this.neighb[i+1]);
    }
    // squares of lengths of sides
    var s2a = squaredLineLength(this.vertices[0], this.vertices[1]);
    var s2b = squaredLineLength(this.vertices[1], this.vertices[2]);
    var s2c = squaredLineLength(this.vertices[2], this.vertices[3]);
    var hexagonity = (s2a+s2b+s2c) 
		/ (s2a/normSquared(this.neighb[1])
		 + s2b/normSquared(this.neighb[2])
		 + s2c/normSquared(this.neighb[3]));
    hexagonity /= onedivcos30;
    this.s2a = s2a;
    this.s2b = s2b;
    this.s2c = s2c;
    this.hexagonity = hexagonity;
}
Lattice.prototype.calcSquarity = function(){
    var squarity = (2.5) 
    	/ (1/normSquared(this.neighb[1])
    	 + 1/normSquared(this.neighb[2])
    	 + 1/normSquared(this.neighb[3]));
    squarity *= squarity;
    var invCirc2umf = 1/(this.s2a+this.s2b+this.s2c);
    invCirc2umf *= onedivcos30;
    this.squarity = squarity;
    this.invCirc2umf = invCirc2umf;
}
Lattice.prototype.calcOrdering = function(){
    if ( this.s2a < this.s2b ){
        if ( this.s2a < this.s2c ){
            this.minSide = this.s2a;
            if ( this.s2b < this.s2c ){
                this.midSide = this.s2b;
                this.maxSide = this.s2c;
                this.ordering = "abc";
            } else {
                this.midSide = this.s2c;
                this.maxSide = this.s2b;
                this.ordering = "acb";
            }
        } else {
            this.minSide = this.s2c;
            this.midSide = this.s2a;
            this.maxSide = this.s2b;
            this.ordering = "cab";
        }
    } else {
        if ( this.s2b < this.s2c ){
            this.minSide = this.s2b;
            if ( this.s2a < this.s2c ){
                this.midSide = this.s2a;
                this.maxSide = this.s2c;
                this.ordering = "bac";
            } else {
                this.midSide = this.s2c;
                this.maxSide = this.s2a;
                this.ordering = "bca";
            }
        } else {
            this.minSide = this.s2c;
            this.midSide = this.s2b;
            this.maxSide = this.s2a;
            this.ordering = "cab";
        }
    }
    var hexSide = 0.385705;
    this.maxSideDivHexSide = this.maxSide/hexSide;
}
function newLattice(a, b){
    var lattice = new Lattice(a,b);
    lattice.calcNeighboursAndVertices();
    lattice.calcOrdering();
    lattice.calcSquarity();
    return lattice;
}
Lattice.prototype.calcColors = function(){
    this.calcNeighboursAndVertices();
    this.calcOrdering();
    var red = 256*this.hexagonity*this.hexagonity/Math.sqrt(this.maxSideDivHexSide);
    var green = 256*square(this.midSide/this.maxSide);
    //var blue = 256*Math.min(midSide/maxSide, minSide/midSide);
    var blue = 256*this.minSide/this.maxSide;
    if ( this.minSide <= 0.00001 ){
        red = green = blue = 0;
    }
    var transpa = 255;
    return {
        red : red,
        green : green,
        blue : blue,
        transpa : transpa
    }
}
Voronoi = {
    bFrom : Defaults.voronoiBFrom,
    bTo : Defaults.voronoiBTo,
    perfectList : null,
    intNeighbAux : function(a, b){
        var um = 1, u = 0, vm = 0, v = 1, aa = a, stop = false, k, kk, am1,
            b2 = b*b, a2b2 = a*a + b2, tmp, uNext, vNext, reverse = false;
        while ( true ){
            tmp = a * v - u;
            kk = Math.ceil(-1 + (um*tmp + a*u*vm - a2b2*vm*v)/(tmp*tmp + b2*v*v));
            if ( aa == 0 ){
                stop = true;
            } else {
                am1 = 1/aa;
                k = Math.floor(am1);
                stop = ( kk < k );
            }
            if ( stop ){
                var p1 = [-u, v];
                var p2 = [-um-(kk+1)*u, vm+(kk+1)*v];
                var p3 = [-um-   kk *u, vm+   kk *v];
                var p4 = [u, -v];
                var p5 = [-p2[0], -p2[1]];
                //var p6 = [-p3[0], -p3[1]];
                if ( reverse ){
                    return [p5, p4, p3, p2, p1];
                } else {
                    return [p1, p2, p3, p4, p5];
                }
            }
            aa = am1 - k;
            uNext = um + k*u;
            vNext = vm + k*v;
            um = u; u = uNext; vm = v; v = vNext; reverse = !reverse;
        }
    },
    calcIntNeighb : function(a, b){
        if ( a > 0 ){
            return this.intNeighbAux(a, b);
        }
        var n = Math.floor(-a + 1);  // n <= -a + 1 < n+1 ==> -n-1 < a - 1 <= - n ==> 0 < a+n <= 1 
        var result = this.intNeighbAux(a+n, b);
        for ( var i=0; i<result.length; i++ ){
            result[i][0] += n*result[i][1];
        }
        return result;
    },
    intersectPerpBisecs : function(p1, p2){
        // intersect perpendicular bisector of origin with point p1 with
        //           perpendicular bisector of origin with point p2
        var s = p1[0], t = p1[1], q = p2[0], w = p2[1];
        var s2t2 = s*s + t*t, q2w2 = q*q + w*w, det2 = 2*(s*w - q*t);
        var x =  w*s2t2 - t*q2w2;
        var y = -q*s2t2 + s*q2w2;
        return [x/det2, y/det2];
    },
    findIntCoordsInArea : function(a, b, c, d, xLo, xHi, yLo, yHi){
        /* find all (u,v) in Z^2, such that (a	b)(u) in  [xLo,xHi] x [yLo, yHi]
                                            (c	d)(v)
        assume v fixed
        case 1.1 a > 0, c > 0
        au + bv <= xHi <==> u <= (xHi - bv)/a, cu + dv <= yHi <==> u <= (yHi - dv)/c
        au + bv >= xLo <==> u >= (xLo - bv)/a, cu + dv >= yLo <==> u >= (yLo - dv)/c
        other cases similar */
        function b1(v){ return (xHi-b*v)/a; }
        function b2(v){ return (yHi-d*v)/c; }
        function b3(v){ return (xLo-b*v)/a; }
        function b4(v){ return (yLo-d*v)/c; }
        var aux;
        var ceil = Math.ceil, floor = Math.floor, max = Math.max, min = Math.min;
        if ( a > 0 ){
            if ( c > 0 ){
                aux = function(v){
                    return [ceil(max(b3(v), b4(v))), floor(min(b1(v), b2(v)))];
                }
            } else {
                if ( c < 0 ){
                    aux = function(v){
                        return [ceil(max(b2(v), b3(v))), floor(min(b1(v), b4(v)))];
                    }
                } else {
                    // c = 0
                    aux = function(v){ return [ceil(b3(v)), floor(b1(v))]; }
                }
            }
        } else {
            if ( a < 0 ){
                if ( c > 0 ){
                    aux = function(v){
                        return [ceil(max(b1(v), b4(v))), floor(min(b2(v), b3(v)))];
                    }
                } else {
                    if ( c < 0 ){
                        aux = function(v){
                            return [ceil(max(b1(v), b2(v))), floor(min(b3(v), b4(v)))];
                        }
                    } else {
                        // c = 0
                        aux = function(v){ return [ceil(b1(v)), floor(b3(v))]; }
                    }
                }
            } else {
                // a = 0
                if ( c > 0 ){
                    aux = function(v){ return [ceil(b4(v)), floor(b2(v))]; }
                } else {
                    if ( c < 0 ){
                        aux = function(v){ return [ceil(b2(v)), floor(b4(v))]; }
                    } else {
                        // a = c = 0 ==> matrix is singular
                        throw "singular matrix";
                    }
                }
            }
        }
        var det = a*d - b*c;
        var tmp1 = (a*yLo - c*xLo)/det,
            tmp2 = (a*yHi - c*xLo)/det,
            tmp3 = (a*yLo - c*xHi)/det,
            tmp4 = (a*yHi - c*xHi)/det;
        var vMax = floor(max(tmp1, tmp2, tmp3, tmp4)),
            vMin = ceil(min(tmp1, tmp2, tmp3, tmp4));
        var result = [];
        for ( var v = vMin; v <= vMax; v++ ){
            var uFromTo = aux(v), uFrom = uFromTo[0], uTo = uFromTo[1];
            for ( var u = uFrom; u <= uTo; u++ ){
                result.push([u, v]);
            }
        }
        return result;
    },
    Perfect : function(denom, aEnum){
        // stands for a pair (a,b) that generates perfect hexagon or square
        // in both cases, a = aEnum/denom
        // in the hexagon case, b = sqrt(3)/denom,
        // and in the square case, b = 1/denom
        // b will be calculated and stored a field outside this constructor
        // ditto for the associated intn matrix
        this.denom = denom;
        this.aEnum = aEnum;
        this.a = aEnum / denom;
    },
    makePerfectHexagon : function(u1, v1, u2, v2){
        var result = new this.Perfect(
            2*(v1*v1 - v1*v2 + v2*v2),
            u1*(2*v1-v2) + u2*(2*v2-v1)        
        );
        result.b = Math.sqrt(3)/result.denom;
        result.type = "hexagon";
        result.u1 = u1;
        result.v1 = v1;
        result.u2 = u2;
        result.v2 = v2;
        return result;
    },
    makePerfectSquare : function(u1, v1, u2, v2){
        var result = new this.Perfect(
            v1*v1 + v2*v2,
            u1*v1 + u2*v2        
        );
        result.b = 1/result.denom;
        result.type = "square";
        result.u1 = u1;
        result.v1 = v1;
        result.u2 = u2;
        result.v2 = v2;
        return result;
    },
    findPerfect : function(minB){
        var result = [];
        var makeHex = this.makePerfectHexagon;
        var makeSquare = this.makePerfectSquare;
        var THIS = this;
        function step(uOld, u, vOld, v){
            var k = 0;
            while ( true ){
                k++;
                var uNew = uOld + k*u;
                var vNew = vOld + k*v;
                var candidate = make.call(THIS, u, v, uNew, vNew);
                if ( candidate.b >= minB ){
                    step(u, uNew, v, vNew);
                    if ( k == 1 && u > 0 && make == makeHex ){
                        // do nothing, same continued fraction occurs again later
                        // ( can always avoid ending continued fractions with 1 )
                    } else {
                        result.push(candidate);
                    }
                } else {
                    break;
                }
            }
        }
        var make = makeHex;
        step(1, 0, 0, 1);
        make = makeSquare;
        step(1, 0, 0, 1);
        return result;
    },
    init : function(){
        this.perfectList = this.findPerfect(this.bTo);
    },
    selectPerfect : function(tau2, tau1, bMin, bMax, maxTanTilt){
        bMin = Math.max(bMin, this.bTo);
        var result = new Array();
        for ( var i=0; i<this.perfectList.length; i++ ){
            var perf = this.perfectList[i];
            if ( perf.b < bMin ) continue;
            if ( perf.b > bMax ) continue;
            var tanTilt = (tau2/tau1-perf.a)/perf.b;
            if ( Math.abs(tanTilt) > maxTanTilt ) continue;
            perf.tanTilt = tanTilt;
            perf.tilt = Math.atan(tanTilt);
            result.push(perf);
        }
        return result;
    }
}
Voronoi.init();
    
Voronoi.Perfect.prototype.toString = function(){
    return this.aEnum + "/" + this.denom;
}
function showHexInCanvas(ctx, vertices){
    ctx.canvas.width = ctx.canvas.width;
    var midX = ctx.canvas.width/2;
    var midY = ctx.canvas.height/2;
    var scale = midY / 1.4; 
    var v1x = midX + scale*vertices[0][0], v1y = midY + scale*vertices[0][1], 
        v2x = midX + scale*vertices[1][0], v2y = midY + scale*vertices[1][1], 
        v3x = midX + scale*vertices[2][0], v3y = midY + scale*vertices[2][1], 
        v4x = midX - scale*vertices[0][0], v4y = midY - scale*vertices[0][1], 
        v5x = midX - scale*vertices[1][0], v5y = midY - scale*vertices[1][1], 
        v6x = midX - scale*vertices[2][0], v6y = midY - scale*vertices[2][1];
    ctx.beginPath();
    ctx.moveTo(v1x, v1y);
    ctx.lineTo(v2x, v2y);
    ctx.lineTo(v3x, v3y);
    ctx.lineTo(v4x, v4y);
    ctx.lineTo(v5x, v5y);
    ctx.lineTo(v6x, v6y);
    ctx.lineTo(v1x, v1y);
    ctx.stroke();
}
function LatticeFromMouseCoords(x,y){
    // 0 <= x <= this.width
    // aFrom <= a <= aTo
    var tilt = -this.maxTilt + 2*x*this.maxTilt/this.width;
    var b = this.bFrom * Math.pow((this.bTo/this.bFrom), (y/this.height));
    var a = this.tau2/this.tau1 - b*Math.tan(tilt);
    var lattice = newLattice(a,b);
    // find closest perfect hexagon or square to the mouse coords
    var perfect = null;
    if ( this.mouseReady ){
        var closest = null;
        var minDistQuot = Infinity;
        for ( var i=0; i<Voronoi.perfectList.length; i++ ){
            var hexOrSquare = Voronoi.perfectList[i];
            var perfA = hexOrSquare.a;
            var perfB = hexOrSquare.b;
            var perfX = this.width*(hexOrSquare.tilt+this.maxTilt)/(2*this.maxTilt);
            var perfY = this.height*Math.log(perfB/this.bFrom)/Math.log(this.bTo/this.bFrom);
            var squaredDist = square(x-perfX) + square(y-perfY);
            var distQuot = squaredDist / square(hexOrSquare.radius);
            if ( distQuot < minDistQuot ){
                minDistQuot = distQuot;
                closest = hexOrSquare;
            }
        }
        if ( minDistQuot <= 1 ){
            perfect = closest;
        }
    }
    lattice.tilt = tilt;
    lattice.perfect = perfect;
    return lattice;
}

