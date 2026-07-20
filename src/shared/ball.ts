export type BallState = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    speed: number;
    color: string;
    fieldWidth: number;
    fieldHeight: number;
};

function setVelocity(ball: BallState, direction: -1 | 1): void {
    const maxAngle = Math.PI / 6;
    const angle = (Math.random() * 2 - 1) * maxAngle;
    const dx = direction * Math.cos(angle);
    const dy = Math.sin(angle);
    const length = Math.hypot(dx, dy);

    ball.vx = (dx / length) * ball.speed;
    ball.vy = (dy / length) * ball.speed;
}

function normalizeVelocity(ball: BallState): void {
    const length = Math.hypot(ball.vx, ball.vy);

    if (length === 0) {
        setVelocity(ball, Math.random() < 0.5 ? -1 : 1);
        return;
    }

    ball.vx = (ball.vx / length) * ball.speed;
    ball.vy = (ball.vy / length) * ball.speed;
}

export function createBall(
    fieldWidth: number,
    fieldHeight: number,
    radius = 8,
    speed = 400
): BallState {
    const ball: BallState = {
        x: fieldWidth / 2,
        y: fieldHeight / 2,
        vx: 0,
        vy: 0,
        radius,
        speed,
        color: "white",
        fieldWidth,
        fieldHeight
    };

    setVelocity(ball, Math.random() < 0.5 ? -1 : 1);

    return ball;
}

export function updateBall(
    ball: BallState,
    dt: number
): void {
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        bounceBallVertical(ball);
    } else if (ball.y + ball.radius >= ball.fieldHeight) {
        ball.y = ball.fieldHeight - ball.radius;
        bounceBallVertical(ball);
    }
}

export function renderBall(
    ball: BallState,
    ctx: CanvasRenderingContext2D
): void {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

export function renderBallRect(
    ball: BallState,
    ctx: CanvasRenderingContext2D
): void {
    const size = ball.radius * 2;

    ctx.fillStyle = ball.color;
    ctx.fillRect(
        ball.x - ball.radius,
        ball.y - ball.radius,
        size,
        size
    );
}

export function resetBall(
    ball: BallState,
    direction: -1 | 1
): void {
    ball.x = ball.fieldWidth / 2;
    ball.y = ball.fieldHeight / 2;
    setVelocity(ball, direction);
}

export function bounceBallVertical(
    ball: BallState
): void {
    ball.vy = -ball.vy;
    normalizeVelocity(ball);
}

export function bounceBallHorizontal(
    ball: BallState
): void {
    ball.vx = -ball.vx;
    normalizeVelocity(ball);
}