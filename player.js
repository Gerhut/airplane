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

  player.on('added', function () {
    var stage = this.stage

    hero.x = stage.canvas.width / 2
    hero.y = stage.canvas.height * 4 / 5

    hero.gotoAndPlay('flying')
    stage.addEventListener('stagemousedown', onStageMouseDown)
    player.hitters.hero = hero
    shoot()

    player.on('removed', function (event) {
      stage.removeEventListener('stagemousedown', onStageMouseDown)
      stage.removeEventListener('stagemousemove', onStageMouseMove)
      stage.removeEventListener('stagemouseup', onStageMouseUp)
    }, null, true)

    var lastX, laseY
    function onStageMouseDown(event) {
      lastX = event.stageX
      lastY = event.stageY
      stage.addEventListener('stagemousemove', onStageMouseMove)
      stage.addEventListener('stagemouseup', onStageMouseUp)
    }
    function onStageMouseMove(event) {
      if (hero.currentAnimation != 'flying') {
        return
      }
      hero.x += event.stageX - lastX
      hero.y += event.stageY - lastY
      lastX = event.stageX
      lastY = event.stageY
    }
    function onStageMouseUp(event) {
      stage.removeEventListener('stagemousemove', onStageMouseMove)
      stage.removeEventListener('stagemouseup', onStageMouseUp)
      lastX = lastY = void 0
    }
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
  }))

  hero.regX = HERO_WIDTH / 2
  hero.regY = HERO_HEIGHT / 2

  hero.on('hit', function () {
    delete player.hitters.hero
    hero.gotoAndPlay('blowup')
    hero.on('animationend', function () {
      console.log('Game Over!')
    }, null, true)
  })

  player.addChild(hero)

  // Bullet
  function Bullet() {
    var bullet = new $.Bitmap('bullet.png')

    bullet.x = hero.x
    bullet.y = hero.y - HERO_HEIGHT / 2
    bullet.regX = BULLET_WIDTH / 2
    bullet.regY = BULLET_HEIGHT
    bullet.visible = false

    bullet.on('added', onBulletAdded)
    bullet.on('removed', onBulletRemoved)
    bullet.on('hit', onBulletHit)

    return bullet
  }

  function onBulletAdded() {
    player.hitters['bullet-' + this.id] = this
  }

  function onBulletRemoved() {
    delete player.hitters['bullet-' + this.id]
    this.removeAllEventListeners()
    $.Tween.removeTweens(this)
  }

  function onBulletHit() {
    player.removeChild(this)
  }

  function shoot() {
    var bullet = new Bullet

    $.Tween.get(bullet, { useTicks: true })
      // show bullet after SHOOT_DELAY
      .to({ visible: true }, SHOOT_DELAY)
      // shoot next bullet if hero is still flying
      .call(function () { hero.currentAnimation == 'flying' && shoot() })
      // fly bullet to the top of screen
      .to({ x: hero.x, y: 0 }, hero.y * BULLET_SPEED)
      // remove bullet
      .call(function () { player.removeChild(this) })

    player.addChild(bullet)
  }

  return player
} (createjs)
