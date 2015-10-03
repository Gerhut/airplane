var stage = new createjs.Stage('stage')

stage.addChild(player)
createjs.Touch.enable(stage)
createjs.Ticker.timingMode = createjs.Ticker.RAF
createjs.Ticker.addEventListener('tick', stage)
