var PLAY = 1
var END = 0
var gameState = PLAY

var backgroundImg

var astronauta, astronauta_running, astronauta_collided
var ground, ground2, invisibleGround, invisibleGround2, invisibleGround3, groundImage

//var cloudsGroup, cloudImage
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6

var score = 0

var gameOver, restart

function preload() {
  astronauta_running = loadAnimation('astronauta_0.png','astronauta_1.png','astronauta_2.png','astronauta_3.png','astronauta_4.png','astronauta_5.png','astronauta_6.png','astronauta_7.png')
  astronauta_collided = loadAnimation('astronauta_0.png')
  astronauta_running2 = loadAnimation('astronauta_de_ponta_cabeça_1.png','astronauta_de_ponta_cabeça_2.png','astronauta_de_ponta_cabeça_3.png','astronauta_de_ponta_cabeça_4.png','astronauta_de_ponta_cabeça_5.png','astronauta_de_ponta_cabeça_6.png','astronauta_de_ponta_cabeça_7.png','astronauta_de_ponta_cabeça_8.png')

  groundImage = loadImage('ground2.png')

 // cloudImage = loadImage('cloud.png')

  backgroundImg = loadImage('background.gif')

  obstacle1 = loadAnimation('sprite_0.png', 'sprite_1.png', 'sprite_2.png', 'sprite_3.png')
  obstacle2 = loadAnimation('sprite_4.png', 'sprite_5.png', 'sprite_6.png', 'sprite_7.png')
  obstacle3 = loadAnimation('sprite_8.png','sprite_9.png', 'sprite_10.png', 'sprite_11.png')
  obstacle4 = loadAnimation('sprite_12.png','sprite_13.png','sprite_14.png','sprite_15.png')
  obstacle5 = loadAnimation('sprite_16.png','sprite_17.png','sprite_18.png','sprite_19.png')
  obstacle6 = loadAnimation('sprite_20.png','sprite_21.png','sprite_22.png','sprite_23.png')

  gameOverAni = loadAnimation('gameover_1.png','gameover_2.png','gameover_3.png','gameover_4.png','gameover_5.png','gameover_6.png','gameover_7.png','gameover_8.png')
  restartAni = loadAnimation('restart_1.png','restart_2.png','restart_3.png','restart_4.png','restart_5.png','restart_6.png','restart_7.png','restart_8.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight)

  astronauta = createSprite(50, height - 80, 20, 50)

  astronauta.addAnimation('running2', astronauta_running2)
  astronauta.addAnimation('running', astronauta_running)
  astronauta.addAnimation('collided', astronauta_collided)
  astronauta.scale = 1.5
  astronauta.setCollider('rectangle', 0, 0, 20, 40)

  ground2 = createSprite(200, height - 740, 400, 20)
  ground2.addImage('ground', groundImage)
  ground2.x = ground2.width / 2
  ground2.velocityX = -(width + (3 * score) / 100)
  ground2.rotation = 180

  ground = createSprite(200, height - 10, 400, 20)
  ground.addImage('ground', groundImage)
  ground.x = ground.width / 2
  ground.velocityX = -(width + (3 * score) / 100)

  gameOver = createSprite(width / 2, height / 2)
  gameOver.addAnimation('gameover',gameOverAni)

  restart = createSprite(width / 2, height / 2 + 200)
  restart.addAnimation('restart',restartAni)

  gameOver.scale = 2.5
  restart.scale = 1.5

  gameOver.visible = false
  restart.visible = false

  invisibleGround = createSprite(200, height - 13, 400, 10)
  invisibleGround.visible = false

  invisibleGround2 = createSprite(200, height - 735, 400, 10)
  invisibleGround2.visible = false

  invisibleGround3 = createSprite(200, height / 2 + 300, 400, 600)
  invisibleGround3.visible = false

  //cloudsGroup = new Group()
  obstaclesGroup = new Group()

  score = 0
}

function draw() {
  //astronauta.debug = true;
  background(35,35,142)
  image(backgroundImg, 0, 0, width, height)

  text('Pontuação: ' + score, width - 100, 50)

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60)
    ground.velocityX = -(6 + (3 * score) / 100)
    ground2.velocityX = -(6 + (3 * score) / 100)

    if (keyDown('up')) {
      astronauta.velocityY = -12
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2
    }

    if (ground2.x < 0) {
      ground2.x = ground2.width / 2
    }

    astronauta.collide(invisibleGround)
    astronauta.collide(invisibleGround2)
    //spawnClouds()
    spawnObstacles()

    if (keyDown('down')) {
      astronauta.velocityY = 12
    }

    if (astronauta.isTouching(invisibleGround3)) {
      astronauta.changeAnimation('running', astronauta_running)
    } else {
      astronauta.changeAnimation('running2', astronauta_running2)
    }

    if (obstaclesGroup.isTouching(astronauta)) {
      gameState = END
    }
  } else if (gameState === END) {
    gameOver.visible = true
    restart.visible = true

    //defina a velocidade da cada objeto do jogo para 0
    ground.velocityX = 0
    ground2.velocityX = 0
    astronauta.velocityY = 0
    obstaclesGroup.setVelocityXEach(0)
    //cloudsGroup.setVelocityXEach(0)

    //mude a animação do astronauta
    astronauta.changeAnimation('collided', astronauta_collided)

    //defina o tempo de vida dos objetos para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1)
    //cloudsGroup.setLifetimeEach(-1)

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset()
      touches = []
    }
  }

  drawSprites()
}

