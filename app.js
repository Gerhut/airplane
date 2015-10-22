
$(function(resoureImage){
	enemyContianer = (function (){
		var sheetMap = {};
		sheetMap['soldier'] = {
			sheet: new createjs.SpriteSheet({
				"images": [resoureImage],
				"frames": [
					//飞行时使用
					[180,540,60,40],
					//被歼灭时使用
					[240,540,60,40],[300,540,60,60,null,0,4],
					[360,540,60,60,null,3,8],[420,540,60,40]
				],
				"animations": {
					"run": [0],
					"die": [1,4]
				}
			}),
			create: function(){
				return new createjs.Sprite(this.sheet, "run");
			},
			handleHit: function(eneScrObj,beHit){
				//被击毁
				eneScrObj.gotoAndPlay('die');
				eneScrObj.on('animationend',this.dieEnd);
				eneControl.removeFromCollide(this);
			},
			dieEnd: function(){
				eneControl.removeEnemy(this);
			},
			width: 60,
			height: 40
		};
		sheetMap['leader'] = {
			sheet: new createjs.SpriteSheet({
				"images": [resoureImage],
				"frames": [
					//飞行时使用
					[200,600,74,90],
					//被歼灭时使用
					[300,600,74,100,null,1,0],[400,600,74,100],
					[500,600,74,100],[300,700,74,90,null,0,-15]
				],
				"animations": {
					"run": [0],
					"die": [1,4,null,0.1]
				}
			}),
			create: function(){
				return new createjs.Sprite(this.sheet, "run");
			},
			handleHit: function(eneScrObj,beHit){
				//被击毁
				switch(beHit){
					case 2:
						eneScrObj.gotoAndPlay('die');
						eneScrObj.on('animationend',this.dieEnd);
						eneControl.removeFromCollide(this);
				}
			},
			dieEnd: function(){
				eneControl.removeEnemy(this);
			},
			width: 70,
			height: 90
		};
		sheetMap['captain'] = {
			sheet: new createjs.SpriteSheet({
				"images": [resoureImage],
				"frames": [
					//飞行时使用
					[0,0,170,260],[170,0,170,260],
					//被打中两次时使用
					[340,0,170,260],
					//被打中两次后继续飞行时使用
					[510,0,170,260],
					//被歼灭时使用
					[0,260,170,260,0,0,1.5],[170,260,170,260,0,0,1.5],
					[340,260,170,260,0,0,1.5],[510,260,170,260,0,0,1.5],
					[0,520,170,260,0,-10,-30]
				],
				"animations": {
					"run": [0,1,"run",0.3],
					"beHit": [2,2,"damage",0.2],
					"damage": [3],
					"die": [4,8,null,0.2]
				}
			}),
			create: function(){
				return new createjs.Sprite(this.sheet, "run");
			},
			handleHit: function(eneScrObj,beHit){
				//被击毁
				switch(beHit){
					case 2:
						eneScrObj.gotoAndPlay('beHit');
						break;
					case 4:
						eneScrObj.gotoAndPlay('die');
						eneScrObj.on('animationend',this.dieEnd);
						eneControl.removeFromCollide(this);
				}
			},
			dieEnd: function(){
				eneControl.removeEnemy(this);
			},
			width: 170,
			height: 260,
		};
		//设置管卡
		var SPEED_SOLIDER = 6000;
		var SPEED_CAPTAIN = 16000;
		var waveMap = [];
		(function(){
			addWave(
				[{
					name: 'soldier',
					number: 30,
					interval: 1500,
					speed: SPEED_SOLIDER,
				},{
					name: 'soldier',
					number: 26,
					interval: 1500,
					speed: SPEED_SOLIDER,
					delay: 6000,
					position:true
				}],{
					nextWave: true
				}
			);
			addWave(
				[{
					name: 'soldier',
					number: 30,
					interval: 1500,
					speed: SPEED_SOLIDER,
				},{
					name: 'soldier',
					number: 30,
					interval: 1500,
					speed: SPEED_SOLIDER,
					position:true
				},{
					name: 'leader',
					number: 20,
					interval: 3000
				}],{
					nextWave: false
				}
			);
			addWave(
				[{
					name: 'soldier',
					number: 30,
					interval: 700,
					speed: SPEED_SOLIDER,
				},{
					name: 'leader',
					number: 7,
					interval: 2500,
					delay: 2900,
				}],{
					nextWave: false
				}
			);
			addWave(
				[{
					name: 'soldier',
					number: 30,
					interval: 1000,
					speed: SPEED_SOLIDER
				},{
					name: 'leader',
					number: 8,
					interval: 2200,
					position:true
				},{
					name: 'captain',
					number: 2,
					interval: 8000,
					delay: 8000,
					speed: SPEED_CAPTAIN
				}],{
					nextWave: false
				}
			);
			addWave(
				[{
					name: 'soldier',
					number: 60,
					interval: 1000,
					speed: SPEED_SOLIDER,
					position:true
				},{
					name: 'leader',
					number: 24,
					interval: 2500,
					position:true
				},{
					name: 'captain',
					number: 9,
					interval: 6000,
					speed: SPEED_CAPTAIN,
					delay: 4000
				}],{
					nextWave: false
				}
			);
		})();
		var EnemyController = (function(){
			function EC(sheetMap,waveMap){
				this._waveMap = waveMap || [];
				this._sheetMap = sheetMap || {};
			}
			EC.prototype = {
				start: function(container){
					var self = this,
						canvas,stage;
					self._gameover = false;
					self._curWave = null;
					self._numEnemy = 0;
					self.container = container;
					stage = self.stage = container.stage;
					canvas = stage.canvas;
					self._stageWidth = canvas.width;
					self._stageHeight = canvas.height;
					container.collideMap = self.collideMap = {};
					createjs.Ticker.addEventListener("tick", function(event){
						//操作敌机逻辑
						self.tick();
						stage.update(event);
					});
				},
				tick: function(){
					var self = this;
					if(self._gameover)
						return ;
					if(self.setWave()){
						//处理每一轮的敌机的发放情况
						self.handleWave();
					}
					//处理当前所有敌机每一帧的情况
					self._numEnemy && self.handleFramerate();
				},
				//设置并初始化一些数据
				setWave: function(){
					var self = this;
					var curMave = self._curWave;
					var waveMap,enemys,nextStart;
					var now = +new Date();
					if(curMave){
						//当前一轮还未播放完毕
						if(curMave.compCount){
							return true;
						}
						// true: 立即,开始下一轮;
						// false: 清屏后,开始下一轮;
						// time: 当前播放完后指定时间后,开始下一轮
						nextStart = curMave.nextWave;
						if(nextStart===true){
							nextStart = 0;
						}else if(nextStart===false){
							nextStart = self._numEnemy ? now : 0 ;
						}else{
							nextStart = ~~nextStart;
						}
						if(now - curMave.startTime < nextStart){
							return ;
						}
					}
					waveMap = self._waveMap.shift();
					//当没有下一轮,并且页面上也没有任何敌机的时候,游戏结束
					if(!waveMap){
						self._numEnemy || self.gameover();
						return ;
					}
					enemys = waveMap.enemys;
					self._curWave = {
						startTime: now,
						nextWave: waveMap.nextWave,
						enemys: enemys,
						compCount: enemys.length
					}
				},
				gameover: function(){
					this._gameover = true;
				},
				handleWave: function(){
					var self = this;
					var curWave = self._curWave;
					//当前没东西 || 当前一轮已完成,等待下一轮的开启
					if(!(curWave && curWave.compCount))
						return ;
					var curDate = +new Date();
					var enemys = curWave.enemys;
					enemys.forEach(function(enInfo){
						var data = enInfo._data;
						var proMax = enInfo.number;
						if(data.complete || !proMax)
							return ;
						var produce = data.produce || 0;
						var delay,prevTime;
						//已经发布后,按照间隔来放置下一台
						if(produce){
							delay = enInfo.interval;
							if(data.prevTime){
								prevTime = data.prevTime;
							}else{
								prevTime = data.prevTime = curDate;
							}
						}else{
							//还未发布时,按照延迟来放置下一台
							delay = enInfo.delay;
							prevTime = curWave.startTime;
						}
						if(delay){
							if(curDate-prevTime>delay)
								addEnemyToStage();
						}else{
							addEnemyToStage();
						}
						function addEnemyToStage(){
							//对上次发射时间进行修正
							data.prevTime = curDate;
							//设置生产数量
							if(++produce>=proMax){
								data.complete = true;
								curWave.compCount--;
							}
							data.produce = produce;
							self.produceEnemy(enInfo);
						}
					});
				},
				produceEnemy: function(enInfo){
					var self = this,id,
						container = self.container,
						name = enInfo.name,
						sheetMap = self._sheetMap[name],
						enemySprite = sheetMap.create();
					enemySprite._data = {
						beHit: 0,
						position: enInfo.position,
						speed: enInfo.speed
					};
					//设置运动动画
					self.setAnimate(enemySprite,sheetMap);
					//将对象添加到可检测对象中
					id = enemySprite.id = 'en_'+enemySprite.id;
					enemySprite.name = name;
					self.collideMap[id] = enemySprite;
					//添加事件
					enemySprite.on('hit',self.eventHit,self);
					//添加到集合中,维护敌机数量
					container.addChild(enemySprite);
					self._numEnemy++;
					container = sheetMap = enemySprite = null;
				},
				setAnimate: function(enemySprite,sheet){
					var self = this,
						data = enemySprite._data,
						target = {},
						speed;
					var FLY_MODS_L2R = 0,FLY_MODS_R2L = 1,FLY_MODS_U2D = 2;
					if(data.position===false){
						enemySprite.x = Math.random()*(self._stageWidth - sheet.width);
						enemySprite.y = -sheet.height;
						target['y'] = self._stageHeight;
						speed = data.speed;
					}
					if(data.position===true){
						speed = data.speed;
						var flyMods = parseInt(Math.random() * 3);
						if(flyMods === FLY_MODS_L2R){
							//从左侧飞入
							enemySprite.x = -sheet.width;
							enemySprite.y = parseInt(self._stageHeight * (Math.random()*4) / 10);
							var angle = 2*Math.PI/360 *(parseInt(Math.random() * 45) + 30);
							target['x'] = self._stageWidth;
							target['y'] = enemySprite.y + (self._stageWidth / Math.tan(angle));
						}else if(flyMods === FLY_MODS_R2L){
							//从右侧飞入
							enemySprite.x = self._stageWidth;
							enemySprite.y = parseInt(self._stageHeight * (Math.random()*4) / 10);
							var angle = 2*Math.PI/360 * (parseInt(Math.random() * 45) + 30);
							target['x'] = -sheet.width;
							target['y'] = enemySprite.y + (self._stageWidth / Math.tan(angle));
						}else if(flyMods === FLY_MODS_U2D){
							//从上向下
							enemySprite.x = Math.random()*(self._stageWidth - sheet.width);
							enemySprite.y = -sheet.height;
							var angle = 2*Math.PI/360 * (45 - parseInt(Math.random() * 45)) ;
							if(enemySprite.x < (0.5*(self._stageWidth - sheet.width))){			
								//左半区向右
								//target['x'] = self._stageWidth;
								var tempWidth = self._stageWidth - enemySprite.x;
								var tempHight = tempWidth / Math.tan(angle);
								if(tempHight <= self._stageHeight){
									//从右侧飞出
									target['x'] = self._stageWidth;
									target['y'] = tempHight;
								}else{
									//从屏幕下边飞出
									target['x'] = enemySprite.x + self._stageHeight *  Math.tan(angle);
									target['y'] = self._stageHeight;
								}
							}else{
								//右半区向左
								//target['x'] = -sheet.width;
								var tempWidth = enemySprite.x;
								var tempHight = tempWidth / Math.tan(angle);
								if(tempHight <= self._stageHeight){
									//从左侧飞出
									target['x'] = -sheet.width;
									target['y'] = tempHight;
								}else{
									//从屏幕下边飞出
									target['x'] = enemySprite.x - self._stageHeight *  Math.tan(angle);
									target['y'] = self._stageHeight;
								}
							}
						}
					}
					//设置运动
					createjs.Tween.
						get(enemySprite).
						to(target, speed).
						call(function(){
							self.removeEnemy(this);
						});
				},
				eventHit: function(event){
					var enemy = event.target,
						sheetObj = this._sheetMap[enemy.name];
					sheetObj.handleHit(enemy,++enemy._data.beHit);
				},
				removeFromCollide: function(enemy){
					delete this.collideMap[enemy.id];
				},
				removeEnemy: function(enemy){
					//用页面中移除
					enemy.parent.removeChild(enemy);
					//维护数量
					this._numEnemy--;
					//关闭位移动画
					createjs.Tween.removeTweens(enemy);
					//用碰撞集合中移除
					delete this.collideMap[enemy.id];
				},
				handleFramerate: function(){},
			}
			return EC;
		})();
		//开启管卡
		var eneControl = new EnemyController(sheetMap,waveMap);
		var container = new createjs.Container();
		container.addEventListener('added',function(){
			eneControl.start(container);
		});
		return container;
		function addWave(enemysInfo,options){
			var enemysArr = [];
			enemysInfo.forEach(function(eInfo){
				enemysArr.push(copy({
					//敌机类型 soldier, leader, captain
					name: '',
					//生产数量
					number: 1,
					//生产间隔
					interval: 0,
					//延迟显示
					delay: 0,
					//位置 false:x轴随机垂直下落,
				 	//[true/false,0,outx,outy] 
					position: false,
					runType: 1,
					speed: 8000,
					//*内部私用
					_data: {}
				},eInfo));
			});
			waveMap.push( copy({
				nextWave: true,
				enemys: enemysArr
			},options) );
			enemysArr = enemysInfo = options = null;
		}
		function copy(tag,obj){
			for(var n in obj){
				if(obj.hasOwnProperty(n)){
					tag[n] = obj[n];
				}
			}
			return tag;
		}
	})();
	//***************** 以下都是外部代码 *******************//
	var stage = new createjs.Stage( document.getElementById("stage") );
	createjs.Ticker.framerate = 40;
	stage.addEventListener('stagemousedown',function(e){
		var enemys = enemyContianer.collideMap;
		for(var n in enemys){
			enemys[n].dispatchEvent('hit');
		}
	});
	stage.addChild(enemyContianer);
});

function $(loadback){
	var resoure = new Image();
	resoure.onload = function (){
		loadback(this);
	}
	resoure.src = 'images/enemys.png';
}