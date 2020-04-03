// errorGraph.js

ErrorGraph = {
    /* properties to be set from the outside:
    canvas, ctx, width, height, functions (set of linear functions)
    minX, maxX, minY, maxY,
    xAxisLabels, yAxisLabels, 
    later xEdgeAcceleration, yEdgeAcceleration
    */
    fontFamily : "Times New Roman",
    init0 : function(ctx){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    },
    init1 : function(minX, maxX, minY, maxY){
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.dx = maxX - minX;
        this.dy = maxY - minY;
        this.xFactorRawToActual = this.dx / this.width;  this.xFactorActualToRaw = 1 / this.xFactorRawToActual;
        this.yFactorRawToActual = this.dy / this.height; this.yFactorActualToRaw = 1 / this.yFactorRawToActual;
    },
    xRawToActual : function(xRaw){
        return this.minX + this.xFactorRawToActual * xRaw;
    },
    xActualToRaw : function(xActual){
        return (xActual - this.minX) * this.xFactorActualToRaw;
    },
    yRawToActual : function(yRaw){
        return this.maxY - this.yFactorRawToActual * yRaw;
    },
    yActualToRaw : function(yActual){
        return (this.maxY - yActual) * this.yFactorActualToRaw;
    },
    findActualStart : function(a, b){
        var yS = a * this.minX + b;
        if ( yS < this.minY ){
            if ( a <= 0 ) return null;
            var xStart = (this.minY - b) / a;
            if ( xStart > this.maxX ) return null;
            return [xStart, this.minY];
        }
        if ( yS > this.maxY ){
            if ( a >= 0 ) return null;
            var xStart = (this.maxY - b) / a;
            if ( xStart > this.maxX ) return null;
            return [xStart, this.maxY];
        }
        // if we get here, we have this.minY <= yS <= this.maxY
        return [this.minX, yS];
    },
    findActualEnd : function(a, b){
        var yE = a * this.maxX + b;
        if ( yE < this.minY ){
            if ( a >= 0 ) return null;
            var xEnd = (this.minY - b)/a;
            if ( xEnd < this.minX ) return null;
            return [xEnd, this.minY];
        }
        if ( yE > this.maxY ){
            if ( a <= 0 ) return null;
            var xEnd = (this.maxY - b)/a;
            if ( xEnd < this.minX ) return null;
            return [xEnd, this.maxY];
        }
        // if we get here, we have this.minY <= yE <= this.maxY
        return [this.maxX, yE];
    },
    drawLinearFunction : function(a, b, pattern, color){
        // draw the linear function y = a*x + b
        // intersect the linear function with the line segments that are the edges of the canvas
        if ( !color ){ color = "Black"; }
        var start = this.findActualStart(a, b);
        if ( !start ) return;
        var end = this.findActualEnd(a, b);
        if ( !end ) return;
        var x0 = start[0], y0 = start[1], x1 = end[0], y1 = end[1];
        var fromX = this.xActualToRaw(x0), toX = this.xActualToRaw(x1);
        var fromY = this.yActualToRaw(y0), toY = this.yActualToRaw(y1);
        dottedLine(this.ctx, fromX, fromY, toX, toY, pattern, color);
    },
    plotMSE : function(errPoly, tau1){
        var tau2i = errPoly.findMinimumForFixedTau1(tau1);
        var y0 = errPoly.valueAt(tau1, tau2i);
        this.ctx.strokeStyle = "Black";
        var delta = this.xFactorRawToActual * 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xActualToRaw(tau2i), this.yActualToRaw(1200*y0));
        var x = tau2i;
        var y = y0;
        while ( y <= this.maxY ){
            x += delta;
            y = errPoly.valueAt(tau1, x);
            this.ctx.lineTo(this.xActualToRaw(x), this.yActualToRaw(1200*y));
        }
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.xActualToRaw(tau2i), this.yActualToRaw(1200*y0));
        var x = tau2i;
        var y = y0;
        while ( y <= this.maxY ){
            x -= delta;
            y = errPoly.valueAt(tau1, x);
            this.ctx.lineTo(this.xActualToRaw(x), this.yActualToRaw(1200*y));
        }
        this.ctx.stroke();
    },
    drawYAxis : function(){
        dottedLine(this.ctx, this.width/2, 0, this.width/2, this.height);
    },
    drawXAxis : function(){
        this.drawLinearFunction(0, 0);
    },
    verticalLineAt : function(x){
        var fromX = this.xActualToRaw(x); 
        var toX = fromX;
        var fromY = 0;
        var toY = this.height;
        dottedLine(this.ctx, fromX, fromY, toX, toY, [3,3], "rgba(0,0,0,128)");
    },
    markerLength : 7,
    xMarkerFontSize : 14,
    yMarkerFontSize : 16,
    xMarker : function(locus, value){
        var fromX = this.xActualToRaw(locus);
        var toX = fromX;
        var temp = 0.5*this.markerLength*this.yFactorRawToActual;
        var fromY = this.yActualToRaw(-temp);
        var toY = this.yActualToRaw(temp);
        dottedLine(this.ctx, fromX, fromY, toX, toY);
        var textX = toX;
        if ( typeof value == "string" ){
            var textY = this.yActualToRaw(-4*temp); 
            putTextAt(this.ctx, value, textX, textY, this.xMarkerFontSize, "Black", this.fontFamily, true);
        }
        if ( typeof value == "object" || value instanceof fraction ){
            var textY = this.yActualToRaw(-6.5*temp);
            putFractionAt(this.ctx, value.enu, value.deno, textX, textY, this.xMarkerFontSize, "Black", this.fontFamily, true); 
        }
    },
    yMarker : function(locus){
        var fromY = this.yActualToRaw(locus);
        var toY = fromY;
        var fromX = this.width/2 - 0.5*this.markerLength;
        var toX = fromX + this.markerLength;
        dottedLine(this.ctx, fromX, fromY, toX, toY);
        var textY = toY;
        var textX = toX + 4;
        var absl = Math.abs(locus);
        if ( absl >= 10 ) {
            var formatString = "%2.0f";
        } else {
            if ( absl >= 1){
                var formatString = "%3.1f";
            } else {
                if ( absl >= 0.1 ){
                    var formatString = "%4.2f";
                } else {
                    var formatString = "%5.3f";
                }
            }
        }
        //formatString += HtmlSymbols.cent; no work in canvas
        var txt = formatString.sprintf(locus);
        putTextAt(this.ctx, txt, textX, textY, this.yMarkerFontSize, "Black", this.fontFamily, true, "left");
    },
    yMarkers : function(){
        var yMarkerStep = this.dy / 7;
        if ( yMarkerStep >= 2.5 ){
            yMarkerStep = Math.round(yMarkerStep);
        } else {
            if ( yMarkerStep >= 0.25 ){
                yMarkerStep = 0.1 * Math.round(10 * yMarkerStep);
            } else {
                if ( yMarkerStep >= 0.025 ){
                    yMarkerStep = 0.01 * Math.round(100 * yMarkerStep);
                } else {
                    yMarkerStep = 0.001 * Math.round(1000 * yMarkerStep);
                }
            }
        }
        this.yMarker( 3*yMarkerStep);
        this.yMarker( 2*yMarkerStep);
        this.yMarker(   yMarkerStep);
        this.yMarker(  -yMarkerStep);
        this.yMarker(-2*yMarkerStep);
        this.yMarker(-3*yMarkerStep);
    }
}
