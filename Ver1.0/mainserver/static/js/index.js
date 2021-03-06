// 전연벽수

// 임시 그림자 저장소 
var shadowR = 20;
var shadowG = 20;
var shadowB = 20;

// 취소 버튼을 위한 전역변수. 
var tempImgWarehouse;
var tempFlag = false;

// 전역객체 
var setMainGridView = {
    "getElements" : function(){
        this.wrapper = document.getElementById("wrapper");
        this.itemFactoryButtonWrapper = document.getElementById("itemFactory-button-wrapper");
        this.itemFactory = document.getElementById("itemFactory");
        this.itemFactoryButton = document.getElementById("itemFactory-button");
        this.moments = document.getElementById("moments");
        this.momentsWrapper = document.getElementById("moments-wrapper");
        this.uploadFile = document.getElementById("upload-file");
        this.uploadText = document.getElementById("upload-text");
        this.closeButton = document.getElementById("close-button-wrapper");
        this.confirmButton = document.getElementById("confirm-button");
        this.previewImg = document.getElementById('preview-image');
        this.request = new XMLHttpRequest();  
    },
    "setLogicIndexes" : function(){
        this.sendCheck = 0;     // 페이지 인덱스 넘과 비교하여 동일하면 다시 요청하지 않는다. 
        this.pageIndexNum = 2;  // css Style 적용을 먹일 페이지 넘버 
        this.classIndexNum = 1; // css Style pageIndexNum안에 적용될 하나 하나의 객체 클래스넘버. 
        this.scrollFlag = true;
    },
    "setShadow" : function(){
        this.shadowColor = "#202020";
        this.addLength = 0.01;
        this.shadowLength = 10;
        this.shadowMaxLength = 30;
        this.shadowMinLength = 10;
        this.shadowBlur = 15;
        this.shadowLengthFlag = true;
    },
    //  화면 끝에 다다랐을 떄 추가적으로 로드하는 코드
    "displayMore" : function(){
        // var momentsArray = document.querySelectorAll("#moments a div");
        // var firstEle = momentsArray[0];
        // var lastEle = momentsArray[momentsArray.length-1];
        // console.log("scrollY " + window.scrollY);
        // console.log("lastEle " + (lastEle.offsetTop - window.innerHeight));
        //console.log("moments " + this.moments.offsetHeight);
        // 일단, 메이슨리를 쓰기 때문에 기존의 방법대로 무한스크롤을 구현할 수 없다.
        // 따라서 우리가 해야하는 일은 가장 마지막 아이를 찾고,
        // 그 아이의 Y값위치를 계산한뒤, 
        // 현재 스크롤의 위치와 비교하여 
        // 현재 스크롤 위치가 그 아이의 Y값 위치보다 크다면 
        // 추가 개체들을 생성하고,
        // 아니라면 그냥 지나치도록 한다. 
        // 스크롤의 현재 위치 > 맨위에서부터 마지막 디브까지의 길이 - 현재 창의 안쪽 길이. 

        // 이렇게 전용우 교수님 말대로 진행하려고 했으나, 그렇게 하면 추가되는 아이들의 높이 값에 영향을 너무 받는다.
        // 따라서 현재의 스크롤 위치가 
        // 추가된 전체 moments div의 offsetHeight의 90%를 넘었을때,
        // 새로 길이를 늘려주고 엘레멘트들을 추가하는 코드로 변경. 
        // 즉, 절대적인 길이를 기준으로 바뀌는게 아니라 비율값으로 변경되도록 하였다. 

        if(window.scrollY > this.moments.offsetHeight * 90 / 100 && this.scrollFlag){
            // 추가로 필요한 객체를 요청한다. 
            if(this.sendCheck !== this.pageIndexNum){
                this.sendCheck = this.pageIndexNum;
                this.request.open("GET", "/page/" + this.pageIndexNum.toString(), true);
                this.request.send();
                console.log("pageNum now : " + this.pageIndexNum);    
            }
         } else if(window.scrollY > 0){ // 그림자를 휠 동작에 맞춰서 바꿔준다.
            var degree = scrollY/10000; // 직접 각도에 scrollY를 삽입하는 방법으로 해결.

            var posX = Math.cos(degree) * this.shadowLength;
            var posY = Math.sin(degree) * this.shadowLength;
            this.itemFactoryButtonWrapper.style.boxShadow = posX.toString() + "px " + posY.toString() + "px " +  this.shadowBlur + "px " + this.shadowColor;

            if(this.shadowLength > this.shadowMaxLength){
                this.shadowLengthFlag = false;
            } else if(this.shadowLength < this.shadowMinLength){
                this.shadowLengthFlag = true;
            }
            if(this.shadowLengthFlag === true){
                this.shadowLength = this.shadowLength + this.addLength;
                this.shadowBlur = this.shadowBlur + this.addLength;
            } else if(this.shadowLengthFlag === false){
                this.shadowLength = this.shadowLength - this.addLength;
                this.shadowBlur = this.shadowBlur - this.addLength;   
            }
         }
    }, 
    "createMoments" : function(){ //DB에 저장된 유닛들을 받아서 원하는 그리드로 뿌려주는 코드.
        this.pageIndexNum++;
        this.moments.style.height = this.moments.offsetHeight + 1000 + "px";
        console.log("size Expanded");
            
        //추가 객체들을 요청. 
        var result = JSON.parse(this.request.responseText);
        var unitNumberInPage = 7;
        if(result.moments.length < unitNumberInPage){
            console.log("this is End Page " + "pageIndexNum = " + this.pageIndexNum + "\nelement in Lastpage : " + result.moments.length);
            this.scrollFlag = false;
        }
        for(var i = 0; i < result.moments.length; i++){
            //moment set 하나씩 추가(div in a tag)
            var addA = document.createElement('a');
            addA.setAttribute("href", "./moment/" + result.moments[i].id);
            var addDiv = document.createElement('div');
            addDiv.setAttribute("class", "moment-" + this.classIndexNum.toString());

            //hover했을 때 색이 보이도록 cssText 추가
            var momentIndex = this.moments.getElementsByTagName('a').length;
            console.log('currently adding momentId : ' + momentIndex);
            
            var hoverText = "#moments a:nth-of-type("+(momentIndex+1)+") div:hover{background-color:"+result.moments[i].bgColor+";}";
            
            /*오류나는 코드 : 왜 오류나는지 알 수 없음....*/
//            var styleTag = document.getElementsByTagName('STYLE');
//            styleTag.appendChild(document.createTextNode(hoverText));
            /*//오류나는 코드*/
            
            /*오류 안나는 코드 : 벗 이렇게 하면 태그를 계속 추가하는데.......*/
            var head = document.head;
            var styleTag = document.createElement('style');
            styleTag.type = 'text/css';  
            if (styleTag.styleSheet){
                styleTag.styleSheet.cssText = hoverText;
            } else {
                styleTag.appendChild(document.createTextNode(hoverText));
            }
            head.appendChild(styleTag);
            ///*오류 안나는 코드*/
            
            //사진이 보이는 칸(1,8,9,12번째)
            if(this.classIndexNum == 1 || this.classIndexNum == 8 || this.classIndexNum == 9 || this.classIndexNum == 12){
                addDiv.style.backgroundImage = "url(" + result.moments[i].file + ")";
            }
            
            if(this.classIndexNum === 14){
                this.classIndexNum = 1;
            } else {
               this.classIndexNum++;
            }
            var addSpan = document.createElement('span');
            addSpan.innerHTML = result.moments[i].text;

            this.moments.appendChild(addA);
            addA.appendChild(addDiv);
            addDiv.appendChild(addSpan);
        }
        EventUtil.addHandler(window, 'scroll', this.displayMore.bind(this));
    },
    "run" : function(){
        this.getElements();
        this.setLogicIndexes();
        this.setShadow();
        EventUtil.addHandler(window, 'scroll', this.displayMore.bind(this));
        EventUtil.addHandler(this.request, 'load', this.createMoments.bind(this));
    }
};

