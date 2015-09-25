var stage = new createjs.Stage('stage')

var player = function ($) {
  var HERO_WIDTH = 102
  var HERO_HEIGHT = 126
  var SHOOT_DELAY = 5
  var BULLET_WIDTH = 5
  var BULLET_HEIGHT = 11
  var BULLET_SPEED = .08

  var grade = 0

  // Whole Container
  var player = new $.Container
  player.hitters = {}

  player.on('added', function () {
    var stage = this.stage
    hero.x = stage.canvas.width / 2
    hero.y = stage.canvas.height * 4 / 5
    stage.on('stagemousemove', function (event) {
      if (!$.Ticker.paused) {
        hero.x = event.stageX
        hero.y = event.stageY
      }
    })
    shoot()
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

  hero.on('upgrade', function () {
    if (grade < 3) {
      grade += 1
    }
  })

  player.addChild(hero)
  player.hitters.hero = hero

  // Bullet
  function shoot() {
    if (hero.currentAnimation != 'flying') {
      return
    }

    var filename = grade != 0 ? 'bullet1.png' : 'bullet2.png'
    var trajectories = [
      [0, 0]
    ]

    if (grade == 2) {
      trajectories.push(
        [-HERO_WIDTH / 4, -HERO_WIDTH / 4],
        [HERO_WIDTH / 4, HERO_WIDTH / 4]
      )
    } else if (grade == 3) {
      trajectories.push(
        [-HERO_WIDTH / 4, -HERO_WIDTH / 4 - hero.y / 4],
        [-HERO_WIDTH / 8, -HERO_WIDTH / 8 - hero.y / 8],
        [HERO_WIDTH / 4, HERO_WIDTH / 4 + hero.y / 4],
        [HERO_WIDTH / 8, HERO_WIDTH / 8 + hero.y / 8]
      )
    }

    trajectories.forEach(function (trajectory, index) {
      var bullet = new $.Bitmap(filename)
      bullet.regY = BULLET_HEIGHT
      bullet.visible = false
      bullet.on('hit', function () {
        $.Tween.removeTweens(this)
        destroy.call(this)
      }, null, true)

      var tween = new $.Tween(bullet, {
        useTicks: true
      }).wait(SHOOT_DELAY)

      if (index == 0) {
        tween.call(shoot)
      }

      tween
        .to({ visible: true,
          x: hero.x + trajectory[0],
          y: hero.y - HERO_HEIGHT / 2
        }, 0)
        .to({
          x: hero.x + trajectory[1],
          y: 0
        }, hero.y * BULLET_SPEED)
        .call(destroy)

      player.addChild(bullet)
      player.hitters['bullet-' + bullet.id] = bullet
    })

    function destroy() {
      player.removeChild(this)
      delete player.hitters['bullet-' + this.id]
    }
  }
  //////////// TEST
  hero.on('click', function () {
    this.dispatchEvent(new $.Event('upgrade'))
  })

  return player
} (createjs)

stage.addChild(player)
createjs.Touch.enable(stage)
createjs.Ticker.timingMode = createjs.Ticker.RAF
createjs.Ticker.addEventListener('tick', stage)
