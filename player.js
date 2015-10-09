var player = function ($) {
  var HERO_WIDTH = 102
  var HERO_HEIGHT = 126
  var SHOOT_DELAY = 5
  var BULLET_WIDTH = 5
  var BULLET_HEIGHT = 11
  var BULLET_SPEED = .08

  // Whole Container
  var player = new $.Container
  player.hitters = {}

  function onStageMouseMove(event) {
    if (!$.Ticker.paused) {
      hero.x = event.stageX
      hero.y = event.stageY
    }
  }

  player.on('added', function () {
    var stage = this.stage
    hero.x = stage.canvas.width / 2
    hero.y = stage.canvas.height * 4 / 5
    hero.gotoAndPlay('flying')
    stage.addEventListener('stagemousemove', onStageMouseMove)
    shoot()

    player.on('removed', function (event) {
      hero.stop()
      stage.removeEventListener('stagemousemove', onStageMouseMove)
    }, null, true)
  })

  // Hero player
  var hero = new $.Sprite(new $.SpriteSheet({
    images: ['hero.png'],
    frames: {
      width: HERO_WIDTH,
      height: HERO_HEIGHT
    },
    animations: {
      flying: [0, 1, 'flying'],
      blowup: [2, 5, null, .3]
    }
  }), 'flying')

  hero.regX = HERO_WIDTH / 2
  hero.regY = HERO_HEIGHT / 2

  hero.on('hit', function () {
    hero.gotoAndPlay('blowup')
    hero.on('animationend', function () {
      $.Ticker.paused = true
      console.log('Game Over!')
    }, null, true)
  })

  player.addChild(hero)
  player.hitters.hero = hero

  // Bullet
  function Bullet() {
    var bullet = new $.Bitmap('bullet.png')

    bullet.x = hero.x
    bullet.y = hero.y - HERO_HEIGHT / 2
    bullet.regX = BULLET_WIDTH / 2
    bullet.regY = BULLET_HEIGHT
    bullet.visible = false

    bullet.on('hit', function () {
      $.Tween.removeTweens(this)
      Bullet.remove.call(this)
    }, null, true)

    return bullet
  }

  Bullet.add = function add() {
    player.addChild(this)
    player.hitters['bullet-' + this.id] = this
  }

  Bullet.remove = function remove() {
    this.removeAllEventListeners()
    player.removeChild(this)
    delete player.hitters['bullet-' + this.id]
  }

  function shoot() {console.log('shoot')
    if (hero.currentAnimation != 'flying' || hero.paused) {
      return
    }

    var bullet = new Bullet()

    $.Tween.get(bullet, {
      useTicks: true
    }).to({ visible: true }, SHOOT_DELAY)
      .call(shoot)
      .to({ x: hero.x, y: 0 }, hero.y * BULLET_SPEED)
      .call(Bullet.remove)

    Bullet.add.call(bullet)
  }

  return player
} (createjs)