var itemFactoryDisplay = {
    "getElements" : function(){
        this.itemFactory = document.getElementById("itemFactory");
        this.itemFactoryButton = document.getElementById("itemFactory-button");
        this.moments = document.getElementById("moments");
        this.uploadFile = document.getElementById("upload-file");
        this.fileInput = document.getElementById('upload-hidden');
        this.uploadText = document.getElementById("upload-text");
        this.textInput = document.getElementById('text-input');
        this.closeButton = document.getElementById("close-button-wrapper");
        this.confirmButton = document.getElementById("confirm-button");
        this.previewImg = document.getElementById('preview-image');
        this.previewImgBorder = document.getElementById('preview-image-border');
        this.inputImg = document.getElementById('input-image');
    },
    "openFactory" : function(){
        display([this.itemFactory,this.itemFactoryButton, this.confirmButton, this.uploadFile,this.closeButton, this.previewImg],'show');
        display([this.moments, this.itemFactoryButton, this.uploadText],'hide');
        // 이미지 전송과 관련된 전역변수 초기화
        tempImgWarehouse = null;
        tempFlag = false;
    },
    "closeFactory" : function(){
        this.initializeItemfactory(); // 취소하므로 모든 상황을 업로드 이전 상태로 돌려준다. 
        display([this.moments, this.itemFactoryButton],'show');
        display([this.itemFactory, this.closeButton, this.previewImg],'hide');
    },
    "initializeItemfactory" : function(){
        //preview image src 초기화
        if(this.inputImg.src !== ""){ 
            this.inputImg.src = "";
        }
        //dynamic border 초기화
        this.previewImgBorder.style.width = '100%';
        this.previewImgBorder.style.height = '100%';
        this.previewImgBorder.style.borderColor = '#202020';

        //text, file input 초기화
        this.textInput.value = "30자 이내로 입력하세요.";                    
        this.fileInput.value = null;                                     
        
        // 그라데이션 색상 초기화  
        fR = 255; fG = 255; fB = 255;                                                                        
        firstColor = "#FFFFFF";    
        secondColor = "#FFFFFF"; 
    },
    "run" : function(){ // mainPage Initial code
        this.getElements();
        EventUtil.addHandler(this.itemFactoryButton, 'click', this.openFactory.bind(this));
        EventUtil.addHandler(this.closeButton, 'click', this.closeFactory.bind(this));
    }
};

