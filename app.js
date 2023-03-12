const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const lineWidth = document.getElementById('line_width');
const color = document.getElementById('text_color');
const backColor = document.getElementById('background_color');
const resetBtn = document.getElementById('reset');
const inputImage = document.getElementById('file');
const text = document.getElementById('text');
const save = document.getElementById('save');
const drawing = document.getElementById('drawing');
const eraser = document.getElementById('eraser');
const brush = document.getElementById('brush');
const fontButton = document.getElementById('font_button');
const textDisplay = document.getElementById('text_tool');
const fontList = document.getElementById('font_lists');
const sansF = document.getElementById('sans_font');
const monoF = document.getElementById('mono_font');
const serifF = document.getElementById('serif_font');
const malangF = document.getElementById('malang_font');
const returnButton = document.getElementById('return_button');
const canvasWidth = document.getElementById('canvas_width'); 
const canvasHeight = document.getElementById('canvas_height');
const squre = document.getElementById('squre');
const triangle = document.getElementById('triangle');
const circle = document.getElementById('circle');
canvas.width = canvasWidth.value;
canvas.height = canvasHeight.value;
ctx.lineWidth = lineWidth.value;

let myFont = 'serif'
ctx.font = lineWidth.value*10 + 'px ' + myFont;
ctx.lineCap = 'round';

let cPushArray = new Array();
cPushArray.splice(0,cPushArray.length)
let cStep = -1;

let isPainting = false;
let isDrawing = false;
let isBrushing = false;
let isSqure = false;
let isTriangle = false;
let isCircle = false;
let isErasing = false;
let isFontList = false;

onReset();

const MalangF = new FontFace('MalangF', 'url(GeekbleMalang2OTF.otf)');
MalangF.load().then(function(font) {
    document.fonts.add(font);
})

