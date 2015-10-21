/*
	有两个问题
	1.player没有提供初始化
	2.暂停按钮在暂停界面时可以去掉

*/
stage.enableMouseOver(10);
var w, h, loader;
var sky, skyinit, mainicon, startBtn, pauseBtn, resumeBtn, introduceBtn, scoretxt, timetxt, startTime, continueBtn, gameoverBtn, againBtn, gameoverbg;


// grab canvas width and height for later calculations:
w = stage.canvas.width;
h = stage.canvas.height;
manifest = [{
    src: "background.png",
    id: "sky"
}, {
    src: "shoot_copyright.png",
    id: "mainicon"
}, {
    src: "start.png",
    id: "startBtn"
}, {
    src: "introduce.png",
    id: "introduceBtn"
}, {
    src: "game_pause_nor.png",
    id: "pause"
}, {
    src: "game_pause_pressed.png",
    id: "pause_press"
}, {
    src: "game_continue.png",
    id: "game_continue"
}, {
    src: "game_again.png",
    id: "game_again"
}, {
    src: "game_over.png",
    id: "game_over"
}, {
    src: "gameoverbg.png",
    id: "game_overbg"
}];

loader = new createjs.LoadQueue(false);
loader.addEventListener("complete", init);
loader.loadManifest(manifest, true, "img/shoot_background/");


