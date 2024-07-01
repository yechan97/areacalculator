const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const output = document.getElementById('output');
let image, isDrawing = false, points = [], areas = [];

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    points = [{ x: event.offsetX, y: event.offsetY }];
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        const { offsetX, offsetY } = event;
        points.push({ x: offsetX, y: offsetY });
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    areas.push([...points]);
    points = [];
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx.beginPath();
    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.closePath();
    ctx.stroke();
}

function calculateArea() {
    let totalArea = 0;
    areas.forEach(area => {
        totalArea += calculatePolygonArea(area);
    });
    output.innerHTML = `선택된 영역의 총 면적: ${totalArea.toFixed(2)} 제곱미터`;
}

function calculatePolygonArea(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;
    // Adjust based on your scale; example assumes 1 pixel = 0.1 meter
    const scale = 0.1;
    return area * scale * scale;
}
