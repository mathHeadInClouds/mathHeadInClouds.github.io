// odTiltChooser.js
//gTiltBChooser

function odTiltChooser(ctx, maxTilt, octavePartition, tau2, tau1, bFrom, bTo){
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.maxTilt = maxTilt;
    this.octavePartition = octavePartition;
    this.tau2 = tau2;
    this.tau1 = tau1;
    this.bFrom = bFrom;
    this.bTo = bTo;
    this.mouseReady = false;
}
odTiltChooser.prototype.draw = function(){
    this.canvas.width = this.canvas.width;
    var imgData = this.ctx.createImageData(this.width, this.height);
    var data = imgData.data;
    var tiltStart = -this.maxTilt;
    var tiltStep = 2*this.maxTilt/this.width;
    var bStepFactor = Math.pow(this.bTo/this.bFrom, 1/this.height);
    var b = this.bFrom * Math.sqrt(bStepFactor);
    for ( var row=0; row<this.height; row++ ){
        var tilt = tiltStart;
        for ( var col=0; col<this.width; col++ ){
            var pos = row*this.width + col;
            var a = this.tau2/this.tau1 - b*Math.tan(tilt);
            var lattice = new Lattice(a, b);
            var colors = lattice.calcColors();
            data[4*pos+0] = colors.red; 
            data[4*pos+1] = colors.green;
            data[4*pos+2] = colors.blue;
            data[4*pos+3] = colors.transpa;
            tilt += tiltStep;
        }
        b *= bStepFactor;
    }
    this.ctx.putImageData(imgData, 0, 0);
    // now, put in symbols for perfect hexagons and perfect squares
    for ( var i=0; i<Voronoi.perfectList.length; i++ ){
        var hexOrSquare = Voronoi.perfectList[i];
        var a = hexOrSquare.a;
        var b = hexOrSquare.b;
        if ( b < this.bTo || b > this.bFrom ) continue;
        var tilt = Math.atan((this.tau2/this.tau1-a)/b);        
        if ( Math.abs(tilt) >= this.maxTilt ) continue;
        var x = (tilt+this.maxTilt)*this.width/(2*this.maxTilt);
        var y = this.height*Math.log(b/this.bFrom)/Math.log(this.bTo/this.bFrom);
        var r;
        hexOrSquare.tilt = tilt;
        if ( hexOrSquare.type == "hexagon" ){
            r = 7;
            drawHexagonAt(this.ctx, x, y, r);
            hexOrSquare.radius = r;
        }
        if ( hexOrSquare.type == "square" ){
            r = 5;
            drawSquareAt(this.ctx, x, y, r);
            hexOrSquare.radius = 1.2*r;
        }
    }
    this.mouseReady = true;
    this.cols = new Array(this.width);
    for ( var col=0; col<this.width; col++ ){
        this.cols[col] = this.ctx.getImageData(col, 0, 1, this.height);
    }
    this.rows = new Array(this.height);
    for ( var row=0; row<this.height; row++ ){
        this.rows[row] = this.ctx.getImageData(0, row, this.width, 1);
    }
    //this.pixels = this.ctx.getImageData(0, 0, this.width, this.height);
    this.whiteCol = this.ctx.createImageData(1, this.height);
    for ( var i=0; i<this.whiteCol.data.length; i++ ){
        this.whiteCol.data[i] = 255;
    }
    this.whiteRow = this.ctx.createImageData(this.width, 1);
    for ( var i=0; i<this.whiteRow.data.length; i++ ){
        this.whiteRow.data[i] = 255;
    }
    this.xx = -1;
    this.yy = -1;
}
odTiltChooser.prototype.verticalLineAtX = function(x){
    if ( x == this.xx ) return;
    if ( this.xx >= 0 ){    
        // restore original data at old position
        this.ctx.putImageData(this.cols[this.xx], this.xx, 0);
    }
    // make white line
    this.ctx.putImageData(this.whiteCol, x, 0);
    this.xx = x;
    this.ctx.putImageData(this.whiteRow, 0, this.yy);
}
odTiltChooser.prototype.horizontalLineAtY = function(y){
    if ( y == this.yy ) return;
    if ( this.yy >= 0 ){    
        // restore original data at old position
        this.ctx.putImageData(this.rows[this.yy], 0, this.yy);
    }
    // make white line
    this.ctx.putImageData(this.whiteRow, 0, y);
    this.yy = y;
    this.ctx.putImageData(this.whiteCol, this.xx, 0);
}
odTiltChooser.prototype.lineAtTilt = function(tilt){
    var x = Math.round(this.tilt2x(tilt));
    if ( x < 0 || x >= this.width ) return;
    this.verticalLineAtX(x);
}
odTiltChooser.prototype.lineAtB = function(b){
    var y = Math.round(this.b2y(b));
    if ( y < 0 || y >= this.height ) return;
    this.horizontalLineAtY(y);
}
odTiltChooser.prototype.lineAtOctDist = function(od){
    var b = square(this.octavePartition/od); 
    this.lineAtB(b);
}
odTiltChooser.prototype.tilt2x = function(tilt){
    return (tilt+this.maxTilt)*this.width/(2*this.maxTilt);
}
odTiltChooser.prototype.b2y = function(b){
    return this.height*Math.log(b/this.bFrom)/Math.log(this.bTo/this.bFrom);
}
