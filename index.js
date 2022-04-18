const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

//////////////////////////////////////////////////////////////

class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}}){
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6
        this.offset = offset
    }

    animateFrames(){
        this.framesElapsed++

        if(this.framesElapsed % this.framesHold === 0){
            if(this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            }else{
                this.framesCurrent = 0
            }
        }
    }

    draw(){
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax, 
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            this.image.width*this.scale / this.framesMax, 
            this.image.height*this.scale
        )
    }

    update(){
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position, velocity, color, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}, sprites }){

        super({
            position,
            imageSrc,
            scale, 
            framesMax,
            offset
        })
    
        this.velocity = velocity
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6
        this.color = color
        this.height = 150
        this.width = 50
        this.lastKey
        this.isAttacking
        this.sprites = sprites

        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 100,
            height: 50
        }

        for(const sprite in this.sprites){
            this.sprites[sprite].image = new Image()
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
        console.log(sprites)

    }
    

    attack(){
        this.switchSprite('attack1')
        this.isAttacking = true
        setTimeout(()=>{
            this.isAttacking = false
        }, 100)
    }

    switchSprite(sprite){
        if(
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image)
                    {
                        this.framesCurrent = 0
                        this.image = this.sprites.idle.image
                        this.framesMax = this.sprites.idle.framesMax
                    }
                break
            case 'run':
                if(this.image !== this.sprites.run.image)
                    {
                        this.framesCurrent = 0
                        this.image = this.sprites.run.image
                        this.framesMax = this.sprites.run.framesMax
                    }
                break
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                }
                break
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                }
                break
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                }
                break
        }
    }

    update(){
        this.draw()
        this.animateFrames()
        

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        
        if(this.lastKey === 'd' || this.lastKey === 'ArrowRight'){
            this.attackBox.position.x = this.position.x
            this.attackBox.position.y = this.position.y
        }else if(this.lastKey === 'a' || this.lastKey === 'ArrowLeft'){
            this.attackBox.position.x = this.position.x - this.width
            this.attackBox.position.y = this.position.y
        }

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 300){
            this.velocity.y = 0
        }else this.velocity.y += gravity
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './background.jpg',
})

const shop = new Sprite({
    position:{
        x: 600,
        y: 120
    },
    imageSrc: './decorations/shop_anim.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "red",
    imageSrc: './samuraiMack/Idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imageSrc: './samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './samuraiMack/Attack1.png',
            framesMax: 6
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 100,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue"
})

player.draw()
// enemy.draw()

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

let timer = 10
function decreaseTimer(){
    setTimeout(decreaseTimer, 1000)
    if(timer > 0){
        timer--
        document.querySelector('#timer').innerHTML = timer
    }else{
        findWinner()
    }
}
decreaseTimer()

function displayWinner(winner){
    console.log(winner)
}

function findWinner(){
    enemyHealth = document.getElementById('enemyHealth').style.width
    enemyHealth = enemyHealth.substring(0, enemyHealth.length - 1)

    playerHealth = document.getElementById('playerHealth').style.width
    playerHealth = playerHealth.substring(0, playerHealth.length - 1)


    if(Number(enemyHealth) === Number(playerHealth)){
        displayWinner("TIE")

    }else if(Number(enemyHealth) < Number(playerHealth)){
        displayWinner("Enemy won")

    }else if(Number(enemyHealth) > Number(playerHealth)){
        displayWinner("Player won")

    }

    
    timer = 0
    document.querySelector('#timer').innerHTML = timer
}



function detectCollision(box1, box2){
    return (
        box1.attackBox.position.x + box1.attackBox.width >=box2.position.x &&
        box1.attackBox.position.x <= box2.position.x + box2.width &&
        box1.attackBox.position.y + box1.attackBox.height >= box2.position.y &&
        box1.attackBox.position.y <= box2.position.y + box2.height
    )
}


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    shop.update()
    player.update()
    // enemy.update()

    player.velocity.x = 0
    

    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -2
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 2
        player.switchSprite('run')
    }else{
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0){
        player.switchSprite('jump')
    } else if(player.velocity.y>0){
        player.switchSprite('fall')
    }
    
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -2
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 2
    }


    if (detectCollision(player, enemy) && player.isAttacking){   
        player.isAttacking = false
        console.log("player attacked")

        width = document.getElementById('enemyHealth').style.width
        width = width.substring(0, width.length - 1)
        document.getElementById('enemyHealth').style.width = String(Number(width)-20) + '%'
        if(Number(width)-20===0){
            displayWinner("PLAYER WON")
        }
    }

    if(detectCollision(enemy, player) && enemy.isAttacking){
        enemy.isAttacking = false
        console.log("enemy attacked")

        width = document.getElementById('playerHealth').style.width
        width = width.substring(0, width.length - 1)
        document.getElementById('playerHealth').style.width = String(Number(width)-20) + '%'
        if(Number(width)-20===0){
            displayWinner("ENEMY WON")
        }
    }
    
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -15
            break
        case " ":
            player.attack()
            break


        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case "m":
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})