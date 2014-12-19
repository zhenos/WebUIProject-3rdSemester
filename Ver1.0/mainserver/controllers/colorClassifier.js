(function() {
var isNodeModule = typeof module !== 'undefined' && module.exports;
var isRequirejsModule = typeof define === 'function' && define.amd;

var tc;
if(isNodeModule){
    tc = require("tinycolor2");
}else if(isRequirejsModule){
    define(["tinycolor2"], function(tinycolor){ 
        tc = tinycolor;
        return colorClassifier; 
    });
/* export normal browser */
}else{
    tc = window.tinycolor;
    window.colorClassifier = colorClassifier;
}    
var colorClassifier = function colorClassifier(colorList){
    if(!(this instanceof colorClassifier)){
        return new colorClassifier(colorList);   
    }
    if(colorList.length === 0){
        this.bgColor = {
            r: 200, 
            g: 200,
            b: 200,
            a: 255,
        };
        this.textColor = {
            r: 100,
            g: 100,
            b: 100,
            a: 255
        };
    }else if(colorList.length === 1){
        this.bgColor = colorList[0];
        this.textColor = {
            r: 220,
            g: 220,
            b: 220,
            a: 255
        };
    }else{
        this.bgColor = colorList[0];
        this.textColor = colorList[1];
    }
}
colorClassifier.prototype ={
    textColorRgb : function(){
        return this.textColor;    
    },
    bgColorRgb : function(){
        return this.bgColor;
    },
    textColorHex : function(){
        return tc(this.textColor).toHexString();
    },
    bgColorHex : function(){
        return tc(this.bgColor).toHexString();
    }
}

/* Export Setting */    
/* export node module */
if(isNodeModule){
    module.exports = colorClassifier;
/* export requirejs module */
}
})();