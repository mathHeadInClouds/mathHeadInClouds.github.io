// phuturePiano2.js
Keyboard = {
    epsilon : 0,
    fontFamily : "Times New Roman",
    maxNumFunsOnButtons : 5,
    centerFontSizeFactors : [0.255, 0.215, 0.19, 0.17, 0.155],
    topFontSizeFactor : 0.12,
    bottomFontSizeFactor : 0.12,
    centerFontSizeMins  : [6.2, 5.5, 5.1, 4.9, 4.6],
    topFontSizeMin : 4,
    bottomFontSizeMin : 4,
    makeFontString : function(fontSize){
        return "" + Math.round(fontSize) + "px " + this.fontFamily;
    },
    calcCenterFontSize : function(numFuns){
        return this.centerFontSizeMins[numFuns] + this.zoom * this.centerFontSizeFactors[numFuns];
    },
    calcTopFontSize : function(){
        return this.topFontSizeMin + this.zoom * this.topFontSizeFactor;
    },
    calcBottomFontSize : function(){
        return this.bottomFontSizeMin + this.zoom * this.bottomFontSizeFactor;
    },
    textColor1 : "Black",
    fontSize3  : 12,
    textColor3 : "Black",
    calcFunctionsOfInvisibleButtons : false,
    errorString : "",
    init : function(){
    	var canvas = document.getElementById('keyboardCanvas');
    	if (!canvas) {
    	   this.errorString = "keyboard canvas undefined";
           return false;
        }
        this.canvas = canvas;
    	var keyboardCtx = canvas.getContext('2d');
    	if ( !keyboardCtx ){
    	   this.errorString = "keyboard canvas 2d context undefined";
           return false;
    	}
        this.ctx = keyboardCtx;
        UI.canvas = $(canvas);
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.tau1 = UI.tau1Val;
        this.tau2 = UI.tau2Val;
        this.matrix = UI.matrix;
        this.octavePartition = this.matrix[0][0];
        if ( UI.rationalTau2 ) {
            this.setRationalTau2(UI.rationalTau2);
        } else {
            this.rationalTau2 = null;
        }
        this.lambda = UI.lambda;
        this.mirrored = UI.mirrored;
        this.tilt = UI.tilt0;
        this.calcABTilt();
        this.calcShearMat();
        this.setMirrored(this.mirrored);
        this.zoom = UI.zoomVal;
        this.shiftX = UI.shiftXVal;
        this.shiftY = UI.shiftYVal;
        this.setRotation(UI.rotVal);
        this.calcMat();
        this.numNiveauLines = UI.getNumNiveauLines();
        this.numOctaveLines = UI.getNumOctaveLines();
        this.centerCaption = Captions[UI.centerCaption];     
        this.topCornerCaptionET = Captions[UI.topCornerCaptionET]; 
        this.topCornerCaptionNonET = Captions[UI.topCornerCaptionNonET]; 
        this.bottomCornerCaption = Captions[UI.bottomCornerCaption]; 
        this.stepsPerOctave = UI.spo;
        this.maxComplexity = Math.exp(UI.logComplVal);
        this.maxPrimeIndex = this.matrix.length;
        this.errPoly = UI.errPoly;
        return true;
    },
    calcABTilt : function(){
        this.sqrtB = Math.exp(this.lambda);
        this.b = this.sqrtB*this.sqrtB;
        this.a = this.tau2/this.tau1 - this.b*Math.tan(this.tilt);
        UI.setAvalue(this.a);
        UI.setBvalue(this.b);
        UI.setTiltValue(this.tilt);
    },
    setAB : function(a, b){
        this.a = a;
        this.b = b;
        this.sqrtB = Math.sqrt(b);
        this.lambda = Math.log(this.sqrtB);
        this.tilt  = Math.atan((this.tau2/this.tau1 - this.a)/this.b);
        this.calcShearMat();
        this.calcNormalVecOfNiveauLines();
        this.calcMat();
        UI.setAvalue(this.a);
        UI.setBvalue(this.b);
        UI.setTiltValue(this.tilt);
    },
    calcTilt : function(){
        this.tilt  = Math.atan((this.tau2/this.tau1 - this.a)/this.b);
        UI.setTiltValue(this.tilt);
    },
    calcShearMat : function(){
        this.lattice = new Lattice(this.a, this.b);
        //this.shearMat = new Mat22(1/this.sqrtB, this.a/this.sqrtB, 0, this.sqrtB);
        this.shearMat = this.lattice.shearMat;
    },
    calcNormalVecOfNiveauLines : function(){
        var cosRot = this.rotMat.a;
        var sinRot = this.rotMat.c;
        // (nx, ny) the (non-rotated) normal vector of the niveau lines
        this.nx = this.b*this.tau1;
        this.ny = this.tau2 - this.tau1*this.a;
        // (nxx, nyy) the (rotated) normal vector of the niveau lines
        var plusMinus = ( this.mirrored ? - 1: 1 );
        this.nxx = this.nx*cosRot - this.ny*sinRot;
        this.nyy = plusMinus*(this.nx*sinRot + this.ny*cosRot);
        // also calc normal vec of octave lines
        this.nxOct = -sinRot;
        this.nyOct = plusMinus * cosRot;
    },
    setRotation : function(angle){
        this.rotAngle = angle;
        this.rotMat = Mat22.prototype.rotMat(angle);
        this.calcNormalVecOfNiveauLines();
    },
    setMirrored : function(mirrored){
        this.mirrored = mirrored;
        this.mirrorMat = ( mirrored ? Mat22.prototype.reflectY : Mat22.prototype.id );
    },
    calcMat : function(){
        this.mat = this.mirrorMat.timesMat(this.rotMat).timesMat(this.shearMat).timesConst(this.zoom);
        this.mousePrepared = false;
    },
    prepareDraw : function(){
        this.prepareDraw1();
        this.prepareDraw2();
        this.prepareDraw3();
    },
    prepareDraw2n3 : function(){
        this.prepareDraw2();
        this.prepareDraw3();
    },
    prepareDraw1 : function(){
        // rotCenterMirr = mirrorMat . rotCenter;
        // shift = mirrorMat . ({xShift, yShift} + nextR);
        // {sx, sy} = shift;
        // to do : most of this function should be migrated to Lattice in voronoi.js
        // and maybe the lattice shouldn't be "unpacked" into Keyboard (some other time)
        this.lattice.setMat(this.mat);
        this.lattice.calcNeighboursAndVertices();
        this.intn = this.lattice.intn;
        this.neighb = this.lattice.neighb;
        this.vertices = this.lattice.vertices;
        this.hexagonity = this.lattice.hexagonity;
        this.hexagonity /= (this.zoom*this.zoom);
        this.trafoMat = this.lattice.trafoMat;
        var trafoMat = this.trafoMat;
        /* circumference
        var sideA = lineLength(this.vertices[0], this.vertices[1]),
            sideB = lineLength(this.vertices[1], this.vertices[2]),
            sideC = lineLength(this.vertices[2], this.vertices[3]);
        var circumference = sideA + sideB + sideC;
        circumference *= 2;
        circumference /= this.zoom;
        UI.setCircumferenceValue(circumference);*/
        //var trafoMat = new Mat22(this.intn[0][0], this.intn[1][0], this.intn[0][1], this.intn[1][1]);
        UI.setHexagonityValue(this.hexagonity);
        var iTrafoMat = trafoMat.inverse();
        this.iTrafoMat = iTrafoMat;
        this.neighbourBasedMatrix = iTrafoMat.timesColumnMatrix(this.matrix);
        var n1 = this.shearMat.timesVec(this.intn[0]);
        var n2 = this.shearMat.timesVec(this.intn[1]);
        var n3 = this.shearMat.timesVec(this.intn[2]);
        var n4 = arrayCopy(n1); n4[0] *= -1; n4[1] *= -1;
        this.n1 = n1; this.n2 = n2; this.n3 = n3; this.n4 = n4;
        this.nAngle1 = angleBetween(n1, n2);
        this.nAngle2 = angleBetween(n2, n3);
        this.nAngle3 = angleBetween(n3, n4);
        var v01 = vecDiff(this.vertices[1], this.vertices[0]);
        var v12 = vecDiff(this.vertices[2], this.vertices[1]);
        var v23 = vecDiff(this.vertices[3], this.vertices[2]);
        this.vAngle1 = angleBetween(negativeVec(v01) ,v12);
        this.vAngle2 = angleBetween(negativeVec(v12),v23);
        this.vAngle3 = angleBetween(negativeVec(v23),negativeVec(v01));
        // actual sx, sy calculated from shift and other stuff, fill in later, TODO
        this.sx = this.shiftX; this.sy = this.shiftY;
        this.mousePrepared = true;
        /* vxLo = min of all x coords of all vertices
          vxHi = max ditto
          vyLo, vyHi, similar
          for button boundaries, only the 4 vertices we calculated would be needed
          (if say the "upper half" of each hexagon is drawn, the lower half will be drawn too,
          because it is part of the upper halves of other hexagons; and we draw the boundaries that way.)
          however, we want button captions to appear also on button on the edges, that have no part of their
          boundary "genuinely drawn" (only drawn, because it's also the boundary of neighbours)
          Therefore, we take vxLo etc the min of all 6 vertices.
          The vertex with index 3 higher (modulo 6) is minus that here, so just take absolute values 
          of first three vertices.
        */
        var ax0 = Math.abs(this.vertices[0][0]),
            ax1 = Math.abs(this.vertices[1][0]),
            ax2 = Math.abs(this.vertices[2][0]),
            ay0 = Math.abs(this.vertices[0][1]),
            ay1 = Math.abs(this.vertices[1][1]),
            ay2 = Math.abs(this.vertices[2][1]);
        var vxHi = Math.max(ax0, ax1, ax2), vxLo = -vxHi,
            vyHi = Math.max(ay0, ay1, ay2), vyLo = -vyHi;
        this.vxLo = vxLo; this.vxHi = vxHi;
        this.vyLo = vyLo; this.vyHi = vyHi;
        var indexOfTopVertex = positionOfMax([this.vertices[0][1],  this.vertices[1][1],  this.vertices[2][1], 
                                             -this.vertices[0][1], -this.vertices[1][1], -this.vertices[2][1]
        ]);
        var topX, topY, theVertex;
        if ( indexOfTopVertex < 3 ){
            theVertex = this.vertices[indexOfTopVertex];
            topX = -theVertex[0];
            topY = -theVertex[1];
        } else {
            theVertex = this.vertices[indexOfTopVertex-3];
            topX = theVertex[0];
            topY = theVertex[1];
        }
        var factor = 0.76;
        this.topX = factor*topX;
        this.topY = factor*topY;
    },
    mouseIntCoordsFromMouseGraphicsCoords : function(mgX, mgY){
        if ( !this.mousePrepared ) return "-";
        var mouseMinusShift = [mgX - this.sx, mgY - this.sy];
        var vec1 = this.rotMat.transpose().timesMat(this.mirrorMat).timesConst(1/this.zoom).timesVec(mouseMinusShift);
        var vec2 = this.shearMat.timesMat(this.trafoMat).inverse().timesVec(vec1);
        var cx = vec2[0], cy = vec2[1];
        var icx = Math.round(cx), icy = Math.round(cy);
        var rcx = cx - icx, rcy = cy - icy;
        var winner;
        if ( rcx*rcy < 0 || Math.abs(rcx+rcy) < 0.5){
            winner = [icx, icy];
        } else {
            var sgn = sign(sign(rcx) + sign(rcy)); 
            var cand1 = [icx, icy],
                cand2 = [icx + sgn, icy],
                cand3 = [icx, icy + sgn];
            var shtr = this.shearMat.timesMat(this.trafoMat);
            var dist1 = normSquared(shtr.timesVec([rcx,     rcy    ])),
                dist2 = normSquared(shtr.timesVec([rcx-sgn, rcy    ])),
                dist3 = normSquared(shtr.timesVec([rcx,     rcy-sgn]));
            if ( dist1 <= dist2 ){
                if ( dist1 <= dist3 ){
                    winner = cand1;
                } else {
                    winner = cand3;
                }
            } else {
                if ( dist2 <= dist3 ){
                    winner = cand2;
                } else {
                    winner = cand3;
                }
            }
        }
        this.mouseIntNeighbourCoords = winner;
        this.mouseIntCoords = this.trafoMat.timesVec(winner);
        return this.mouseIntCoords;
    },
    prepareDraw2 : function(){
        // actual sx, sy calculated from shift and other stuff, fill in later, TODO
        this.sx = this.shiftX; this.sy = this.shiftY;
        var trafoMat = this.trafoMat;
        var xMin = 0, xMax = this.width, yMin = 0, yMax = this.height;
        this.mattt = this.mat.timesMat(trafoMat);
        this.tempIntGrid = Voronoi.findIntCoordsInArea(this.mattt.a, this.mattt.b, this.mattt.c, this.mattt.d, 
            xMin - this.vxHi - this.sx, xMax - this.vxLo - this.sx, 
            yMin - this.vyHi - this.sy, yMax - this.vyLo - this.sy
        );
        var intGrid = map(function(arg){ return trafoMat.timesVec(arg); }, this.tempIntGrid);
        // need min and max "y-coords" (second entries) in intGrid for additional button function in the tau2rational case. (pitch repetition)
        var minY =  Infinity; 
        var maxY = -Infinity; 
        for ( var i=0; i<intGrid.length; i++ ){
            var y = intGrid[i][1];
            if ( y > maxY ){
                maxY = y;
            } else {
                if ( y < minY ){
                    minY = y;
                }
            }
        }
        this.intGrid = intGrid;
        // buttons = lookup to see which button exists, given coordinates
        this.buttons = {};
        for ( var i=0; i<intGrid.length; i++ ){
            var xy = intGrid[i];
            var x = xy[0];
            var y = xy[1];
            if ( !this.buttons[x] ) { this.buttons[x] = {}; }
            if ( !this.buttons[x][y] ) {
                this.buttons[x][y] = { functions: [] };
            }
        }
        this.minY = minY;
        this.maxY = maxY;
        // deal with niveau lines and octave lines
        this.calcMinMaxPitch();
        this.calcNiveauLines();
        this.calcMinMaxOctaveDist();
        this.calcOctaveLines();
    },
    calcNiveauLines : function(){
        if ( this.numNiveauLines == 0 ) {
            this.niveauLines = [];
            return;
        }
        var sx = this.sx, sy = this.sy;
        var nxx = this.nxx, nyy = this.nyy;
        var zoom = this.zoom, sqrtB = this.sqrtB;
        var zb = zoom * sqrtB;
        var mini, maxi, interMarg;
        if ( Math.abs(nxx) >= Math.abs(nyy) ){
            mini = 0;
            maxi = this.height;
            interMarg = auxY;
        } else {
            mini = 0;
            maxi = this.width;
            interMarg = auxX;
        }
        function auxY(pitch){
            // intersect with horizontal screen margins
            return [
                [sx + (zb*pitch - nyy*(mini - sy))/nxx, mini], 
                [sx + (zb*pitch - nyy*(maxi - sy))/nxx, maxi]
            ];
        }
        function auxX(pitch){
            // intersect with vertical screen margins
            return [
                [mini, sy + (zb*pitch - nxx*(mini - sx))/nyy], 
                [maxi, sy + (zb*pitch - nxx*(maxi - sx))/nyy]
            ];
        }
        var niveauLines = [];
        var num = this.numNiveauLines;
        var deltaPitch = 1/num;
        var pitch = Math.ceil(num*this.minPitch)/num;
        while ( pitch <= this.maxPitch ){
            niveauLines.push(interMarg(pitch));
            pitch += deltaPitch;
        }
        this.niveauLines = niveauLines;
    },
    calcOctaveLines : function(){
        if ( this.numOctaveLines == 0 ) {
            this.octaveLines = [];
            return;
        }
        var sx = this.sx, sy = this.sy;
        var nxx = this.nxOct, nyy = this.nyOct;
        var zoom = this.zoom, sqrtB = this.sqrtB;
        var zb = zoom * sqrtB;
        var mini, maxi, interMarg;
        if ( Math.abs(nxx) >= Math.abs(nyy) ){
            mini = 0;
            maxi = this.height;
            interMarg = auxY;
        } else {
            mini = 0;
            maxi = this.width;
            interMarg = auxX;
        }
        function auxY(dist){
            // intersect with horizontal screen margins
            return [
                [sx + (zb*dist - nyy*(mini - sy))/nxx, mini], 
                [sx + (zb*dist - nyy*(maxi - sy))/nxx, maxi]
            ];
        }
        function auxX(dist){
            // intersect with vertical screen margins
            return [
                [mini, sy + (zb*dist - nxx*(mini - sx))/nyy], 
                [maxi, sy + (zb*dist - nxx*(maxi - sx))/nyy]
            ];
        }
        var octaveLines = [];
        var deltaDist = (this.maxOctaveDist - this.minOctaveDist) / this.numOctaveLines; 
        var dist = 0;
        while ( dist <= this.maxOctaveDist ){
            octaveLines.push(interMarg(dist));
            dist += deltaDist;
        }
        dist = -deltaDist;
        while ( dist >= this.minOctaveDist ){
            octaveLines.push(interMarg(dist));
            dist -= deltaDist;
        }
        this.octaveLines = octaveLines;
    },
    setToMinMse : function(value){
        this.rationalTau2 = null;
        this.stepsPerOctave = Infinity;
        this.tau1 = this.errPoly.tau1Opt;
        this.tau2 = this.errPoly.tau2Opt;
    },
    setIrrationalTau2 : function(value){
        this.rationalTau2 = null;
        this.tau2 = value;
        this.stepsPerOctave = Infinity;
    },
    setTau1 : function(value){
        this.rationalTau2 = null;
        this.tau1 = value;
        this.stepsPerOctave = Infinity;
    },
    setRationalTau2 : function(value){
        this.rationalTau2 = value;
        this.tau2 = value.value();
        this.tau1 = 1/this.octavePartition;
        this.ggt = gcd(value.deno, this.octavePartition);
        this.stepsPerOctave = this.octavePartition*value.deno / this.ggt;
        this.xSteps = value.deno / this.ggt;
        this.ySteps = value.enu * this.octavePartition / this.ggt;
    },
    getStepsAt : function(x, y){
        return x*this.xSteps + y*this.ySteps;
    },
    getStepsAtVec : function(xy){
        return xy[0]*this.xSteps + xy[1]*this.ySteps;
    },
    getPitchAt : function(x, y){
        return x*this.tau1 + y*this.tau2;
    },
    getPitchAtVec : function(xy){
        return xy[0]*this.tau1 + xy[1]*this.tau2;
    },
    getQuasiPitchAt : function(x, y){
        // uses graphics coords instead of integer coords
        // returns the correct pitch of the button, if the graphics coords are at the center of the button
        // otherwise, returns the linear extension of the resulting function
        // used for niveau lines
        var tmpX = this.nxx*(x - this.sx);
        var tmpY = this.nyy*(y - this.sy);
        return (tmpX + tmpY) / (this.sqrtB * this.zoom);
    },
    getOctaveLineDistAt : function(x, y){
        // distance of a point to the line through origin-button and the button octave higher
        var tmpX = this.nxOct*(x - this.sx);
        var tmpY = this.nyOct*(y - this.sy);
        return (tmpX + tmpY) / (this.sqrtB * this.zoom);
    },
    calcMinMaxPitch : function(){
        var p1 = this.getQuasiPitchAt(0, 0);
        var p2 = this.getQuasiPitchAt(this.width, 0);
        var p3 = this.getQuasiPitchAt(0, this.height);
        var p4 = this.getQuasiPitchAt(this.width, this.height);
        this.minPitch = Math.min(p1, p2, p3, p4);
        this.maxPitch = Math.max(p1, p2, p3, p4);
    },
    calcMinMaxOctaveDist : function(){
        var p1 = this.getOctaveLineDistAt(0, 0);
        var p2 = this.getOctaveLineDistAt(this.width, 0);
        var p3 = this.getOctaveLineDistAt(0, this.height);
        var p4 = this.getOctaveLineDistAt(this.width, this.height);
        this.minOctaveDist = Math.min(p1, p2, p3, p4);
        this.maxOctaveDist = Math.max(p1, p2, p3, p4);
    },
    prepareDraw3 : function(){
        // caption calculation (which fracs on which button)
        // this.funs[x][y] contains array with all the fractions that are associated
        // with the button with coordinates x, y
        if ( this.matrix == "undefined" ){
            throw "undefined matrix";
            return;
        }
        if ( !this.calcFunctionsOfInvisibleButtons ){
            // erase old button functions
            for ( var i=0; i<this.intGrid.length; i++ ){
                var xy = this.intGrid[i];
                var x = xy[0];
                var y = xy[1];
                this.buttons[x][y].functions.length = 0;
                /*if ( !this.buttons[x] ) { this.buttons[x] = {}; }
                if ( !this.buttons[x][y] ) {
                    this.buttons[x][y] = { functions: [] };
                } else {
                    this.buttons[x][y].functions.length = 0;
                }*/
            }
        }
        var minPitch = this.minPitch;
        var maxPitch = this.maxPitch;
        var buttons = this.buttons;
        var funs = {};
        var fracs = genFracs(this.maxComplexity, primes.slice(0, this.maxPrimeIndex));
        function addFracIfBtnVisible(x, y, fr, orig){
            // same as addFrac, but only does something, if the button playing the frac is visible
            var klon = fr.copy();
            klon.original = orig;
            if ( buttons[x] && buttons[x][y] ){
                buttons[x][y].functions.push(klon);
            }
        }
        function addFrac(x, y, fr, orig){
            // original say that the button always has that function 
            // if false, the button only has that function, because the button has the same pitch as a button
            // that "originally" (i.e. always, for all tau1, tau2, just due to the matrix) has that function
            var klon = fr.copy();
            klon.original = orig;
            if ( !funs[x] ){
                funs[x] = {};
            }
            if ( !funs[x][y] ){
                funs[x][y] = [];
            }
            funs[x][y].push(klon);
        }
        var minY = this.minY;
        var maxY = this.maxY;
        var xSteps = this.xSteps;
        var ySteps = this.ySteps;
        var importExtraFunctionsFromButtonsWithTheSamePitch = this.rationalTau2;
        function addFracToAll(x, y, fr, addFracToOne){
            addFracToOne(x, y, fr, true);
            if ( !importExtraFunctionsFromButtonsWithTheSamePitch  ) return; // irrational tau2 -> each pitch unique
            var x0 = x, y0 = y;
            while ( true ){
                // find all buttons with same pitch and lower y
                x += ySteps;
                y -= xSteps;
                if ( y < minY ) break;
                addFracToOne(x, y, fr, false);
            }
            x = x0; y = y0;
            while ( true ){
                // find all buttons with same pitch and higher y
                x -= ySteps;
                y += xSteps;
                if ( y > maxY ) break;
                addFracToOne(x, y, fr, false);
            }
        }
        var addFracToOne = ( this.calcFunctionsOfInvisibleButtons ? addFrac : addFracIfBtnVisible );
        for ( var i=0; i<fracs.length; i++ ){
            var fr = fracs[i];
            var coords = fr.getCoords(this.matrix);
            var x = coords[0];
            var y = coords[1];
            addFracToAll(x, y, fr, addFracToOne);
        }
        if ( this.calcFunctionsOfInvisibleButtons ){
            for ( var i1 in funs ){
                var column = funs[i1];
                for ( var i2 in column ){
                    var entry = column[i2];
                    for ( var i=0; i<entry.length; i++ ){
                        entry[i].calculateConsistencyInterval(i1-0, i2-0, this.matrix[0][0]);
                    }
                }
            }
            this.funs = funs;
        } else {
            for ( var i=0; i<this.intGrid.length; i++ ){
                var xy = this.intGrid[i];
                var x = xy[0];
                var y = xy[1];
                var btnFunList = this.buttons[x][y].functions;
                var numFuns = btnFunList.length;
                for ( var j=0; j<numFuns; j++ ){
                    btnFunList[j].calculateConsistencyInterval(x, y, this.matrix[0][0]);
                }
            }
        }
    },
    clear : function(){
        this.ctx.canvas.width = this.ctx.canvas.width;
    },
    clearAndDraw : function(){
        this.clear();
        this.draw();
    },
    putTextAt : function(text, x, y, fontSize, color){
        text = "" + text;
        var textLen = text.length;
        var factor = [1.1, 1.1, 1.1, 1.1, 1.05, 1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7][textLen];
        //fontSize *= 8/(3 + Math.max(5, text.length));
        fontSize *= factor;
        var font = this.makeFontString(fontSize);
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        var textSize = this.ctx.measureText(text);
        var textWidth = textSize.width;
        var textHeight = 0.7*fontSize;
        try {
            this.ctx.fillText(text, x - 0.5*textWidth, y + 0.5*textHeight);
        } catch(e){
            //alert(text + "\nx = " + x  + "\ny = " + y  + "\nerr = " + e + "\nfont = " + font);
            debugger;
        }
    },
    draw : function(){
        this.ctx.strokeStyle = "Black";
        this.ctx.lineWidth = 1;
        var topFontSize = this.calcTopFontSize();
        var bottomFontSize = this.calcBottomFontSize();
        var cfs = new Array();
        for ( var num=0; num<this.maxNumFunsOnButtons; num++ ){
            cfs[num] = this.calcCenterFontSize(num);
        }
        for ( var i=0; i<this.intGrid.length; i++ ){
            var intCoords = this.intGrid[i];
            var sung = false;
            if (microphoneObj && Keyboard.sungKeys){
                Keyboard.sungKeys.forEach(function(sungCoords){
                    if ( (intCoords[0]===sungCoords[0]) && (intCoords[1]===sungCoords[1]) ){
                        sung = true;
                    }
                });
            }
            var mid = this.mat.timesVec(intCoords);
            var midX = mid[0] + this.sx;
            var midY = mid[1] + this.sy;
            var topX = midX + this.topX;
            var topY = midY + this.topY;
            var botX = midX - this.topX;
            var botY = midY - this.topY;
            var centerTxt;
            if ( (!this.rationalTau2) && this.centerCaption.ETOnly ){
                // illegitimate user choice, so fallback to default
                centerTxt = Captions.funs(intCoords, this);
            } else {
                centerTxt = this.centerCaption(intCoords, this);
            }
            if ( centerTxt instanceof Array ){
                var len = centerTxt.length;
                var fontSize = cfs[len-1];
                for ( var j=0; j<len; j++ ){
                    var lamY = [[0], [0.32, -0.32], [0.5, 0, -0.5], [0.69, 0.23, -0.23, -0.69], [0.78, 0.39, 0, -0.39, -0.78]][len-1][j];
                    var lamX = this.epsilon * lamY;
                    var x = (1-lamX)*midX + lamX*topX;
                    var y = (1-lamY)*midY + lamY*topY;
                    this.putTextAt(centerTxt[j], x, y, fontSize, this.textColor1);
                }
            } else {
                this.putTextAt(centerTxt, midX, midY, cfs[0], this.textColor1);
            }
            if ( this.rationalTau2 ){
                this.putTextAt(this.topCornerCaptionET(intCoords, this), topX, topY, topFontSize, this.textColor3);
            } else {
                this.putTextAt(this.topCornerCaptionNonET(intCoords, this), topX, topY, topFontSize, this.textColor3);
            }
            this.putTextAt(this.bottomCornerCaption(intCoords, this), 0.94*botX + 0.06*midX, botY, bottomFontSize, this.textColor3);
            // boundary of button
            this.ctx.beginPath();
            this.ctx.moveTo(midX+this.vertices[0][0], midY+this.vertices[0][1]);
            for ( var j=1; j<this.vertices.length; j++ ){
                this.ctx.lineTo(midX+this.vertices[j][0], midY+this.vertices[j][1]);
            }
            this.ctx.stroke();
            if (sung){
                this.ctx.fillStyle = 'rgba(0,96,255,0.6)';
                this.ctx.beginPath();
                this.ctx.moveTo(midX+this.vertices[0][0], midY+this.vertices[0][1]);
                this.ctx.lineTo(midX+this.vertices[1][0], midY+this.vertices[1][1]);
                this.ctx.lineTo(midX+this.vertices[2][0], midY+this.vertices[2][1]);
                this.ctx.lineTo(midX-this.vertices[0][0], midY-this.vertices[0][1]);
                this.ctx.lineTo(midX-this.vertices[1][0], midY-this.vertices[1][1]);
                this.ctx.lineTo(midX-this.vertices[2][0], midY-this.vertices[2][1]);
                this.ctx.lineTo(midX+this.vertices[0][0], midY+this.vertices[0][1]);
                this.ctx.fill();
            }
        }
        this.drawNiveauLines();
        this.drawOctaveLines();
    },
    drawNiveauLines : function(){
        var len = this.niveauLines.length;
        this.ctx.strokeStyle = "rgba(0,0,0,0.2)";
        this.ctx.lineWidth = 3;
        for ( var i=0; i<len; i++ ){
            var line = this.niveauLines[i];
            var startX = line[0][0],
                startY = line[0][1],
                endX = line[1][0],
                endY = line[1][1];
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    },
    drawOctaveLines : function(){
        var len = this.octaveLines.length;
        this.ctx.strokeStyle = "rgba(0,255,0,0.2)";
        this.ctx.lineWidth = 3;
        for ( var i=0; i<len; i++ ){
            var line = this.octaveLines[i];
            var startX = line[0][0],
                startY = line[0][1],
                endX = line[1][0],
                endY = line[1][1];
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    },
    getFunctionsAt : function(xy){
        var x = xy[0];
        var y = xy[1];
        if ( this.calcFunctionsOfInvisibleButtons ){
            if ( this.funs && this.funs[x] && this.funs[x][y] && this.funs[x][y].length ){
                mergeSortObjects(this.funs[x][y]);
                return this.funs[x][y];
            }
            return [];
        } else {
            if ( this.buttons[x] && this.buttons[x][y] ){
                var result = this.buttons[x][y].functions;
                mergeSortObjects(result);
                return result;
            }
            return [];
        }
    },
    getFunErrListAt : function(xy){
        function numberInInterval(number, interval){
            return ( number >= interval[0] && number <= interval[1] );
        }
        var fl = this.getFunctionsAt(xy);
        if ( fl.length == 0 ) return [];
        var actualPitch = this.getPitchAtVec(xy); 
        var result = new Array(fl.length);
        for ( var i=0; i<result.length; i++ ){
            var fr = fl[i];
            var desiredPitch = Math.log(fr.value) / Math.LN2;
            var errorInCent = 1200 * (actualPitch - desiredPitch);
            var consistent = numberInInterval(this.tau2, fr.consistencyInterval);
            var ETconsistent = false;
            if ( this.rationalTau2 ){
                ETconsistent = Math.abs(desiredPitch - actualPitch) <= 0.5/this.stepsPerOctave;
                if ( ETconsistent ) consistent = true; 
                // mathematically speaking this last line is redundant, because the implication holds
                // and we used the correct way to calculate consistent
                // but the correct result can be destroyed by rounding errors, esp. in the rational case 
            }
            result[i] = new fracErr(fr, errorInCent, consistent, ETconsistent);
        }
        var compareMethod = fracErr.prototype.lessEq;
        fracErr.prototype.lessEq = SortFracErr.byComplexity;
        mergeSortObjects(result);
        result.length = Math.min(result.length, UI.maxNumFunsInMouseTable);
        if ( compareMethod != fracErr.prototype.lessEq ){
            fracErr.prototype.lessEq = compareMethod;
            mergeSortObjects(result);
        }
        return result;
    }
};
Captions = {
    coords : function(xy){
        var x = xy[0];
        var y = xy[1];
        return "(" +x+ ", " +y+ ")"; 
    },
    nCoords : function(stdXY){
        var xy = Keyboard.iTrafoMat.timesVec(stdXY);
        var x = xy[0];
        var y = xy[1];
        return "(" +x+ ", " +y+ ")"; 
    },
    funs: function(xy, kb){
        var funList = kb.getFunctionsAt(xy);
        if ( funList.length == 0 ){
            return "-";
        }
        var result = new Array();
        var f0 = funList[0];
        var c0 = f0.complexity;
        var i=0;
        result.push(f0.toString());
        while ( true ){
            i++;
            if ( i >= funList.length || i >= Keyboard.maxNumFunsOnButtons ) break;
            var f = funList[i];
            var c = f.complexity;
            if ( c >= 500 && c/c0 >= 2 ) break; 
            result.push(f.toString());
        }
        return result;
    },
    steps : function(xy, kb){
        if ( !kb.rationalTau2 ) return "";
        return kb.getStepsAtVec(xy);
    },
    stepsModulo : function(xy, kb){
        if ( !kb.rationalTau2 ) return "";
        return modulo(kb.getStepsAtVec(xy), kb.stepsPerOctave);
    },
    cent : function(xy, kb){
        var pitch = kb.getPitchAtVec(xy);
        var c = 1200*pitch;
        return "%5.0f".sprintf(c).trim();
    },
    centModulo : function(xy, kb){
        var pitch = kb.getPitchAtVec(xy);
        var c = 1200*pitch;
        return "%5.0f".sprintf(modulo(c,1200)).trim();
    },
    none : function(){
        return "";
    }
};
Captions.steps.ETOnly = true;
Captions.stepsModulo.ETOnly = true;

