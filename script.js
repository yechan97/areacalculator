let canvas = document.getElementById('floorplanCanvas');
let ctx = canvas.getContext('2d');
let isDrawing = false;
let startX, startY;
let rectangles = [];
let currentRectangle = null;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawRectangle);
canvas.addEventListener('mouseup', finishDrawing);

function startDrawing(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    currentRectangle = { startX, startY, width: 0, height: 0 };
}

function drawRectangle(e) {
    if (!isDrawing) return;
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    const width = mouseX - startX;
    const height = mouseY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redrawRectangles();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.strokeRect(startX, startY, width, height);

    currentRectangle.width = width;
    currentRectangle.height = height;
}

function finishDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    rectangles.push(currentRectangle);
    currentRectangle = null;
    updateAreaInfo();
}

function redrawRectangles() {
    rectangles.forEach((rect, index) => {
        ctx.fillStyle = `rgba(0, 0, 255, 0.2)`;
        ctx.fillRect(rect.startX, rect.startY, rect.width, rect.height);
        ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
    });
}

function updateAreaInfo() {
    const areaInfo = document.getElementById('areaInfo');
    areaInfo.innerHTML = '';
    let totalArea = 0;
    rectangles.forEach((rect, index) => {
        const area = Math.abs(rect.width * rect.height) / 10000; // cm^2 to m^2
        totalArea += area;
        areaInfo.innerHTML += `<p>영역 ${index + 1} - 가로: ${Math.abs(rect.width)}cm, 세로: ${Math.abs(rect.height)}cm, 면적: ${area.toFixed(2)}m²</p>`;
    });
    areaInfo.innerHTML += `<p><strong>총 면적: ${totalArea.toFixed(2)}m²</strong></p>`;
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles = [];
    document.getElementById('areaInfo').innerHTML = '';
}

// Add more logic here for calculating mat requirements based on totalArea from updateAreaInfo function
