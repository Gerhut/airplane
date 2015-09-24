var stage = new createjs.Stage('stage')

var player = function ($) {
  var HERO_WIDTH = 102
  var HERO_HEIGHT = 126
  var SHOOT_SPEED = 3
  var BULLET_WIDTH = 5
  var BULLET_HEIGHT = 11
  var BULLET_SPEED = 1

  // Whole Container
  var player = new $.Container
  player.hitters = {}

  player.on('added', function () {
    var stage = this.stage
    hero.x = stage.canvas.width / 2 - HERO_WIDTH / 2
    hero.y = stage.canvas.height * 4 / 5 - HERO_HEIGHT / 2
    stage.on('stagemousemove', function (event) {
      if (!$.Ticker.paused) {
        hero.x = event.stageX - HERO_WIDTH / 2
        hero.y = event.stageY - HERO_HEIGHT / 2
      }
    })
  }, null, true)

  // Hero player
  var hero = new $.Sprite(new $.SpriteSheet({
    images: ['hero.png'],
    frames: {
      width: HERO_WIDTH,
      height: HERO_HEIGHT
    },
    animations: {
      flying: [0, 1, 'flying'],
      blowup: [2, 5, 'flying', 2]
    },
    framerate: 12
  }), 'flying')

  hero.on('hit', function () {
    hero.gotoAndPlay('blowup')
    hero.on('animationend', function () {
      console.log('Game Over!')
    }, null, true)
  })

  player.addChild(hero)
  player.hitters.hero = hero

  // Bullet
  function shoot(fire) {
    var filename = fire ? 'bullet1.png' : 'bullet2.png'
    var bullet = new $.Bitmap(filename)

    bullet.x = hero.x + HERO_WIDTH / 2 - BULLET_WIDTH / 2
    bullet.y = hero.y - BULLET_HEIGHT
    bullet.on('hit', function () {
      tween.pause()
      miss.call(this)
    }, null, true)

    player.addChild(bullet)

    var tween = new $.Tween(bullet)
      .to({y: -BULLET_HEIGHT}, hero.y * BULLET_SPEED)
      .call(miss)

    function miss() {
      player.removeChild(this)
      delete player.hitters['bullet-' + this.id]
    }
  }

  var shootCount = 0
  $.Ticker.addEventListener('tick', function () {
    if (++shootCount == SHOOT_SPEED) {
      shootCount = 0
      shoot()
    }
  })

  //////////// TEST
  hero.on('click', function () {
    this.dispatchEvent(new $.Event('hit'))
  })

  return player
} (createjs)

stage.addChild(player)
createjs.Touch.enable(stage)
createjs.Ticker.fps = 60
createjs.Ticker.addEventListener('tick', stage)
