var common = require('./../../script/common');
//左右弹片控制类
cc.Class({
    extends: cc.Component,
    properties: {
        type: 'left',
        leftSpringBar: cc.Node,
        rightSpringBar: cc.Node
    },
    onLoad: function () {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.node.active = false;
        this.running = false;
    },
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    },
    //模拟长按
    onTouchStart() {
        this.holdClick = true;
    },
    onTouchEnd() {
        this.holdClick = false;
        //复位
        this.reset();
    },
    //长按旋转弹片
    rotate() {
        if (!this.running) {
            this.running = true;
            let degLeft = 50
            let degRight = -50;
            if(this.type == "left"){
                this.leftSpringBar.runAction(cc.sequence(
                    cc.rotateTo(0.05, degLeft),
                    cc.callFunc(() => {
                        this.audio.audioEffectPlay(this.audio.flipper);
                    })
                ));
                if(common.oneHandStatus){
                    this.rightSpringBar.runAction(cc.sequence(
                        cc.rotateTo(0.05, degRight),
                        cc.callFunc(() => {
                            this.audio.audioEffectPlay(this.audio.flipper);
                        })
                    ));
                }
            }else{
                this.rightSpringBar.runAction(cc.sequence(
                    cc.rotateTo(0.05, degRight),
                    cc.callFunc(() => {
                        this.audio.audioEffectPlay(this.audio.flipper);
                    })
                ));
                if(common.oneHandStatus){
                    this.leftSpringBar.runAction(cc.sequence(
                        cc.rotateTo(0.05, degLeft),
                        cc.callFunc(() => {
                            this.audio.audioEffectPlay(this.audio.flipper);
                        })
                    ));
                }
            }
        };
    },
    //复位
    reset() {
        let degLeft = 2
        let degRight = -2;
        if(this.type == "left"){
            this.leftSpringBar.runAction(cc.rotateTo(0.05, degLeft));
            if(common.oneHandStatus){
                this.rightSpringBar.runAction(cc.rotateTo(0.05, degRight));
            }
        }else{
            this.rightSpringBar.runAction(cc.rotateTo(0.05, degRight));
            if(common.oneHandStatus){
                this.leftSpringBar.runAction(cc.rotateTo(0.05, degLeft));
            }
        }
        this.running = false;
    },
    //更新操作
    update(dt) {
        //是否是手指长按
        if (this.holdClick) {
            this.rotate()
        }
    },
});
