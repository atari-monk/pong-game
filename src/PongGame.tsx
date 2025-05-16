const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;

interface GameState {
    leftPaddleY: number;
    rightPaddleY: number;
    ballX: number;
    ballY: number;
    ballSpeedX: number;
    ballSpeedY: number;
    leftScore: number;
    rightScore: number;
    upPressed: boolean;
    downPressed: boolean;
    wPressed: boolean;
    sPressed: boolean;
}

const createPongGame = () => {
    const state: GameState = {
        leftPaddleY: 0,
        rightPaddleY: 0,
        ballX: 0,
        ballY: 0,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED,
        leftScore: 0,
        rightScore: 0,
        upPressed: false,
        downPressed: false,
        wPressed: false,
        sPressed: false,
    };

    let width = 0;
    let height = 0;

    let leftPaddleTouchId: number | null = null;
    let rightPaddleTouchId: number | null = null;
    let leftPaddleTouchStartY = 0;
    let rightPaddleTouchStartY = 0;

    const resetBall = () => {
        state.ballX = width / 2;
        state.ballY = height / 2;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
        state.ballSpeedX = INITIAL_BALL_SPEED * Math.cos(angle) * direction;
        state.ballSpeedY = INITIAL_BALL_SPEED * Math.sin(angle);
    };

    const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const x = touch.clientX;
            if (x < width / 2 && leftPaddleTouchId === null) {
                leftPaddleTouchId = touch.identifier;
                leftPaddleTouchStartY = touch.clientY;
            } else if (x >= width / 2 && rightPaddleTouchId === null) {
                rightPaddleTouchId = touch.identifier;
                rightPaddleTouchStartY = touch.clientY;
            }
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (touch.identifier === leftPaddleTouchId) {
                const deltaY = touch.clientY - leftPaddleTouchStartY;
                state.leftPaddleY = Math.max(
                    0,
                    Math.min(
                        height - PADDLE_HEIGHT,
                        state.leftPaddleY + deltaY * 1.5
                    )
                );
                leftPaddleTouchStartY = touch.clientY;
            } else if (touch.identifier === rightPaddleTouchId) {
                const deltaY = touch.clientY - rightPaddleTouchStartY;
                state.rightPaddleY = Math.max(
                    0,
                    Math.min(
                        height - PADDLE_HEIGHT,
                        state.rightPaddleY + deltaY * 1.5
                    )
                );
                rightPaddleTouchStartY = touch.clientY;
            }
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            if (touch.identifier === leftPaddleTouchId) {
                leftPaddleTouchId = null;
            } else if (touch.identifier === rightPaddleTouchId) {
                rightPaddleTouchId = null;
            }
        }
    };

    const keyDownHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                state.upPressed = true;
                break;
            case "ArrowDown":
                state.downPressed = true;
                break;
            case "w":
                state.wPressed = true;
                break;
            case "s":
                state.sPressed = true;
                break;
        }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                state.upPressed = false;
                break;
            case "ArrowDown":
                state.downPressed = false;
                break;
            case "w":
                state.wPressed = false;
                break;
            case "s":
                state.sPressed = false;
                break;
        }
    };

    const init = (w: number, h: number) => {
        width = w;
        height = h;
        state.leftPaddleY = height / 2 - PADDLE_HEIGHT / 2;
        state.rightPaddleY = height / 2 - PADDLE_HEIGHT / 2;
        resetBall();

        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.addEventListener("touchstart", handleTouchStart, {
                passive: false,
            });
            canvas.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            canvas.addEventListener("touchend", handleTouchEnd);
        }
    };

    const cleanup = () => {
        document.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("keyup", keyUpHandler);

        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.removeEventListener("touchstart", handleTouchStart);
            canvas.removeEventListener("touchmove", handleTouchMove);
            canvas.removeEventListener("touchend", handleTouchEnd);
        }
    };

    const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        if (width !== w || height !== h) {
            init(w, h);
        }

        if (state.upPressed && state.rightPaddleY > 0) {
            state.rightPaddleY -= PADDLE_SPEED;
        }
        if (state.downPressed && state.rightPaddleY < height - PADDLE_HEIGHT) {
            state.rightPaddleY += PADDLE_SPEED;
        }
        if (state.wPressed && state.leftPaddleY > 0) {
            state.leftPaddleY -= PADDLE_SPEED;
        }
        if (state.sPressed && state.leftPaddleY < height - PADDLE_HEIGHT) {
            state.leftPaddleY += PADDLE_SPEED;
        }

        state.ballX += state.ballSpeedX;
        state.ballY += state.ballSpeedY;

        if (state.ballY - BALL_SIZE < 0 || state.ballY + BALL_SIZE > height) {
            state.ballSpeedY = -state.ballSpeedY;
        }

        if (
            state.ballX - BALL_SIZE < PADDLE_WIDTH &&
            state.ballY > state.leftPaddleY &&
            state.ballY < state.leftPaddleY + PADDLE_HEIGHT
        ) {
            const relativeIntersect =
                (state.ballY - (state.leftPaddleY + PADDLE_HEIGHT / 2)) /
                (PADDLE_HEIGHT / 2);
            const bounceAngle = (relativeIntersect * Math.PI) / 3;
            state.ballSpeedX = INITIAL_BALL_SPEED * Math.cos(bounceAngle);
            state.ballSpeedY = INITIAL_BALL_SPEED * Math.sin(bounceAngle);
        }

        if (
            state.ballX + BALL_SIZE > width - PADDLE_WIDTH &&
            state.ballY > state.rightPaddleY &&
            state.ballY < state.rightPaddleY + PADDLE_HEIGHT
        ) {
            const relativeIntersect =
                (state.ballY - (state.rightPaddleY + PADDLE_HEIGHT / 2)) /
                (PADDLE_HEIGHT / 2);
            const bounceAngle = (relativeIntersect * Math.PI) / 3;
            state.ballSpeedX = -INITIAL_BALL_SPEED * Math.cos(bounceAngle);
            state.ballSpeedY = INITIAL_BALL_SPEED * Math.sin(bounceAngle);
        }

        if (state.ballX < 0) {
            state.rightScore++;
            resetBall();
        }
        if (state.ballX > width) {
            state.leftScore++;
            resetBall();
        }

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "#fff";
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, state.leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillRect(
            width - PADDLE_WIDTH,
            state.rightPaddleY,
            PADDLE_WIDTH,
            PADDLE_HEIGHT
        );

        ctx.beginPath();
        ctx.arc(state.ballX, state.ballY, BALL_SIZE, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(state.leftScore.toString(), width / 4, 50);
        ctx.fillText(state.rightScore.toString(), (3 * width) / 4, 50);
    };

    return { draw, cleanup };
};

export const PongGame = createPongGame();