var manageFileInput = {
    "getElements" : function(){
        this.fileInput = document.getElementById("upload-hidden");
        this.textInput = document.getElementById("text-input");
        this.previewImg = document.getElementById('preview-image');
        this.inputImg = document.getElementById('input-image');
        this.previewDivBorder = document.getElementById('preview-image-border');
        this.tempImgWarehouse = "";
    },
    "reset" : function(){
        if(this.fileInput.files.item(0) !== null){                  // 이미지창을 띄워놓고 선택하지 않을 경우를 대비해 지금 있는 이미지를
            tempImgWarehouse = this.fileInput.files.item(0);        // 미리 전역으로 선언해둔 변수에 파일을 집어넣는다. 
            tempSrcWarehouse = URL.createObjectURL(tempImgWarehouse);
            console.log(tempImgWarehouse);
            console.log(this.fileInput.files.item(0));
        }
        this.fileInput.value = null;
    },
    "onChange" : function(){
        //img src 초기화
        if(this.inputImg.src !== ""){ 
            this.inputImg.src = "";
        }
        //inputImg preview
        var imgFile = this.fileInput.files.item(0);
        var imgURL = URL.createObjectURL(imgFile);
        this.inputImg.src = imgURL;
        display([this.previewImg], 'show');
        //dynamic border
        this.inputImg.onload = function(){
            this.previewDivBorder.style.width = this.inputImg.clientWidth + 20 + 'px';
            this.previewDivBorder.style.height = this.inputImg.clientHeight + 20 + 'px';
            this.previewDivBorder.style.borderColor = '#202020'; // 가끔 이미지가 작으면 뒤에 카메라가 보이는데 차라리 같은색으로 유지하는 것이 나을듯.
        }.bind(this);            
    },
    "run" : function(){
        this.getElements();
        EventUtil.addHandler(this.fileInput, 'click', this.reset.bind(this));
        EventUtil.addHandler(this.fileInput, 'change', this.onChange.bind(this));
    }
};

