// htmlGeneratorTools.js
HtmlGen = {
    nodeWithAtts : function(tagName, content, atts){
        if ( arguments.length < 3 ) atts = {};
        var openTag =  "<" +tagName;
        for ( var attName in atts ){
            openTag += " ";
            openTag += attName;
            openTag += '="';
            openTag += atts[attName];
            openTag += '"';
        }
        openTag += ">";
        var closeTag =  "</" +tagName+ ">";
        return openTag + content + closeTag;
    },
    checkbox : function(checked, atts, content){
        if ( arguments.length < 3 ){
            content = "";
        }
        if ( arguments.length < 2 ){
            atts = {};
        }
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "checkbox";
        if ( checked ){
            attsClone.checked = "yes";
        }
        return this.nodeWithAtts("input", content, attsClone);
    },
    makeTable : function(rows){
        var result = "<table>";
        for ( var i=0; i<rows.length; i++ ){
            result += rows[i];
        }
        result += "</table>";
        return result;
    },
    makeTableRow : function(cols, attobjVec){
        var result = "<tr>";
        if ( arguments.length < 2 ){
            for ( var i=0; i<cols.length; i++ ){
                result += this.td(cols[i]);
            }
        } else {
            for ( var i=0; i<cols.length; i++ ){
                result += this.td(cols[i], attobjVec[i]);
            }
        }
        result += "</tr>";
        return result;
    },
    makeTableHeaderRow : function(cols){
        var result = "<tr>";
        for ( var i=0; i<cols.length; i++ ){
            result += this.makeTableHeaderCol(cols[i]);
        }
        result += "</tr>";
        return result;
    },
    tr : function(content, atts){
        return this.nodeWithAtts("tr", content, atts);
    },
    td : function(content, atts){
        return this.nodeWithAtts("td", content, atts);
    },
    th : function(content, atts){
        return this.nodeWithAtts("th", content, atts);
    },
    caption : function(content, atts){
        return this.nodeWithAtts("caption", content, atts);
    },
    table : function(content, atts){
        return this.nodeWithAtts("table", content, atts);
    },
    spacerTable : function(height){
        return this.table("<tr/>", { width: "100%", height: height});
    },
    div : function(content, atts){
        return this.nodeWithAtts("div", content, atts);
    },
    span : function(content, atts){
        return this.nodeWithAtts("span", content, atts);
    },
    canvas : function(atts){
        return this.nodeWithAtts("canvas", "", atts);
    },
    select : function(optionsArr, atts){
        var sel = new this.SELECT(atts);
        sel.pushOptionsArr(optionsArr);
        return sel.get();
    },
    option : function(content, atts){
        return this.nodeWithAtts("option", content, atts);
    },
    inputBtn : function(content, atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "button";
        return this.nodeWithAtts("input", content, attsClone);
    },
    text : function(atts){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "text";
        return this.nodeWithAtts("input", "", attsClone);
    },
    textarea : function(atts){
        return this.nodeWithAtts("textarea", "", atts);
    },
    btn : function(content, atts){
        return this.nodeWithAtts("button", content, atts);
    },
    makeTableHeaderCol : function(content){
        return "<th>" + content + "</th>";
    },
    makeSpan : function(id, content){
        if ( arguments.length < 2 ) content = "";
        var result = '<span id="' +id+ '">'
        result += content;
        result += "</span>";
        return result;
    },
    makeDiv : function(id, content){
        if ( arguments.length < 2 ) content = "";
        var result = '<div id="' +id+ '">'
        result += content;
        result += "</div>";
        return result;
    },
    makeTextInput : function(id){
        return '<input id=' +id+ ' type="text"/>';
    },
    makeRadio : function(name, checked){
        if ( checked ){
            return '<input name=' +name+ ' type="radio" checked="checked"/>';
        } else {
            return '<input name=' +name+ ' type="radio"/>';
        }
    },
    radio : function(content, atts, checked){
        var attsClone = {};
        for ( var attName in atts ){
            attsClone[attName] = atts[attName];
        }
        attsClone.type = "radio";
        if ( checked ){
            attsClone.checked = "yes";
        }
        return this.nodeWithAtts("input", content, attsClone);
    },
    makeRadioWithId : function(name, id, checked, content){
        if ( arguments.length <= 3 ){
            content = "";
        }
        if ( checked ){
            return this.nodeWithAtts("input", content, {id : id, name : name, type : "radio", checked : "checked"});
        } else {
            return this.nodeWithAtts("input", content, {id : id, name : name, type : "radio"});
        }
    },
    makeLabel : function(forWhat, name){
        return this.nodeWithAtts("label", name, { "for" : forWhat});
    },
    makeRadioGroup : function(name, ids, labels, checkedIndex, mode){
        // make a simple radio group, consisting of a div tag, with the given name as id
        // (all radio tags of course all have the same name.)
        // and alternating labels and radio inputs
        // give a negative number for checkedIndex in order to have no radio checked
        // ids and labels must be arrays of the same length
        // mode = "labelLeft" gives labels to the left
        // mode = "labelRight" gives labels to the right
        // mode = something else gives no label tags, instead the label is the text content of the radio node
        var content = "";
        var withLabels = ( ( mode == "labelLeft" ) || ( mode == "labelRight" ) );
        var left = ( mode == "labelLeft" );
        for ( var i=0; i<ids.length; i++ ){
            var id = ids[i]; var label = labels[i]; var isChecked = ( i == checkedIndex );
            if ( withLabels ){
                var labelTag = this.makeLabel(id, label);
                var radioTag = this.makeRadioWithId(name, id, isChecked);
                if ( left ){
                    content += labelTag + radioTag;
                } else {
                    content += radioTag + labelTag;
                }
            } else {
                content += this.makeRadioWithId(name, id, isChecked, label);
            }
        }
        return this.makeDiv(name, content);
    },
    makeButton : function(id, onclick, title){
        return '<button id="' +id+ '" onclick="' +onclick+ '">' +title+ "</button>" 
    },
    makeQueryString : function (atts){
        var result = "?";
        var seperator = "";
        for ( var attName in atts ){
            result += seperator;
            result += attName;
            result += '=';
            result += atts[attName];
            seperator = "&";
        }
        return result;
    },
    makeQueryString2 : function (atts, defaults){
        // same as makeQueryString, but excludes attributes
        // which occur (with the same value) in defaults
        if ( !defaults ){
            return this.makeQueryString(atts);
        }
        var nonDefaultAtts = {};
        for ( attName in atts ){
            if ( attName in defaults && atts[attName] == defaults[attName] ) continue;
            nonDefaultAtts[attName] = atts[attName];
        }
        var result = "?";
        var seperator = "";
        for ( var attName in nonDefaultAtts ){
            result += seperator;
            result += attName;
            result += '=';
            result += nonDefaultAtts[attName];
            seperator = "&";
        }
        return result;
    },
    makeLabeledSliderRow : function(UI, tableName, label, sliderId, valueId, space){
        if ( arguments.length < 5 ){
            valueId = sliderId + "Value";
        }
        if ( arguments.length < 6 ){
            space = "9px";
        }
        var labelCol = this.td(label);
        var spacerCol = this.td("", {width : space});
        var sliderCol = this.td(this.div("", { id: sliderId }));
        var sliderValueCol = this.td(this.span("", { id: valueId }));
        //for some reason, this doesn't work: var row = "<tr>" + labelCol + spacerCol + sliderCol + spacerCol + sliderValueCol + "</tr>"; $(row).appendTo(this.UITable);
        var row = $("<tr></tr>");
        $(labelCol).appendTo(row);
        $(spacerCol).appendTo(row);
        $(sliderCol).appendTo(row);
        $(spacerCol).appendTo(row);
        $(sliderValueCol).appendTo(row);
        row.appendTo(UI[tableName]);
        UI[sliderId] = $("#" + sliderId);
        UI[valueId] = $("#" + valueId);
    }
};
Slider = {
    makeExponentialRawToActualFun : function(min, lambda){
        return function(raw){
            return min * Math.exp(lambda * raw);
        };
    },
    makeExponentialActualToRawFun : function(min, lambda){
        return function(actual){
            return Math.log( actual / min ) / lambda;
        };
    },
    makeLinearRawToActualFun : function(min, slope){
        return function(raw){
            return min + slope * raw;
        };
    },
    makeLinearActualToRawFun : function(min, slope){
        return function(actual){
            return ( actual - min ) / slope;
        };
    },
    makeEdgeAcceleratedRawToActualFun : function(lambda, C, mid){
        return function(raw){
            var temp = lambda * raw;
            return mid + C * ( Math.exp(temp) - Math.exp(-temp) );
        };
    },
    makeEdgeAcceleratedRawToActualFunRounded : function(lambda, C, mid){
        return function(raw){
            var temp = lambda * raw;
            return Math.round( mid + C * ( Math.exp(temp) - Math.exp(-temp) ) );
        };
    },
    makeEdgeAcceleratedActualToRawFun : function(lambda, C, mid){
        var twoC = 2*C;
        return function(actual){
            var y = actual - mid;
            var temp = ( y + Math.sqrt(y*y + 4*C*C) ) / twoC;
            return Math.log(temp) / lambda;
        };
    },
    makeRangeSliderChangeFunction : function(UI, minValName, maxValName, rawToActualFun, labelChangeFun){
        return function(event, ui){
            UI[minValName] = rawToActualFun(ui.values[0]);
            UI[maxValName] = rawToActualFun(ui.values[1]);
            labelChangeFun.call(UI);
        }; 
    },
    makeSliderChangeFunction : function(UI, valName, rawToActualFun, labelChangeFun){
        return function(event, ui){
            UI[valName] = rawToActualFun(ui.value);
            labelChangeFun.call(UI);
        }; 
    },
    makeSetRangeSliderLabelFunction : function(minValName, maxValName, labelName, valuesToHtmlFunOrFormatString){
        var formatString = "";
        var valuesToHtmlFun;
        if ( !valuesToHtmlFunOrFormatString ){
            formatString = "%6.3f - %6.2f";
        } else {
            if ( typeof valuesToHtmlFunOrFormatString == "string" ){
                formatString = valuesToHtmlFunOrFormatString;
            }
        }
        if ( formatString != "" ){
            valuesToHtmlFun = this.makeRangeSprintf(formatString);
        } else {
            valuesToHtmlFun = valuesToHtmlFunOrFormatString;
        }
        return function(){
            this[labelName].html( valuesToHtmlFun.call(this, [this[minValName], this[maxValName]]) );
        }
    },
    makeSetSliderLabelFunction : function(valName, labelName, valToHtmlFun){
        var formatString = "";
        if ( !valToHtmlFun ){
            formatString = "%6.3f";
        } else {
            if ( typeof valToHtmlFun == "string" ){
                formatString = valToHtmlFun;
            }
        }
        if ( formatString != "" ){
            valToHtmlFun = this.makeSprintf(formatString);
        }
        return function(){
            this[labelName].html( valToHtmlFun.call(this, this[valName]) );
        }
    },
    makeSprintf : function(formatString){
        return function(value){
            return formatString.sprintf(value);
        }
    },
    makeRangeSprintf : function(formatString){
        return function(values){
            return formatString.sprintf(values[0], values[1]);
        }
    },
    createExponentialRangeSlider : function(UI, minminName, minName, maxName, maxmaxName, tableName, label, id, width, slideCallBack, stopCallBack, valuesToHtmlFunOrFormatString){
        var minmin = UI[minminName];
        var min    = UI[minName];
        var max    = UI[maxName];
        var maxmax = UI[maxmaxName];
        var lambda = Math.log(maxmax / minmin);
        var valueId = id + "Value";
        HtmlGen.makeLabeledSliderRow(UI, tableName, label, id, valueId);
        UI[id].width(width);
        var r2a = this.makeExponentialRawToActualFun(minmin, lambda);
        var a2r = this.makeExponentialActualToRawFun(minmin, lambda);
        var setValLabel = this.makeSetRangeSliderLabelFunction(minName, maxName, valueId, valuesToHtmlFunOrFormatString);
        var onSliCh = this.makeRangeSliderChangeFunction(UI, minName, maxName, r2a, setValLabel);
        //var sliderChangeFunctionName = id + "Change";
        //UI[sliderChangeFunctionName] = onSliCh;
        var sliderOptions = {
    		range: true,
    		min: 0,
    		max: 1,
    		values: [ a2r(min), a2r(max) ],
            step: 0.000001,
    		slide: ( slideCallBack ? 
                function( event, ui ) { onSliCh(event, ui); slideCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } ),                
    		stop: ( stopCallBack ? 
                function( event, ui ) { onSliCh(event, ui); stopCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } )                
        };
        UI[id].slider(sliderOptions);
        setValLabel.call(UI);
    },
    createExponentialSlider : function(UI, minName, valName, maxName, tableName, label, id, width, slideCallBack, stopCallBack, valToHtmlFunOrFormatString){
        var min = UI[minName];
        var val = UI[valName];
        var max = UI[maxName];
        var lambda = Math.log(max / min);
        var valueId = id + "Value";
        HtmlGen.makeLabeledSliderRow(UI, tableName, label, id, valueId);
        UI[id].width(width);
        var r2a = this.makeExponentialRawToActualFun(min, lambda);
        var a2r = this.makeExponentialActualToRawFun(min, lambda);
        var setValLabel = this.makeSetSliderLabelFunction(valName, valueId, valToHtmlFunOrFormatString);
        var onSliCh = this.makeSliderChangeFunction(UI, valName, r2a, setValLabel);
        var sliderOptions = {
    		min: 0,
    		max: 1,
    		value: a2r(val),
            step: 0.000001,
    		slide: ( slideCallBack ? 
                function( event, ui ) { onSliCh(event, ui); slideCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } ),                
    		stop: ( stopCallBack ? 
                function( event, ui ) { onSliCh(event, ui); stopCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } )                
        };
        UI[id].slider(sliderOptions);
        setValLabel.call(UI);
        UI[id + "SetTo"] = this.makeSetSliderToValFun(UI, id, a2r, valName, setValLabel);
    },
    createLinearSlider : function(UI, minName, valName, maxName, tableName, label, id, width, slideCallBack, stopCallBack, valToHtmlFunOrFormatString){
        var min = UI[minName];
        var val = UI[valName];
        var max = UI[maxName];
        var slope = max - min;
        var valueId = id + "Value";
        HtmlGen.makeLabeledSliderRow(UI, tableName, label, id, valueId);
        UI[id].width(width);
        var r2a = this.makeLinearRawToActualFun(min, slope);
        var a2r = this.makeLinearActualToRawFun(min, slope);
        var setValLabel = this.makeSetSliderLabelFunction(valName, valueId, valToHtmlFunOrFormatString);
        var onSliCh = this.makeSliderChangeFunction(UI, valName, r2a, setValLabel);
        var sliderOptions = {
    		min: 0,
    		max: 1,
    		value: a2r(val),
            step: 0.000001,
    		slide: ( slideCallBack ? 
                function( event, ui ) { onSliCh(event, ui); slideCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } ),                
    		stop: ( stopCallBack ? 
                function( event, ui ) { onSliCh(event, ui); stopCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } )                
        };
        UI[id].slider(sliderOptions);
        setValLabel.call(UI);
        UI[id + "SetTo"] = this.makeSetSliderToValFun(UI, id, a2r, valName, setValLabel);
    },
    createEdgeAcceleratedSlider : function(UI, minName, valName, maxName, acceleration, tableName, label, id, width, slideCallBack, stopCallBack, valToHtmlFunOrFormatString, roundToInteger){
        // acceleration must be greater than 1. It says how much faster the value changes at the edges of the slider, 
        // compared to the rate of change in the center of the slider.
        var valueId = id + "Value";
        HtmlGen.makeLabeledSliderRow(UI, tableName, label, id, valueId);
        UI[id].width(width);
        var a = acceleration;
        var min = UI[minName];
        var val = UI[valName];
        var max = UI[maxName];
        // range = (max-min)/2, x elem [-1, 1]
        // f(x) = C*(exp(lambda*x) - exp(-lambda*x))
        // f'(x) = C*lambda*(exp(lambda*x) + exp(-lambda*x))
        // f(1) = range
        // f'(0) = C*lambda*2
        // f'(1) = C*lambda*(exp(lambda) + exp(-lambda))
        // f'(1)/f'(0) = acceleration = (exp(lambda) + exp(-lambda))/2
        // solving for lambda, C gives
        var lambda = Math.log(a + Math.sqrt(a*a-1));
        var range = (max - min)/2;
        var mid = (max + min)/2;
        var C = range / ( Math.exp(lambda) - Math.exp(-lambda));
        var r2a = ( roundToInteger ? this.makeEdgeAcceleratedRawToActualFunRounded(lambda, C, mid) : this.makeEdgeAcceleratedRawToActualFun(lambda, C, mid) );
        var a2r = this.makeEdgeAcceleratedActualToRawFun(lambda, C, mid);
        var setValLabel = this.makeSetSliderLabelFunction(valName, valueId, valToHtmlFunOrFormatString);
        var onSliCh = this.makeSliderChangeFunction(UI, valName, r2a, setValLabel);
        var sliderOptions = {
    		min: -1,
    		max: 1,
    		value: a2r(val),
            step: 0.000001,
    		slide: ( slideCallBack ? 
                function( event, ui ) { onSliCh(event, ui); slideCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } ),                
    		stop: ( stopCallBack ? 
                function( event, ui ) { onSliCh(event, ui); stopCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } )                
        };
        UI[id].slider(sliderOptions);
        setValLabel.call(UI);
        UI[id + "SetTo"] = this.makeSetSliderToValFun(UI, id, a2r, valName, setValLabel);
    },
    createEdgeAcceleratedRangeSlider : function(UI, minminName, minName, maxName, maxmaxName, acceleration, tableName, label, id, width, slideCallBack, stopCallBack, valuesToHtmlFunOrFormatString, roundToInteger){
        var valueId = id + "Value";
        HtmlGen.makeLabeledSliderRow(UI, tableName, label, id, valueId);
        UI[id].width(width);
        var a = acceleration;
        var minmin = UI[minminName];
        var min    = UI[minName];
        var max    = UI[maxName];
        var maxmax = UI[maxmaxName];
        var lambda = Math.log(a + Math.sqrt(a*a-1));
        var range = (max - min)/2;
        var mid = (max + min)/2;
        var C = range / ( Math.exp(lambda) - Math.exp(-lambda));
        var r2a = ( roundToInteger ? this.makeEdgeAcceleratedRawToActualFunRounded(lambda, C, mid) : this.makeEdgeAcceleratedRawToActualFun(lambda, C, mid) );
        var a2r = this.makeEdgeAcceleratedActualToRawFun(lambda, C, mid);
        var setValLabel = this.makeSetRangeSliderLabelFunction(minName, maxName, valueId, valuesToHtmlFunOrFormatString);
        var onSliCh = this.makeRangeSliderChangeFunction(UI, minName, maxName, r2a, setValLabel);
        var sliderOptions = {
            range : true,
    		min: -1,
    		max: 1,
    		values: [a2r(min), a2r(max)],
            step: 0.000001,
    		slide: ( slideCallBack ? 
                function( event, ui ) { onSliCh(event, ui); slideCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } ),                
    		stop: ( stopCallBack ? 
                function( event, ui ) { onSliCh(event, ui); stopCallBack.call(UI); } :
                function( event, ui ) { onSliCh(event, ui); } )                
        };
        UI[id].slider(sliderOptions);
        setValLabel.call(UI);
    },
    makeSetSliderToValFun : function(UI, sliderId, actualToRaw, valName, labelChangeFun){
        return function(value){
            UI[sliderId].slider( { value: actualToRaw(value) } );
            UI[valName] = value;
            labelChangeFun.call(UI);
        }
    }
};
HtmlGen.TR = function(atts){
    this.content = "";
    this.atts = atts;
}
HtmlGen.TR.prototype.pushTd = function(content, atts){
    this.content += HtmlGen.td(content, atts);
}
HtmlGen.TR.prototype.pushTh = function(content, atts){
    this.content += HtmlGen.th(content, atts);
}
HtmlGen.TR.prototype.pushAllTd = function(strArr){
    for ( var i=0; i<strArr.length; i++ ){
        this.content += HtmlGen.td(strArr[i]);
    }
}
HtmlGen.TR.prototype.pushAllTh = function(strArr){
    for ( var i=0; i<strArr.length; i++ ){
        this.content += HtmlGen.th(strArr[i]);
    }
}
HtmlGen.TR.prototype.get = function(){
    return HtmlGen.tr(this.content, this.atts);
}
HtmlGen.TR.prototype.appendTo = function(host){
    $(this.get()).appendTo(host);
}
HtmlGen.SELECT = function(atts){
    this.content = "";
    this.atts = atts;
}
HtmlGen.SELECT.prototype.pushOption = function(content, atts){
    this.content += HtmlGen.option(content, atts);
}
HtmlGen.SELECT.prototype.pushOptionsArr = function(arr){
    for ( var i=0; i<arr.length; i++ ) {
        this.content += HtmlGen.option(arr[i]);
    }
}
HtmlGen.SELECT.prototype.get = function(){
    return HtmlGen.nodeWithAtts("select", this.content, this.atts);
}
HtmlSymbols = {
    degree    : "&#176;",
    pi        : "&#960;",
    checkMark : "&#10003",
    infinity  : "&#8734;",
    cent      : "&#162;",
    rightArrow : "&#8594;"
}
function ID(id){
    return $("#" + id);
}
function nthOptionText(id, n){
    return $(ID(id).children()[n]).text();
}
function firstOptionText(id){
    return nthOptionText(id, 0);
}
function nthOptionValue(id, n){
    return ID(id).children()[n].value;
}
function firstOptionValue(id){
    return nthOptionValue(id, 0);
}
function selectedIndexOf(id){
    return ID(id)[0].selectedIndex;
}
function setSelectedIndex(id, value){
    ID(id)[0].selectedIndex = value;
}
function selectedOptionText(id){
    return nthOptionText(id, selectedIndexOf(id));
}
function selectedOptionValue(id){
    return nthOptionValue(id, selectedIndexOf(id));
}
function isChecked(id){
    return document.getElementById(id).checked;
}
function valueOfID(id){
    return document.getElementById(id).value;
}