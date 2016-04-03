'use strict';
class User {
    constructor(socket){
        this.socket = socket;
        this.score = 0;
        this.name = '';
    }
    
    setName(name) {
        this.name = name.substring(0,10);
    }
    
    addScore() {
        this.score++;
    }
    
    getData() {
        const {
            score,
            name,
        } = this;
        return {
            score,
            name,
        };
    }
}

module.exports = User;
