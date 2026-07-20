import type { Input } from "atari-monk-atom-engine";

export type PaddleState = {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    color: string;
    fieldWidth: number;
    fieldHeight: number;
};

export function createPaddle(
    fieldWidth: number,
    fieldHeight: number,
    side: "left" | "right"
): PaddleState {
    const width = 10;
    const height = 80;

    return {
        x: side === "left" ? 20 : fieldWidth - 30,
        y: (fieldHeight - height) / 2,
        width,
        height,
        speed: 500,
        color: "white",
        fieldWidth,
        fieldHeight
    };
}

export function updatePaddle(
    paddle: PaddleState,
    input: Input,
    upKey: string,
    downKey: string,
    dt: number
): void {
    if (input.isDown(upKey)) {
        paddle.y -= paddle.speed * dt;
    }

    if (input.isDown(downKey)) {
        paddle.y += paddle.speed * dt;
    }

    paddle.y = Math.max(
        0,
        Math.min(
            paddle.fieldHeight - paddle.height,
            paddle.y
        )
    );
}

export function renderPaddle(
    paddle: PaddleState,
    ctx: CanvasRenderingContext2D
): void {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}

export function resetPaddle(
    paddle: PaddleState
): void {
    paddle.y = (paddle.fieldHeight - paddle.height) / 2;
}

export function collidesWithPaddle(
    paddle: PaddleState,
    ball: {
        x: number;
        y: number;
        radius: number;
    }
): boolean {
    return (
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height
    );
}