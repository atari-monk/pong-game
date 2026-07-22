import type { Input } from "atari-monk-atom-engine";

export type ScoreState = {
    leftScore: number;
    rightScore: number;
    visible: boolean;
    visibleTime: number;
};

export function createScore(): ScoreState {
    return {
        leftScore: 0,
        rightScore: 0,
        visible: false,
        visibleTime: 0
    };
}

export function addScore(
    score: ScoreState,
    side: "left" | "right"
): void {
    if (side === "left") {
        score.leftScore++;
    } else {
        score.rightScore++;
    }

    score.visible = true;
    score.visibleTime = 3;
}

export function updateScore(
    score: ScoreState,
    input: Input,
    dt: number
): void {
    if (input.isDown("p")) {
        score.visible = true;
        score.visibleTime = 3;
    }

    if (score.visibleTime > 0) {
        score.visibleTime -= dt;

        if (score.visibleTime <= 0) {
            score.visible = false;
            score.visibleTime = 0;
        }
    }
}

export function renderScore(
    score: ScoreState,
    ctx: CanvasRenderingContext2D
): void {
    if (!score.visible) {
        return;
    }

    ctx.fillStyle = "white";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
        `${score.leftScore} : ${score.rightScore}`,
        ctx.canvas.width / 2,
        50
    );
}