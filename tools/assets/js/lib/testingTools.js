(function(){
var isRequirejs = typeof define === 'function' && define.amd;
    
var Canvas;
var Image;
var tc;
var cmCvs;
    
/* Dependency, Export Setting */
//create Canvas constructor on Browser 
Canvas = function(width, height){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}
if(isRequirejs){
    //export Requirejs module
    define(["commonCanvas", "tinycolor2"],function(commonCanvas,tinycolor2){ 
        cmCvs = commonCanvas;
        tc = tinycolor2;
        return testingTool; 
    });
}else{
     //export normal browser
     window.testingTool = testingTool;
} 

var drawHistogram = function(histData, width, height){
    var histCanvas = new Canvas(width, height);
    var ctx = histCanvas.getContext("2d");
    var imageData = ctx.createImageData(histCanvas.width, histCanvas.height);
    var maxDataSize = 0;
    for(var i =0; i< histData.width; ++i){
        if(histData[i] > maxDataSize) maxDataSize = histData[i];   
    }
    var dataWidth = imageData.width / histData.width;
    var dataHeightRate = imageData.height / maxDataSize;
    
//    for(var x = 0; x < imageData.width ; ++x){
//        for(var y = 0; y < imageData.height; ++y){
//            var index = (y * imageData.width + x) * 4;
//            imageData.data[index + 0] = 197;
//            imageData.data[index + 1] = 32;
//            imageData.data[index + 2] = 101;
//            imageData.data[index + 3] = 255;
//        }
//    }
    
    for(var histIdx = 0; histIdx < histData.width; ++histIdx){
        for(var x = parseInt(histIdx * dataWidth); x < (histIdx+1) * dataWidth ; ++x){
//            for(var y = 0; y< histData[histIdx] * dataHeightRate; ++y){
            for(var y = imageData.height; y > imageData.height - (histData[histIdx] * dataHeightRate); --y){
                var index = (y * imageData.width + x) * 4;
            
                imageData.data[index + 0] = 197;
                imageData.data[index + 1] = 32;
                imageData.data[index + 2] = 101;
                imageData.data[index + 3] = 255;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return histCanvas;
};

var draw2dHistogram = function(hist, width, height){
    var histCanvas = new Canvas(width, height);
    var ctx = histCanvas.getContext("2d");
    var maxDataSize = find2dMax(hist);
    var canvasXRate = width/hist.width;
    var canvasYRate = height/hist.height;
    for(var x = 0; x< hist.width; ++x){
        for(var y = 0; y < hist.height; ++y){
            var histColor = gen2dHistColor(hist[x][y]/maxDataSize);
            for(var canvasX = parseInt(x * canvasXRate); 
                canvasX < (x+1) * canvasXRate; ++canvasX){
                for(var canvasY = height - parseInt(y * canvasYRate); 
                    canvasY > height - (y+1) * canvasYRate; --canvasY){
                    cmCvs.setPixel(ctx, canvasX, canvasY, histColor);
                }
            }
        }
    }
    return histCanvas;
};

var gen2dHistColor = function(rate){
    //rate max : 1 min : 0
    var hue = 240 * (1-rate);
    return tc({h : hue, s: 100, v: 100}).toRgb();
};

var find2dMax = function(twoDArray, cmp){
    var max = 0;
    for(var i = 0; i < twoDArray.width; ++i){
        var iMax = Math.max.apply(null, twoDArray[i]);
        if(max < iMax) max = iMax;
    }
    return max;
};
var testingTool = {
    drawHistogram : drawHistogram,
    draw2dHistogram : draw2dHistogram,
    find2dMax : find2dMax
};
})();