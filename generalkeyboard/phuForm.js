// phuForm.js
function odRangeCheck(){
    if ( this.odVal <= this.octDistMinMin + 0.01 ){
        this.octDistMinMin = this.odVal - 0.02;
        this.octDistMin = this.odVal - 0.01;
    }
    if ( this.odVal <= this.octDistMin + 0.005 ){
        this.octDistMin = this.odVal - 0.005;
    }
    if ( this.odVal >= this.octDistMaxMax - 0.01 ){
        this.octDistMaxMax = this.odVal + 0.02;
        this.octDistMax = this.odVal + 0.01;
    }
    if ( this.odVal >= this.octDistMax - 0.005 ){
        this.octDistMax = this.odVal + 0.005;
    }
}
PhuForm = {
    numRats : 7,
    createMatrixTable : function(matrix, length){
        if ( length ){
            length = Math.min(matrix.length, length);
        } else {
            length = matrix.length;
        }
        this.numPrimes = length;
        this.matrixTable.html("");
        var alignCenter = {align:"center"};
        var headerRow = new HtmlGen.TR();
        var xRow  = new HtmlGen.TR();
        var yRow  = new HtmlGen.TR();
        for ( var i=0; i<length; i++ ){
            headerRow.pushTh(primes[i], alignCenter);
            xRow.pushTd(HtmlGen.text({ id: "matrixX" + i, value: matrix[i][0], size: 2}), alignCenter);
            yRow.pushTd(HtmlGen.text({ id: "matrixY" + i, value: matrix[i][1], size: 2}), alignCenter);
        }
        $(headerRow.get()).appendTo(this.matrixTable);
        $(     xRow.get()).appendTo(this.matrixTable);
        $(     yRow.get()).appendTo(this.matrixTable);
    },
    morePrimes : function(){
        if ( this.numPrimes >= primes.length ){
            //alert("max reached");
            return;
        }
        var newMatrix = this.readMatrix();
        if ( !newMatrix ){
            alert("invalid matrix");
            return;
        }
        for ( var i=0; i<newMatrix.length; i++ ){
            this.matrix[i][0] = newMatrix[i][0];
            this.matrix[i][1] = newMatrix[i][1];
        }
        this.numPrimes++;
        if ( this.numPrimes > this.matrix.length ){
            this.matrix.push(["", ""]);
        }
        this.createMatrixTable(this.matrix, this.numPrimes);
        if ( this.readMatrix() ){
            this.commitMatrixChange();
        }
    },
    fewerPrimes : function(){
        if ( this.numPrimes <= 2 ) return;
        this.numPrimes--;
        var newMatrix = this.readMatrix();
        if ( !newMatrix ){
            alert("invalid matrix");
            return;
        }
        for ( var i=0; i<newMatrix.length; i++ ){
            this.matrix[i][0] = newMatrix[i][0];
            this.matrix[i][1] = newMatrix[i][1];
        }
        this.createMatrixTable(this.matrix, this.numPrimes);
        this.setMatrix(this.matrix);
        this.makeTau2Table();
        this.reCreateTauSliders();
    },
    init : function(){
        this.matrixTable = $("#matrixTable");
        this.matrixDiv = $("#matrixDiv");
        this.matrixFieldSet = $("#matrixFieldSet");
        this.form = $("#form");
        this.form1 = $("#form1");
        this.form2 = $("#form2");
        this.form3 = $("#form3");
        this.errorGraphCanvas = document.getElementById("errorGraphCanvas");
        this.errorGraphContext = this.errorGraphCanvas.getContext("2d");
        ErrorGraph.init0(this.errorGraphContext);
        this.defaults = shallowCloneObject(Defaults);
        this.defaults.shiftX = this.defaults.shiftXVal;
        this.defaults.shiftY = this.defaults.shiftYVal;
        this.defaults.zoom = this.defaults.zoomVal;
        this.defaults.maxLogCompl = this.defaults.logComplVal;
        this.defaults.rotation = 0;
    },
    setMatrix : function(matrix){
        var octPart = matrix[0][0];
        this.errPoly = calculateErrorPolynomial(matrix, this.numPrimes);
        var tau2Info = this.errPoly.findTau2Rats(this.numRats);
        this.tau2ButtonRats = tau2Info.tau2Rats;
        this.tau2Min = tau2Info.tau2Min;
        this.tau2Max = tau2Info.tau2Max;
        this.tau2Val = this.errPoly.tau2Opt;
        this.tau1Val = this.errPoly.tau1Opt;
        this.tau1SliderRangeInCent = tau2Info.tau1SliderRangeInCent;
        var delta = this.tau1SliderRangeInCent / 1200;
        this.tau1Min = 1/octPart - delta;
        this.tau1Max = 1/octPart + delta;
    },
    commitMatrixChange : function(){
        var matrix = this.readMatrix();
        if ( !matrix ) {
            alert("invalid matrix");
            return;
        }
        this.setMatrix(matrix);
        this.rationalTau2 = null;
        this.makeTau2Table();
        this.reCreateTauSliders();
    },
    makeMiscTable : function(){
        // first table row with mirrored and limit of number of functions on mouseover
        this.form1.append(HtmlGen.table("", { id:"miscTable"})); this.miscTable = $("#miscTable");
        var miscRow = new HtmlGen.TR();
        miscRow.pushTd(HtmlGen.checkbox(this.mirrored, { id: "mirroredCheck" }, "mirrored"), { "class" : "nobr"});
        miscRow.pushTd("", { width : "14px"});
        miscRow.pushTd(HtmlGen.select(range(3,30), { id: "numShownFunsInMouseTableSelect" }), { id: "numShownFunsInMouseTableTd"});
        miscRow.pushTd("limit of number of functions shown on mouseOver", { "class" : "nobr"});
        miscRow.pushTd("", { width : "14px"});
        miscRow.pushTd(HtmlGen.text({ id: "tuningName", value: this.name, size: 18}));
        miscRow.pushTd("name");
        this.form1.append(miscRow.get());
        this.numShownFunsInMouseTableTd = $("#numShownFunsInMouseTableTd");
        this.numShownFunsInMouseTableSelect = document.getElementById("numShownFunsInMouseTableSelect");
        var firstValue = this.numShownFunsInMouseTableTd.children().children(":nth-child(1)").text()-0;
        this.numShownFunsInMouseTableSelect.selectedIndex = this.maxNumFunsInMouseTable - firstValue;
    },
    numRatsChange : function(elt){
        var first = firstOptionText("numRatsSelect") - 0;
        this.numRats = elt.selectedIndex + first;
        var tau2Info = this.errPoly.findTau2Rats(this.numRats);
        this.tau2ButtonRats = tau2Info.tau2Rats;
        this.makeTau2Table();
    },
    makeTau2Table : function(){
        var caption = "tau2 (rational value/s)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ";
        caption += HtmlGen.select(range(5, 13), { id: "numRatsSelect", onchange: "PhuForm.numRatsChange(this);"});
        caption += " &nbsp; numTau2Rats";
        this.tau2Table.html(HtmlGen.caption(caption)); 
        setSelectedIndex("numRatsSelect", this.numRats - firstOptionText("numRatsSelect"));
        var tau2CaptionRow = new HtmlGen.TR();
        var tau2RadioRow = new HtmlGen.TR();
        var tau2CheckRow = new HtmlGen.TR();
        var spoRow = new HtmlGen.TR();
        this.rationalTau2String = ( this.rationalTau2 ? this.rationalTau2.toString() : "" );
        tau2CaptionRow.pushTd(HtmlGen.text({ id: "rationalTau2", value: this.rationalTau2String, size: 13}));
        tau2RadioRow.pushTd("set tau2 =");
        tau2CheckRow.pushTd("include button for");
        spoRow.pushTd("steps per octave");
        var octPart = $("#matrixX0")[0].value - 0;
        for ( var i=0; i<this.tau2ButtonRats.length; i ++ ){
            var rat = this.tau2ButtonRats[i];
            var caption = rat.toString();
            var radioId = "radio" + rat.toStringSpecial();
            var checkId = "check" + rat.toStringSpecial();
            var radioChecked = rat.equals(this.rationalTau2);
            var checkboxChecked = true;
            tau2CaptionRow.pushTh(caption);
            tau2RadioRow.pushTd(HtmlGen.radio("", { id: radioId, name: "tau2Radios" }, radioChecked));
            tau2CheckRow.pushTd(HtmlGen.checkbox(checkboxChecked, { id: checkId}, ""));
            spoRow.pushTd(lcm(octPart, rat.deno));
        }
        $(tau2CaptionRow.get()).appendTo(this.tau2Table);
        $(tau2RadioRow.get()).appendTo(this.tau2Table);
        $(tau2CheckRow.get()).appendTo(this.tau2Table);
        $(spoRow.get()).appendTo(this.tau2Table);
        for ( var i=0; i<this.tau2ButtonRats.length; i ++ ){
            var rat = this.tau2ButtonRats[i];
            $("#radio" + rat.toStringSpecial()).change(this.makeTau2RadioHandler(rat));
            $("#check" + rat.toStringSpecial()).change(this.makeTau2CheckHandler(rat));
        }
        $("#rationalTau2")[0].onkeyup = this.rationalTau2TextChange;
    },
    createTauSliders : function(){
        Slider.createEdgeAcceleratedSlider(this, "tau2Min", "tau2Val", "tau2Max", this.tau2SliderAcceleration, "sliderTable", "tau2:", "tau2Slider", this.sliderWidth,
            this.tau2SliderSlide, this.tau2SliderStop, this.tau2ValToHtml);
        Slider.createEdgeAcceleratedSlider(this, "tau1Min", "tau1Val", "tau1Max", this.tau1SliderAcceleration, "sliderTable", "tau1:", "tau1Slider", this.sliderWidth, 
            this.tau1SliderSlide, this.tau1SliderStop, this.tau1ValToHtml);
    },
    reCreateTauSliders : function(){
        if ( $("#tau2Slider").length ){
            $("#tau2Slider").parent().parent().remove();
            $("#tau1Slider").parent().parent().remove();
            var otherSliders = this.sliderTable.children().children().detach();
            this.createTauSliders();
            otherSliders.appendTo(this.sliderTable);
        } else {
            this.createTauSliders();
        }
        this.drawErrorGraph(true);
    },
    createForm : function(params){
        importSecondIntoFirst(this, params);
        importUnlessGiven(this, Defaults);
        if ( "tau2ButtonRats" in this ){
            this.numRats = this.tau2ButtonRats.length;
        }
        odRangeCheck.call(this);
        // first row
        this.makeMiscTable();
        // matrix stuff
        if ( this.computeTauStuff ){
            this.setMatrix(this.matrix);
        } else {
            this.errPoly = calculateErrorPolynomial(this.matrix, this.numPrimes);            
        }
        this.errorGraphCentRange = 4000 * this.errPoly.minMse;
        this.createMatrixTable(this.matrix, this.numPrimes);
        this.matrixFieldSet.append(HtmlGen.btn("fewer primes", { id: "fewerPrimesBtn", onclick: "PhuForm.fewerPrimes();"}));
        this.matrixFieldSet.append("&nbsp;&nbsp;");
        this.matrixFieldSet.append(HtmlGen.btn("more primes", { id: "morePrimesBtn", onclick: "PhuForm.morePrimes();"}));
        this.matrixFieldSet.append("&nbsp;&nbsp;");
        this.matrixFieldSet.append(HtmlGen.btn("commit matrix change", { id: "commitMatrixChangeBtn", onclick: "PhuForm.commitMatrixChange();"}));
        // to do : "matrix wizard"
        // tables
        this.form.append(HtmlGen.table("", { id:"tau2Table", cellspacing: "2", border: "2" })); this.tau2Table = $("#tau2Table");
        this.form.append(HtmlGen.table("", { id:"sliderTable"})); this.sliderTable = $("#sliderTable");
        // rationalTau2
        this.makeTau2Table();
        this.tau2MinMin = this.tau2Mini = this.tau2Min;
        this.tau2MaxMax = this.tau2Maxi = this.tau2Max;
        // sliders
        this.createTauSliders();
        Slider.createEdgeAcceleratedSlider(this, "shiftXMin", "shiftXVal", "shiftXMax", this.shiftSliderAcceleration, "sliderTable", "shift-X:", "shiftXSlider", 
            this.sliderWidth, this.shiftXSliderSlide, this.shiftXSliderStop, "%d", true);
        Slider.createEdgeAcceleratedSlider(this, "shiftYMin", "shiftYVal", "shiftYMax", this.shiftSliderAcceleration, "sliderTable", "shift-Y:", "shiftYSlider", 
            this.sliderWidth, this.shiftYSliderSlide, this.shiftYSliderStop, "%d", true);
        Slider.createExponentialSlider(this, "zoomMin", "zoomVal", "zoomMax", "sliderTable", "zoom:", "zoomSlider", this.sliderWidth, this.zoomSliderSlide, this.zoomSliderStop, "%5.1f");
        Slider.createLinearSlider(this, "rotMin", "rotVal", "rotMax", "sliderTable", "rotation:", "rotSlider", this.sliderWidth, this.rotSliderSlide, this.rotSliderStop, this.rotSliderFormat);
        Slider.createExponentialSlider(this, "logComplMin", "logComplVal", "logComplMax", "sliderTable", "maxComplexity:", "maxComplSlider",
            this.sliderWidth, this.maxComplSliderSlide, this.maxComplSliderStop, "%6.3f");
        Slider.createExponentialRangeSlider(this, "octDistMinMin", "octDistMin", "octDistMax", "octDistMaxMax", "sliderTable", "OD-Range", "octDistRangeSlider",
            this.sliderWidth, this.octDistRangeSliderSlide,this.octDistRangeSliderStop,"%5.2f - %5.2f");
        Slider.createExponentialSlider(this, "latticeMaxTanTiltMin", "latticeMaxTanTiltVal", "latticeMaxTanTiltMax", "sliderTable", "maxTanTilt", "latticeMaxTanTiltSlider",
            this.sliderWidth, this.latticeMaxTanTiltSliderSlide, this.latticeMaxTanTiltSliderStop, "%4.2f");
        this.makeODandTiltSliders();
        this.form.append(HtmlGen.table("", { id:"canvasTable"})); this.canvasTable = $("#canvasTable");
        var canvasRow = new HtmlGen.TR();
        canvasRow.pushTd(HtmlGen.canvas({ width: 450, height: 300, id: "octDistTiltCanvas"}));
        canvasRow.pushTd(HtmlGen.canvas({ width: 250, height: 300, id: "hexagonCanvas"}));
        $(canvasRow.get()).appendTo(this.canvasTable);
        this.odtCanvas = document.getElementById("octDistTiltCanvas");
        this.odtCtx = this.odtCanvas.getContext("2d");
        this.hexCanvas = document.getElementById("hexagonCanvas");
        this.hexCtx = this.hexCanvas.getContext("2d");
        this.drawLattice();
        this.form.append(HtmlGen.btn("refresh graphics", { id: "refreshGraphicsBtn", onclick: "PhuForm.refreshGraphics();"}));
        this.form2.append(HtmlGen.span("", {id : "errorGraphXY"}));
        this.form2.append("<br/>");
        this.form2.append(HtmlGen.btn("generate url", { id: "generateUrlBtn", onclick: "PhuForm.generateUrl();"}));
        this.form2.append("&nbsp;&nbsp;&nbsp;&nbsp;");
        this.form2.append(HtmlGen.btn("open in opener", { id: "openInOpenerBtn", onclick: "PhuForm.openInOpener();"}));
        this.form2.append("&nbsp;&nbsp;&nbsp;&nbsp;");
        this.form2.append(HtmlGen.btn("open in new window", { id: "openInNewWindowBtn", onclick: "PhuForm.openInNewWindow();"}));
        this.form2.append("&nbsp;&nbsp;&nbsp;&nbsp;");
        this.form2.append(HtmlGen.checkbox(true, { id: "autoCloseCheckbox"}, "auto close"));
        this.form2.append("&nbsp;&nbsp;&nbsp;&nbsp;");
        this.form2.append(HtmlGen.checkbox(true, { id: "omitDefaultsCheckbox"}, "omit defaults"));
        this.form2.append("<br/>");
        this.form2.append(HtmlGen.textarea({ id: "urlTextArea", rows: "4", cols: "85"}));
        $("#octDistRangeSliderValue").addClass("nobr");
        this.makeErrorGraphFracChooserTable();
        this.addInitialErrorGraphFracs();
        this.drawErrorGraph(true);
        this.makeErrorGraphSliderTable();
        $(document).mousemove(this.mouseMove);
    },
    addInitialErrorGraphFracs : function(){
        this.egfcTableAddRow(); document.getElementById("egfcFrac0").value = "3/2"; document.getElementById("egfcPattern0").value = "";
        if ( this.numPrimes <= 2 ) return;
        this.egfcTableAddRow(); document.getElementById("egfcFrac1").value = "5/4"; document.getElementById("egfcPattern1").value = "[2,2]";
        if ( this.numPrimes <= 3 ) return;
        this.egfcTableAddRow(); document.getElementById("egfcFrac2").value = "7/4"; document.getElementById("egfcPattern2").value = "[6,6]";
        if ( this.numPrimes <= 4 ) return;
        this.egfcTableAddRow(); document.getElementById("egfcFrac3").value = "11/8"; document.getElementById("egfcPattern3").value = "[8,3,3,3]";
        if ( this.numPrimes <= 5 ) return;
        this.egfcTableAddRow(); document.getElementById("egfcFrac4").value = "13/8"; document.getElementById("egfcPattern4").value = "[11,3,3,3,3,3]";
    },
    errGrFrRowCount : 0,
    errorGraphFracs : {},
    egfcTableAddRow : function(){
        var index = this.errGrFrRowCount;
        var row = new HtmlGen.TR({ index: index });
        var alignCenter = { align: "center" };
        row.pushTd(HtmlGen.text({id: "egfcFrac" + index, size: 6}), alignCenter);
        row.pushTd(HtmlGen.text({id: "egfcLocus" + index, size: 6}), alignCenter);
        row.pushTd(HtmlGen.text({id: "egfcPattern" + index, size: 13}), alignCenter);
        row.pushTd(HtmlGen.canvas({id: "egfcPatCanvas" + index, width: 110, height: 16}), alignCenter);
        row.pushTd(
            HtmlGen.inputBtn(" ", { id: "egfcColorBtn" + index, index: index, onclick: "PhuForm.egfcColorBtnClick(this);"})
            + HtmlGen.div("", { id: "cgfcColorPicker" + index, index: index}),
        alignCenter);
        row.pushTd(HtmlGen.inputBtn(" ", {id: "egfcRemove" + index, index: index, onclick: "PhuForm.egfcRemoveRow(this);"}), alignCenter);
        $(row.get()).appendTo(this.errorGraphFracChooserTable);
        $("#cgfcColorPicker" + index).ColorPicker({onSubmit: PhuForm.egfcColorPickerSubmit}).ColorPickerSetColor("#000000");
        $("#egfcColorBtn" + index).css("background-color", "#000000");
        this.errGrFrRowCount++;
    },
    egfcColorBtnClick : function(btn){
        var b = $(btn); 
        var index = b.attr("index") - 0;
        b.hide();
        $("#errorCentSlider").parent().parent().hide();
        $("#cgfcColorPicker" + index).ColorPickerShow();
    },
    egfcColorPickerSubmit : function(hsb, hex, rgb, el){
        //foo = { hsb : hsb, hex : hex, rgb : rgb, el : el };
        var index = $(el).attr("index") - 0;
        $(el).ColorPickerHide();
        var btn = $("#egfcColorBtn" + index); 
        btn.css("background-color", "#" + hex);
        btn.show();
        $("#errorCentSlider").parent().parent().show();
        PhuForm.drawErrorGraph(true);
    },
    egfcRemoveRow : function(btn){
        var doomed = $(btn).attr("index") - 0;
        delete this.errorGraphFracs[doomed];
        $(btn).parent().parent().remove();
    },
    makeErrorGraphFracChooserTable : function(){
        this.form3.append(HtmlGen.table("", { id:"errorGraphFracChooserTable"})); this.errorGraphFracChooserTable = $("#errorGraphFracChooserTable");
        var header = new HtmlGen.TR();
        header.pushTh("fraction");
        header.pushTh("location");
        header.pushTh("pattern", {colspan : 2});
        header.pushTh("color");
        header.pushTh("remove");
        $(header.get()).appendTo(this.errorGraphFracChooserTable);
        this.form3.append(HtmlGen.btn("add row", { onclick: "PhuForm.egfcTableAddRow();"}));
        this.form3.append("&nbsp;");
        this.form3.append(HtmlGen.btn("refresh", { onclick: "PhuForm.drawErrorGraph(true);"}));
        //this.form3.append(HtmlGen.checkbox(false, { id: "showMSECheck"}, "show mean squared error"));
    },
    centRangeMin : 0.01,
    centRangeMax : 70,
    errorGraphCentRange : 10,
    makeErrorGraphSliderTable : function(){
        var width = 520;
        this.form3.append(HtmlGen.table("", { id:"errorGraphSliderTable"})); this.errorGraphSliderTable = $("#errorGraphSliderTable");
        Slider.createExponentialSlider(this, "centRangeMin", "errorGraphCentRange", "centRangeMax", "errorGraphSliderTable", "cent range", "errorCentSlider", width,
            this.centRangeSliderSlide, this.centRangeSliderStop, "%7.4f" + HtmlSymbols.cent);
        Slider.createEdgeAcceleratedRangeSlider(this, "tau2MinMin", "tau2Mini", "tau2Maxi", "tau2MaxMax", 2, "errorGraphSliderTable", "tau2 range", "tau2RangeSlider", width,
            this.tau2RangeSliderSlide, this.tau2RangeSliderStop, this.tau2RangeToHtml, false);
    },
    tau2RangeSliderSlide : function(){
        this.drawErrorGraph(false);
    },
    tau2RangeSliderStop : function(){
        this.drawErrorGraph(true);
    },
    centRangeSliderSlide : function(){
        this.drawErrorGraph(false);
    },
    centRangeSliderStop : function(){
        this.drawErrorGraph(true);
    },
    updateErrorGraphFracs : function(){
        this.errorGraphFracs = {};
        var rows = $("#errorGraphFracChooserTable tr[index]");
        for ( var i=0; i<rows.length; i++ ){
            var row = $(rows[i]);
            var index = row.attr("index");
            var errGrFr = this.getErrGrFr(index);
            if ( "error" in errGrFr ){
            } else {
                this.errorGraphFracs[index] = errGrFr;
                var ctx = canvasCtxFromId("egfcPatCanvas" + index);
                ctx.canvas.width = ctx.canvas.width;
                var y = ctx.canvas.height/2;
                dottedLine(ctx, 0, y, ctx.canvas.width, y, errGrFr.pattern, errGrFr.color);
            }
        }
    },
    drawErrorGraph : function(showMSE){
        this.updateErrorGraphFracs();
        this.errorGraphCanvas.width = this.errorGraphCanvas.width;
        ErrorGraph.init1(this.tau2Mini, this.tau2Maxi, -this.errorGraphCentRange, this.errorGraphCentRange);
        ErrorGraph.drawXAxis();
        ErrorGraph.drawYAxis();
        var matrix = this.readMatrix();
        for ( var i in this.errorGraphFracs ){
            var errGrFr = this.errorGraphFracs[i];
            var f = errGrFr.f;
            var pattern = errGrFr.pattern;
            var perfectTuning = Math.log(f.value)/Math.LN2;
            var u = 0, v = 0;
            for ( var j=0; j<matrix.length; j++ ){
                u += matrix[j][0] * f.expons[j];
                v += matrix[j][1] * f.expons[j];
            }
            document.getElementById("egfcLocus" + i).value = arrayToString([u, v]); // to do: if given, read location, rather than writing it. Also inform whether it is compatible with matrix or not, 
            // error = tau1 * u + tau2 * v - perfectTuning                          // and give option to change the matrix accordingly (cf matrix wizard)
            var a = v;
            var b = this.tau1Val * u - perfectTuning;
            a *= 1200;
            b *= 1200;
            ErrorGraph.drawLinearFunction(a, b, pattern, errGrFr.color);
        }
        ErrorGraph.verticalLineAt(this.tau2Val);
        for ( var i=0; i<this.tau2ButtonRats.length; i ++ ){
            var rat = this.tau2ButtonRats[i];
            var val = rat.value();
            if ( val < this.tau2Mini || val > this.tau2Maxi ) continue;
            ErrorGraph.xMarker(rat.value(), rat);
        }
        var errPoly = calculateErrorPolynomial(matrix, this.numPrimes);
        //if ( isChecked("showMSECheck") ){
        if ( showMSE ){
            ErrorGraph.plotMSE(errPoly, this.tau1Val);
        }
        ErrorGraph.yMarkers();
    },
    refreshGraphics : function(){
        var octPart = $("#matrixX0")[0].value - 0;
        if ( !isNaturalNumber(octPart) ){
            return;
        }
        if ( !this.odtc || this.odtc.octavePartition != octPart ){
            this.makeODandTiltSliders();
        }
        this.drawLattice();
    },
    readMatrix : function(){
        var result = new Array();
        for ( var i=0; i<this.numPrimes; i++ ){
            var xValStr = $("#matrixX" + i)[0].value; if ( xValStr.length == 0 ) return null; 
            var yValStr = $("#matrixY" + i)[0].value; if ( yValStr.length == 0 ) return null; 
            result.push([xValStr-0, yValStr-0]);
        }
        if ( !is2DIntegerArray(result) ){
            return null;
        }
        if ( result[0][1] != 0 ){
            return null;
        }
        if ( result[0][0] <= 0 ){
            return null;
        }
        return result;
    },
    computeUrl : function(){
        var octPart = $("#matrixX0")[0].value - 0;
        if ( !isNaturalNumber(octPart) ){
            return "invalid";
        }
        var matrix = this.readMatrix();
        if ( !matrix ){
            return "invalid";
        }
        var url = "phuturePiano.html";
        var numShownFunsInMouseTableSelect = document.getElementById("numShownFunsInMouseTableSelect");
        var atts = {
            name : document.getElementById("tuningName").value,
            matrix : "[" + array2dToString(matrix) + "]",
            shiftX : this.shiftXVal,
            shiftY : this.shiftYVal,
            zoom : this.zoomVal,
            rotation : this.rotVal,
            maxLogCompl : this.logComplVal,
            octDist : this.odVal,
            tilt0 : rad2deg(this.tiltVal),
            maxNumFunsInMouseTable : numShownFunsInMouseTableSelect.selectedIndex + ( $(numShownFunsInMouseTableSelect).children(":nth-child(1)").text()-0 ),
            octDistMin : this.octDistMin,
            octDistMax : this.octDistMax,
            latticeMaxTanTilt : this.latticeMaxTanTiltVal
        };
        if ( document.getElementById("mirroredCheck").checked ){
            atts.mirrored = "true";
        }
        var rationalTau2String = document.getElementById("rationalTau2").value;
        var ratTau2 = numFromString(rationalTau2String);
        // default is not to use the rational value, it might not be there or be invalid
        atts.tau2 = this.tau2Val;
        atts.tau1 = this.tau1Val;
        if ( ratTau2 instanceof fraction ){
            if ( ratTau2.value() > 0 && ratTau2.value() < 1/(2*octPart) ){
                atts.tau2 = ratTau2.toString();
                atts.tau1 = 1/octPart;
            } else {
                // stay with default, because the tau2 value is invalid
            }
        } else {
            // also allow non-rational user input, such as eg 1-Math.log(5)/Math.LN2/4
            if ( ratTau2 != null && !(ratTau2<=0) && !(ratTau2>=1/(2*octPart)) && isANumber(ratTau2) ){
                atts.tau2 = ratTau2;
            } 
        }
        var tau2BtnRats = new Array();
        for ( var i=0; i<this.tau2ButtonRats.length; i++ ){
            var rat = this.tau2ButtonRats[i];
            if ( document.getElementById("check" + rat.toStringSpecial()).checked ){
                tau2BtnRats.push(rat);
            }
        }
        atts.tau2ButtonRats = "[" + arrayToString(tau2BtnRats) + "]";
        url += HtmlGen.makeQueryString2(atts, document.getElementById("omitDefaultsCheckbox").checked ? this.defaults : null);
        return url;
    },
    generateUrl : function(){
        var url = this.computeUrl();
        document.getElementById("urlTextArea").value = url;
    },
    openInOpener : function(){
        var url = this.computeUrl();
        if ( url == "invalid" ){
            document.getElementById("urlTextArea").value = url;
            return;
        }
        window.opener.location.replace(url);
        if ( document.getElementById("autoCloseCheckbox").checked ) window.close();
    },
    openInNewWindow : function(){
        var url = this.computeUrl();
        if ( url == "invalid" ){
            document.getElementById("urlTextArea").value = url;
            return;
        }
        window.open(url, "win" + Math.round(100000000*Math.random()));
        if ( document.getElementById("autoCloseCheckbox").checked ) window.close();
    },
    drawLattice : function(){
        $(document).unbind("click");
        this.odtc = new odTiltChooser(this.odtCtx, Math.atan(this.latticeMaxTanTiltVal), $("#matrixX0")[0].value - 0, this.tau2Val, this.tau1Val, this.latticeBMax, this.latticeBMin);
        this.odtc.draw();
        // show crosshairs
        this.tiltSliderSlide();
        this.octDistSliderSlide();
        setTimeout(function(){ $(document).click(PhuForm.onClick); }, 1);
        this.endRefreshBtnBlink();
    },
    bFromOctDist : function(octDist){
        var octPart = $("#matrixX0")[0].value - 0;
        return square(octPart/octDist);
    },
    octDistFromB : function(octDist){
        var octPart = $("#matrixX0")[0].value - 0;
        return octPart/Math.sqrt(octDist);
    },
    makeODandTiltSliders : function(){
        this.latticeBMax = this.bFromOctDist(this.octDistMin);
        this.latticeBMin = this.bFromOctDist(this.octDistMax);
        this.odMin = this.octDistMin;
        this.odMax = this.octDistMax;
        //this.odVal
        this.tiltMax = Math.atan(this.latticeMaxTanTiltVal);
        this.tiltMin = -this.tiltMax;
        // this.tiltVal 
        var oldOctDistSlider = $("#octDistSlider");
        if ( oldOctDistSlider.length ){
            oldOctDistSlider.parent().parent().remove();
            $("#tiltSlider").parent().parent().remove();
        }
        Slider.createExponentialSlider(this, "odMin", "odVal", "odMax", "sliderTable", "octDist", "octDistSlider", this.sliderWidth, this.octDistSliderSlide,this.octDistSliderStop,"%5.2f");
        Slider.createLinearSlider(this, "tiltMin", "tiltVal", "tiltMax", "sliderTable", "tilt&nbsp;&nbsp;&nbsp;", "tiltSlider", this.sliderWidth, this.tiltSliderSlide, this.tiltSliderStop, this.tilt2html);
        //this.addZeroTiltButton();
    },
    sliderWidth : 505,
    tau2SliderSlide : function(){
        $("#rationalTau2")[0].value = "";
        for ( var i=0; i<this.tau2ButtonRats.length; i ++ ){
            var rat = this.tau2ButtonRats[i];
            $("#radio" + rat.toStringSpecial())[0].checked = false;
        }
        if ( !this.blinker ){ this.startRefreshBtnBlink(); }
        this.drawErrorGraph(false);
    },
    tau2SliderStop : function(){
        this.drawErrorGraph(true);
    },
    tau2ValToHtml : function(value){ return "%8.4f".sprintf(1200*value); },
    tau2RangeToHtml : function(values){ return "%8.3f-%8.3f".sprintf(1200*values[0], 1200*values[1]); },
    tau1SliderSlide : function(){
        if ( !this.blinker ){ this.startRefreshBtnBlink(); }
        this.drawErrorGraph(false);
    },
    tau1SliderStop : function(){
        this.drawErrorGraph(true);
    },
    tau1ValToHtml : function(value){ return "%8.3f".sprintf(1200*value); },
    shiftXSliderSlide : function(){},
    shiftXSliderStop : function(){},
    shiftYSliderSlide : function(){},
    shiftYSliderStop : function(){},
    rotSliderSlide : function(){},
    rotSliderStop : function(){},
    rotSliderFormat : function(value){
        var formatString = "%5.1f" + HtmlSymbols.degree;
        return formatString.sprintf(rad2deg(value));
    },
    maxComplSliderSlide : function(){},
    maxComplSliderStop : function(){},
    zoomSliderSlide : function(){},
    zoomSliderStop : function(){},
    octDistRangeSliderSlide : function(){},
    octDistRangeSliderStop : function(){
        this.makeODandTiltSliders();
        this.drawLattice();
    },
    latticeMaxTanTiltSliderSlide : function(){},
    latticeMaxTanTiltSliderStop : function(){
        this.makeODandTiltSliders();
        this.drawLattice();
    },
    octDistSliderSlide : function(){ this.odtc.lineAtOctDist(this.odVal); this.latticeUpdate(); },
    octDistSliderStop : function(){ this.odtc.lineAtOctDist(this.odVal); this.latticeUpdate(); },
    tiltSliderSlide : function(){ this.odtc.lineAtTilt(this.tiltVal); this.latticeUpdate(); },
    tiltSliderStop : function(){ this.odtc.lineAtTilt(this.tiltVal); this.latticeUpdate(); },
    latticeUpdate : function(){
        var octPart = $("#matrixX0")[0].value - 0;
        var b = this.bFromOctDist(this.odVal);
        //var a = octPart*this.tau2Val - b*Math.tan(this.tiltVal);
        var a = this.tau2Val/this.tau1Val - b*Math.tan(this.tiltVal);
        var lattice = newLattice(a,b);
        showHexInCanvas(this.hexCtx, lattice.vertices);
        this.hexCtx.font = this.font;
        this.hexCtx.fillStyle = "Black";
        var formatString = "hexagonity: %5.3f";
        var txt = formatString.sprintf(lattice.hexagonity);
        try {
            this.hexCtx.fillText(txt, 10, this.hexCtx.canvas.height - 10);
        } catch(e){
            foo = lattice;
        }
    },
    tilt2html : function(value){
        return "%5.2f".sprintf(rad2deg(value)) + HtmlSymbols.degree;
    },
    tau1SliderAcceleration : 5,
    tau2SliderAcceleration : 5,
    shiftSliderAcceleration : 2.3,
    makeTau2RadioHandler : function(rat){
        return function(){
            $("#rationalTau2")[0].value = rat.toString();
            PhuForm.tau2SliderSetTo(rat.value());
            var octPart = $("#matrixX0")[0].value - 0;
            if ( isNaN(octPart) ) return;
            PhuForm.tau1SliderSetTo(1/octPart);
            if ( !PhuForm.blinker ){ PhuForm.startRefreshBtnBlink(); }
            PhuForm.drawErrorGraph(true);
            //PhuForm.updateMse();
            //PhuForm.calcAndSetSPO(tau2);
        }
    },
    makeTau2CheckHandler : function(rat){
        // to do : throw this out later, probably
        return function(){}
    },
    rationalTau2TextChange : function(){
        var num = numFromString(this.value);
        foo = num;
        if ( num == null || num <= 0 || num >= 1/2 ){
            return;
        } else {
            for ( var i=0; i<PhuForm.tau2ButtonRats.length; i ++ ){
                var rat = PhuForm.tau2ButtonRats[i];
                $("#radio" + rat.toStringSpecial())[0].checked = ( rat.equals(num) );
            }
        }
        var sliderVal = ( num instanceof fraction ? num.value() : num );
        sliderVal = Math.max(sliderVal, PhuForm.tau2Min);
        sliderVal = Math.min(sliderVal, PhuForm.tau2Max);
        PhuForm.tau2SliderSetTo(sliderVal);
        if ( !PhuForm.blinker ){ PhuForm.startRefreshBtnBlink(); }
        PhuForm.drawErrorGraph(true);
    },
    font : "16px Times New Roman",
    // mouse stuff
    updatePos : function(evt){
    	var canvasMinX = $("#octDistTiltCanvas").offset().left;
    	var canvasMinY = $("#octDistTiltCanvas").offset().top;
    	this.mouseX = evt.pageX - canvasMinX;
    	this.mouseY = evt.pageY - canvasMinY;
    	var errCanvasMinX = $("#errorGraphCanvas").offset().left;
    	var errCanvasMinY = $("#errorGraphCanvas").offset().top;
    	this.errMouseX = evt.pageX - errCanvasMinX;
    	this.errMouseY = evt.pageY - errCanvasMinY;
    },
    mouseMove: function(evt){
        PhuForm.updatePos(evt);
        var valid = true;
        if ( PhuForm.errMouseX < 0 ) valid = false;
        if ( PhuForm.errMouseX >= ErrorGraph.width ) valid = false;
        if ( PhuForm.errMouseY < 0 ) valid = false;
        if ( PhuForm.errMouseY >= ErrorGraph.height ) valid = false;
        var foo = [valid, PhuForm.errMouseX, PhuForm.errMouseY];
        if ( valid ){
            var tau2 = ErrorGraph.xRawToActual(PhuForm.errMouseX);
            var errorCent = ErrorGraph.yRawToActual(PhuForm.errMouseY);
            var formatString = "tau2=%8.6f = %8.3f" + HtmlSymbols.cent + " &nbsp;&nbsp; error=%7.3f" + HtmlSymbols.cent;
            $("#errorGraphXY").html(formatString.sprintf(tau2, 1200*tau2, errorCent));
        } else {
            $("#errorGraphXY").html("");
        }
    },
    onClick : function(evt){
        PhuForm.updatePos(evt);
        if ( PhuForm.mouseX < 0 ) return;
        if ( PhuForm.mouseX >= PhuForm.odtc.width ) return;
        if ( PhuForm.mouseY < 0 ) return;
        if ( PhuForm.mouseY >= PhuForm.odtc.height ) return;
        var info = LatticeFromMouseCoords.call(PhuForm.odtc, PhuForm.mouseX, PhuForm.mouseY);
        var a,b;
        var perf = false;
        var tilt;
        if ( info.perfect ){
            a = info.perfect.a;
            b = info.perfect.b;
            perf = info.perfect.type;
            tilt = info.perfect.tilt;
        } else {
            a = info.a;
            b = info.b;
            tilt = info.tilt;
        }
        var octDist = PhuForm.octDistFromB(b);
        PhuForm.octDistSliderSetTo(octDist);
        PhuForm.tiltSliderSetTo(tilt);
        PhuForm.odtc.lineAtOctDist(PhuForm.odVal);
        PhuForm.odtc.lineAtTilt(PhuForm.tiltVal);
        PhuForm.latticeUpdate();
        if ( perf ){
            var ip = info.perfect;
            var aString = ip.toString();
            var uvString = "[" + array2dToString([[ip.u1, ip.v1], [ip.u2, ip.v2]]) + "]";
            var bString = ( perf == "hexagon" ? "sqrt(3)" : "1" ) + "/" + ip.denom;
            var txt1 = perf + " a=" + aString + " b=" + bString;
            var txt2 = "uvMat=" + uvString;
            PhuForm.hexCtx.fillText(txt1, 10, PhuForm.hexCtx.canvas.height - 32);            
            PhuForm.hexCtx.fillText(txt2, 10, PhuForm.hexCtx.canvas.height - 54);            
        }
    },
    normalFontSize : { fontSize : "14px" },
    biggerFontSize : { fontSize : "18px" },
    refreshBtnIsBig : false,
    blinker : null,
    toggleRefreshBtn : function(){
        this.refreshBtnIsBig = !this.refreshBtnIsBig;
        $("#refreshGraphicsBtn").css(this.refreshBtnIsBig ? this.biggerFontSize : this.normalFontSize);
    },
    startRefreshBtnBlink : function(){
        this.blinker = setInterval("PhuForm.toggleRefreshBtn();", 1000);
    },
    endRefreshBtnBlink : function(){
        if ( !this.blinker ) return;
        clearInterval(this.blinker);
        if ( this.refreshBtnIsBig ){
            this.toggleRefreshBtn();
        }
        this.blinker = null;
    },
    getErrGrFr : function(index){
        var fracString = document.getElementById("egfcFrac" + index).value;
        var f = frac.prototype.fromString(fracString, this.numPrimes);
        if ( !f ){
            return { error: "invalid fraction for error graph"};
        }
        var patternString = document.getElementById("egfcPattern" + index).value;
        var pattern = null;
        if ( patternString.length > 0 ){
            pattern = integerArrayFromString(patternString);
            if ( !pattern ){
                return { error: "pattern must be an array of integers, eg. [5,5,2,2]"}
            }
        }
        var color = $("#egfcColorBtn" + index).css("backgroundColor");
        return new ErrGrFr(f, pattern, color);
    }
}
function ErrGrFr(f, pat, color){
    // a fraction and a pattern for the error graph
    this.f = f;
    this.pattern = pat;
    this.color = color;
}
