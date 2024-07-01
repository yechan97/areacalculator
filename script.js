const fileInput = document.getElementById('file-input');
const fileCount = document.getElementById('file-count');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let image = new Image();
let rectangles = [];
let isDrawing = false;
let startX, startY;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            image.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
        }
        reader.readAsDataURL(file);
        fileCount.textContent = "1장의 사진이 추가됨.";
    }
});

canvas.addEventListener('mousedown', (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        const width = currentX - startX;
        const height = currentY - startY;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.strokeRect(startX, startY, width, height);
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;
        rectangles.push({ startX, startY, width, height });
        isDrawing = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        rectangles.forEach(rect => {
            ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
            ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
            ctx.fillRect(rect.startX, rect.startY, rect.width, rect.height);
        });
        updateResults();
    }
});

function updateResults() {
    const results = document.getElementById('results');
    results.innerHTML = '';
    let totalArea = 0;
    rectangles.forEach((rect, index) => {
        const area = (rect.width * rect.height) / 10000; // converting to square meters
        totalArea += area;
        results.innerHTML += `<p>영역 ${index + 1}: 가로 ${rect.width}cm, 세로 ${rect.height}cm, 면적 ${area.toFixed(2)}㎡</p>`;
    });
    results.innerHTML += `<p>총 면적: ${totalArea.toFixed(2)}㎡</p>`;
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rectangles = [];
    fileCount.textContent = "선택된 파일 없음";
    const results = document.getElementById('results');
    results.innerHTML = '';
}

function processAreas() {
    // 로고 추가, 견적 계산기 등과 연동하는 코드를 추가할 수 있습니다.
}