/*function spawnClouds() {
  //escreva o código aqui para fazer as nuvens surgirem
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width, 120, 40, 10)
    cloud.y = Math.round(random(100, height - 100))
    cloud.addImage(cloudImage)
    cloud.scale = 0.8
    cloud.velocityX = -3

    //designe tempo de vida para a variável
    cloud.lifetime = width

    //ajuste a profundidade
    cloud.depth = astronauta.depth
    astronauta.depth = astronauta.depth + 1

    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud)
  }
}*/

function spawnObstacles() {
  if (frameCount % 20 === 0 && score <= 300) {
    var obstacle = createSprite(width, height - 65, 10, 40)
    obstacle.setCollider('circle', 0, 10, 10)
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + (3 * score) / 50)
    obstacle.y = Math.round(random(50, height - 50))
    //gere um obstáculo aleatório
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obstacle.addAnimation('alien1', obstacle1)
        break
      case 2:
        obstacle.addAnimation('alien2', obstacle2)
        break
      case 3:
        obstacle.addAnimation('alien3', obstacle3)
        break
      case 4:
        obstacle.addAnimation('alien4', obstacle4)
        break
      case 5:
        obstacle.addAnimation('alien5', obstacle5)
        break
      case 6:
        obstacle.addAnimation('alien6', obstacle6)
        break
      default:
        break
    }
  
     //designe o escalonamento e tempo de vida ao obstáculo
     obstacle.scale = 1.5
     obstacle.lifetime = width
     //adicione cada obstáculo ao grupo
     obstaclesGroup.add(obstacle)
     
  } else if(score > 300) {
    if(frameCount % 10 === 0){
      var obstacle = createSprite(width, height - 65, 10, 40)
    obstacle.setCollider('circle', 0, 10, 10)
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + (3 * score) / 50)
    obstacle.y = Math.round(random(50, height - 50))
    //gere um obstáculo aleatório
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obstacle.addAnimation('alien1', obstacle1)
        break
      case 2:
        obstacle.addAnimation('alien2', obstacle2)
        break
      case 3:
        obstacle.addAnimation('alien3', obstacle3)
        break
      case 4:
        obstacle.addAnimation('alien4', obstacle4)
        break
      case 5:
        obstacle.addAnimation('alien5', obstacle5)
        break
      case 6:
        obstacle.addAnimation('alien6', obstacle6)
        break
      default:
        break
      }

    //designe o escalonamento e tempo de vida ao obstáculo
    obstacle.scale = 1.5
    obstacle.lifetime = width
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle)

    } 
  }
}


   
  


function reset() {
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false

  obstaclesGroup.destroyEach()
  //cloudsGroup.destroyEach()

  astronauta.changeAnimation('running', astronauta_running)

  score = 0
}