//飞机大战进入界面
function init() {
    skyinit = new createjs.Shape();
    var skyImg = loader.getResult("sky");
    skyinit.graphics.beginBitmapFill(skyImg).drawRect(0, 0, w, h);

    mainicon = new createjs.Shape();
    var mainiconImg = loader.getResult("mainicon");
    mainicon.graphics.beginBitmapFill(mainiconImg, 'no-repeat').drawRect(0, 0, w, h);
    mainicon.x = (w - mainiconImg.width) / 2;
    mainicon.y = (h - mainiconImg.height) / 2 - 150;


    startBtn = new createjs.Shape();
    var startBtnImg = loader.getResult("startBtn");
    startBtn.graphics.beginBitmapFill(startBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    startBtn.x = (w - startBtnImg.width) / 2;
    startBtn.y = (h - startBtnImg.height) / 2 + 100;



    introduceBtn = new createjs.Shape();
    var introduceBtnImg = loader.getResult("introduceBtn");
    introduceBtn.graphics.beginBitmapFill(introduceBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    introduceBtn.x = (w - startBtnImg.width) / 2;
    introduceBtn.y = (h - startBtnImg.height) / 2 + 160;

    stage.addChild(skyinit, mainicon, startBtn, introduceBtn);
    //手势
    startBtn.cursor = 'pointer';
    introduceBtn.cursor = 'pointer';

    startBtn.addEventListener("click", function() {

        //stage.removeChild(skyinit,mainicon,startBtn,introduceBtn);

        start();
    });

    introduceBtn.addEventListener("click", function() {
    });

    // stage.update();
}


//飞机大战开始
function start() {
    //分数清0
    tmpscore = 0;
    //开始计时
    startTime = new Date();
    //清除上一屏幕所有元素
    stage.removeAllChildren();
    console.log(stage);
    sky = new createjs.Shape();
    var skyImg = loader.getResult("sky");
    sky.graphics.beginBitmapFill(skyImg).drawRect(0, -skyImg.height, w, h + skyImg.height);

    pauseBtn = new createjs.Shape();
    var pauseBtnImg = loader.getResult("pause");
    pauseBtn.graphics.beginBitmapFill(pauseBtnImg, 'no-repeat').drawRect(0, 0, w, h);

    pauseBtn.x = pauseBtn.y = 25;

    //计算分数
    scoretxt = new createjs.Text("Hello World", "26px Arial", "#ff7700");
    scoretxt.x = 100;
    scoretxt.y = 60;
    scoretxt.textBaseline = "alphabetic";

    //计算时间
    timetxt = new createjs.Text("Hello time", "26px Arial", "#ff7700");
    timetxt.x = 350;
    timetxt.y = 60;
    timetxt.textBaseline = "alphabetic";

    stage.addChild(sky, pauseBtn, timetxt, scoretxt, timetxt);
    stage.removeChild(player);
    stage.addChild(player);
     stage.removeChild(enemy_container);
    stage.addChild(enemy_container);
    console.log(player,enemy_container)
    sky.tileH = skyImg.height;

    pauseBtn.cursor = 'pointer';

    pauseBtn.addEventListener("click", function(evt) {
        pause();
    });
    //控制样式
    pauseBtn.addEventListener("mouseover", function(evt) {
        var pauseBtnImg = loader.getResult("pause_press");
        pauseBtn.graphics.beginBitmapFill(pauseBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    });
    pauseBtn.addEventListener("mouseout", function(evt) {
        var pauseBtnImg = loader.getResult("pause");
        pauseBtn.graphics.beginBitmapFill(pauseBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    });

    // createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
};
var tmpscore = 0;

function tick(event) {
    sky.y += 4; //控制背景运动
    if (sky.y >= h) {
        sky.y = 0; //恢复
    }
    timetxt.text = (new Date() - startTime) / 1000 + '秒';
    scoretxt.text = tmpscore++ + '分';
    stage.update(event);
}

//暂停状态
function pause() {
    createjs.Ticker.removeEventListener("tick", tick);
    //继续游戏
    // var pause = createjs.Ticker.getPaused();
    createjs.Ticker.setPaused(true);
    continueBtn = new createjs.Shape();
    var continueBtnImg = loader.getResult("game_continue");
    continueBtn.graphics.beginBitmapFill(continueBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    continueBtn.x = (w - continueBtnImg.width) / 2;
    continueBtn.y = (h - continueBtnImg.height) / 2 + 100;

    //重新开始
    againBtn = new createjs.Shape();
    var againBtnImg = loader.getResult("game_again");
    againBtn.graphics.beginBitmapFill(againBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    againBtn.x = (w - againBtnImg.width) / 2;
    againBtn.y = (h - againBtnImg.height) / 2 + 150;

    //游戏结束
    gameoverBtn = new createjs.Shape();
    var gameoverBtnImg = loader.getResult("game_over");
    gameoverBtn.graphics.beginBitmapFill(gameoverBtnImg, 'no-repeat').drawRect(0, 0, w, h);
    gameoverBtn.x = (w - gameoverBtnImg.width) / 2;
    gameoverBtn.y = (h - gameoverBtnImg.height) / 2 + 200;


    //继续游戏事件
    continueBtn.addEventListener("click", function(evt) {
        createjs.Ticker.addEventListener("tick", tick);
        stage.removeChild(continueBtn, againBtn, gameoverBtn);
        var pause = createjs.Ticker.getPaused();
        createjs.Ticker.setPaused(!pause);
    });

    //重新开始事件
    againBtn.addEventListener("click", function(evt) {
        start();
    });

    //结束按钮事件
    gameoverBtn.addEventListener("click", function(evt) {
        end(false);
    });

    stage.addChild(continueBtn, againBtn, gameoverBtn);
    // stage.update();
}
//结束
function end(failure) {
    //清除上一屏幕所有元素
    stage.removeAllChildren();
    createjs.Ticker.removeEventListener("tick", tick);
    gameoverbg = new createjs.Shape();
    var gameoverbgImg = loader.getResult("game_overbg");
    gameoverbg.graphics.beginBitmapFill(gameoverbgImg).drawRect(0, 0, w, h);
    scoretxt.text = tmpscore + '分';
    scoretxt.x = 200;
    scoretxt.y = 400;
    scoretxt.font = '36px Arial';
    if (failure) {
        stage.addChild(gameoverbg, scoretxt, againBtn);
    } else {
        stage.addChild(gameoverbg, scoretxt);
    }
    // stage.update();
}
