
var common = require("./../../script/common");
//游戏开始时弹窗控制类
cc.Class({
    extends: cc.Component,
    properties: {
        popBox: cc.Node,
        mask: cc.Node,
        left: cc.Node,
        right: cc.Node
    },
    //首次加载完
    onLoad() { 
        this.node.on(cc.Node.EventType.TOUCH_START, this.hidePopBox, this);
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.node.active = false;
        this.popBoxDefaultPosition = this.popBox.position;
        this.pathPosition = [];
        //左右弹片动画
        this.left.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.5, 45).easing(cc.easeBackIn()),
            cc.delayTime(0.5),
            cc.rotateTo(0.5, 0).easing(cc.easeBackOut())
        )))
        this.right.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.4, -45).easing(cc.easeBackOut()),
            cc.rotateTo(0.4, 0).easing(cc.easeBackIn())
        )))
        //显示弹窗
        this.showPopBox();
    },
    //显示弹窗
    showPopBox() {
        this.node.active = true;
        this.pathPosition.push(this.popBoxDefaultPosition);
        this.pathPosition.push(cc.v2(0, 50));
        this.pathPosition.push(cc.v2(0, 0));
        this.mask.runAction(cc.fadeTo(0.3, 180));
        common.bannerAd = common.showBannerAd();
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, this.pathPosition, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => { })
        ));
    },
    //关闭弹窗
    hidePopBox() {
        if (this.running) {
            return;
        }
        common.bannerAd.hide();
        this.running = true;
        let pathPos = this.pathPosition.slice(0).reverse();
        this.mask.runAction(cc.fadeTo(0.3, 0));
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, pathPos, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => {
                this.node.active = false;
                this.pathPosition = []
                this.running = false;
            })
        ));
        this.node.main.moveCameraToRB(2);
        this.audio.audioEffectPlay(this.audio.gameStart);
    }
});