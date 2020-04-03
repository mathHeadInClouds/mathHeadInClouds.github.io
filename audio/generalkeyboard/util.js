// util.js
function GET(){
    this.params = {};
}
GET.prototype.retrieveParams = function(doc){
    // retrieve get parameters from document search string,
    // put result into this.params as object (associative array) 
    this.numParams = 0;
    if ( arguments.length < 1 ){
        doc = document;
    }
    // full search string
    var s = doc.location.search;
    // omit question mark
    var str = s.substr(1, s.length);
    if ( !str ) return this;
    // split into name value pairs
    var arr = str.split('&');
    var numParams = arr.length;
    this.numParams = numParams;
    for ( var i=0; i<numParams; i++ ){
        // split into name and value
        var subArr = arr[i].split('=');
        var paramName = unescape(subArr[0]);
        var value = '';
        if ( subArr.length > 1 ){
            value = unescape(subArr[1]);
        }
        // store what we have retrieved
        this.params[paramName] = value;
    }
    return this;
}
function map(fun, arr){
    var result = new Array(arr.length);
    for ( var i=0; i<arr.length; i++ ){
        result[i] = fun(arr[i]);
    }
    return result;
}
function callOnArray(fun, arr){
    for ( var i=0; i<arr.length; i++ ){
        fun(arr[i]);
    }
}
function forAll(fun, arr){
    for ( var i=0; i<arr.length; i++ ){
        if ( !fun(arr[i]) ){
            return false;
        }
    }
    return true;
}
function arrayContainsElement(arr, el){
    for ( var i=0; i<arr.length; i++ ){
        if ( arr[i] == el ) return true;
    }
    return false;
}
/* superfluous, there's already Array.slice
function take(arr, howMany){
    var result = new Array(howMany);
    for ( var i=0; i<howMany; i++ ){
        result[i] = arr[i];
    }
    return result;
}*/
function isANumber(x){
    return ( !isNaN(x) );
}
function isNaturalNumber(x){
    if ( isNaN(x) ) return false;
    if ( Math.round(x) != x ) return false;
    if ( x <= 0 ) return false;
    return true;
}
function isInteger(x){
    if ( isNaN(x) ) return false;
    if ( Math.round(x) != x ) return false;
    return true;
}
function isNumericArray(arr){
    if ( typeof arr != "object" ) return false;
    if ( !(arr instanceof Array) ) return false;
    return forAll( isANumber, arr);
}
function is2DNumericArray(arr){
    if ( typeof arr != "object" ) return false;
    if ( !(arr instanceof Array) ) return false;
    for ( var i=0; i<arr.length; i++ ){
        if ( !isNumericArray(arr[i]) ) return false;
        if ( i == 0 ) continue;
        if ( arr[i].length != arr[i-1].length ) return false;
    }
    return true;
}
function isIntegerArray(arr){
    if ( typeof arr != "object" ) return false;
    if ( !(arr instanceof Array) ) return false;
    return forAll( isInteger, arr);
}
function is2DIntegerArray(arr){
    if ( typeof arr != "object" ) return false;
    if ( !(arr instanceof Array) ) return false;
    for ( var i=0; i<arr.length; i++ ){
        if ( !isIntegerArray(arr[i]) ) return false;
        if ( i == 0 ) continue;
        if ( arr[i].length != arr[i-1].length ) return false;
    }
    return true;
}
function Select(fun, arr){
    var result = new Array();
    for ( i=0; i<arr.length; i++ ){
        if ( fun(arr[i]) ){
            result.push(arr[i]);
        }
    }
    return result;
}
function zeros(len){
    var result = new Array(len);
    for ( var i=0; i<len; i++ ){
        result[i] = 0;
    }
    return result;
}
function range(from, to, step){
    if ( arguments.length < 3 ){
        step = 1;
    }
    var result = new Array();
    for ( var i=from; i<=to ; i+= step ){
        result.push(i);
    }
    return result;
}
function arrayCopy(arr){
    var len = arr.length;
    var result = new Array(len);
    for ( var i=0; i<len; i++ ){
        result[i] = arr[i];
    }
    return result;
}
function arrayCopy2D(arr){
    var len = arr.length;
    var result = new Array(len);
    for ( var i=0; i<len; i++ ){
        result[i] = arrayCopy(arr[i]);
    }
    return result;
}
function arrayToString(arr){
    // array must not be sparse (i.e., must not have holes, but consecutively filled from 0 to length-1)
    var len = arr.length;
    var result = "";
    var i=0;
    while (true){
        var entry = arr[i++];
        if ( typeof(entry) == "object" && entry != null ){
            result += entry.toString();
        } else {
            result += entry;
        }
        if ( i == len ) break;
        result += ",";
    }
    return result;
}
function array2dToString(arr){
    var len = arr.length;
    var result = "";
    var i=0;
    while (true){
        var entry = arr[i++];
        result += "[" + arrayToString(entry) + "]";
        if ( i == len ) break;
        result += ",";
    }
    return result;
}
function assert(condition, errorMsg){
    if ( !condition ){
        alert(errorMsg);
        throw("errorMsg");
    }
}
function shallowCloneObject(o){
    var result = {};
    for ( var prop in o ){
        result[prop] = o[prop];
    }
    return result;
}
function mergeObjects(obj1, obj2){
    // copy (shallow, not deep) all props from both objects into new object.
    var result = {};
    for ( var prop in obj1 ){
        result[prop] = obj1[prop];
    }
    for ( var prop in obj2 ){
        result[prop] = obj2[prop];
    }
    return result;
}
function importSecondIntoFirst(host, toBeImported){
    // import all properties of second argument into first argument
    // replacing (if they already existed) old values
    // making new properties, else
    for ( var prop in toBeImported ){
        host[prop] = toBeImported[prop];
    }
    return host;
}
function importUnlessGiven(host, toBeImported){
    // import all properties of second argument into first argument
    // old properties are kept as they are, new properties are copied
    for ( var prop in toBeImported ){
        if ( prop in host ){
            continue;
        }
        host[prop] = toBeImported[prop];
    }
    return host;
}
function arraysEqual(arr1, arr2){
    if ( arr1.length != arr2.length ) return false;
    for ( var i=0; i<arr1.length; i++ ){
        if ( arr1[i] != arr2[i] ) return false;
    }
    return true;
}
function arraysEqual2D(arr1, arr2){
    if ( arr1.length != arr2.length ) return false;
    for ( var i=0; i<arr1.length; i++ ){
        if ( !arraysEqual(arr1[i], arr2[i]) ) return false;
    }
    return true;
}
function removeDuplicates(arr){
    // works only on SORTED array
    // assumed arr contains objects that have a .equals method
    // all equal elements appear one after the other (due to being sorted)
    // generates new array.
    var result = new Array();
    if ( arr.length == 0 ) return result;
    var item = arr[0];
    result[0] = item;
    for ( var i=1; i<arr.length; i++ ){
        var newItem = arr[i];
        if ( item.equals(newItem) ) continue;
        item = newItem;
        result.push(item);
    }
    return result;
}
function numericArrayFromString(str){
    if ( str[0] != "[") return null;
    if ( str[str.length-1] != "]" ) return null;
    // remove first and last character
    str = str.slice(1, -1);
    var entries = str.split(",");
    var result = new Array(entries.length);
    for ( var i=0; i<result.length; i++ ){
        var num = entries[i] - 0;
        if ( isNaN(num) ) return null;
        result[i] = num;
    }
    return result;
}
function integerArrayFromString(str){
    if ( str[0] != "[") return null;
    if ( str[str.length-1] != "]" ) return null;
    // remove first and last character
    str = str.slice(1, -1);
    var entries = str.split(",");
    var result = new Array(entries.length);
    for ( var i=0; i<result.length; i++ ){
        var num = entries[i] - 0;
        if ( !isInteger(num) ) return null;
        result[i] = num;
    }
    return result;
}
/*************** canvas drawing utils **********************/
function drawSquareAt(ctx, x, y, halfWidth){
    ctx.beginPath();
    ctx.moveTo(x-halfWidth, y-halfWidth);
    ctx.lineTo(x+halfWidth, y-halfWidth);
    ctx.lineTo(x+halfWidth, y+halfWidth);
    ctx.lineTo(x-halfWidth, y+halfWidth);
    ctx.lineTo(x-halfWidth, y-halfWidth);
    ctx.stroke();
}
function drawCircleAt(ctx, x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI, false);
    ctx.stroke();
}
function drawHexagonAt(ctx, x, y, radius){
    var h = radius*Math.sqrt(3)/2;
    ctx.beginPath();
    ctx.moveTo(x-0.5*radius, y-h);
    ctx.lineTo(x+0.5*radius, y-h);
    ctx.lineTo(x+    radius, y  );
    ctx.lineTo(x+0.5*radius, y+h);
    ctx.lineTo(x-0.5*radius, y+h);
    ctx.lineTo(x-    radius, y  );
    ctx.lineTo(x-0.5*radius, y-h);
    ctx.stroke();
}
function dottedLine(ctx, fromX, fromY, toX, toY, pattern, color, lineWidth){
    // pattern must be an array of even length, containing positive numbers (lengths of the segments)
    // segments in color color and invisible alternate
    // pattern can also be omitted, in which case a solid line is drawn
    if ( !color ){
        color = "Black";
    }
    if ( !lineWidth ){
        lineWidth = 1;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    if ( !pattern ){
        ctx.lineTo(toX, toY);
        ctx.stroke();
        return;
    }
    var Dx = toX - fromX, Dy = toY - fromY;
    var Diag = Math.sqrt(Dx*Dx + Dy*Dy);
    var x = fromX, y = fromY;
    while ( true ){
        for ( var i=0; i<pattern.length; i++ ){
            var diag = pattern[i];
            var factor = diag / Diag;
            var dx = Dx * factor, dy = Dy * factor;
            x += dx; y += dy;
            if ( i % 2 == 0 ){
                ctx.lineTo(x, y);
            } else {
                ctx.moveTo(x, y);
            }
            if ( (x-fromX)*(x-toX) > 0 || (y-fromY)*(y-toY) > 0 ) {
                ctx.stroke();
                return;
            }
        }
    }
}
function putTextAt(ctx, text, x, y, fontSize, color, fontFamily, shiftIfOutside, align){
    if ( !align ){
        align = "center";
    }
    text = "" + text;
    var font = "" + Math.round(fontSize) + "px " + fontFamily;
    ctx.font = font;
    ctx.fillStyle = color;
    var textSize = ctx.measureText(text);
    var textWidth = textSize.width;
    var textHeight = 0.7*fontSize;
    var textX = ( align == "center" ? x - 0.5*textWidth : ( align == "left" ? x : x - textWidth ) );
    var textY = y + 0.5*textHeight;
    if ( shiftIfOutside ){
        textX = Math.max(0, textX);
        textX = Math.min(ctx.canvas.width - textWidth, textX);
        // to do: textY (if we need it ...)
    }
    try {
        ctx.fillText(text, textX, textY);
    } catch(e){
        //alert(text + "\nx = " + x  + "\ny = " + y  + "\nerr = " + e + "\nfont = " + font);
        debugger;
    }
}
function putFractionAt(ctx, enu, deno, x, y, fontSize, color, fontFamily, shiftIfOutside){
    enu = "" + enu;
    deno = "" + deno;
    var font = "" + Math.round(fontSize) + "px " + fontFamily;
    ctx.font = font;
    ctx.fillStyle = color;
    var enuSize  = ctx.measureText(enu);  var enuWidth  = enuSize.width;
    var denoSize = ctx.measureText(deno); var denoWidth = denoSize.width;
    var textHeight = 0.7*fontSize;
    var enuX = x - 0.5*enuWidth;
    var enuY = y - 0.3*textHeight;
    var denoX = x - 0.5*denoWidth;
    var denoY = y + 1.3*textHeight;
    if ( shiftIfOutside ){
        enuX  = Math.max(0,  enuX);  enuX = Math.min(ctx.canvas.width -  enuWidth,  enuX);
        denoX = Math.max(0, denoX); denoX = Math.min(ctx.canvas.width - denoWidth, denoX);
        // to do: textY (if we need it ...)
    }
    try {
        ctx.fillText(enu ,  enuX,  enuY);
        ctx.fillText(deno, denoX, denoY);
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.min(enuX, denoX), y);
        ctx.lineTo(Math.max(enuX + enuWidth, denoX + denoWidth), y);
        ctx.stroke();
    } catch(e){
        //alert(text + "\nx = " + x  + "\ny = " + y  + "\nerr = " + e + "\nfont = " + font);
        debugger;
    }
}
function canvasCtxFromId(id){
    var canvas = document.getElementById(id);
    return canvas.getContext("2d");
}
