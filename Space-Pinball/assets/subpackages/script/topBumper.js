
//右上角一组（3个bumpers)的碰撞逻辑
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
        label: cc.Label,
        lightLabel: cc.Label,
        bigLights: {
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
        for (let i in this.bumpers) {
            this.bumpers[i].main = this;
        }
        for (let i in this.bigLights) {
            this.bigLights[i].main = this;
        }
        this.bigLightLevel = 1;
    },
    //设置单个bumper对应的灯亮起
    setLight(tag) {
        this.lightStatus.push(tag);
        if (this.lightStatus.length == this.bumpers.length) {
            this.clearAllBumperLight();
            this.audio.audioEffectPlay(this.audio.allBumperOn);
            this.setBigLightLevel(this.bigLightLevel++)
            //加分
            score.addScore(score.scoreConfig["topAllBumpers"]);
            this.lightLabel.node.runAction(cc.sequence(
                cc.blink(2,6),
                cc.callFunc(() => {
                    this.lightLabel.node.opacity = 0;
                })
            ))
        } else {
            //音效
            this.audio.audioEffectPlay(this.audio.bumperOn);
            //加分
            score.addScore(score.scoreConfig["oneBumper"]);
        }
    },
    //设置大圆灯碰撞级别
    setBigLightLevel(level) {
        let scoreLv = '';
        if (level >= 7) {
            level = 6;
        }
        scoreLv = level + 1;
        let string = score.scoreConfig["bigLights"]["lv" + scoreLv].toString();
        this.label.string = string;
        this.lightLabel.string = string;
    },
    //重置大圆灯碰撞级别
    resetBigLightLevel(){
        let string = score.scoreConfig["bigLights"]["lv1"].toString();
        this.label.string = string;
        this.lightLabel.string = string;
    },
    //大圆灯碰撞加分
    addScore() {
        if (this.bigLightLevel > 7) {
            this.bigLightLevel = 7;
        }
        score.addScore(score.scoreConfig["bigLights"]["lv" + this.bigLightLevel])
    },
    //设置一组灯同时亮起的闪烁,清除所有亮灯
    clearAllBumperLight() {
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
        this.resetBigLightLevel();
        this.clearAllBumperLight();
        this.init();
    }
});
