math = (function(){
	function distance_point_segment(pt1, pt2){
		var x1 = pt1[0], y1 = pt1[1],
		    x2 = pt2[0], y2 = pt2[1],
		    dx = x2 - x1,
		    dy = y2 - y1,
		    f  = 1/(dx*dx + dy*dy),
		    adx = Math.abs(dx),
		    ady = Math.abs(dy);
		// dx x + dy y = dx u + dy v
		// x = x1 + t dx
		// y = y1 + t dy
		// t = (dx(u-x1)+dy(v-y1))/(dx^2+dy^2)
		if (adx > ady){
			return function(p){
				var u = p[0], v = p[1];
				var t = f * ( dx*(u-x1) + dy*(v-y1) );
				var x0 = x1 + t * dx;
				var y0 = y1 + t * dy;
				var B1 = x0 > x1;
				var B2 = x0 > x2;
				var ex, ey, B12;
				if (B1===B2){
					B12 = x2 > x1;
					if (B12===B1){
						ex = u - x2; ey = v - y2;
					} else {
						ex = u - x1; ey = v - y1;
					}
				} else {
					ex = u - x0; ey = v - y0;
				}
				return Math.sqrt(Math.max(0, ex*ex + ey*ey));
			}
		} else {
			return function(p){
				var u = p[0], v = p[1];
				var t = f * ( dx*(u-x1) + dy*(v-y1) );
				var x0 = x1 + t * dx;
				var y0 = y1 + t * dy;
				var B1 = y0 > y1;
				var B2 = y0 > y2;
				var ex, ey, B12;
				if (B1===B2){
					B12 = y2 > y1;
					if (B12===B1){
						ex = u - x2; ey = v - y2;
					} else {
						ex = u - x1; ey = v - y1;
					}
				} else {
					ex = u - x0; ey = v - y0;
				}
				return Math.sqrt(Math.max(0, ex*ex + ey*ey));
			}
		}
	}
	function copyMatrix(mat){
	    var result = new Array(mat.length);
	    for (var row=0; row<mat.length; row++){
	        result[row] = new Array(mat[row].length);
	        for (var col=0; col<mat[row].length; col++){
	            result[row][col] = mat[row][col];
	        }
	    }
	    return result;
	}
    function determinant(mat0, matrixMayBeChangedInPlace){
        var N = mat0.length;
        if (N == 1){
            return mat0[0][0];
        }
        if (N == 2){
            return mat0[0][0] * mat0[1][1] - mat0[0][1] * mat0[1][0];
        }
        if (N == 3){
            return mat0[0][0] * ( mat0[1][1] * mat0[2][2] - mat0[1][2] * mat0[2][1] )
                 + mat0[0][1] * ( mat0[1][2] * mat0[2][0] - mat0[1][0] * mat0[2][2] )
                 + mat0[0][2] * ( mat0[1][0] * mat0[2][1] - mat0[1][1] * mat0[2][0] );
        }
        var mat;
        if (matrixMayBeChangedInPlace){
            mat = mat0;
        } else {
            mat = copyMatrix(mat0);
        }
        var result = 1;
        var isZero = false;
        // mat n x n matrix, as array of rows
        function pivotIndex(col, startRow){
            // find argmax { |mat[s][c]|, |mat[s+1][c]|, ..., |mat[N-1][c]}|}
            var maxVal = 0;
            var index = -1;
            for (var row = startRow; row < N; row++){
                var val = Math.abs(mat[row][col]);
                if (val > maxVal){
                    maxVal = val;
                    index = row;
                }
            }
            if (index == -1){ isZero = true; }
            return index;
        }
        function swapRows(row1, row2, startCol){
            // swap rows with indices row1, row2, starting at colmun index start 
            for (var col = startCol; col < N; col++){
                temp = mat[row1][col];
                mat[row1][col] = mat[row2][col];
                mat[row2][col] = temp;
            }
            result *= -1;
        }
        function addLinComb(pivotRow, targetRow, coeff, startCol){
            // adds coeff * pivotRow to targetRow, starting at startCol
            for (var col = startCol; col < N; col++){
                mat[targetRow][col] += coeff * mat[pivotRow][col]; 
            }
        }
        function triag(){
            // generate zeros below the main diagonal
            for (var k = 0; k < N; k++){
                var pIndex = pivotIndex(k, k);
                if (isZero){
                    return;
                }
                if ( k!=pIndex ){
                    swapRows(k, pIndex, k); // always use absolute biggest possible as pivot, for numerical stability
                }
                for (var r = k+1; r < N; r++){
                    var lambda = -mat[r][k]  * 1 / mat[k][k];
                    addLinComb(k, r, lambda, k+1);
                    mat[r][k] = 0;
                }
            }
        }
        triag();
        if (isZero){
            return 0;
        }
        for (var k=0; k<N; k++){
            result *= mat[k][k];
        }
        return result;
    }
    function subsets(n, k){
    	// all subsets of the natural numbers, having exactly k elements, such that all elements x are such that 0 <= x < n
    	var result = [];
    	function step(stack, lo, r){
    		if (r<=0){
    			result.push(stack);
    		} else {
    			for (var i=lo; i<=n-r; i++){
    				step(stack.concat(i), i+1, r-1);
    			}
    		}
    	}
    	step([], 0, k);
    	return result;
    }
    function nullspace(mat, k){
    	var n = mat.length;
    	if (arguments.length<=1){
    		k = mat[0].length;
    	}
    	var colPicks = subsets(k, n+1);
    	var detPicks = subsets(k, n);
    	var dets = {};
    	detPicks.forEach(function(detPick){
    		if (false) console.log(detPicks, colPicks, n, k, mat);
    		var str = detPick.join('_');
    		var subMat = mat.map(function(row){
    			var sub = [];
    			detPick.forEach(function(idx){
    				sub.push(row[idx]);
    			});
    			return sub;
    		});
    		dets[str] = determinant(subMat, true);
    	});
    	var results = {};
    	function allExceptIncluding(indicesToRemove, indicesToAdd){
	    	function all(){
	    		var retval = [];
	    		for (var j=0; j<k; j++){
	    			retval.push(true);
	    		}
	    		return retval;
	    	}
	    	var vec = all();
    		indicesToRemove.forEach(function(index){
    			vec[index] = false;
    		});
    		indicesToAdd.forEach(function(index){
    			vec[index] = true;
    		});
    		return vec;
    	}
    	colPicks.forEach(function(colPick){
    		var vec = [];
    		for (var i=0; i<k; i++){
    			vec.push(0);
    		}
    		var factor = 1;
    		var entries = [];
    		var j, entry;
    		for (j=0; j<colPick.length; j++){
    			var detPick = [];
    			for (var r=0; r<colPick.length; r++){
    				if (r!==j){
    					detPick.push(colPick[r]);
    				}
    			}
    			var str = detPick.join('_');
    			var det = dets[str];
    			entry = factor * det;
    			entries.push(entry);
    			//vec[colPick[j]] = entry;
    			factor *= -1;
    		}
    		var positiveCount = 0, negativeCount = 0, zerosAt = [], first = [];
    		for (j=0; j<colPick.length; j++){
    			entry = entries[j];
    			if (entry>0){
    				if (first.length===0) { first = [true]; }
    				++positiveCount;
    			} else {
	    			if (entry<0){
	    				if (first.length===0) { first = [false]; }
	    				++negativeCount;
	    			} else {
	    				zerosAt.push(colPick[j]);
	    			}
    			}
    		}
    		if (first.length>0){
				var negateVector = (function(){
					if (positiveCount > negativeCount) return false;
					if (negativeCount > positiveCount) return true;
					return !first[0];
				})();
				if (negateVector){
					for (j=0; j<colPick.length; j++){ vec[colPick[j]] = -entries[j]; }
				} else {
					for (j=0; j<colPick.length; j++){ vec[colPick[j]] =  entries[j]; }
				}
				var zeroFlags = allExceptIncluding(colPick, zerosAt);
				var support = Object.keys(zeroFlags).filter(function(k){
					return !zeroFlags[k]
				});
				results[support.join('_')] = vec;
    		}
    	});
    	return results;
    }
    function combineFromNullspace(nullspaceObj, vector){
    	var vec = vector.concat();
    	var keys = Object.keys(nullspaceObj);
    	var buckets = [];
    	keys.forEach(function(key){
    		var nullspRow = nullspaceObj[key];
    		var negativeCount = (function(){
    			var count = 0;
    			for (var i=0; i<nullspRow.length; i++){
    				var entry = nullspRow[i];
    				if (entry < 0){
    					++count;
    				}
    			}
    			return count;
    		})();
    		if ((typeof buckets[negativeCount])==='undefined'){
    			buckets[negativeCount] = [];
    		}
    		buckets[negativeCount].push(key);
    	});
    	var orderedKeys = [];
    	for (var i=0; i<buckets.length; i++){
    		if ((typeof buckets[i])!=='undefined'){
    			orderedKeys = orderedKeys.concat(buckets[i]);
    		}
    	}
    	var result = [];
    	function step(){
    		var key = (function(){
    			for (var i=0; i<orderedKeys.length; i++){
    				var candidate = orderedKeys[i];
    				var candidateRow = nullspaceObj[candidate];
    				var eligible = (function(row){
	    				for (var j=0; j<row.length; j++){
	    					if (vec[j]===0) {
	    						if (row[j]!==0) return false;
	    					}
	    				}
	    				return true;
    				})(candidateRow);
    				if (eligible) return candidate;
    			}
    		})();
    		var row = nullspaceObj[key];
    		var minCoeff = Infinity;
    		var j;
    		for (j=0; j<row.length; j++){
    			if (row[j]>0){
    				var coeff = vec[j] / row[j];
    				minCoeff = Math.min(minCoeff, coeff);
    			}
    		}
    		result.push({key: key, coeff: minCoeff});
    		for (j=0; j<row.length; j++){
    			vec[j] = vec[j] - minCoeff*row[j];
    		}
    	}
    	function vecIsZero(v){
    		for (var i=0; i<v.length; i++){
    			if (v[i]!==0) return false;
    		}
    		return true;
    	}
    	while (!vecIsZero(vec)){
    		step();
    	}
    	var obj = {};
    	keys.forEach(function(key){
    		obj[key] = 0;
    	});
    	result.forEach(function(entry){
    		obj[entry.key] = entry.coeff;
    	});
    	return obj;
    }
    function matrixTimesVector(mat, vec){
        var n = mat.length;
        var k = mat[0].length;
        if (vec.length != k){
            console.log("matrixTimesVector: mat * vec can't be computed; mat has " + k + " cols, vec has length " + vec.length + " which should have been equal");
            return null;
        }
        var result = new Array(n);
        for (var r=0; r<n; r++){
            var sum = 0;
            for (var c=0; c<k; c++){
                sum += (mat[r][c] * vec[c]);
            }
            result[r] = sum;
        }
        return result;
    }
    function vectorTimesMatrix(vec, mat){
        var n = mat.length;
        var k = mat[0].length;
        if (vec.length != n){
            console.log("vectorTimesMatrix:  vec * mat * vec can't be computed; mat has " + n + " rows, vec has length " + vec.length + " which should have been equal");
            return null;
        }
        var result = new Array(k);
        for (var c=0; c<k; c++){
            var sum = 0;
            for (var r=0; r<n; r++){
                sum += (vec[r] * mat[r][c]);
            }
            result[c] = sum;
        }
        return result;
    }
    function matrixTimesMatrix(left, right){
        // computes matrix product left * right; both matrices given as row arrays, i.e. mat[r][c] = entry in row r, column c
        var N = left.length;
        var K = left[0].length;
        if (right.length != K){
            console.log("matrixTimesMatrix: matrix format error: left matrix has " +K+ " colums, but right matrix has " +right.length+ " rows, which should have been equal.");
            return null;
        }
        var R = right[0].length;
        var result = new Array(N);
        for (var n=0; n<N; n++){
            result[n] = new Array(R);
            for (var r=0; r<R; r++){
                var sum = 0;
                for (var k=0; k<K; k++){
                    sum += (left[n][k] * right[k][r]);
                }
                result[n][r] = sum;
            }
        }
        return result;
    }
    function makeEllipseTable(rx, ry, size){
        var maxTableSize = 1024;
        function angleToPoint(angle){
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var x = rx * c;
            var y = ry * s;
            return [x,y];
        }
        function anglesToPoints(angles){
            return angles.map(angleToPoint);
        }
        function sumUp(pts){
            var totalLength = 0;
            var lengths = [];
            var sums = [0];
            for (var i=1; i<pts.length; i++){
                var current = pts[i];
                var prev = pts[i-1];
                var dx = current[0] - prev[0];
                var dy = current[1] - prev[1];
                var length = Math.sqrt(dx*dx + dy*dy);
                lengths.push(length);
                totalLength += length;
                sums.push(totalLength);
            }
            return {
                total   : totalLength,
                lengths : lengths,
                sums    : sums
            }
        }
        function nextAngles(angles, S, nextSize){
            var totalLength = S.total;
            var sums        = S.sums;
            var lengthUnit  = totalLength/nextSize;
            var position    = 0;
            var index       = 0;
            sums.push(Infinity);
            var newAngles = [0];
            while (true){
                position += lengthUnit;
                while(sums[index] < position){
                    ++index;
                }
                if (sums[index]===Infinity) break;
                // we know here: s1 = sums[index-1] < position <= sums[index] = s2
                var s1 = sums[index-1], s2 = sums[index], ds = s2 - s1;
                var a1 = angles[index-1], a2 = angles[index], da = a2 - a1;
                var p = position - s1;
                var a = a1 + p * da / ds;
                newAngles.push(a);
            }
            if (newAngles.length < 1+nextSize){
                newAngles.push(-2*Math.PI);
            }
            return newAngles;
        }
        function statistics(result){
            var unit = result.total / result.lengths.length;
            var maxAll = -Infinity;
            var minAll = Infinity;
            var differences = result.lengths.map(function(len){
                return len - unit;
            });
            differences.forEach(function(value){
                if (value > maxAll) maxAll = value;
                if (value < minAll) minAll = value;
            });
            var M = Math.max(maxAll, -minAll);
            return {
                unit : unit,
                max  : M
            };
        }
        var i;
        var currentTableSize = 16;
        var angleUnit = 2 * Math.PI / currentTableSize;
        var angles = []; for (i=0; i<=currentTableSize; i++){ angles.push(-i * angleUnit); }
        var result, stats, nextSize;
        var iterCount = 0;
        while(true){
            var pts = anglesToPoints(angles);
            var S = sumUp(pts);
            result = {
                angles  : angles,
                pts     : pts,
                lengths : S.lengths,
                total   : S.total,
                sums    : S.sums
            };
            stats = statistics(result);
            var quality = stats.unit/stats.max;
            //console.log(iterCount, result.lengths.length, stats.unit, quality);
            var nextTableSize = 4*currentTableSize;
            if (nextTableSize > maxTableSize){
                nextSize = currentTableSize;
                ++iterCount;
                if (iterCount >= 12) break;
                if (quality >= 1000000) break;
            } else {
                nextSize = nextTableSize;
            }
            var newAngles = nextAngles(angles, S, nextSize);
            angles = newAngles;
            currentTableSize = nextSize;
        }
        return nextAngles(angles, S, size);
    }

	return {
		distance_point_segment : distance_point_segment,
		determinant: determinant,
		nullspace  : nullspace,
		subsets    : subsets,
		combineFromNullspace: combineFromNullspace,
		matrixTimesVector   : matrixTimesVector,
		vectorTimesMatrix   : vectorTimesMatrix,
		matrixTimesMatrix   : matrixTimesMatrix,
        makeEllipseTable    : makeEllipseTable
	};
})();
