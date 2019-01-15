var Common = require("./common");
//pinball灯控制类
cc.Class({
    extends: cc.Component,
    properties: {
        lights: {
            type: cc.Node,
            default: []
        },
    },
    //加载完成
    onLoad() {
        this.blinkingStatus = false;
    },
    //闪烁
    blinkLights() {
        let delay = 100;
        for (let i in this.lights) {
            let node = this.lights[i];
            setTimeout(() => {
                node.runAction(cc.repeatForever(cc.sequence(
                    cc.fadeIn(1).easing(cc.easeCircleActionInOut()),
                    cc.fadeOut(1).easing(cc.easeCircleActionInOut())
                )));
            }, delay);
            delay += 150;
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
    //更新pinball灯的状态
    update() {
        if (Common.getShootStatus()) {
            if (!this.blinkingStatus) {
                return;
            }
            this.clearAllBlink();
            return;
        }
        if (!this.blinkingStatus) {
            this.blinkLights();
        }
    }
});
