import type { BallState } from "../shared/ball";
import { resetBall } from "../shared/ball";
import type { PaddleState } from "../shared/paddle";
import { resetPaddle } from "../shared/paddle";

export type GameRulesState = {
    leftScore: number;
    rightScore: number;
    winner?: "left" | "right";
    winningScore: number;
};

export function createGameRules(
    winningScore = 10
): GameRulesState {
    return {
        leftScore: 0,
        rightScore: 0,
        winningScore
    };
}

export function updateGameRules(
    rules: GameRulesState,
    ball: BallState,
    leftPaddle: PaddleState,
    rightPaddle: PaddleState
): void {
    if (rules.winner !== undefined) {
        return;
    }

    if (ball.x + ball.radius < 0) {
        rules.rightScore++;

        if (rules.rightScore >= rules.winningScore) {
            rules.winner = "right";
        }

        resetBall(ball, -1);
        resetPaddle(leftPaddle);
        resetPaddle(rightPaddle);

        return;
    }

    if (ball.x - ball.radius > ball.fieldWidth) {
        rules.leftScore++;

        if (rules.leftScore >= rules.winningScore) {
            rules.winner = "left";
        }

        resetBall(ball, 1);
        resetPaddle(leftPaddle);
        resetPaddle(rightPaddle);
    }
}