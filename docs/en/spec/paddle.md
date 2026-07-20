Given your ball behavior, the **simplest paddle behavior** should be equally minimal:

### Simplest Pong Paddle Behavior

* Spawn near the left or right edge.
* Have a fixed width and height.
* Move only vertically (up/down).
* Stay at a fixed horizontal position.
* Follow player input.
* Stop at the top wall.
* Stop at the bottom wall.
* Collide with the ball.
* Do not rotate.
* Do not accelerate.
* Reset to starting position after a score.

That is enough to make a playable Pong.

### Player paddle behavior

```text
Player presses up:
    paddle.y -= speed

Player presses down:
    paddle.y += speed

Clamp paddle.y:
    if paddle touches top:
        stop

    if paddle touches bottom:
        stop
```

### Example data

```text
Paddle:
    x
    y
    width
    height
    speed
```

Example:

```
Left paddle:
    x = 20
    y = center of screen
    width = 10
    height = 80

Right paddle:
    x = screen_width - 30
    y = center of screen
    width = 10
    height = 80
```

### Collision with ball

The paddle only needs a rectangle collision check:

```
if ball overlaps paddle:
    ball.direction_x *= -1
```

Optionally add a small angle change:

```
hit_position = ball.y - paddle.center_y

ball.velocity_y += hit_position * factor
```

But for the **simplest version**, just reverse horizontal movement.

---

### Minimal paddle update loop

```text
update_paddle():
    if up_pressed:
        y -= speed

    if down_pressed:
        y += speed

    y = clamp(y, 0, screen_height - height)
```

---

### Rendering

Use a rectangle:

```
draw_rect(
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height,
    white
)
```

Unlike the ball, there is no benefit to making the paddle a circle. A Pong paddle is naturally a rectangle, and a rectangle collision is simpler and faster.

Your current ball draft + this paddle behavior gives you the original Pong gameplay loop with the minimum number of systems.
