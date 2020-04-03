// tiltBChooser.js
//gTiltBChooser: global variable used here, set in phuturePiano.html

function tiltBChooser(ctx, littleCtx, maxTilt, octavePartition, tau2, tau1, bFrom, bTo){
    this.ctx = ctx;
    this.littleCtx = littleCtx;
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
tiltBChooser.prototype.draw = function(){
    this.canvas.width = this.canvas.width;
    var imgData = this.ctx.createImageData(this.width, this.height);
    var data = imgData.data;
    var tiltStart = -this.maxTilt;
    var tiltStep = 2*this.maxTilt/this.width;
    tiltStart += 0.5*tiltStep;
    var bStepFactor = Math.pow(this.bTo/this.bFrom, 1/this.height);
    var b = this.bFrom * Math.sqrt(bStepFactor);
    for ( var row=0; row<this.height; row+=2 ){
        var tilt = tiltStart;
        for ( var col=0; col<this.width; col+=2 ){
            var pos = row*this.width + col;
            var pos2 = (row+1)*this.width + col;
            var a = this.tau2/this.tau1 - b*Math.tan(tilt);
            var lattice = new Lattice(a, b);
            var colors = lattice.calcColors();
            data[4*pos+0] = data[4*pos+4] = colors.red; 
            data[4*pos+1] = data[4*pos+5] = colors.green;
            data[4*pos+2] = data[4*pos+6] = colors.blue;
            data[4*pos+3] = data[4*pos+7] = colors.transpa;
            data[4*pos2+0] = data[4*pos2+4] = colors.red; 
            data[4*pos2+1] = data[4*pos2+5] = colors.green;
            data[4*pos2+2] = data[4*pos2+6] = colors.blue;
            data[4*pos2+3] = data[4*pos2+7] = colors.transpa;
            tilt += 2*tiltStep;
        }
        b *= bStepFactor;
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
}
tiltBChooser.prototype.infoFromMouseCoords = LatticeFromMouseCoords;

tiltBChooserMouse = {
    onMouseMove : function(evt){
        var htmlDegreeSymbol = "&#176;";
        tiltBChooserMouse.updatePos(evt);
        $("#mouseCoords").html(tiltBChooserMouse.x + ", " + tiltBChooserMouse.y);
        var info = gTiltBChooser.infoFromMouseCoords(tiltBChooserMouse.x, tiltBChooserMouse.y);
        //var aString = "a=%7.5f".sprintf(info.a);
        //var bString = "b=%7.5f".sprintf(info.b);        
        var aString = "%7.5f".sprintf(info.a);
        var bString = "%7.5f".sprintf(info.b);        
        var uvString = "blah";
        if ( info.perfect ){
            var ip = info.perfect;
            aString += " = " + ip.toString();
            uvString = "u1v1u2v2 = " + arrayToString([ip.u1, ip.v1, ip.u2, ip.v2]);
            bString += " = " + (ip.type == "hexagon" ? "sqrt(3)" : "1" ) + "/" + ip.denom;            
        }
        //$("#tiltValue").html(("tilt=%8.3f"+htmlDegreeSymbol).sprintf(rad2deg(info.tilt)));
        $("#tiltValue").html(("%8.3f"+htmlDegreeSymbol).sprintf(rad2deg(info.tilt)));
        $("#aValue").html(aString);
        $("#u1v1u2v2Value").html(uvString);
        UI.setBvalue(info.b);
        $("#bValue").html(bString);
        //$("#hexagonityValue").html("hexagonity=%7.5f".sprintf(info.hexagonity));
        $("#hexagonityValue").html("%7.5f".sprintf(info.hexagonity));
        $("#squarityValue").html("squarity=%7.5f".sprintf(info.squarity));
        $("#invCirc2umfValue").html("invCirc2umf=%7.5f".sprintf(info.invCirc2umf));
        $("#minMidMaxSideValue").html("sides=%7.5f, %7.5f, %7.5f".sprintf(info.minSide, info.midSide, info.maxSide) + info.ordering);
        /*$("#minSideValue").html("minSide=%7.5f".sprintf(info.minSide));
        $("#midSideValue").html("midSide=%7.5f".sprintf(info.midSide));
        $("#maxSideValue").html("maxSide=%7.5f".sprintf(info.maxSide));
        $("#orderingValue").html(info.ordering);*/
        $("#maxSideDivHexSideValue").html("maxSideDivHexSide=%7.5f".sprintf(info.maxSideDivHexSide));
        $("#intnValue").html("intn=" + array2dToString(info.intn));
        gTiltBChooser.showInLittleCanvas(info.vertices);
        //$("#verticesValue").html("=%".sprintf(info.));
    },
    onClick : function(evt){
        tiltBChooserMouse.updatePos(evt);
        var info = gTiltBChooser.infoFromMouseCoords(tiltBChooserMouse.x, tiltBChooserMouse.y);
        var a,b;
        var perf = false;
        if ( info.perfect ){
            a = info.perfect.a;
            b = info.perfect.b;
            perf = info.perfect.type;
        } else {
            a = info.a;
            b = info.b;
        }
        //alert("a= " +a+ ", b= " +b+ " perfect= " +perf);
        gridConfigDone(a, b);
    },
    updatePos : function(evt){
    	var canvasMinX = $("#keyboardCanvas").offset().left;
    	var canvasMinY = $("#keyboardCanvas").offset().top;
    	this.x = evt.pageX - canvasMinX;
    	this.y = evt.pageY - canvasMinY;
    }
}
tiltBChooser.prototype.showInLittleCanvas = function (vertices){
    showHexInCanvas(this.littleCtx, vertices);
}
