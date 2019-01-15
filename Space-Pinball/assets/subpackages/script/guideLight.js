//起步指示灯控制
var Common = require("./../../script/common");
cc.Class({
    extends: cc.Component,
    properties: {
        lights: {
            type: cc.Node,
            default: []
        },
    },
    start() {
        this.blinkingStatus = false;
    },
    //闪烁
    blinkLights() {
        let delay = 100;
        for (let i in this.lights) {
            let node = this.lights[i];
            setTimeout(() => {
                node.runAction(cc.repeatForever(cc.sequence(
                    cc.fadeIn(0.8).easing(cc.easeCircleActionInOut()),
                    cc.fadeOut(0.8).easing(cc.easeCircleActionInOut())
                )));
            }, delay);
            delay += 100;
        }
        this.blinkingStatus = true;
    },
    //清除闪烁
    clearAllBlink() {
        for (let i in this.lights) {
            this.lights[i].stopAllActions();
            this.lights[i].opacity = 0;
        }
        this.blinkingStatus = false;
    },
    //更新起步指示灯的状态
    update() {
        if (Common.getShootStatus()) {
            this.clearAllBlink();
            return;
        }
        if (!this.blinkingStatus) {
            this.blinkLights();
        }
    }
});
