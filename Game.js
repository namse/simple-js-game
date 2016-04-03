'use strict';
const broadcast = require('./Network').broadcast;

class Game {
    constructor() {
        this.target = {
            x: Math.random() * 100,
            y: Math.random() * 100,
            radius: 1,
        };
        this.isTargetOn = false;
        
        this.setTimer();
    }
    
    onHit(user, x, y) {
        const {
            target,
            isTargetOn,
        } = this;
        if( isTargetOn
        && target.x - target.radius <= x && x <= target.x + target.radius
        && target.y - target.radius <= y && y <= target.y + target.radius) {
            this.setTargetOff();
            user.addScore();
            broadcast();
            this.setTimer();
        }
    }
    
    setTargetOff() {
        this.isTargetOn = false;
    }
    
    setTimer() {
        setTimeout(() => {
            this.isTargetOn = true;
            this.target.x = Math.random() * 100;
            this.target.y = Math.random() * 100;
            broadcast();
        }, 3000);
    }
}

const game = new Game();

module.exports = game;