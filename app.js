/*

	1.加载资源
	2.通知我机，敌机，用户界面完成初始化
	3.点击开始按钮，通知敌机我机运动，隐藏控制界面
	4.点击暂停按钮，通知敌机我机暂停，展示控制界面
	5.当我机被击落时，或完成所有关卡，游戏结束
*/



var stage = new createjs.Stage('stage')

var controller = {
	start:function (argument) {
		
	},
	pause:function (argument) {
		
	},
	goOn:function (argument) {
		
	},
	end:function (argument) {
		
	}
};

//增加玩家
stage.addChild(player)
createjs.Touch.enable(stage)
createjs.Ticker.timingMode = createjs.Ticker.RAF
createjs.Ticker.addEventListener('tick', stage)

stage.addEventListener('stagemousedown',function(e){
	var pause = createjs.Ticker.getPaused();
	createjs.Ticker.setPaused(!pause);

});