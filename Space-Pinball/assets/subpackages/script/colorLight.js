//彩色灯控制类
var score = require("./score");
cc.Class({
    extends: cc.Component,
    properties: {
        lights: {
            default: [],
            type: cc.Node
        }
    },
    //首次加载完
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //设置单个multi对应的灯亮起
    setLight(tag) {
        //音效
        this.audio.audioEffectPlay(this.audio.toggle);
        //加分
        score.addScore(score.scoreConfig["oneBumper"]);
        let lightSort = []
        switch (tag) {
            case 0:
            case 1:
                lightSort = [0, 1, 2, 3];
                break;
            case 2:
                lightSort = [[1, 2], [0, 3]];
                break;
            case 3:
            case 4:
                lightSort = [3, 2, 1, 0];
                break;
        }
        this.setLighBlinkSort(lightSort);
    },
    //判断是否为数组
    isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },
    //设置4个竖灯的闪烁顺序
    setLighBlinkSort(lightSort) {
        let delay = 100;
        for (let i in lightSort) {
            if (this.isArray(lightSort[i])) {
                setTimeout(() => {
                    for (let j in lightSort[i]) {
                        this.lights[lightSort[i][j]].children[0].runAction(cc.sequence(
                            cc.fadeIn(0.4).easing(cc.easeCircleActionInOut()),
                            cc.fadeOut(0.4).easing(cc.easeCircleActionInOut())
                        ))
                    }
                }, delay);
                delay += 120;
            } else {
                setTimeout(() => {
                    this.lights[lightSort[i]].children[0].runAction(cc.sequence(
                        cc.fadeIn(0.4).easing(cc.easeCircleActionInOut()),
                        cc.fadeOut(0.4).easing(cc.easeCircleActionInOut())
                    ))
                }, delay)
                delay += 80;
            }
        }
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        this.setLight(self.tag);
    }
});
