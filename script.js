
const ballVelocity = 10
const ballSize = 20

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
            this.y = ballSize;
            this.velocityY *= -1;
        }else if (this.y + ballSize > this.game.height - ballSize) {
            this.y = this.game.height - ballSize * 2;
            this.velocityY *= -1;
        }

        if ( (this.x < 0 || this.x > this.game.width)) {
            this.x = this.game.width / 2;
            this.y = this.game.height / 2;
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
        context.fillRect(this.x,this.y,this.width,this.height)
        
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

    canvas.width = 900
    canvas.height = 600
    const ctx = canvas.getContext('2d')

        class Game {
            constructor(width,height){
                this.width = width
                this.height = height
                this.leftDino = new LeftDino(this)
                this.rightDino = new RightDino(this)
                this.ball = new Ball(this)
                this.input = new InputHandler()
            }
            update(){
                this.leftDino.update(this.input.keys)
                this.rightDino.update()
                this.ball.update()
                
            }
            draw(context){
                this.leftDino.draw(context)
                this.rightDino.draw(context)
                this.ball.draw(context)
            }
        }

        const game = new Game(canvas.width,canvas.height)
        function animate(){
            ctx.clearRect(0,0,canvas.width,canvas.height)
            game.update()
            game.draw(ctx)
            requestAnimationFrame(animate)
        }
        animate()
    }
)
