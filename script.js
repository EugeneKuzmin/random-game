
const ballVelocity = 10
const ballSize = 20
const gameOverLayout = document.querySelector('gameOverLayout')

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }



class LeftDino {
    constructor(game){
        this.game = game
        this.width = 100
        this.height = 100
        this.x = 0
        this.y = this.game.height/2
        this.image = document.getElementById('leftDino')
        this.speed = 0
        this.maxSpeed = 3
    }
    update(input){
        this.y +=this.speed
        if(input.includes('ArrowUp')) this.speed -= this.maxSpeed
        else if(input.includes('ArrowDown')) this.speed += this.maxSpeed
        else this.speed = 0
        if(this.y<0) this.y=0
        if(this.y > this.game.height - this.height) this.y = this.game.height - this.height

        }
    draw(context){
        context.fillStyle = "white";
        context.fillRect(this.x,this.y,this.width,this.height)
        context.drawImage(this.image,0,0,this.width,this.height,this.x,this.y,this.width,this.height)
    }
}
class RightDino {
    constructor(game){
        this.game = game
        this.width = 100
        this.height = 100
        this.x = this.game.width-this.width
        this.y = this.game.height/2
        this.image = document.getElementById('rightDino')
    }
    update(){
        this.y = this.game.ball.y

        }
    draw(context){
        context.fillStyle = "white";
        context.fillRect(this.x,this.y,this.width,this.height)
        context.drawImage(this.image,0,0,this.width,this.height,this.x,this.y,this.width,this.height)
    }
}

class Ball {
    constructor(game){
        this.game = game
        this.width = ballSize
        this.height = ballSize
        this.x = this.game.width/2
        this.y = this.game.height/2
        this.velocityX = 3
        this.velocityY = 3
    }
    update(){
        this.x +=this.velocityX
        this.y -=this.velocityY

        if (this.y < ballSize) {
            this.y = ballSize
            this.velocityY *= -1
        }else if (this.y + ballSize > this.game.height - ballSize) {
            this.y = this.game.height - ballSize * 2
            this.velocityY *= -1
        }

        if ( (this.x < 0 || this.x > this.game.width)) {
            this.x = this.game.width / 2;
            this.y = this.game.height / 2;
            if(this.x < 0){
                if(this.game.leftDinoScore==3) this.game.stopGame()
                else this.game.leftDinoScore++
            }else{
                if(this.game.rightDinoScore==3) this.game.stopGame()
                else this.game.rightDinoScore++
            }
           
        }

        if (collides(this, this.game.leftDino)) {
            this.velocityX *= -1;
            this.x = this.game.leftDino.x + this.game.leftDino.width;
        }else if (collides(this, this.game.rightDino)) {
            this.velocityX *= -1;
            this.x = this.game.rightDino.x - this.width;
        }

    }
    draw(context){
        context.fillStyle = "black";
        context.fillRect(this.x,this.y,this.width,this.height)
    }
}

class Score {
    constructor (game) {
        this.game = game
    }
    draw(ctx){
        ctx.fillStyle = "rgba(100,100,100)";
        ctx.fillText(this.game.leftDinoScore,this.game.width*0.25,this.game.height*0.25);
        ctx.fillText(this.game.rightDinoScore,this.game.width*0.75,this.game.height*0.25);
    }
} 

class InputHandler {
    constructor () {
         this.keys = []
         window.addEventListener('keydown',e=>{
            if(e.key === 'ArrowDown' && this.keys.indexOf(e.key) === -1||
            e.key === 'ArrowUp' && this.keys.indexOf(e.key) === -1
            ){
                this.keys.push(e.key)
            }
        })
        
        window.addEventListener('keyup',e=>{
            if(e.key === 'ArrowDown'||
                e.key === 'ArrowUp'
            ){
                this.keys.splice(this.keys.indexOf(e.key),1)
            }
         })
    }
}



window.addEventListener('load', ()=>{
    const canvas = document.getElementById('pCanvas')

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')
    ctx.font = "200px 'Roboto', Arial";
    ctx.textAlign = "center";

        class Game {
            constructor(width,height){
                this.width = width
                this.height = height
                this.leftDinoScore = 0
                this.rightDinoScore = 0
                this.leftDino = new LeftDino(this)
                this.rightDino = new RightDino(this)
                this.ball = new Ball(this)
                this.input = new InputHandler()
                this.score = new Score(this)
                this.playOn = true
            }
            update(){
                this.leftDino.update(this.input.keys)
                this.rightDino.update()
                this.ball.update()
                
            }
            draw(context){
                this.leftDino.draw(context)
                this.rightDino.draw(context)
                this.score.draw(context)
                this.ball.draw(context)
            }
            startGame(){
                this.playOn = true
                animate()
            }
            stopGame(){
                this.playOn = false
                gameOverLayout.classList.add('active');
            }
        }

        const game = new Game(canvas.width,canvas.height)
        function animate(){
            ctx.clearRect(0,0,canvas.width,canvas.height)
            game.update()
            game.draw(ctx)
            if(game.playOn){
                requestAnimationFrame(animate)
            }
        }
        animate()
    }
)
