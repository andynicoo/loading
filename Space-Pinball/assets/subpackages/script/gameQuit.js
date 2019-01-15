//退出本局游戏弹窗控制类
var score = require("./score");
cc.Class({
    extends: cc.Component,
    properties: {
        popBox: cc.Node,
        okBtn: cc.Button,
        noBtn: cc.Button,
        mask: cc.Node
    },
    //首次加载完
    onLoad() {
        this.mask.on(cc.Node.EventType.TOUCH_START, () => { }, this);
        this.okBtn.node.on('click', this.goHome, this);
        this.noBtn.node.on('click', this.hidePopBox, this);
    },
    start(){
        this.node.active = false;
        this.mask.active = false;
        this.popBoxDefaultPosition = this.popBox.position;
        this.pathPosition = [];
    },
    //显示弹窗
    showPopBox() {
        if (this.running) {
            return;
        }
        this.node.active = true;
        this.mask.active = true;
        this.pathPosition.push(this.popBoxDefaultPosition);
        this.pathPosition.push(cc.v2(0, 50));
        this.pathPosition.push(cc.v2(0, 0));
        this.mask.runAction(cc.fadeTo(0.3, 180));
        this.noBtn.node.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5, 1.2).easing(cc.easeBackOut()),
            cc.scaleTo(0.5, 1).easing(cc.easeBackIn())
        )));
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
    },
    //返回主页
    goHome() {
        score.resetScore();
        cc.director.loadScene("home");
    }
});