var confirm = {
    "getElements" : function(){
        this.itemFactory = document.getElementById("itemFactory");
        this.closeButton = document.getElementById("close-button-wrapper");
        this.uploadFile = document.getElementById("upload-file");
        this.uploadText = document.getElementById("upload-text");
        this.confirmButton = document.getElementById("confirm-button");
        this.fileInput = document.getElementById("upload-hidden");
        this.inputImg = document.getElementById('input-image');
        this.previewImg = document.getElementById('preview-image');
        this.previewImgBorder = document.getElementById('preview-image-border');
        this.textInput = document.getElementById("text-input");
        this.submitButton = document.getElementById("submit-button");
        this.bgCanvas = document.getElementById('back-ground-canvas');
        
        this.loadingImageWrapper = document.getElementById("loading-image-wrapper");
        this.loadingImage = document.getElementById("loading-image");
        this.duringTime = 0;
        this.request = new XMLHttpRequest();
    },
    "sendImage" : function(e){
        display([this.confirmButton, this.itemFactory, this.closeButton], 'hide');
        display([this.loadingImageWrapper], 'show');        
        // 로딩버튼 초기 설정
        var loadingImage = document.getElementById("loading-image");
        var lCanvas_W = window.innerWidth * 99.3/100;                    // innerWidth와 실제 창의 크기가 달라서 비율을 넣었다.
        var lCanvas_H = window.innerHeight * 99.3/100;
        loadingImage.width = lCanvas_W;
        loadingImage.height = lCanvas_H; 
        var lCtx = loadingImage.getContext("2d");
        // 컨텍스트 합성환경설정
        lCtx.globalCompositeOperation = "copy";
        // 원설정 
        var circleR = 10;
        var circleColor = "#FFFFFF";
        // 그림자 설정
        var shadow = {
            x : 4,
            y : 4,
            degree : 0,
            offset : 2,
            blur : 10,
            color : "#202020"
        };
        var sizeFlag = true;

        this.duringTime = setInterval(function(){                          // 따로 함수로 빼려고 했으나, setInterval 특성상 안쪽에 넣는 것이 좋을 것이라고 판단. (중일)
            drawLoading(lCtx, circleR, circleColor, shadow, lCanvas_W, lCanvas_H, sizeFlag);
            if(circleR < 20 && sizeFlag === true){ 
                circleR = circleR + 1;
                shadow.blur++;
                shadow.degree = shadow.degree + 0.3;   
            } else if(circleR === 20){
                shadow.blur--;
                shadow.degree = shadow.degree + 0.3;
 
                sizeFlag = false;
            }
        }, 40);
        
        e.preventDefault(); // 중복전송 방지.

        if(this.fileInput.files.item(0) === null){  // 파일 없을때 에러처리
            if(tempImgWarehouse !== null){          // 전역창고에 파일이 있다면 여기서 전송해준다. 
                this.inputImg.src = tempSrcWarehouse;
                tempFlag = true;
                display([this.previewImg], 'hide');
                //AJAX로 데이터 보내기
                var formData = new FormData();
                formData.append("image", tempImgWarehouse);
                //길을 열어라! - 보내라! - 받아와라!(data가 load되면 실행)
                this.request.open("POST" , "/upload-image" , true);
                this.request.send(formData);
            } else {
                console.log("b");
                alert('no image');
            }
        }
        else{
            display([this.previewImg], 'hide');
            //AJAX로 데이터 보내기
            var formData = new FormData();
            formData.append("image", this.fileInput.files[0]);
            //길을 열어라! - 보내라! - 받아와라!(data가 load되면 실행)
            this.request.open("POST" , "/upload-image" , true);
            this.request.send(formData);
        }
    },

    "switchToTextInput" : function(){
        //로딩버튼관련
        clearInterval(this.duringTime);
        //텍스트 입력창으로 전환
        display([this.uploadText, this.itemFactory, this.closeButton],'show');
        display([this.uploadFile, this.loadingImageWrapper], 'hide');
        
        var result = JSON.parse(this.request.responseText);
        var bgColor = result.bgColor;
        var textColor = result.textColor;

        // 16진수를 10진수로 바꿔서 fRGB에 넣어준다. 
        fR = parseInt(bgColor.slice(1,3), 16);
        fG = parseInt(bgColor.slice(3,5), 16);
        fB = parseInt(bgColor.slice(5,7), 16);
        shadowR = parseInt(textColor.slice(1,3), 16);
        shadowG = parseInt(textColor.slice(3,5), 16);
        shadowB = parseInt(textColor.slice(5,7), 16);
        firstColor = bgColor;
        if(textColor !== null){
            secondColor = textColor;
        } else{
            secondColor = bgColor;
        }

        // 입력받은 평균 배경의 밝기가 130이하이면 글자색을 흰색으로 설정해준다.(점점 어두워 질테니 130보다 좀더 높게 잡음) 
        var avgBrightness = (fR + fG + fB) / 3;
        if(avgBrightness < 130){
            this.textInput.style.color = "#FFFFFF";
            this.closeButton.children[0].src = "image/png/close(invert).png";
            this.submitButton.src = "image/png/confirm(invert).png";
            // console.log(this.closeButton);
             console.log(this.submitButton);
        } else{
            this.textInput.style.color = "#000000";
            this.closeButton.children[0].src = "image/png/close.png";
            this.submitButton.src = "image/png/confirm.png";           
        }
        drawGradation(bgColor, textColor);
    },
    "run" : function(){
        this.getElements();
        EventUtil.addHandler(this.confirmButton, 'click', this.sendImage.bind(this));
        EventUtil.addHandler(this.request, 'load', this.switchToTextInput.bind(this));
    }
};

