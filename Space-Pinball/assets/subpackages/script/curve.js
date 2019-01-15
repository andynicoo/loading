//左侧三角（3个curves)的碰撞逻辑
var score = require("./score");
var Bumper = require("./bumper");
cc.Class({
    extends: cc.Component,
    properties: {
        curves: {
            type: Bumper,
            default: []
        },
        lightStatus: [],
        arrarLights: {
            type: cc.Node,
            default: []
        },
        pinball: {
            type: cc.Node,
            default: []
        }
    },
    //首次加载完
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.init();
    },
    //初始化，开始和重置时调用
    init(){
        for (let i in this.curves) {
            this.curves[i].main = this;
        }
        this.level = 1;
        this.record = [];
        this.arrarLightBlinking = false;
        this.pinballCache = [];
        this.defaultPinball = this.pinball.slice(0);
    },
    //重置
    reset(){
        this.clearAllBumperLight();
        for(let i in this.arrarLights){
            this.stopArrarLightBlink(i)
        }
        this.resetPinball();
        this.init();
    },

    //设置单个curve对应的灯亮起
    setLight(tag) {
        this.lightStatus.push(tag);
        if (this.lightStatus.length == this.curves.length) {
            this.audio.audioEffectPlay(this.audio.allBumperOn);
            this.setArrawLight();
            //加分
            score.addScore(score.scoreConfig["allCurves"]);
        } else {
            //音效
            this.audio.audioEffectPlay(this.audio.bumperOn);
            //加分
            score.addScore(score.scoreConfig["oneBumper"]);
        }
    },
    //设置箭头亮起
    setArrawLight() {
        this.index = Math.floor(Math.random() * this.arrarLights.length);
        this.lightBlink(this.arrarLights[this.index].children[0]);
        this.arrarLightBlinking = true;
    },
    //设置当前level
    setLevel(level) {
        let scoreLv = '';
        if (level >= 5) {
            level = 4;
            scoreLv = level + 1;
        } else {
            scoreLv = level;
        }
        score.addScore(score.scoreConfig["curvesLevels"]['lv' + scoreLv]);
    },
    //闪烁
    lightBlink(node) {
        this.linghtInterval = cc.blink(1, 1);
        node.runAction(cc.repeatForever(cc.sequence(
            this.linghtInterval,
            cc.callFunc(() => {
                node.opacity = 0;
            })
        )));
    },
    //设置一组灯同时亮起的闪烁,清除所有亮灯
    clearAllBumperLight() {
        this.lightStatus = [];
        for (let i in this.curves) {
            let curve = this.curves[i].node.children[0];
            curve.runAction(cc.sequence(
                cc.blink(1, 3),
                cc.callFunc(() => {
                    curve.opacity = 0;
                    this.curves[i].isLight = false;
                })
            ));
        }
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        this.recordTag(self.tag);
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        this.recordTag(self.tag)
        //定义两个碰撞点，判断小球是否通过三角弯道
        let record = this.record.join("").toString();
        if (/0022$/.test(record) || /1122$/.test(record)) {
            this.audio.audioEffectPlay(this.audio.gate);
        }
        if (!this.arrarLightBlinking) {
            return;
        }
        if ((record == "002211" && this.index == 0)) {
            this.stopArrarLightBlinkSetLv(this.index);
            this.setPinball();
        }
        if (record == "112200" && this.index == 1) {
            this.stopArrarLightBlinkSetLv(this.index);
            this.setPinball();
        }
    },
    //设置pinball字母
    setPinball() {
        if (this.pinballCache.length == 7) {
            this.resetPinballAddScore();
            return;
        }
        let index = Math.floor(Math.random() * this.defaultPinball.length);
        this.pinballCache.push(this.defaultPinball.splice(index, 1));
        for (let i in this.pinballCache) {
            this.pinballCache[i][0].opacity = 0;
            this.pinballCache[i][0].stopAllActions(this.linghtInterval);
            if (i == this.pinballCache.length - 1) {
                this.lightBlink(this.pinballCache[i][0])
            } else {
                this.pinballCache[i][0].opacity = 255;
            }
        }
    },
    //重置pinball
    resetPinball(){
        for (let i in this.pinballCache) {
            let node = this.pinballCache[i][0];
            node.stopAllActions(this.linghtInterval);
            node.runAction(cc.sequence(
                cc.blink(1, 3),
                cc.callFunc(() => {
                    node.opacity = 0;
                })
            ));
        }
        this.defaultPinball = this.pinball.slice(0);
        this.pinballCache = [];
    },
    //重置pinball,并加分
    resetPinballAddScore() {
        this.resetPinball();
        score.addScore(score.scoreConfig["pinball"]);
        this.audio.audioEffectPlay(this.audio.pinball);
    },
    //停止箭头灯的闪烁
    stopArrarLightBlink(i) {
        this.arrarLights[i].children[0].stopAllActions(this.linghtInterval);
        this.arrarLights[i].children[0].opacity = 0;
        this.clearAllBumperLight();
        this.arrarLightBlinking = false;
    },
    //停止箭头灯的闪烁并设置级别
    stopArrarLightBlinkSetLv(i){
        this.stopArrarLightBlink(i);
        this.setLevel(this.level++);
    },
    //记录标记
    recordTag(tag) {
        if (this.record.length >= 6) {
            this.record = this.record.splice(-5);
        }
        this.record.push(tag);
    }
});
