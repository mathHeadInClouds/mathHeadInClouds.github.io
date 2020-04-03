// math.js
function square(x){
    return x*x;
}
function thirdPower(x){
    return x*x*x
}
function fourthPower(x){
    return square(square(x));
}
function thirdRoot(x){
    if ( x >= 0 ){
        return Math.pow(x, 1/3);
    } else {
        return -Math.pow(-x, 1/3);
    }
}
function modulo(x, module){
    return (((x % module) + module) % module);
}
function deg2rad(angle){
    return angle/180*Math.PI;
}
function rad2deg(angle){
    return angle/Math.PI*180;
}
function angleBetween(vec1, vec2){
    return Math.acos((vec1[0]*vec2[0]+vec1[1]*vec2[1])/(norm(vec1)*norm(vec2)));
}
function lineLength(pt1, pt2){
    var dx = pt1[0] - pt2[0];
    var dy = pt1[1] - pt2[1];
    return Math.sqrt(dx*dx + dy*dy);
}
function squaredLineLength(pt1, pt2){
    var dx = pt1[0] - pt2[0];
    var dy = pt1[1] - pt2[1];
    return dx*dx + dy*dy;
}
function vecDiff(vec1, vec2){
    return [vec1[0] - vec2[0], vec1[1] - vec2[1]];
}
function vecSum(vec1, vec2){
    return [vec1[0] + vec2[0], vec1[1] + vec2[1]];
}
function negativeVec(vec){
    return [-vec[0], -vec[1]];
}
function normSquared(pt){
    return pt[0]*pt[0] + pt[1]*pt[1];
}
function norm(pt){
    return Math.sqrt(pt[0]*pt[0] + pt[1]*pt[1]);
}
function sign(x){
    if ( x > 0 ) return  1;
    if ( x < 0 ) return -1;
    return 0;
}
function Mat22(a, b, c, d){
    /*
    matrix 
    (a b)
    (c d)
    */
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
}
Mat22.prototype.timesVec = function(vec){
    return [this.a*vec[0]+this.b*vec[1], this.c*vec[0]+this.d*vec[1]];
}
Mat22.prototype.timesMat = function(that){
    /*
    (a b)  * (a' b') = (a a' + b c'    a b' + b d')
    (c d)    (c' d')   (c a' + d c'    c b' + d d')
    */
    return new Mat22(
        this.a * that.a + this.b * that.c,
        this.a * that.b + this.b * that.d,
        this.c * that.a + this.d * that.c,
        this.c * that.b + this.d * that.d 
    );
}
Mat22.prototype.setTimesMat = function(that){
    var newA = this.a * that.a + this.b * that.c;
    var newB = this.a * that.b + this.b * that.d;
    var newC = this.c * that.a + this.d * that.c;
    var newD = this.c * that.b + this.d * that.d;
    this.a = newA;
    this.b = newB;
    this.c = newC;
    this.d = newD;
    return this;
}
Mat22.prototype.timesConst = function(factor){
    return new Mat22(this.a*factor, this.b*factor, this.c*factor, this.d*factor);
}
Mat22.prototype.setTimesConst = function(factor){
    this.a *= factor;
    this.b *= factor;
    this.c *= factor;
    this.d *= factor;
    return this;
}
Mat22.prototype.det = function(){ return this.a*this.d - this.b*this.c; }
Mat22.prototype.adjunct = function(){ return new Mat22(this.d, -this.b, -this.c, this.a); }
Mat22.prototype.inverse = function(){ return this.adjunct().setTimesConst(1/this.det()); }
Mat22.prototype.rotMat = function(angle){
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return new Mat22(c, -s, s, c);
}
Mat22.prototype.transpose = function(){
    return new Mat22(this.a, this.c, this.b, this.d);
}
Mat22.prototype.timesColumnMatrix = function(mat){
    var result = new Array(mat.length);
    for ( var i=0; i<mat.length; i++ ){
        result[i] = new Array(2);
        result[i][0] = this.a * mat[i][0] + this.b * mat[i][1];
        result[i][1] = this.c * mat[i][0] + this.d * mat[i][1];
    }
    return result;
}
/*Mat22.prototype.id = function(){
    return new Mat22(1, 0, 0, 1);
}
Mat22.prototype.reflectY = function(){
    return new Mat22(1, 0, 0, -1);
}
Mat22.prototype.reflectX = function(){
    return new Mat22(-1, 0, 0, 1);
}*/
Mat22.prototype.id = new Mat22(1, 0, 0, 1);
Mat22.prototype.reflectY = new Mat22(1, 0, 0, -1);
Mat22.prototype.reflectX = new Mat22(-1, 0, 0, 1);

function scalarProd2D(vec1, vec2){
    return vec1[0]*vec2[0] + vec1[1]*vec2[1];
}
function gcd3(x,y,z){
    // greatest common divisor of 3 numbers
    // uses gcd from fracMath2.js
    x = Math.abs(x);
    y = Math.abs(y);
    z = Math.abs(z);
    return gcd(gcd(x,y), z);
}
function integerLinearCombineThird(vec1, vec2, vec3){
    // vec1, vec2, vec3 must be vectors (arrays) with integer entries, all with the same length
    // if there exist integers u, v, w, (not all zero) such that w*vec3 = u*vec1 + v*vec2,
    // return [u,v,w], where gcd(u,v,w) = 1 and w*vec3 = u*vec1 + v*vec2, and w > 0
    // otherwise, return []
    // it is assumed that vec1 and vec2 are linearly independent
    // otherwise, also [] is returned
    var len = vec1.length;
    if ( vec2.length != len ) return [];
    if ( vec3.length != len ) return [];
    var i = -1, j = -1;
    function findLinearInd(){
        for ( var ii=0; ii<len; ii++ ){
            for ( var jj=ii+1; jj<len; jj++ ){
                var deter = vec1[ii]*vec2[jj] - vec1[jj]*vec2[ii];
                if ( deter != 0 ){
                    i = ii;
                    j = jj;
                    return deter;
                }
            }
        }
        return 0;
    }
    var det = findLinearInd();
    if ( det == 0 ){
        return [];
    }
    var a = vec1[i]; var b = vec2[i];
    var c = vec1[j]; var d = vec2[j];
    var e = vec3[i]; var f = vec3[j];
    var uu =  d*e - b*f;
    var vv = -c*e + a*f;
    for ( var index=0; index<len; index++ ){
        if ( uu*vec1[index] + vv*vec2[index] != det*vec3[index] ){
            return [];
        }
    }
    var g = gcd3(uu, vv, det);
    uu /= g;
    vv /= g;
    det /= g;
    if ( det < 0 ){
        det *= -1;
        uu *= -1;
        vv *= -1;
    }
    return [uu, vv, det];
}
