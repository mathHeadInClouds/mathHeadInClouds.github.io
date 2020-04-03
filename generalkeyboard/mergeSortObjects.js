// mergeSortObjects.js
function mergeSortObjects(arr){
    // arr needs to consist of objects that have a method called "lessEq"
    function sortInPlace(source, aux, len, sourceStart, auxStart){
        if ( len <= 1 ) return;
        // sort source(sourceStart ... sourceStart+len-1)
        // using aux(auxStart ... auxStart+ceil(len/2)-1) as auxiliary
        var firstHalfLen = Math.ceil(len/2);
        var secondHalfStart = sourceStart + firstHalfLen;
        var secondHalfLen = len - firstHalfLen;
        // sort second half in place
        sortInPlace(source, aux, secondHalfLen, secondHalfStart, auxStart);
        // sort first half into aux
        sortInto(source, aux, firstHalfLen, sourceStart, auxStart);
        // merge into source
        merge(source, aux, sourceStart, auxStart, firstHalfLen, secondHalfLen);
    }
    function sortInto(source, target, len, sourceStart, targetStart){
        if ( len <= 0 ) return;
        if ( len == 1 ){
            target[targetStart] = source[sourceStart];
            return;
        }
        // sort source(sourceStart ... sourceStart+len-1)
        // into target(targetStart ... targetStart+len-1)
        var firstHalfLen = Math.ceil(len/2);
        var secondHalfStart       = sourceStart + firstHalfLen;
        var secondHalfStartTarget = targetStart + firstHalfLen;
        var secondHalfLen = len - firstHalfLen;
        // sort first half in place
        sortInPlace(source, target, firstHalfLen, sourceStart, targetStart);
        // sort second half into second half of target
        sortInto(source, target, secondHalfLen, secondHalfStart, secondHalfStartTarget);
        // merge into target
        merge(target, source, targetStart, sourceStart, firstHalfLen, secondHalfLen);
    }
    function merge(target, aux, targetStart, auxStart, auxLen, secondHalfLen){
        // before:
        // aux(auxStart ... auxStart+auxLen-1) sorted
        // target(targetStart ... targetStart+auxLen-1) available
        // target(targetStart+auxLen ... targetStart+auxLen+secondHalfLen-1) sorted
        // after:
        // target(targetStart ... targetStart+auxLen+secondHalfLen-1) sorted
        var t1 = targetStart;
        var tMid = targetStart + auxLen;
        var tEnd = tMid + secondHalfLen;
        var t2 = tMid;
        var a = auxStart;
        var aEnd = auxStart + auxLen;
        while ( true ){
            if ( a >= aEnd ){
                return;
            }
            if ( t2 >= tEnd ){
                // move rest of aux and finish
                while ( a < aEnd ){
                    target[t1++] = aux[a++];
                }
                return;
            }
            if ( aux[a].lessEq(target[t2]) ){
                target[t1++] = aux[a++];
            } else {
                target[t1++] = target[t2++];
            }
        }
    }
    var len = arr.length;
    var halfLen = Math.ceil(len/2);
    var aux = new Array(halfLen);
    sortInPlace(arr, aux, len, 0, 0);
}
function mergeSortObjects2(arr, lessEq){
    // the entries of arr are compared via the function lessEq
    function sortInPlace(source, aux, len, sourceStart, auxStart){
        if ( len <= 1 ) return;
        // sort source(sourceStart ... sourceStart+len-1)
        // using aux(auxStart ... auxStart+ceil(len/2)-1) as auxiliary
        var firstHalfLen = Math.ceil(len/2);
        var secondHalfStart = sourceStart + firstHalfLen;
        var secondHalfLen = len - firstHalfLen;
        // sort second half in place
        sortInPlace(source, aux, secondHalfLen, secondHalfStart, auxStart);
        // sort first half into aux
        sortInto(source, aux, firstHalfLen, sourceStart, auxStart);
        // merge into source
        merge(source, aux, sourceStart, auxStart, firstHalfLen, secondHalfLen);
    }
    function sortInto(source, target, len, sourceStart, targetStart){
        if ( len <= 0 ) return;
        if ( len == 1 ){
            target[targetStart] = source[sourceStart];
            return;
        }
        // sort source(sourceStart ... sourceStart+len-1)
        // into target(targetStart ... targetStart+len-1)
        var firstHalfLen = Math.ceil(len/2);
        var secondHalfStart       = sourceStart + firstHalfLen;
        var secondHalfStartTarget = targetStart + firstHalfLen;
        var secondHalfLen = len - firstHalfLen;
        // sort first half in place
        sortInPlace(source, target, firstHalfLen, sourceStart, targetStart);
        // sort second half into second half of target
        sortInto(source, target, secondHalfLen, secondHalfStart, secondHalfStartTarget);
        // merge into target
        merge(target, source, targetStart, sourceStart, firstHalfLen, secondHalfLen);
    }
    function merge(target, aux, targetStart, auxStart, auxLen, secondHalfLen){
        // before:
        // aux(auxStart ... auxStart+auxLen-1) sorted
        // target(targetStart ... targetStart+auxLen-1) available
        // target(targetStart+auxLen ... targetStart+auxLen+secondHalfLen-1) sorted
        // after:
        // target(targetStart ... targetStart+auxLen+secondHalfLen-1) sorted
        var t1 = targetStart;
        var tMid = targetStart + auxLen;
        var tEnd = tMid + secondHalfLen;
        var t2 = tMid;
        var a = auxStart;
        var aEnd = auxStart + auxLen;
        while ( true ){
            if ( a >= aEnd ){
                return;
            }
            if ( t2 >= tEnd ){
                // move rest of aux and finish
                while ( a < aEnd ){
                    target[t1++] = aux[a++];
                }
                return;
            }
            if ( lessEq(aux[a], target[t2]) ){
                target[t1++] = aux[a++];
            } else {
                target[t1++] = target[t2++];
            }
        }
    }
    var len = arr.length;
    var halfLen = Math.ceil(len/2);
    var aux = new Array(halfLen);
    sortInPlace(arr, aux, len, 0, 0);
}
function positionOfMax(arr){
    var result = -1;
    var max = -Infinity;
    for ( var i=0; i<arr.length; i++ ){
        if ( arr[i] >= max ){
            max = arr[i];
            result = i;
        }
    }
    return result;
}
