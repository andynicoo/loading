//游戏结束弹窗控制类
var score = require("./score");
var common = require("./../../script/common");
cc.Class({
    extends: cc.Component,
    properties: {
        popBox: cc.Node,
        restartBtn: cc.Button,
        homeBtn: cc.Button,
        scoreLabel: cc.Label,
        highScoreLabel: cc.Label,
        mask: cc.Node
    },
    //首次加载完
    onLoad() {
        this.mask.on(cc.Node.EventType.TOUCH_START, () => { }, this)
        this.restartBtn.node.on('click', this.gameRestart, this);
        this.homeBtn.node.on('click', this.goHome, this);
    },
    start(){
        this.node.active = false;
        this.mask.active = false;
        this.popBoxDefaultPosition = this.popBox.position;
        this.pathPosition = [];
    },
    //显示游戏结束弹窗
    showPopBox() {
        let _seft = this;
        wx.getStorage({
            key: 'highScore',
            success (res) {
                console.log("显示游戏结束弹窗" + res.data + typeof(res.data))
                _seft.highScoreLabel.string = res.data.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
            }
        })
        //游戏结束计分牌
        this.scoreLabel.string = score.getScore().toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
        this.node.active = true;
        this.mask.active = true;
        this.pathPosition.push(this.popBoxDefaultPosition);
        this.pathPosition.push(cc.v2(0, 50));
        this.pathPosition.push(cc.v2(0, 0));
        this.mask.runAction(cc.fadeTo(0.3, 180));
        common.bannerAd = common.showBannerAd();
        this.restartBtn.node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5, 1.2).easing(cc.easeBackOut()),
            cc.scaleTo(0.5, 1).easing(cc.easeBackIn())
        )));
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, this.pathPosition, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => {})
        ));
    },
    //重开游戏
    gameRestart() {
        if (this.running) {
            return;
        }
        common.bannerAd.hide();
        this.running = true;
        let pathPos = this.pathPosition.slice(0).reverse();
        this.mask.runAction(cc.sequence(
            cc.fadeTo(0.3, 0),
            cc.callFunc(() => {
                this.mask.active = false;
            })
        ));
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, pathPos, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => {
                this.node.active = false;
                this.pathPosition = [];
                this.running = false;
            })
        ));
        this.node.main.gameRestart();
    },
    //返回主页
    goHome() {
        score.resetScore();
        cc.director.loadScene("home");
    }
});