//顶部多倍分数控制类
var score = require("./score");
cc.Class({
    extends: cc.Component,
    properties: {
        subEles: {
            type: cc.Node,
            default: []
        },
        lightStatus: [],

        levelsEles: {
            default: [],
            type: cc.Node
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
        for (let i in this.subEles) {
            this.subEles[i].main = this;
        }
        this.level = 0;
    },
    //设置单个multi对应的灯亮起
    setLight(tag) {
        this.lightStatus.push(tag);
        if (this.lightStatus.length == this.subEles.length) {
            this.clearAllLightsStatus();
            this.audio.audioEffectPlay(this.audio.multi);
            this.setLevels(this.level++);
            //加分
            score.addScore(score.scoreConfig["multiLights"]);
        } else {
            //加分
            score.addScore(score.scoreConfig["oneBumper"]);
        }
    },
    //设置多倍分数的级别
    setLevels(level) {
        if (level == 0) {
            this.lightBlink(this.levelsEles[0].children[0]);
            return;
        }
        let scoreLv = '';
        if (level >= 6) {
            level = 5;
            scoreLv = level + 1;
        } else {
            this.levelsEles[level - 1].children[0].stopAllActions(this.linghtInterval);
            this.levelsEles[level - 1].children[0].opacity = 255;
            scoreLv = level;
        }
        score.setMultiScore(score.scoreConfig["multiLevels"]['lv' + scoreLv]);
        for (let i = 0; i <= level; i++) {
            if (i == level) {
                this.lightBlink(this.levelsEles[level].children[0]);
            }
        }
    },
    //重置级别灯
    resetLevels(){
        if(this.level > 0){
            let level = this.level >= 6 ? 5 : this.level;
            for(let i = 0; i <= level; i++){
                this.levelsEles[i].children[0].stopAllActions(this.linghtInterval);
                this.levelsEles[i].children[0].opacity = 0;
            }
        }
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
    //设置一组灯同时亮起的闪烁，清除所有亮灯
    clearAllLightsStatus() {
        this.lightStatus = [];
        for (let i in this.subEles) {
            let ele = this.subEles[i].children[0];
            ele.runAction(cc.sequence(
                cc.blink(1, 3),
                cc.callFunc(() => {
                    ele.opacity = 0;
                    this.subEles[i].isLight = false;
                })
            ));
        }
    },
    //重置
    reset(){
        this.resetLevels();
        this.clearAllLightsStatus()
        this.init();
    }
});
