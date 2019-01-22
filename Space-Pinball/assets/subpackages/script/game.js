//game主文件 - 游戏控制类
var Common = require("./../../script/common");
var Ball = require("./ball");
var score = require("./score");
cc.Class({
    extends: cc.Component,
    properties: {
        mainCamera: {
            default: null,
            type: cc.Node
        },
        prefabBall: cc.Prefab,
        prefabBallAmount: {
            type: cc.Prefab,
            default: []
        },
        ballAmountBox: cc.Node,
        spring: {
            type: cc.Node,
            default: null
        },
        scoreLabel: cc.Label,
        surpriseLabel: cc.Label,
        leftControl: {
            default: null,
            type: cc.Node
        },
        rightControl: {
            default: null,
            type: cc.Node
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        gameGuideNode: cc.Node,
        eye: cc.Node,
        leftBumpers: cc.Node,
        plusLight: cc.Prefab,
        btnSetting: cc.Node
    },
    //加载完成，启用物理系统
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        //事件监听
        // this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        // this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onSpringStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onSpringEnd, this);
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
        
        //匹配大部分分辨率
        this.matchMediaScreen();
    },
    start() {
        this.storaging = false;
        //子类继承
        this.gameOverNode.main = this;
        this.gameGuideNode.main = this;
        this.leftBumpers.main = this;
        this.btnSetting.main = this;
        //显示小球个数
        this.prefabBallAmountCache = this.prefabBallAmount.slice(0);
        this.prefabBallIcon = this.prefabBallAmountCache[0];
        //设置小球总数，生成小球
        this.isBallActive = false;
        this.ballAmount = 3;

        //显示小球数量
        this.showBallAmount();

        //设置本地缓存默认分数为0
        this.storageScore = 0;
        //获取本地缓存的分数
        this.getStorage();

        Common.setShootStatus(false);
    },
    //获取本地缓存的分数
    getStorage() {
        let _self = this;
        wx.getStorage({
            key: 'highScore',
            success(res) {
                _self.storageScore = res.data;
                console.log('游戏结束，第一次获取本地缓存的分数' + res.data);
            }
        })
    },
    //匹配大部分分辨率
    matchMediaScreen() {
        let canvasSize = cc.view.getCanvasSize();
        let defaultWidth = 750;
        if (canvasSize.width >= defaultWidth) {
            this.mainCamera.height = canvasSize.height / (canvasSize.width / defaultWidth);
            this.mainCamera.width = defaultWidth;
        }
        //匹配iphonex顶部刘海儿
        if (canvasSize.height == 1624) {
            let score = this.mainCamera.getChildByName("score");
            let widget = score.getComponent(cc.Widget);
            widget.top = 60;
            let setting = this.mainCamera.getChildByName("setting");
            let sWidget = setting.getComponent(cc.Widget);
            sWidget.top = 290;
        }
    },
    //触摸开始
    onTouchStart(touch) {
        let ball = this.ball;
        ball.rigidBody.active = false;
        ball.rigidBody.linearVelocity = cc.Vec2.ZERO;
        let touchPos = this.mainCamera.getComponent(cc.Camera).getCameraToWorldPoint(this.node.convertTouchToNodeSpaceAR(touch.touch));
        let pathPos = [];
        pathPos.push(ball.node.position);
        pathPos.push(touchPos);
        ball.node.runAction(cc.cardinalSplineTo(0.8, pathPos, 0.5));
    },
    //触摸结束
    onTouchEnd(touch) {
        let ball = this.ball;
        let touchPos = this.mainCamera.getComponent(cc.Camera).getCameraToWorldPoint(this.node.convertTouchToNodeSpaceAR(touch.touch));
        let dir = touchPos.sub(ball.node.position);
        ball.rigidBody.active = true;
        ball.rigidBody.linearVelocity = dir.mul(5);
    },
    //生成小球
    generateBall() {
        let ball = cc.instantiate(this.prefabBall).getComponent(Ball);
        ball.node.parent = this.node;
        ball.node.position = cc.v2(1095, 625);
        ball.main = this;
        this.ball = ball;
        this.isBallActive = true;
        this.ballAmount--;
        this.prefabBallAmountCache.splice(0, 1);
        this.showBallAmount();
        Common.setShootStatus(false);
    },
    //失败消除小球
    removeBall(ball) {
        Common.setUpgradeStatus(false);
        ball.node.removeFromParent(false);
        this.isBallActive = false;
        if(!Common.getAccumulativeStatus()){
            this.resetAll();
        }
        if (this.ballAmount > 0) {
            this.moveCameraToRB(1);
        } else {
            this.gameOver();
        }
    },
    //显示小球个数
    showBallAmount() {
        this.ballAmountBox.removeAllChildren();
        let defaultPositionX = 15;
        for (let i in this.prefabBallAmountCache) {
            let ball = cc.instantiate(this.prefabBallAmountCache[i]);
            ball.parent = this.ballAmountBox;
            ball.position = cc.v2(defaultPositionX, 15);
            defaultPositionX += 60
        }
    },
    //移动摄像机到右下角
    moveCameraToRB(time) {
        let posX = this.node.width - this.mainCamera.width / 2;
        let posY = this.mainCamera.height / 2;
        this.mainCamera.runAction(cc.sequence(
            cc.moveTo(time, cc.v2(posX, posY)),
            cc.callFunc(() => {
                //生成小球
                this.generateBall();
            })
        ))
    },
    //提升小球
    upgrade() {
        Common.setUpgradeStatus(true);
        cc.loader.loadRes('upgrade-ball', cc.SpriteFrame, (err, spriteFrame) => {
            this.ball.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    //+1小球
    plusBall() {
        let ball = cc.instantiate(this.plusLight);
        ball.parent = this.mainCamera;
        ball.position = this.mainCamera.getComponent(cc.Camera).getWorldToCameraPoint(this.ball.node.position);
        this.prefabBallAmountCache.push(this.prefabBallIcon);
        let posX = -this.mainCamera.width / 2 + 130;
        let posY = this.mainCamera.height / 2 - 65;

        ball.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(1, cc.v2(posX, posY)).easing(cc.easeBackIn()),
                cc.fadeTo(2, 0)
            ),
            cc.callFunc(() => {
                this.audio.audioEffectPlay(this.audio.plus);
                this.showBallAmount();
                ball.removeFromParent(false);
                this.ballAmount++;
            })
        ))
    },
    //游戏暂停
    pause() {
        if (this.isBallActive) {
            this.ball.rigidBody.active = false;
        }
    },

    //游戏继续
    goOn() {
        if (this.isBallActive) {
            this.ball.rigidBody.active = true;
        }
    },

    //设置分数
    setScore() {
        //总得分
        this.scoreLabel.string = score.getScore().toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
        //surprise记分牌
        this.surpriseLabel.string = score.getSurpriseScore().toString();
    },
    //模拟长按
    onSpringStart() {
        if (!this.isBallActive) {
            return;
        }
        this.holdClick = true;
        if (!this.storaging) {
            this.storaging = true;
            this.audio.audioEffectPlay(this.audio.flipper);
        }
    },
    onSpringEnd() {
        if (!this.isBallActive) {
            return;
        }
        this.holdClick = false;
        //长按结束时发射动作
        this.shoot();
    },
    //游戏结束
    gameOver() {
        //本地存储一次分数
        let curScore = score.getScore();

        //当前得分大于缓存得分则覆盖
        if (curScore > this.storageScore) {
            console.log('当前得分：' + curScore, typeof (curScore) + ',本地缓存分数：' + this.storageScore, typeof (this.storageScore));
            wx.setStorage({
                key: "highScore",
                data: curScore,
                success: this.setUserCloudStorage(curScore)
            })
        }
        //调用子类显示游戏结束弹窗
        this.gameOverNode.getComponent('gameOver').showPopBox();
    },
    //上报分数
    setUserCloudStorage(score) {
        wx.setUserCloudStorage({
            "KVDataList": [{ "key": "score", "value": JSON.stringify(score) }],
            "success": function () {
                console.log("上报setUserCloudStorage分数success");
            }
        });

        //数据库记录一条分数信息
        wx.request({
            url:"https://www.super-cell.club/weapp/score/insertRecord",
            method: "POST",
            data: {
                open_id: Common.openId,
                score: score
            },
            success: function(res){
                console.log("请求成功，" + res)
            }
        })
    },
    //重开游戏
    gameRestart() {
        this.ballAmount = 3;
        this.prefabBallAmountCache = this.prefabBallAmount.slice(0);
        this.showBallAmount();
        this.moveCameraToRB(1);
        score.resetScore();
        this.resetAll();
        this.getStorage();
    },
    //更新操作
    update(dt) {
        this.updateCameraPosition();
        this.setScore();
        this.updateEye();
        //是否是手指长按
        if (this.holdClick) {
            this.storagePower()
        }
        if (!Common.getShootStatus()) {
            this.leftControl.active = false;
            this.rightControl.active = false;
            return;
        } else {
            this.leftControl.active = true;
            this.rightControl.active = true;
        }
    },
    //弹簧发射
    shoot() {
        let pathPos = [];
        let posX = this.spring.position.x;
        pathPos.push(this.spring.position);
        pathPos.push(cc.v2(posX, 70));
        pathPos.push(cc.v2(posX, 45));
        this.spring.runAction(cc.sequence(
            cc.cardinalSplineTo(0.15, pathPos, 1),
            cc.callFunc(() => {
                this.storaging = false;
                this.audio.audioEffectPlay(this.audio.launch);
            })
        ))
    },
    //弹簧蓄力
    storagePower() {
        let posX = this.spring.position.x;
        let posY = this.spring.position.y;
        posY--;
        if (posY <= -45) {
            posY = -45;
        }
        this.spring.position = cc.v2(posX, posY);
    },
    //camera始终跟随小球中心位置
    updateCameraPosition() {
        if (!this.isBallActive) {
            return;
        }
        let posX , posY;
        let rate = 0.2; //镜头缓动系数
        let ballPosition = this.ball.node.position;
        let mainCamera = this.mainCamera;
       
        if (ballPosition.y < mainCamera.height / 2) {
            posY = mainCamera.height / 2;
        } else if (ballPosition.y > this.node.height - mainCamera.height / 2) {
            posY = this.node.height - mainCamera.height / 2;
        }else{
            posY = ballPosition.y;
        }

        if (ballPosition.x < mainCamera.width / 2) {
            posX = mainCamera.width / 2;
        } else if (ballPosition.x > this.node.width - mainCamera.width / 2) {
            posX = this.node.width - mainCamera.width / 2;
        }else{
            posX = ballPosition.x;
        }

        mainCamera.x = cc.misc.lerp(mainCamera.x, posX, rate);
        mainCamera.y = cc.misc.lerp(mainCamera.y, posY, rate);

    },
    //更新眼珠跟随小球的移动
    updateEye() {
        if (this.isBallActive) {
            let ballNodePos = this.ball.node.parent.convertToWorldSpaceAR(this.ball.node.position);
            let eyePos = this.eye.parent.parent.convertToWorldSpaceAR(this.eye.parent.position)
            let l = 10;
            let dis = ballNodePos.sub(eyePos);
            let angle = Math.atan2(dis.y, dis.x);
            let eyePosY = l * Math.sin(angle);
            let eyePosX = l * Math.cos(angle);
            this.eye.position = cc.v2(eyePosX, eyePosY);
        }
    },
    //重置所有亮灯效果
    resetAll(){
        if(Common.getAccumulativeStatus()){
            return;
        }
        this.node.getChildByName('curve').getComponent('curve').reset();
        this.node.getChildByName('left-bumpers').getComponent('leftBumper').reset();
        this.node.getChildByName('multi-group').getComponent('multiGroup').reset();
        this.node.getChildByName('right-bumpers').getComponent('rightBumper').reset();
        this.node.getChildByName('top-bumpers').getComponent('topBumper').reset();
        this.node.getChildByName('router').getComponent('router').reset();
    }
});
