## `pong-game` History

This doc is trying to observe and describe process of building.  

### Init

Game is initialized by script `/home/atari-monk/atari-monk/project/tools/src/create-project.sh`.  
It makes copy of repository 'atom-starter' and runs bunch of setup commands on it.  

Project is structured out of the box.  
App layer contains configs, web page ui, style and main entypoint integrating app.  
game.ts integrates game objects and handles their life cycle.  
src/shared stores game parts with interface of GameObject.  

Game was tested with pulsing rect at screen center proving initial setup works fine.  

### Definitions

Draft - Human writen high level document with draft of game part.  
Spec - AI written document where draft is input. Defines game part in greater detail.  
`src` content - Ai generated Typescript implementation based on Spec document, code base and docs.

Most offen ocurring scheme of generating code:  
- Draft
- Spec
- Game Object Implementation
- Game and Game Object Integration

[`docs/en/log.md`](log.md) - pomodoro log, format: date and numbered list describing what each pomodoro was about. To hold attention.    
`docs/en/project-history.md` - this file with notes about project. Log that should show what project is about.  

In draft [Pong Game](draft/pong-game.md).  
High level project assumptions.  

Prompts:
- Given context generate spec that will drive implementation of drafted GameObject.
- Given context implement GameObject according to spec and context. Use engine lib if it provides needed functionality.
- Integrate given GameObject in Game.

### Simple Ball

Ball defined in draft [Pong Ball](draft/pong-ball.md)
Spec was generated for [ball](spec/ball.md).  
Implemented, integrated with game and tested.  
Committed: feat(ball): add pong ball.  

### Simple Paddle

Spec was generated for [paddle](spec/paddle.md).  
Implemented, integrated with game and tested.  
Committed: feat(paddle): add pong paddles.  