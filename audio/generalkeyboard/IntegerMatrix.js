// IntegerMatrix.js
// class for square matrices with integer entries
// matrices are stored as row - arrays
function unitVector(len, which){
    var result = new Array(len);
    for ( var i=0; i<len; i++ ){
        result[i] = ( i == which ? 1 : 0 );
    }
    return result;
}
function IntegerMatrix(mat){
    this.mat = mat;
}
function makeIdentitytMatrix(len){
    var result = new Array(len);
    for ( var i=0; i<len; i++ ){
        result[i] = unitVector(len, i);
    }
    return new IntegerMatrix(result);
}
IntegerMatrix.prototype.operateSL2 = function(ii, ij, ji, jj, i, j){
    /* return a new matrix that is the result of multiplying this matrix from the left with the following matrix:
    the k-row, (where k is neither i nor j) is the k-th unit vector
    the ith row has ii in column i and ij in column j, and zeros otherwise
    the jth row has ji in column i and jj in column j, and zeros otherwise
    i and j must not be equal, and must be integers between zero and this.mat.length - 1
    */
    var len = this.mat.length;
    var mat = new Array(len);
    for ( var k=0; k<len; k++ ){
        if ( k == i || k == j ) continue;
        mat[k] = arrayCopy(this.mat[k]);
    }
    mat[i] = new Array(len);
    mat[j] = new Array(len);
    for ( col=0; col<len; col++ ){
        mat[i][col] = ii * this.mat[i][col] + ij * this.mat[j][col];
        mat[j][col] = ji * this.mat[i][col] + jj * this.mat[j][col];
    }
    return new IntegerMatrix(mat);
}
IntegerMatrix.prototype.operateSL2Me = function(ii, ij, ji, jj, i, j){
    /* same as operateSL2, but changes this matrix, rather than making a new one */
    var len = this.mat.length;
    for ( col=0; col<len; col++ ){
        var matIcol = ii * this.mat[i][col] + ij * this.mat[j][col];
        var matJcol = ji * this.mat[i][col] + jj * this.mat[j][col];
        this.mat[i][col] = matIcol;
        this.mat[j][col] = matJcol;
    }
    return this;
}
IntegerMatrix.prototype.rowSwap = function(i, j){
    /* return a new matrix that is the result of swapping rows i and j
    i and j must not be equal, and must be integers between zero and this.mat.length - 1
    */
    var len = this.mat.length;
    var mat = new Array(len);
    for ( var k=0; k<len; k++ ){
        if ( k == i || k == j ) continue;
        mat[k] = arrayCopy(this.mat[k]);
    }
    mat[i] = arrayCopy(this.mat[j]);
    mat[j] = arrayCopy(this.mat[i]);
    return new IntegerMatrix(mat);
}
IntegerMatrix.prototype.rowSwapMe = function(i, j){
    // same as rowSwap, but changes this matrix, rather than creating a new one
    var len = this.mat.length;
    var mat = new Array(len);
    for ( col=0; col<len; col++ ){
        var temp = this.mat[i][col];
        this.mat[i][col] = this.mat[j][col];
        this.mat[j][col] = temp;
    }
    return this;
}
IntegerMatrix.prototype.rowOp = function(i, j, factor){
    /* return a new matrix that is the result of adding factor times the jTh row to the iTh row
    i and j must not be equal, and must be integers between zero and this.mat.length - 1
    */
    var len = this.mat.length;
    var mat = new Array(len);
    for ( var k=0; k<len; k++ ){
        if ( k == i ) continue;
        mat[k] = arrayCopy(this.mat[k]);
    }
    mat[i] = new Array(len);
    for ( col=0; col<len; col++ ){
        mat[i][col] = this.mat[i][col] + factor * this.mat[j][col];
    }
    return new IntegerMatrix(mat);
}
IntegerMatrix.prototype.rowOpMe = function(i, j, factor){
    // same as rowOp, but changes this matrix, rather than creating a new one
    var len = this.mat.length;
    for ( col=0; col<len; col++ ){
        this.mat[i][col] += factor * this.mat[j][col];
    }
    return this;
}
IntegerMatrix.prototype.rowTimes = function(rowIndex, factor){
    /* return a new matrix that is the result of multiplying row rowIndex with factor factor */
    var len = this.mat.length;
    var mat = new Array(len);
    for ( var k=0; k<len; k++ ){
        if ( k == rowIndex ) continue;
        mat[k] = arrayCopy(this.mat[k]);
    }
    mat[rowIndex] = new Array(len);
    for ( col=0; col<len; col++ ){
        mat[rowIndex][col] = factor * this.mat[rowIndex][col];
    }
    return new IntegerMatrix(mat);
}
IntegerMatrix.prototype.rowTimesMe = function(rowIndex, factor){
    // same as rowTimes, but changes this matrix, rather than creating a new one
    var len = this.mat.length;
    for ( col=0; col<len; col++ ){
        this.mat[rowIndex][col] *= factor;
    }
    return this;
}
function transposeMat(mat){
    var result = new Array(mat[0].length);
    for ( var row=0; row<result.length; row++ ){
        result[row] = new Array(mat.length);
        for ( col=0; col<result[row].length; col++ ){
            result[row][col] = mat[col][row];
        }
    }
    return result;
}
IntegerMatrix.prototype.multiplyFromLeftWithMat = function(mat){
    /* compute the matrix product mat * this.mat
    return null, if that is not defined 
    */
    var vecLen = mat[0].length;
    if ( vecLen != this.mat.length ){
        return null;
    }
    var numRows = mat.length;
    var numCols = this.mat[0].length;
    var result = new Array(numRows);
    for ( var row=0; row<numRows; row++ ){
        result[row] = new Array(numCols);
        for ( var col=0; col<numCols; col++ ){
            // compute scalar product of rowTh row of mat with colTh column of this.mat, and put into result at position (row, col)
            var sum = 0;
            for ( var k=0; k<vecLen; k++ ){
                sum += mat[row][k] * this.mat[k][col];
            }
            result[row][col] = sum; 
        }
    }
    return result;
}
function bezout(x, y){
	// returns [g, a, b], where g = gcd(x, y) and g = a*x + b*y
	var result = new Array(3);
	var epsX = 1, epsY = 1;
	if ( x < 0 ){
		x = -x;
		epsX = -1;
	}
	if ( y < 0 ){
		y = -y;
		epsY = -1;
	}
	if ( y == 0 ) {
		result[0] = x;
		result[1] = epsX;
		result[2] = 0;
		return result;
	}
	var uOld = 1, uCur = 0;
	var vOld = 0, vCur = 1;
	while ( true ){
		var next = x % y;
		if ( next == 0 ){
			result[0] = y;
			result[1] = uCur * epsX;
			result[2] = vCur * epsY;
			break;
		}
		//var q = Math.floor(x/y);
		var q = Math.round((x-next)/y); // to be on the save side with rounding errors
		var uNext = uOld - q*uCur;
		var vNext = vOld - q*vCur;
		uOld = uCur; uCur = uNext;
		vOld = vCur; vCur = vNext;
		x = y;
		y = next;
	}
	return result;
}
IntegerMatrix.prototype.clone = function(){
    return new IntegerMatrix(arrayCopy2D(this.mat));
}
IntegerMatrix.prototype.inverseOld = function(){
    var tempStr, resuStr;
    var len = this.mat.length;
    var last = len - 1;
    var result = makeIdentitytMatrix(len);
    var temp = this.clone();
    // step 1: transform temp into a triangular matrix (zeros below diag, ones on diag), and store product of trafos in result
    for ( var i=0; i<len; i++ ){
        // make sure that temp[i][i] != 0
        if ( temp.mat[i][i] == 0 ){
            for ( var j=i+1; j<len; j++ ){
                if ( temp.mat[j][i] != 0 ) break;
            }
            if ( j >= len ) {
                debugger;
                return null;
            }
            temp = temp.rowSwap(i, j);
            result = result.rowSwap(i, j);
            tempStr = array2dToString(temp.mat);
            resuStr = array2dToString(result.mat);
        }
        for ( var j=i+1; j<len; j++ ){
            var y = temp.mat[j][i];
            if ( y == 0 ) continue;
            var x = temp.mat[i][i];
            var gab = bezout(x, y);
            var g = gab[0], a = gab[1], b = gab[2];
            var ii = a, ij = b, ji = -y/g, jj = x/g;
            temp = temp.operateSL2(ii, ij, ji, jj, i, j);
            result = result.operateSL2(ii, ij, ji, jj, i, j);
            tempStr = array2dToString(temp.mat);
            resuStr = array2dToString(result.mat);
        }
        if ( temp.mat[i][i] < 0 ){
            temp = temp.rowTimes(i, -1);
            result = result.rowTimes(i, -1);
            tempStr = array2dToString(temp.mat);
            resuStr = array2dToString(result.mat);
        }
        if ( temp.mat[i][i] != 1 ){
            debugger;
            return null;
        }
    }
    // step 2: get rid of entries above the diagonal
    for ( var j=len-1; j>0; j-- ){
        for ( var i=0; i<j; i++ ){
            var factor = -temp.mat[i][j];
            if ( factor == 0 ) continue;
            result = result.rowOp(i, j, factor);
        }
    }
    return result;
}
IntegerMatrix.prototype.inverse = function(){
    var tempStr, resuStr;
    var len = this.mat.length;
    var last = len - 1;
    var result = makeIdentitytMatrix(len);
    var temp = this.clone();
    // step 1: transform temp into a triangular matrix (zeros below diag, ones on diag), and store product of trafos in result
    for ( var i=0; i<len; i++ ){
        // make sure that temp[i][i] != 0
        if ( temp.mat[i][i] == 0 ){
            for ( var j=i+1; j<len; j++ ){
                if ( temp.mat[j][i] != 0 ) break;
            }
            if ( j >= len ) {
                //debugger;
                return null;
            }
            temp.rowSwapMe(i, j);
            result.rowSwapMe(i, j);
        }
        for ( var j=i+1; j<len; j++ ){
            var y = temp.mat[j][i];
            if ( y == 0 ) continue;
            var x = temp.mat[i][i];
            var gab = bezout(x, y);
            var g = gab[0], a = gab[1], b = gab[2];
            var ii = a, ij = b, ji = -y/g, jj = x/g;
            temp.operateSL2Me(ii, ij, ji, jj, i, j);
            result.operateSL2Me(ii, ij, ji, jj, i, j);
        }
        if ( temp.mat[i][i] < 0 ){
            temp.rowTimesMe(i, -1);
            result.rowTimesMe(i, -1);
        }
        if ( temp.mat[i][i] != 1 ){
            //debugger;
            return null;
        }
    }
    // step 2: get rid of entries above the diagonal
    for ( var j=len-1; j>0; j-- ){
        for ( var i=0; i<j; i++ ){
            var factor = -temp.mat[i][j];
            if ( factor == 0 ) continue;
            result.rowOpMe(i, j, factor);
        }
    }
    return result;
}
function normalizeTuningMatStep1(mat){
    var x = mat[0][0];
    var y = mat[0][1];
    var gab = bezout(x, y);
    var g = gab[0], a = gab[1], b = gab[2];
    var ii = a, ij = b, ji = -y/g, jj = x/g;
    for ( var row=0; row<mat.length; row++ ){
        var temp0 = ii * mat[row][0] + ij * mat[row][1];
        var temp1 = ji * mat[row][0] + jj * mat[row][1];
        mat[row][0] = temp0;
        mat[row][1] = temp1;
    }
}
function normalizeTuningMatStep2(mat, numPrimes){
    if ( !numPrimes ){
        numPrimes = mat.length;
    }
    var errPoly = calculateErrorPolynomial(mat, numPrimes);
    var k = 1 + Math.floor(-errPoly.tau2Opt/errPoly.tau1Opt);
    if ( errPoly.tau2Opt + k*errPoly.tau1Opt > 0.5*errPoly.tau1Opt ){
        var r = 1-k; var s = -1;
    } else {
        var r = -k; var s = 1;
    }
    // multiply mat from the left with 
    // (1 r)
    // (0 s)
    for ( var i=0; i<mat.length; i++ ){
        mat[i][0] += r * mat[i][1];
        mat[i][1] *= s;
    }
}

