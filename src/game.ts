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
        score: createScore()
    };
}

export function updateGame(
    state: GameState,
    dt: number
): void {
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

    renderBall(state.ball, ctx);
    renderPaddle(state.leftPaddle, ctx);
    renderPaddle(state.rightPaddle, ctx);
    renderScore(state.score, ctx);
}