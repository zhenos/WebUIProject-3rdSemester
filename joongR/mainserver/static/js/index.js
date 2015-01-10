
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
        this.momentlength = 0;     // 페이지 인덱스 넘과 비교하여 동일하면 다시 요청하지 않는다. 
        //this.pageIndexNum = 2;  // css Style 적용을 먹일 페이지 넘버 
        //this.classIndexNum = 1; // css Style pageIndexNum안에 적용될 하나 하나의 객체 클래스넘버. 
        this.scrollFlag = true;

        this.stringSum = 0;
        this.maxStringNum = 270;
        this.getUnitNum = 15;
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
    // 처음 윈도우가 온로드외었을 때 객체들을 추가
    "preload" : function(){
        console.log("getUnitNumber : " + this.getUnitNum);
        this.request.open("GET", "/getmoments?index=" + 0 + "&num=" + this.getUnitNum, true);
        this.request.send();

        this.moments.style.height = this.moments.style.height + window.innerHeight;//this.moments.offsetHeight + 1000 + "px";
        console.log("size Expanded");

//        //추가 객체들을 요청. 
//
//        for(var i = 0; i < result.moments.length; i++){
//            this.mementlength++
//            if(this.stringSum > this.maxStringNum){
//                //this.scrollFlag = false;
//                break;
//            }
//            this.stringSum += result.moments[i].text.length;
//            this.momentArray.push(this.moments[i]);
//        }
//        // 모자라면 재요청을 보내는 코드
//        if(this.stringSum < this.maxStringNum - 30){    // 정확히 270자인 경우는 극히 드물 것이므로 30자의 버퍼를 주어 최악의 경우에 대비한다.  
//            this.createMoments.bind(this);
//        }
//
//
//        //받아온 페이지가 끝 페이지인지 알아보는 코드
//        if(result.moments.length < this.getUnitNum){
//            this.scrollFlag = false;
//        }

//        for(var i = 0; i < result.moments.length; i++){
//            //moment set 하나씩 추가(div in a tag)
//            var addA = document.createElement('a');
//            addA.setAttribute("href", "./moment/" + result.moments[i].id);
//            var addSpan = document.createElement('span'); // 이제 디브가 아니라 스팬으로 추가. 
//            addSpan.setAttribute("class", "moment-span");// + this.classIndexNum.toString());
//
//            this.moments.appendChild(addA);
//            addA.appendChild(addSpan);
//        }
        EventUtil.addHandler(window, 'scroll', this.displayMore.bind(this));
        this.request.addEventListener('load', function(){
            var momentsWrapper = document.getElementById('moments');
            var result = JSON.parse(this.request.responseText);
            for(var i =0; i < result.moments.length; ++i){
                var moment = result.moments[i];
                var momentA = document.createElement('a');
                momentA.href = '/moment/' + result.moments[i].id;
                var momentSpan = document.createElement('span');  
                momentSpan.innerHTML = moment.text;
                
                
                
//                
//                this.moments.addEventListener('mouseover', function(){
//             this.momentsWrapper.style.backgroundColor = '#b1a686';
//            
//             var otherSpans = document.querySelectorAll('span:not(#'+this.id+')');
//             for(var i=0 ; i<otherSpans.length ; i++){
//                 otherSpans[i].style.opacity = '0.5';
//             }
//         });
//         this.moments.addEventListener('mouseout', function(){
//             this.momentsWrapper.style.backgroundColor = 'transparent';
//            
//             var otherSpans = document.querySelectorAll('span:not(#'+this.id+')');
//             for(var i=0 ; i<otherSpans.length ; i++){
//                 otherSpans[i].style.opacity = '1';
//             }
//         });

         //아마도 이렇게 함수로 만들어서, span추가될때마다 색상값만 데이터로 넣어서 이벤트도 같이 추가하면 될 듯?
   
                momentA.appendChild(momentSpan);
                momentsWrapper.appendChild(momentA);
            }
        }.bind(this));
         //기본 구조
        function spanHover(targetSpan, bgColor){
            targetSpan.addEventListener('mouseover', function(){
                this.momentsWrapper.style.backgroundColor = bgColor;
                
                var otherSpans = document.querySelectorAll('span:not(#'+this.id+')');
                for(var i=0 ; i<otherSpans.length ; i++){
                    otherSpans[i].style.opacity = '0.5';
                }
            });
            targetSpan.addEventListener('mouseout', function(){
                this.momentsWrapper.style.backgroundColor = 'transparent';
                
                var otherSpans = document.querySelectorAll('span:not(#'+this.id+')');
                for(var i=0 ; i<otherSpans.length ; i++){
                    otherSpans[i].style.opacity = '1';
                }
            });
        };
             

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
            // if(this.sendCheck !== this.pageIndexNum){
            //     this.sendCheck = this.pageIndexNum;
                this.request.open("GET", "/getmoments?index=" + this.momentlength + "&num=" + this.getUnitNum, true);
                this.request.send();
            //     console.log("pageNum now : " + this.pageIndexNum);    
            // }
            //수정이 필요함



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
        

        this.moments.style.height = this.moments.style.height + window.innerHeight;//this.moments.offsetHeight + 1000 + "px";
        console.log("size Expanded");
            
        //추가 객체들을 요청. 
        var result = JSON.parse(this.request.responseText);
        for(var i = 0; i < result.moments.length; i++){
            this.mementlength++
            if(this.stringSum > this.maxStringNum){
                //this.scrollFlag = false;
                break;
            }
            this.stringSum += result.moments[i].text.length;
            this.momentArray.push(this.moments[i]);
        }
        // // 모자라면 재요청을 보내는 코드
        // if(this.stringSum < this.maxStringNum - 30){    // 정확히 270자인 경우는 극히 드물 것이므로 30자의 버퍼를 주어 최악의 경우에 대비한다.  
        //     this.createMoments.bind(this);
        // }


        //받아온 페이지가 끝 페이지인지 알아보는 코드
        if(result.moments.length < this.getUnitNum){
            this.scrollFlag = false;
        }

        for(var i = 0; i < result.moments.length; i++){
            //moment set 하나씩 추가(div in a tag)
            var addA = document.createElement('a');
            addA.setAttribute("href", "./moment/" + result.moments[i].id);
            var addSpan = document.createElement('span'); // 이제 디브가 아니라 스팬으로 추가. 
            addSpan.setAttribute("class", "moment-span");// + this.classIndexNum.toString());

            this.moments.appendChild(addA);
            addA.appendChild(addSpan);
            // 텍스트 레이아웃은 호버하지 않음. 
            //hover했을 때 색이 보이도록 cssText 추가
            // var momentIndex = this.moments.getElementsByTagName('a').length;
            // console.log('currently adding momentId : ' + result.moments[i].id);
            
            // var hoverText = "#moments a:nth-of-type("+(momentIndex+1)+") div:hover{background-color:"+result.moments[i].bgColor+";}";
            
            /*오류나는 코드 : 왜 오류나는지 알 수 없음....*/
//            var styleTag = document.getElementsByTagName('STYLE');
//            styleTag.appendChild(document.createTextNode(hoverText));
            /*//오류나는 코드*/
            
            /*오류 안나는 코드 : 벗 이렇게 하면 태그를 계속 추가하는데.......*/
            // var head = document.head;
            // var styleTag = document.createElement('style');
            // styleTag.type = 'text/css';  
            // if (styleTag.styleSheet){
            //     styleTag.styleSheet.cssText = hoverText;
            // } else {
            //     styleTag.appendChild(document.createTextNode(hoverText));
            // }
            // head.appendChild(styleTag);
            ///*오류 안나는 코드*/
            
            //사진이 보이는 칸(1,8,9,12번째)
            // if(this.classIndexNum == 1 || this.classIndexNum == 8 || this.classIndexNum == 9 || this.classIndexNum == 12){
            //     addDiv.style.backgroundImage = "url(" + result.moments[i].file + ")";
            // }
            
            // if(this.classIndexNum === 14){
            //     this.classIndexNum = 1;
            // } else {
            //    this.classIndexNum++;
            // }
            // var addSpan = document.createElement('span');
            // addSpan.innerHTML = result.moments[i].text;

        }
        //EventUtil.addHandler(window, 'scroll', this.displayMore.bind(this));
    },
    "run" : function(){
        this.getElements();
        this.setLogicIndexes();
        this.setShadow();

        EventUtil.addHandler(document, "DOMContentLoaded", this.preload.bind(this));
        // EventUtil.addHandler(window, 'scroll', this.displayMore.bind(this));
        // EventUtil.addHandler(this.request, 'load', this.createMoments.bind(this));
    }
};

