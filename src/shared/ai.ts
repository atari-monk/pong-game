import type { BallState } from "./ball";
import type { PaddleState } from "./paddle";

export type AIState = {
    enabled: boolean;
    side: "left" | "right";
    difficulty: number;
    targetY: number;
    reactionTimer: number;
};

export function createAI(
    side: "left" | "right",
    difficulty = 50
): AIState {
    return {
        enabled: difficulty > 0,
        side,
        difficulty: Math.max(0, Math.min(100, difficulty)),
        targetY: 0,
        reactionTimer: 0
    };
}

export function updateAI(
    ai: AIState,
    paddle: PaddleState,
    ball: BallState,
    dt: number
): void {
    if (!ai.enabled) {
        return;
    }

    const accuracy = ai.difficulty / 100;

    ai.reactionTimer -= dt;

    if (ai.reactionTimer <= 0) {
        const reactionDelay =
            0.35 - accuracy * 0.3;

        ai.reactionTimer =
            Math.max(0.05, reactionDelay);

        const prediction =
            ball.vy *
            (0.05 + accuracy * 0.2);

        const error =
            (Math.random() * 2 - 1) *
            (120 - accuracy * 120);

        ai.targetY =
            ball.y -
            paddle.height / 2 +
            prediction +
            error;
    }

    const speed =
        0.04 +
        accuracy * 0.5;

    const difference =
        ai.targetY - paddle.y;

    paddle.y +=
        difference *
        speed *
        dt *
        60;

    paddle.y = Math.max(
        0,
        Math.min(
            paddle.fieldHeight - paddle.height,
            paddle.y
        )
    );
}