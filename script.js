const ballVelocity = 20
const ballSize = 20
const initialVelocity = 5
const velocityIncreaseStep = 0.01
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
const resultTableBtn = document.getElementById('resultTableBtn')
const audio = new Audio("./sounds/happytheme-22437.mp3")
const hitSound = new Audio("./sounds/mixkit-fast-blow-2144.wav")
const lostSound = new Audio("./sounds/mixkit-losing-bleeps-2026.wav")

audio.volume = .33

function collides(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }


class LeftDino {
    constructor(game){
        this.game = game
        this.width = 90
        this.height = 100
        this.x = 0
        this.y = this.game.height/2
        this.image = document.getElementById('leftDino')
        this.speed = 0
        this.maxSpeed = 3
        this.dinoFrame = 0
        this.dinoFrameCount = 2
    }
    update(input){
        this.y +=this.speed
        if(input.includes('ArrowUp')) 
        {
            this.speed -= this.maxSpeed
            this.handleMove()
        }

        else if(input.includes('ArrowDown'))
        {
            this.speed += this.maxSpeed
            this.handleMove()
        }
        else this.speed = 0
        if(this.y<0) this.y=0
        if(this.y > this.game.height - this.height) this.y = this.game.height - this.height

    }
    hit(){
        this.dinoFrame = 3

    }
    racketDown(){
        this.dinoFrame = 0
    }
    handleMove() {
        if(this.dinoFrame !=3 ){
            this.dinoFrame = (this.dinoFrame + 1) % this.dinoFrameCount
        }

    }
    draw(context){
        context.fillStyle = "white";
        context.fillRect(this.x,this.y,this.width,this.height)
        context.drawImage(this.image,this.width*this.dinoFrame,0,this.width,this.height,this.x,this.y,this.width,this.height)
    }


}
class RightDino {
    constructor(game){
        this.game = game
        this.width = 90
        this.height = 100
        this.x = this.game.width-this.width
        this.y = this.game.height/2
        this.image = document.getElementById('rightDino')
        this.speedAI = 0.02
    }
    update(){
        this.y += this.speedAI *  (this.game.ball.y - this.y)
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
        this.hitBall = false
      
        this.drctn = { x: 0 }
        while (
            Math.abs(this.drctn.x) <= 0.25 ||
            Math.abs(this.drctn.x) >= 0.8
        ) {
            const heading = Math.random() * 2 * Math.PI
            this.drctn = { x: Math.cos(heading), y: Math.sin(heading) }
        }
        this.velocity = initialVelocity
        }
    update(){
        this.x += this.drctn.x * this.velocity 
        this.y += this.drctn.y * this.velocity 
        this.velocity += velocityIncreaseStep

        if (this.y < ballSize) {
            this.y = ballSize
            this.drctn.y *= -1
        }else if (this.y + ballSize > this.game.height - ballSize) {
            this.y = this.game.height - ballSize * 2
            this.drctn.y *= -1
        }

        if ( (this.x < 0 || this.x > this.game.width)) {
            
            if(this.x <= 0){
                this.game.leftDinoScore++
                if(this.game.leftDinoScore>=3) this.game.stopGame('You lost(((')
            }else{
                this.game.rightDinoScore++
                if(this.game.rightDinoScore>=3) this.game.stopGame('Congratulations! You won!!!')
            }
            lostSound.play()
            this.reset()
        }
        if ( (this.x - 10*ballSize >= this.game.leftDino.width&&this.hitBall)) {
           this.game.leftDino.racketDown()
           this.hitBall = false
        }

        if (collides(this, this.game.leftDino)) {
            this.game.leftDino.hit()
            this.hitBall = true
            this.drctn.x *= -1;

            this.x = this.game.leftDino.x + this.game.leftDino.width;

            hitSound.play()

        }else if (collides(this, this.game.rightDino)) {
            this.drctn.x *= -1;
            this.x = this.game.rightDino.x - this.width;
            hitSound.play()
        }

    }
    draw(context){
        context.fillStyle = "black";
        context.fillRect(this.x,this.y,this.width,this.height)
    }
    reset(){
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
        this.velocity = initialVelocity
        this.drctn = { x: 0 }
        while (
            Math.abs(this.drctn.x) <= 0.25 ||
            Math.abs(this.drctn.x) >= 0.8
        ) {
            const heading = Math.random() * 2 * Math.PI
            this.drctn = { x: Math.cos(heading), y: Math.sin(heading) }
        }
   
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
        audio.play()
        animate()
    }
    continueGame(){
        pause.classList.remove('active')
        this.playOn = true
        if(this.input.keys.includes('space'))this.input.keys.splice(this.input.keys.indexOf('space'),1)
        animate()
    }
    stopGame(msg){
        this.playOn = false
        audio.pause()
        let rTbl = JSON.parse(localStorage.getItem('DinoPingPongGameReslts'))
        if(typeof rTbl !== "object"||rTbl == null) rTbl = []
        const currDate = new Date()
        const dateString = `${currDate.toLocaleDateString()} at ${currDate.getHours()}:${('0'+currDate.getMinutes()).slice(-2)}`
        rTbl.length?rTbl.unshift({date:dateString,playerI:this.leftDinoScore,playerAI:this.rightDinoScore}):rTbl.push({date:dateString,playerI:this.leftDinoScore,playerAI:this.rightDinoScore})
        if(rTbl.length>10)rTbl.splice(10,rTbl.length-10)

        localStorage.setItem('DinoPingPongGameReslts',JSON.stringify(rTbl))
        gameOverMessage.textContent = msg
        gameOverLayout.classList.add('active');
        resultsContainer.classList.add('active');
    }
    pauseGame(){
        this.playOn = false
        audio.pause()
        pause.classList.add('active')
    }
    checkPauseKey(){

        if(this.input.keys.includes('space')){
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
    let results = JSON.parse(localStorage.getItem('DinoPingPongGameReslts'))
    if(results!=null&&typeof results === "object") {
        table.textContent = ''
    
        results.forEach(x=>{
            
            const divDate = document.createElement('div')
            divDate.classList.add('date-fs')
            const dateTxt = document.createTextNode(x.date)
            divDate.appendChild(dateTxt)
            
            const divResultI = document.createElement('div')
            divResultI.classList.add('table-row')
            divResultI.classList.add('flex-centered')
            const divStrResultI = document.createElement('div')
            const divStrResultScore = document.createElement('div')
            const divResultITxt = document.createTextNode(`Your score`)
            const divResultScoreTxt = document.createTextNode(`${x.playerI}`)
            divStrResultI.appendChild(divResultITxt)
            divStrResultScore.appendChild(divResultScoreTxt)
            divResultI.appendChild(divStrResultI)
            divResultI.appendChild(divStrResultScore)
            
            const divResultAI = document.createElement('div')
            divResultAI.classList.add('table-row')
            divResultAI.classList.add('flex-centered')
            const divStrResultAI = document.createElement('div')
            const divStrResultScoreAI = document.createElement('div')
            const divResultAITxt = document.createTextNode(`Dino's AI score`)
            const divResultScoreAITxt = document.createTextNode(`${x.playerAI}`)
            divStrResultAI.appendChild(divResultAITxt)
            divStrResultScoreAI.appendChild(divResultScoreAITxt)
            divResultAI.appendChild(divStrResultAI)
            divResultAI.appendChild(divStrResultScoreAI)
            
            const divResults = document.createElement('div')
            divResults.appendChild(divResultI)
            divResults.appendChild(divResultAI)
            divResults.classList.add('score-layout')

            const divRow = document.createElement('div')
            divRow.classList.add('flex-centered')
            divRow.classList.add('table-row')
            divRow.appendChild(divDate)
            divRow.appendChild(divResults)

            table.appendChild(divRow)

        })

    }
}

initTable()

startGameBtn.addEventListener('click',()=>{
    game.startGame([menu,resultsContainer])
}
)
gameOverBtn.addEventListener('click',()=>{
    game = new Game(canvas.width,canvas.height)
    game.startGame([gameOverLayout,resultsContainer])
    }
)
gameContinueBtn.addEventListener('mousedown',()=>{
    game.continueGame()
    }
)
gameRestartBtn.addEventListener('mousedown',()=>{
    game = new Game(canvas.width,canvas.height)
    game.startGame([pause])
    }
)

resultTableBtn.addEventListener('click',()=>{
    initTable()
    table.hidden = !table.hidden

})

audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
});



