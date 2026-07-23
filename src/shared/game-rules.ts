import type { BallState } from "../shared/ball";
import { resetBall } from "../shared/ball";
import type { PaddleState } from "../shared/paddle";
import { resetPaddle } from "../shared/paddle";
import type { ScoreState } from "../shared/score";
import { addScore } from "../shared/score";

export type GameRulesState = {
    winner?: "left" | "right";
    winningScore: number;
};

export function createGameRules(
    winningScore = 5
): GameRulesState {
    return {
        winningScore
    };
}

export function updateGameRules(
    rules: GameRulesState,
    score: ScoreState,
    ball: BallState,
    leftPaddle: PaddleState,
    rightPaddle: PaddleState
): void {
    if (rules.winner !== undefined) {
        return;
    }

    if (ball.x + ball.radius < 0) {
        addScore(score, "right");

        if (score.rightScore >= rules.winningScore) {
            rules.winner = "right";
        }

        resetBall(ball, -1);
        resetPaddle(leftPaddle);
        resetPaddle(rightPaddle);

        return;
    }

    if (ball.x - ball.radius > ball.fieldWidth) {
        addScore(score, "left");

        if (score.leftScore >= rules.winningScore) {
            rules.winner = "left";
        }

        resetBall(ball, 1);
        resetPaddle(leftPaddle);
        resetPaddle(rightPaddle);
    }
}