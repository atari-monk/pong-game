import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import {
    type BallState,
    createBall,
    updateBall,
    renderBall,
    bounceBallHorizontal
} from "./shared/ball";
import {
    type PaddleState,
    createPaddle,
    updatePaddle,
    renderPaddle,
    collidesWithPaddle
} from "./shared/paddle";
import {
    type GameRulesState,
    createGameRules,
    updateGameRules
} from "./shared/game-rules";
import {
    type ScoreState,
    createScore,
    updateScore,
    renderScore
} from "./shared/score";
import {
    type AIState,
    createAI,
    updateAI
} from "./shared/ai";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    ball: BallState;
    leftPaddle: PaddleState;
    rightPaddle: PaddleState;
    leftAI: AIState;
    rightAI: AIState;
    gameRules: GameRulesState;
    score: ScoreState;
    started: boolean;
    countdown: number;
    countdownActive: boolean;
    gameOverTimer: number;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    const width = renderer.ctx.canvas.width;
    const height = renderer.ctx.canvas.height;

    return {
        renderer,
        input,
        audio,
        ball: createBall(width, height),
        leftPaddle: createPaddle(width, height, "left"),
        rightPaddle: createPaddle(width, height, "right"),
        leftAI: createAI("left", 20),
        rightAI: createAI("right", 0),
        gameRules: createGameRules(),
        score: createScore(),
        started: false,
        countdown: 3,
        countdownActive: false,
        gameOverTimer: 0
    };
}

export function startGame(
    state: GameState
): void {
    state.gameRules.winner = undefined;
    state.score.leftScore = 0;
    state.score.rightScore = 0;
    state.gameOverTimer = 0;
    state.countdown = 3;
    state.countdownActive = true;
    state.started = false;
    state.ball.x = state.ball.fieldWidth / 2;
    state.ball.y = state.ball.fieldHeight / 2;
    state.ball.vx = 0;
    state.ball.vy = 0;
}

function updateCountdown(
    state: GameState,
    dt: number
): void {
    if (!state.countdownActive) {
        return;
    }

    state.countdown -= dt;

    if (state.countdown <= 0) {
        state.countdownActive = false;
        state.started = true;
        state.ball.vx = state.ball.speed * (Math.random() < 0.5 ? -1 : 1);
    }
}

function updateGameOver(
    state: GameState,
    dt: number
): void {
    if (!state.gameRules.winner) {
        return;
    }

    state.gameOverTimer += dt;

    if (state.gameOverTimer < 3) {
        return;
    }

    state.started = false;

    const overlay = document.getElementById("start-overlay");
    const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;

    if (overlay) {
        overlay.style.display = "flex";
    }

    if (canvas) {
        canvas.style.display = "none";
    }
}

function renderCountdown(
    state: GameState,
    ctx: CanvasRenderingContext2D
): void {
    if (!state.countdownActive) {
        return;
    }

    ctx.fillStyle = "white";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        Math.ceil(state.countdown).toString(),
        ctx.canvas.width / 2,
        70
    );
}

function renderGameOver(
    state: GameState,
    ctx: CanvasRenderingContext2D
): void {
    if (!state.gameRules.winner) {
        return;
    }

    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        `${state.score.leftScore} : ${state.score.rightScore}`,
        ctx.canvas.width / 2,
        ctx.canvas.height / 2
    );
}

export function updateGame(
    state: GameState,
    dt: number
): void {
    updateGameOver(state, dt);

    if (state.gameRules.winner) {
        return;
    }

    updateCountdown(state, dt);

    if (state.countdownActive || !state.started) {
        return;
    }

    if (state.leftAI.enabled) {
        updateAI(
            state.leftAI,
            state.leftPaddle,
            state.ball,
            dt
        );
    } else {
        updatePaddle(
            state.leftPaddle,
            state.input,
            "w",
            "s",
            dt
        );
    }

    if (state.rightAI.enabled) {
        updateAI(
            state.rightAI,
            state.rightPaddle,
            state.ball,
            dt
        );
    } else {
        updatePaddle(
            state.rightPaddle,
            state.input,
            "ArrowUp",
            "ArrowDown",
            dt
        );
    }

    updateScore(
        state.score,
        state.input,
        dt
    );

    updateBall(state.ball, dt);

    if (
        collidesWithPaddle(
            state.leftPaddle,
            state.ball
        ) ||
        collidesWithPaddle(
            state.rightPaddle,
            state.ball
        )
    ) {
        bounceBallHorizontal(state.ball);
    }

    updateGameRules(
        state.gameRules,
        state.score,
        state.ball,
        state.leftPaddle,
        state.rightPaddle
    );
}

export function renderGame(
    state: GameState,
    _alpha: number
): void {
    const ctx = state.renderer.ctx;

    state.renderer.clear();

    if (state.gameRules.winner) {
        renderGameOver(state, ctx);
        return;
    }

    renderBall(state.ball, ctx);
    renderPaddle(state.leftPaddle, ctx);
    renderPaddle(state.rightPaddle, ctx);

    if (!state.countdownActive) {
        renderScore(state.score, ctx);
    }

    renderCountdown(state, ctx);
}