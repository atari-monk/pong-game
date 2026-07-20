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

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    ball: BallState;
    leftPaddle: PaddleState;
    rightPaddle: PaddleState;
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
        rightPaddle: createPaddle(width, height, "right")
    };
}

export function updateGame(
    state: GameState,
    dt: number
): void {
    updatePaddle(
        state.leftPaddle,
        state.input,
        "w",
        "s",
        dt
    );

    updatePaddle(
        state.rightPaddle,
        state.input,
        "ArrowUp",
        "ArrowDown",
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
}

export function renderGame(
    state: GameState,
    _alpha: number
): void {
    const ctx = state.renderer.ctx;

    state.renderer.clear();

    renderBall(state.ball, ctx);
    renderPaddle(state.leftPaddle, ctx);
    renderPaddle(state.rightPaddle, ctx);
}