# Pong Ball Specification

## Goal

Implement a self-contained Pong ball object responsible for:

* storing its own state
* moving every update
* bouncing off top/bottom walls
* rendering itself
* resetting after scoring

The object **does not own the game**.

It does **not**:

* update scores
* know about paddles
* decide when a round starts

Those are responsibilities of the game.

---

# Public API

```ts
export type BallState = {
    x: number;
    y: number;

    vx: number;
    vy: number;

    radius: number;
    speed: number;

    color: string;

    fieldWidth: number;
    fieldHeight: number;
};

export function createBall(
    fieldWidth: number,
    fieldHeight: number,
    radius?: number,
    speed?: number
): BallState;

export function updateBall(
    ball: BallState,
    dt: number
): void;

export function renderBall(
    ball: BallState,
    ctx: CanvasRenderingContext2D
): void;

export function renderBallRect(
    ball: BallState,
    ctx: CanvasRenderingContext2D
): void;

export function resetBall(
    ball: BallState,
    direction: -1 | 1
): void;

export function bounceBallVertical(
    ball: BallState
): void;

export function bounceBallHorizontal(
    ball: BallState
): void;
```

---

# State

| Property    | Description             |
| ----------- | ----------------------- |
| x           | Center X position       |
| y           | Center Y position       |
| vx          | Horizontal velocity     |
| vy          | Vertical velocity       |
| radius      | Collision/render radius |
| speed       | Constant movement speed |
| color       | Render color            |
| fieldWidth  | Playfield width         |
| fieldHeight | Playfield height        |

Velocity should always be normalized to `speed`.

---

# Creation

When created:

* position is centered

```
x = fieldWidth / 2
y = fieldHeight / 2
```

* choose initial horizontal direction randomly

```
left OR right
```

* choose a small random vertical angle

Example:

```
-30° ... +30°
```

Normalize the direction and multiply by `speed`.

---

# Update

Every update:

```
x += vx * dt
y += vy * dt
```

---

# Top/Bottom Collision

If

```
y - radius <= 0
```

then

```
y = radius
vy = -vy
```

---

If

```
y + radius >= fieldHeight
```

then

```
y = fieldHeight - radius
vy = -vy
```

---

# Paddle Collision

The ball itself does **not** detect paddles.

Instead the game performs collision detection.

When a collision occurs the game calls

```
bounceBallHorizontal(ball)
```

The function should:

```
vx = -vx
```

Optionally normalize velocity afterwards.

---

# Scoring

The ball never updates score.

The game checks

```
ball.x + ball.radius < 0
```

Left player missed.

Right player scores.

---

The game checks

```
ball.x - ball.radius > fieldWidth
```

Right player missed.

Left player scores.

---

After scoring:

```
resetBall(ball, direction)
```

where

```
direction = -1
```

launches toward left

and

```
direction = 1
```

launches toward right.

---

# Reset

Reset performs:

```
x = fieldWidth / 2
y = fieldHeight / 2
```

Generate a new random launch angle.

Horizontal direction is supplied by caller.

Velocity is rebuilt from

```
speed
direction
random angle
```

---

# Rendering

Default renderer:

```
white filled circle
```

using

```
ctx.arc(...)
```

---

Alternative renderer:

```
white rectangle
```

with dimensions

```
radius * 2
```

Useful for performance comparison.

---

# Invariants

The implementation should maintain the following:

* Ball always stays inside the playfield vertically.
* Ball speed remains constant after every bounce.
* Ball only changes direction when bouncing or resetting.
* Ball position represents its center.
* Rendering does not mutate state.
* Update does not perform score handling.
* Update does not perform paddle collision detection.

---

# Responsibilities

## Ball

* Own movement
* Own position
* Own velocity
* Bounce on top/bottom walls
* Reset itself
* Render itself

## Game

* Detect paddle collisions
* Call `bounceBallHorizontal()`
* Detect scoring
* Update player scores
* Decide launch direction after scoring
* Manage round flow

This separation keeps `Ball` as a reusable, deterministic game object while the game orchestrates interactions between objects.