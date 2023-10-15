const ballVelocity = 10
const ballSize = 20
const gameOverLayout = document.getElementById("gameOverLayout")
const menu = document.querySelector(".menu")
const pause = document.querySelector(".pause")
const startGameBtn = document.getElementById("gameOnBtn")
const gameOverBtn = document.getElementById("gameOverBtn")
const gameContinueBtn = document.getElementById("gameContinueBtn")
const gameRestartBtn = document.getElementById("gameRestartBtn")
const gameOverMessage = document.getElementById("gameOverMessage")
const table = document.querySelector('[data-table]')
const main = document.querySelector('main')
const resultsContainer = document.querySelector('.result-table-container')

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
        this.y = this.game.ball.y-this.height/2
        if(this.y<0) this.y=0
        if(this.y > this.game.height - this.height) this.y = this.game.height - this.height

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
                if(this.game.leftDinoScore==3) this.game.stopGame('Congratulations! You won!!!')
                else this.game.leftDinoScore++
            }else{
                if(this.game.rightDinoScore==3) this.game.stopGame('You lost(((')
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
    constructor (game) {
        console.log('keys cleaned');
         this.keys = []
         this.game = game
         window.addEventListener('keydown',e=>{
            if(e.key === 'ArrowDown' && this.keys.indexOf(e.key) === -1||
            e.key === 'ArrowUp' && this.keys.indexOf(e.key) === -1
            ){
                this.keys.push(e.key)
            }
            if(e.key === ' ' && this.keys.indexOf('space') === -1){
                this.keys.push('space')
            }
        })
        
        window.addEventListener('keyup',e=>{
            if(e.key === 'ArrowDown'||
                e.key === 'ArrowUp'
                
            ){
                console.log('cleaned');
                console.log(this.keys)
                this.keys.splice(this.keys.indexOf(e.key),1)
            }
           
         })
    }
}

const canvas = document.getElementById('pCanvas')

canvas.width = main.clientWidth;
canvas.height = main.clientHeight;
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
        this.score = new Score(this)
        this.playOn = true
        this.input = new InputHandler(this)
    }
    update(){
        this.checkPauseKey()
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
    startGame(cls){
        cls.forEach(x=>x.classList.remove('active'))
        this.playOn = true
        animate()
    }
    continueGame(){
        pause.classList.remove('active')
        this.playOn = true
        console.log('cleaned grom continue game');
        if(this.input.keys.includes('space'))this.input.keys.splice(this.input.keys.indexOf('space'),1)
        animate()
    }
    stopGame(msg){
        this.playOn = false
        gameOverMessage.textContent = msg
        gameOverLayout.classList.add('active');
    }
    pauseGame(){
        this.playOn = false
        pause.classList.add('active')
    }
    checkPauseKey(){
        // console.log('checking');
        // console.log(this.input.keys);


        if(this.input.keys.includes('space')){
            console.log('includes space');
            game.pauseGame()
        }

    }
}

let game = new Game(canvas.width,canvas.height)
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    game.update()
    game.draw(ctx)
    if(game.playOn){
        requestAnimationFrame(animate)
    }
}

const initTable = () => {
    const results = [
        {date:'10.10.2023',playerI:1,playerAI:3},
        {date:'10.08.2023',playerI:3,playerAI:2},
        {date:'10.01.2023',playerI:3,playerAI:1},
    ]
    results.forEach(x=>{
        
        const divDate = document.createElement('div')
        const dateTxt = document.createTextNode(x.date)
        divDate.appendChild(dateTxt)
        
        const divResultI = document.createElement('div')
        divResultI.classList.add('table-row')
        const divResultITxt = document.createTextNode(`I ${x.playerI}`)
        divResultI.appendChild(divResultITxt)
        
        const divResultAI = document.createElement('div')
        const divResultAITxt = document.createTextNode(`Dino AI ${x.playerAI}`)
        divResultAI.appendChild(divResultAITxt)
        
        const divResults = document.createElement('div')
        divResults.appendChild(divResultI)
        divResults.appendChild(divResultAI)

        const divRow = document.createElement('div')
        divRow.classList.add('flex-centered')
        divRow.classList.add('table-row')
        divRow.appendChild(divDate)
        divRow.appendChild(divResults)

        table.appendChild(divRow)

    })
}

initTable()

startGameBtn.addEventListener('click',()=>{
    game.startGame([menu,resultsContainer])
}
)
gameOverBtn.addEventListener('click',()=>{
    game = new Game(canvas.width,canvas.height)
    game.startGame([gameOverLayout])
    }
)
gameContinueBtn.addEventListener('click',()=>{
    game.continueGame()
    }
)
gameRestartBtn.addEventListener('click',()=>{
    game = new Game(canvas.width,canvas.height)
    game.startGame([pause])
    }
)



