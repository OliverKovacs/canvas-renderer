// Oliver Kovacs 2021 - MIT

const CUBE_VERTICES = [
    [ -1, -1, -1 ],
    [  1, -1, -1 ],
    [ -1,  1, -1 ],
    [  1,  1, -1 ],
    [ -1, -1,  1 ],
    [  1, -1,  1 ],
    [ -1,  1,  1 ],
    [  1,  1,  1 ],
];

const CUBE_EDGES = [
    [ 0, 1 ],
    [ 2, 3 ],
    [ 4, 5 ],
    [ 6, 7 ],
    [ 0, 2 ],
    [ 1, 3 ],
    [ 4, 6 ],
    [ 5, 7 ],
    [ 0, 4 ],
    [ 1, 5 ],
    [ 2, 6 ],
    [ 3, 7 ],
];

const position = [ 0, 0, 0 ];
const rotation = [ 0, 0, 0 ];
const scale    = [ 30, 30, 30 ];

function clearCanvas(ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawLine (ctx, begin, end) {
    const half_width  = ctx.canvas.width  / 2;
    const half_height = ctx.canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(
        begin[0] + half_width,
        begin[1] + half_height,
    );
    ctx.lineTo(
        end[0] + half_width,
        end[1] + half_height,
    );
    ctx.stroke();
}

function translate(vertex) {
    return [
        vertex[0] + position[0],
        vertex[1] + position[1],
        vertex[2] + position[2],
    ];
}

function rotate(vertex) {
    const cos_a = Math.cos(rotation[0]);    // cos(alpha)
    const sin_a = Math.sin(rotation[0]);    // sin(alpha)
    const cos_b = Math.cos(rotation[1]);    // cos(beta)
    const sin_b = Math.sin(rotation[1]);    // sin(beta)
    const cos_c = Math.cos(rotation[2]);    // cos(gamma)
    const sin_c = Math.sin(rotation[2]);    // sin(gamma)
    return [
        vertex[0] * cos_a * cos_b +
        vertex[1] * (cos_a * sin_b * sin_c - sin_a * cos_c) +
        vertex[2] * (cos_a * sin_b * cos_c + sin_a * sin_c),

        vertex[0] * sin_a * cos_b +
        vertex[1] * (sin_a * sin_b * sin_c + cos_a * cos_c) +
        vertex[2] * (sin_a * sin_b * cos_c - cos_a * sin_c),

        vertex[0] * -sin_b +
        vertex[1] * cos_b * sin_c +
        vertex[2] * cos_b * cos_c,
    ];
}

function dilate(vertex) {
    return [
        vertex[0] * scale[0],
        vertex[1] * scale[1],
        vertex[2] * scale[2],
    ];
}

function project(vertex) {
    const x = 150;
    const y = 200;
    return [
        vertex[0] * y / (x + vertex[2]),
        vertex[1] * y / (x + vertex[2]),
    ];
}

function process(vertex) {
    return project(translate(rotate(dilate(vertex))));
}

function drawCube(ctx) {
    for (let i = 0; i < CUBE_EDGES.length; i++) {
        const edge = CUBE_EDGES[i];
        const begin = process(CUBE_VERTICES[edge[0]]);
        const end   = process(CUBE_VERTICES[edge[1]]);
        drawLine(ctx, begin, end);
    }
}

window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.border = "1px solid";
    canvas.width  = 600;
    canvas.height = 300;

    const loop = () => {
        rotation[0] += 0.003;
        rotation[1] += 0.01;
        rotation[2] += 0.02;
        
        clearCanvas(ctx);
        drawCube(ctx);
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
};
