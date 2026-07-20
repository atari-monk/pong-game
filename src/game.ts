import type { Renderer, Input, Audio } from "atari-monk-atom-engine";
import {
    type BallState,
    createBall,
    updateBall,
    renderBall,
    //renderBallRect
} from "./shared/ball";

export type GameState = {
    renderer: Renderer;
    input: Input;
    audio: Audio;
    ball: BallState;
};

export function createGame(
    renderer: Renderer,
    input: Input,
    audio: Audio
): GameState {
    return {
        renderer,
        input,
        audio,
        ball: createBall(
            renderer.ctx.canvas.width,
            renderer.ctx.canvas.height
        )
    };
}

export function updateGame(
    state: GameState,
    dt: number
): void {
    updateBall(state.ball, dt);
}

export function renderGame(
    state: GameState,
    _alpha: number
): void {
    const ctx = state.renderer.ctx;

    state.renderer.clear();
    renderBall(state.ball, ctx);
}