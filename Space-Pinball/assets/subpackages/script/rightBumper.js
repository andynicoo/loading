//右侧一组（4个bumpers)的碰撞逻辑
var Bumper = require("./bumper");
var score = require("./score");
cc.Class({
    extends: cc.Component,
    properties: {
        bumpers: {
            type: Bumper,
            default: []
        },
        lightStatus: [],
        lights: {
            default: [],
            type: cc.Node
        },
        brands: {
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
        for (let i in this.bumpers) {
            this.bumpers[i].main = this;
        }
        this.brandsLevel = 0;
    },
    //设置单个bumper对应的灯亮起
    setLight(tag) {
        this.lights[tag].opacity = 255;
        this.lightStatus.push(tag);
        if (this.lightStatus.length == this.bumpers.length) {
            this.clearAllBumperLight();
            this.audio.audioEffectPlay(this.audio.allBumperOn);
            this.setBrandLevel(this.brandsLevel++);
            //加分
            score.addScore(score.scoreConfig["rightAllBumpers"]);
        } else {
            //音效
            this.audio.audioEffectPlay(this.audio.bumperOn);
            //加分
            score.addScore(score.scoreConfig["oneBumper"]);
        }
    },
    //设置右侧记分牌的当前level
    setBrandLevel(level) {
        if (level == 0) {
            this.lightBlink(this.brands[0]);
            return;
        }
        let scoreLv = '';
        if (level >= 7) {
            level = 6;
            scoreLv = level + 1;
        } else {
            this.brands[level - 1].stopAllActions(this.linghtInterval);
            this.brands[level - 1].opacity = 255;
            scoreLv = level;
        }
        score.addScore(score.scoreConfig["rightBrands"]['lv' + scoreLv]);
        for (let i = 0; i <= level; i++) {
            if (i == level) {
                this.lightBlink(this.brands[level]);
            }
        }
    },
    //重置级别灯
    resetBrandLevel(){
        if(this.brandsLevel > 0){
            let level = this.brandsLevel >= 7 ? 6 : this.brandsLevel;
            for(let i = 0; i <= level; i++){
                this.brands[i].stopAllActions(this.linghtInterval);
                this.brands[i].opacity = 0;
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
    //设置一组灯同时亮起的闪烁,清除所有亮灯
    clearAllBumperLight() {
        for (let i in this.lights) {
            this.lights[i].opacity = 0;
        }
        this.lightStatus = [];
        for (let i in this.bumpers) {
            let bumper = this.bumpers[i].node.children[0];
            bumper.runAction(cc.sequence(
                cc.blink(1, 3),
                cc.callFunc(() => {
                    bumper.opacity = 0;
                    this.bumpers[i].isLight = false;
                })
            ));
        }
    },
    //重置
    reset(){
        this.resetBrandLevel();
        this.clearAllBumperLight();
        this.init();
    }
});