var itemFactoryDisplay = {
    "getElements" : function(){
        this.itemFactory = document.getElementById("itemFactory");
        this.itemFactoryButton = document.getElementById("itemFactory-button");
        this.itemFactoryButtonWrapper = document.getElementById("itemFactory-button-wrapper");
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
        this.bgCanvas = document.getElementById('back-ground-canvas');
    },
    "openFactory" : function(){
        display([this.itemFactory,this.itemFactoryButton, this.confirmButton, this.uploadFile,this.closeButton, this.previewImg],'show');
        display([this.moments, this.itemFactoryButton, this.itemFactoryButtonWrapper, this.uploadText],'hide');
        // 이미지 전송과 관련된 전역변수 초기화
        tempImgWarehouse = null;
        tempFlag = false;
    },
    "closeFactory" : function(){
        this.initializeItemfactory(); // 취소하므로 모든 상황을 업로드 이전 상태로 돌려준다. 
        display([this.moments, this.itemFactoryButton, this.itemFactoryButtonWrapper],'show');
        display([this.itemFactory, this.closeButton, this.previewImg, this.bgCanvas],'hide');
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
        GlobalVar.GradationColorSetter("#FFFFFF", "#FFFFFF");                                                                       
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
        display([this.loadingImageWrapper, this.bgCanvas], 'show');        
        // 로딩버튼 초기 설정
        // 로딩버튼을 위한 설정변수.
        var loadingImage = document.getElementById("loading-image");
        var lCanvas_W = window.innerWidth * 99.3/100;
        var lCanvas_H = window.innerHeight * 99.3/100;

        // 버튼크기 및 초기 색상설정
        var circle ={
            r : 10,
            maximumR : 20,
            color : "#FFFFFF",
            sizeFlag : true 
        } 
        var shadow = {
            x : 4,
            y : 4,
            degree : 0,
            offset : 2,
            blur : 10,
            color : "#202020"
        };

        drawLoadingButton.init(loadingImage, lCanvas_W, lCanvas_H, circle, shadow, false);  // src = /lib/drawLoadingButton.js 

        this.duringTime = setInterval(drawLoadingButton.run.bind(drawLoadingButton), 40);
        
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

        clearInterval(this.duringTime);
        //텍스트 입력창으로 전환
        display([this.uploadText, this.itemFactory, this.closeButton],'show');
        display([this.uploadFile, this.loadingImageWrapper], 'hide');
    
        var result = JSON.parse(this.request.responseText);
        var color1 = result.bgColor;
        var color2 = result.textColor;
        var thisPictureR, thisPictureG, thisPictureB;
        var brightnessMark = 130;

        // 추후를 위해 전송받은 색들을 전역변수에 저장
        GlobalVar.ShadowColorSetter(parseInt(color2.slice(1,3), 16),
                                    parseInt(color2.slice(3,5), 16),
                                    parseInt(color2.slice(5,7), 16)); 
        // 색이 하나 밖에 없을 때에는(흑밴사진의 경우) 하나의 값으로 모든 그라데이션을 처리 
        if(color2 !== null){
            GlobalVar.GradationColorSetter(color1, color2);
        } else {
            GlobalVar.GradationColorSetter(color1, color1);
        }

        // 입력받은 평균 배경의 밝기가 130이하이면 글자색을 흰색으로 설정해준다.(점점 어두워 질테니 130보다 좀더 높게 잡음) 
        thisPictureR = parseInt(color1.slice(1,3), 16);
        thisPictureG = parseInt(color1.slice(3,5), 16);
        thisPictureB = parseInt(color1.slice(5,7), 16);

        var avgBrightness = (thisPictureR + thisPictureG + thisPictureB) / 3;
        if(avgBrightness < brightnessMark){
            this.textInput.style.color = "white";
            this.closeButton.children[0].src = "image/png/close(invert).png";
            this.submitButton.src = "image/png/confirm(invert).png";
        } else{
            this.textInput.style.color = "black";
            this.closeButton.children[0].src = "image/png/close.png";
            this.submitButton.src = "image/png/confirm.png";           
        }
        textInput.drawGradation(color1, color2);
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
        
        // 로버튼을 위한 설정변수.
        var loadingImage = document.getElementById("loading-image");
        var lCanvas_W = window.innerWidth * 99.3/100;
        var lCanvas_H = window.innerHeight * 99.3/100;

        // 버튼크기 및 초기 색상설정
        var circle ={
            circleR : 10,
            circleMaximumR : 20,
            circleColor : "#FFFFFF",
            sizeFlag : true 
        } 
        drawLoadingButton(loadingImage, lCanvas_W, lCanvas_H, circle);  // src = /lib/drawLoadingButton.js 
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