var submit = {
    "getElements" : function(){
        this.request = new XMLHttpRequest();
        this.closeButton = document.getElementById("close-button-wrapper");
        this.submitButton = document.getElementById("submit-button");
        this.textInput = document.getElementById("text-input");
        this.fileInput = document.getElementById("upload-hidden");
        this.moments = document.getElementById("moments");
        this.itemFactory = document.getElementById("itemFactory");
        this.itemFactoryButton = document.getElementById("itemFactory-button");
        this.mainContentWrapper = document.getElementById("wrapper");
        this.previewImgWrapper = document.getElementById("preview-image");
        this.previewImg = document.getElementById("input-image");
        this.loadingImageWrapper = document.getElementById("loading-image-wrapper");
        this.loadingImage = document.getElementById("loading-image");
        this.uploadText = document.getElementById("upload-text");
    },
    "sendData" : function(e){
        display([this.closeButton, this.submitButton, this.uploadText], 'hide');
        display([this.loadingImageWrapper], 'show');
        // 로딩버튼 초기 설정
        var loadingImage = document.getElementById("loading-image");
        var lCanvas_W = window.innerWidth * 99.3/100;
        var lCanvas_H = window.innerHeight * 99.3/100;
        loadingImage.width = lCanvas_W;
        loadingImage.height = lCanvas_H; 
        var lCtx = loadingImage.getContext("2d");
        // 컨텍스트 합성환경설ㅈ
        lCtx.globalCompositeOperation = "copy";
        // 원설정 
        var circleR = 10;
        var circleColor = "#FFFFFF"; 
        // 그림자 설정
        var shadow = {
            x : 4,
            y : 4,
            degree : 0,
            offset : 2,
            blur : 10,
            color : "#202020"
        };
        // 원크기 제어를 위한 플래그 설정
        var sizeFlag = true;
        // 전역변수 fR, fG, fB와 연동하면서 계산할 RGB변수
        var loadingR = 255;
        var loadingG = 255;
        var loadingB = 255;
        var loadingShadowR = 20; // 받아오기 위해 전역으로 선언.
        var loadingShadowG = 20;
        var loadingShadowB = 20;

        // 계산할 때 증감할 offset Num 
        var colorOffset = 1; 

        this.duringTime = setInterval(function(){
            drawLoading(lCtx, circleR, circleColor, shadow, lCanvas_W, lCanvas_H, sizeFlag);
            if(circleR < 20 && sizeFlag === true){ 
                circleR = circleR + 1;
                shadow.blur++;
                shadow.degree = shadow.degree + 0.3;   
            } else if(circleR === 20){

                //받아온 칼라값을 적용
                //전역으로 선언해둔 fR, fG, fB를 재활용. 
                //원이 커지고 난 후부터 애니메이션이 시작되도록 설정함.
                loadingShadowR = adjustColor(loadingShadowR, shadowR, colorOffset);
                loadingShadowG = adjustColor(loadingShadowG, shadowG, colorOffset);
                loadingShadowB = adjustColor(loadingShadowB, shadowB, colorOffset);
                loadingR = adjustColor(loadingR, fR, colorOffset);
                loadingG = adjustColor(loadingG, fG, colorOffset);
                loadingB = adjustColor(loadingB, fB, colorOffset);

                circleColor = commonCanvas.rgb2Hex(loadingR, loadingG, loadingB);
                shadow.color = commonCanvas.rgb2Hex(loadingShadowR, loadingShadowG, loadingShadowB);
                shadow.blur--;
                shadow.degree = shadow.degree + 0.3;
                sizeFlag = false;
                // RGB비교후 offset만큼 맞춰주는 함수
                function adjustColor(colorNum, sourceColor, offset){
                    if(colorNum > sourceColor){
                        colorNum = colorNum - offset;
                    } else if(colorNum == sourceColor){
                        colorNum = colorNum;
                    } else if(colorNum < sourceColor){
                        colorNum = colorNum + offset;
                    } else {
                        console.log("error in adjestColor function");
                    }
                    return colorNum;
                }
            }
        }, 40);
        
        // 데이터를 전송
        var formData = new FormData(); 
        formData.append("textInput", this.textInput.value);
        
        if(tempFlag === true){ // 이미지취소 버튼을 누른채 템프변수들을 이용하여 이미지를 전송한 경우.
            formData.append("image", tempImgWarehouse);
        } else {    // 정상작동의 경우. 
            formData.append("image", this.fileInput.files[0]);    
        }
        this.request.open("POST", "/upload-text", true);
        this.request.send(formData);
        var sendData = 1;
        console.log("sendData Count : " + sendData);
        sendData++;

    },
    "drawShadowCircle" : function(context, shadowX, shadowY, shadowBlur, circleR){
            context.shadowOffsetX = shadowX;
            context.shadowOffsetY = shadowY;
            context.shadowColor = "#202020";
            context.shadowBlur = shadowBlur;
            context.arc(lCanvas_W/2, lCanvas_H/2, circleR, (Math.PI/180)*0, (Math.PI/180)*360, false); 
            context.fill();
    },
    "afterSubmit" : function(){
        clearInterval(this.duringTime);
        window.location.reload(true);
    },
    "preventDoubleSubmit" : function(e){ // 중복 전송을 막는 코드. - 중일 
        var submitEvent = EventUtil.getEvent(e);
        EventUtil.preventDefault(submitEvent);
    },
    "run" : function(){
        this.getElements();
        EventUtil.addHandler(this.submitButton, 'click', this.sendData.bind(this));
        EventUtil.addHandler(this.request, 'load', this.afterSubmit.bind(this));
        this.textInput.addEventListener('onsubmit', this.preventDoubleSubmit(this), false);
        this.fileInput.addEventListener('onsubmit', this.preventDoubleSubmit(this), false);
    }
};