function onMouseMove(event) {
    if(isPainting && isErasing) {
        ctx.save()
        ctx.strokeStyle = backColor.value
        ctx.lineWidth = lineWidth.value*3;
        ctx.lineTo(event.offsetX, event.offsetY)
        ctx.stroke()
        ctx.restore()
    } else if(isPainting && isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY)
        ctx.stroke()
    } else if(isPainting && isBrushing) {
        ctx.save()
        function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }
        function angleBetween(point1, point2) {
            return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        }
        ctx.fillStyle = color.value;
        ctx.strokeStyle = color.value;
        ctx.globalAlpha = "0.02";
        ctx.lineWidth = 0;
        ctx.globalCompositeOperation = "source-over"; 
        var currentPoint = { x: event.offsetX, y: event.offsetY };
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);
        for (var i = 0; i < dist; i+=3) {
            x = event.offsetX + (Math.sin(angle) * i) - 25;
            y = event.offsetY + (Math.cos(angle) * i) - 25;
            ctx.beginPath();
            ctx.arc(x+25, y+25, lineWidth.value*5, false, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        lastPoint = currentPoint;
    ctx.restore()
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function onMouseDown(event) {
    isPainting = true;
    lastPoint = { x: event.offsetX, y: event.offsetY };
    if(isDrawing || isErasing || isBrushing || isSqure || isTriangle || isCircle) {
        cStep++;
        cPushArray.push(canvas.toDataURL());
    };
    if(isSqure) {
        const LineWidth = ctx.lineWidth*20;
        ctx.rect(event.offsetX - LineWidth/2, event.offsetY - LineWidth/2, LineWidth, LineWidth)
        ctx.stroke();
    } else if(isTriangle) {
        const LineWidth = ctx.lineWidth*20;
        const start = LineWidth/2*Math.sqrt(3)/20;
        const high = LineWidth*Math.sqrt(3)/2
        ctx.moveTo(event.offsetX, event.offsetY+start+LineWidth/4);
        ctx.lineTo(event.offsetX+LineWidth/2, event.offsetY+start+LineWidth/4);
        ctx.lineTo(event.offsetX, event.offsetY-high+LineWidth/4);
        ctx.lineTo(event.offsetX-LineWidth/2, event.offsetY+start+LineWidth/4);
        ctx.lineTo(event.offsetX, event.offsetY+start+LineWidth/4);
        ctx.stroke();
    } else if(isCircle) {
        const LineWidth = ctx.lineWidth*10;
        ctx.beginPath();
        ctx.arc(event.offsetX, event.offsetY, LineWidth, 0, 2*Math.PI, false);
        ctx.stroke();
    };
}

function onMouseUp() {
    isPainting = false;
    ctx.beginPath();
}

function lineWidthChange(event) {
    let fontSize = event.target.value * 10;
    ctx.lineWidth = event.target.value;
    ctx.font = fontSize + 'px ' + myFont;
}

function onColorChange(event) {
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onBColorChange(event) {
    ctx.save()
    ctx.fillStyle = event.target.value
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.restore()
}

function onReset() {
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.restore()
    backColor.value = '#ffffff'
    cPushArray.splice(0,cPushArray.length)
    cStep = -1
}

function onDelete() {
    let tf = confirm('내용을 삭제하시겠습니까?')
    if(tf) {
        onReset()
    }
}

function onImg(event) {
    const files = event.target.files[0];
    const url = URL.createObjectURL(files);
    const img = new Image();
    img.src = url;
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        inputImage.value = null;
    }
}

function onDouble(event) {
    ctx.save();
    const inputText = text.value;
    ctx.lineWidth = 1;
    ctx.fillText(inputText, event.offsetX, event.offsetY);
    ctx.restore();
}

function onSave() {
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Art.png';
    a.click();
}

function onDraw() {
    if(!isDrawing) {
        isDrawing = true;
        isBrushing = false;
        isErasing = false;
        isSqure = false;
        isTriangle = false;
        isCircle = false;
        drawing.style.backgroundColor = 'gray'
        circle.style.backgroundColor = '#171717'
        triangle.style.backgroundColor = '#171717'
        brush.style.backgroundColor = '#171717'
        eraser.style.backgroundColor = '#171717'
        squre.style.backgroundColor = '#171717'
    } else {
        isDrawing = false;
        drawing.style.backgroundColor = '#171717'
    }
}

function onErase() {
    if(!isErasing){
        isErasing = true;
        isDrawing = false;
        isBrushing = false;
        isSqure = false;
        isTriangle = false;
        isCircle = false;
        eraser.style.backgroundColor = 'gray'
        circle.style.backgroundColor = '#171717'
        triangle.style.backgroundColor = '#171717'
        brush.style.backgroundColor = '#171717'
        drawing.style.backgroundColor = '#171717'
        squre.style.backgroundColor = '#171717'
    } else {
        isErasing = false;
        eraser.style.backgroundColor = '#171717'
    }
}

function onBrush() {
    if(!isBrushing) {
        isBrushing = true;
        isErasing = false;
        isDrawing = false;
        isSqure = false;
        isTriangle = false;
        isCircle = false;
        brush.style.backgroundColor = 'gray'
        circle.style.backgroundColor = '#171717'
        triangle.style.backgroundColor = '#171717'
        eraser.style.backgroundColor = '#171717'
        drawing.style.backgroundColor = '#171717'
        squre.style.backgroundColor = '#171717'
    } else {
        isBrushing = false;
        brush.style.backgroundColor = '#171717'
    }
}

function onSqure() {
    if(!isSqure) {
        isSqure = true;
        isBrushing = false;
        isErasing = false;
        isDrawing = false;
        isTriangle = false;
        isCircle = false;
        squre.style.backgroundColor = 'gray'
        circle.style.backgroundColor = '#171717'
        brush.style.backgroundColor = '#171717'
        eraser.style.backgroundColor = '#171717'
        drawing.style.backgroundColor = '#171717'
        triangle.style.backgroundColor = '#171717'
    } else {
        isSqure = false;
        squre.style.backgroundColor = '#171717'
    }
}

function onTriangle() {
    if(!isTriangle) {
        isTriangle = true;
        isSqure = false;
        isBrushing = false;
        isErasing = false;
        isDrawing = false;
        isCircle = false;
        triangle.style.backgroundColor = 'gray'
        circle.style.backgroundColor = '#171717'
        squre.style.backgroundColor = '#171717'
        brush.style.backgroundColor = '#171717'
        eraser.style.backgroundColor = '#171717'
        drawing.style.backgroundColor = '#171717'
    } else {
        isTriangle = false;
        triangle.style.backgroundColor = '#171717'
    }
}

function onCircle() {
    if(!isCircle) {
        isCircle = true;
        isTriangle = false;
        isSqure = false;
        isBrushing = false;
        isErasing = false;
        isDrawing = false;
        circle.style.backgroundColor = 'gray'
        triangle.style.backgroundColor = '#171717'
        squre.style.backgroundColor = '#171717'
        brush.style.backgroundColor = '#171717'
        eraser.style.backgroundColor = '#171717'
        drawing.style.backgroundColor = '#171717'
    } else {
        isCircle = false;
        circle.style.backgroundColor = '#171717'
    }
}

function onFontList() {
    if(!isFontList) {
        textDisplay.style.height = '250px'
        fontList.style.display = 'block'
        isFontList = true;
    } else if(isFontList) {
        textDisplay.style.height = '50px'
        fontList.style.display = 'none'
        isFontList = false;
    }
}

function onSans() {
    myFont = 'sans-serif'
    ctx.font = lineWidth.value*10 + 'px ' + myFont;
    return myFont
}

function onMono() {
    myFont = 'monospace'
    ctx.font = lineWidth.value*10 + 'px ' + myFont;
    return myFont
}

function onSerif() {
    myFont = 'serif'
    ctx.font = lineWidth.value*10 + 'px ' + myFont;
    return myFont
}

function onMalang() {
    myFont = 'MalangF'
    ctx.font = lineWidth.value*10 + 'px ' + myFont;
    return myFont
}

function onReturn() {
    if (cStep >= 0) {
        const img = new Image();
        const url = cPushArray[cStep];
        img.src = url
        img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            cStep--;
        cPushArray.pop();
    }
    }
}

function onWidthChange(event) {
    if(!isNaN(event.target.value)){
        if(event.target.value<=1400) {
            canvas.width = event.target.value;
            canvas.style.width = event.target.value + 'px'  
        } else {alert('1400이하의 숫자만 입력 가능합니다!');
        event.target.value = 1000;
        canvas.style.width = event.target.value + 'px' 
    }
    } else {
        alert('1400이하의 숫자만 입력 가능합니다!');
        event.target.value = 1000;
        canvas.style.width = event.target.value + 'px' 
    }
    onReset();
}

function onHeightChange(event) {
    if(!isNaN(event.target.value)){
        if(event.target.value<=900) {
            canvas.height = event.target.value;
            canvas.style.height = event.target.value + 'px'  
        } else {alert('900이하의 숫자만 입력 가능합니다!');
        event.target.value = 900;
        canvas.style.height = event.target.value + 'px' 
    }
    } else {
        alert('900이하의 숫자만 입력 가능합니다!');
        event.target.value = 900;
        canvas.style.height = event.target.value + 'px' 
    }
    onReset();
}

function onKeyboard(event) {
    switch(event.keyCode) {
        case 81 : onDraw();
        break;
        case 87 : onBrush();
        break;
        case 69 : onErase();
        break;
        case 65 : onSqure();
        break;
        case 83 : onTriangle();
        break;
        case 68 : onCircle();
        break;
        case 17&&90 : onReturn();
        break;
        case 46 : onDelete();
        break;
    }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
addEventListener('mouseup', onMouseUp);
lineWidth.addEventListener('change', lineWidthChange);
color.addEventListener('change', onColorChange);
backColor.addEventListener('change', onBColorChange);
resetBtn.addEventListener('click', onDelete);
inputImage.addEventListener('change', onImg);
canvas.addEventListener('dblclick', onDouble);
save.addEventListener('click', onSave);
drawing.addEventListener('click', onDraw);
eraser.addEventListener('click', onErase);
brush.addEventListener('click', onBrush);
fontButton.addEventListener('click', onFontList);
sansF.addEventListener('click', onSans);
monoF.addEventListener('click', onMono);
serifF.addEventListener('click', onSerif);
malangF.addEventListener('click', onMalang);
returnButton.addEventListener('click', onReturn);
canvasWidth.addEventListener('change', onWidthChange);
canvasHeight.addEventListener('change', onHeightChange);
squre.addEventListener('click',onSqure);
triangle.addEventListener('click',onTriangle);
circle.addEventListener('click', onCircle);
addEventListener('keydown', onKeyboard);
