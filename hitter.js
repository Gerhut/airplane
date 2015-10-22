void function ($) {
  $.Ticker.on('tick', function () {
    for (var idx in player.hitters) {
      var objx = player.hitters[idx]
      var rectx = objx.getTransformedBounds()
      if (rectx == null) {
        continue
      }
      for (var idy in enemy.collideMap) {
        var objy = enemy.collideMap[idy]
        var recty = objy.getTransformedBounds()
        if (recty == null) {
          continue
        }
        if (rectx.intersects(recty)) {
          objx.dispatchEvent('hit')
          objy.dispatchEvent('hit')
          return
        }
      }
    }
  })
} (createjs)