var uploadDrag = document.getElementById("upload-drag");
uploadDrag.addEventListener("drop", function(e){
    e.stopPropagation();
    e.preventDefault();
    var files = e.target.files || e.dataTransfer.files;
    //image 인지 판별 코드 필요.
    fileInput.files = files;
}, true);
//브라우저는 이미지를 받으면 바로 이미지를 여는 기본기능이 있기 때문에, 기본기능을 막아둔다.
uploadDrag.addEventListener("dragover", function(e){ e.preventDefault(); }, true);

// LoadingImage관련 전역함수.
function drawLoading(context, circleR, circleColor, shadow, canvasW, canvasH, sizeFlag){
    context.fillStyle = circleColor;
    shadowPositionSetter(shadow);     
    context.shadowOffsetX = shadow.x;
    context.shadowOffsetY = shadow.y;
    context.shadowColor = shadow.color;
    context.shadowBlur = shadow.blur;
    context.arc(canvasW/2, canvasH/2, circleR, (Math.PI/180)*0, (Math.PI/180)*360, false); 
    context.fill();

    function shadowPositionSetter(shadow){
        shadow.x = Math.cos(shadow.degree) * shadow.offset;
        shadow.y = -(Math.sin(shadow.degree) * shadow.offset);
    }
}

setMainGridView.run();
itemFactoryDisplay.run();
manageFileInput.run();
confirm.run();
submit.run();

