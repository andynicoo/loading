//左侧一组（5个bumpers)的碰撞逻辑
var Bumper = require("./bumper");
var score = require("./score");
var common = require("./../../script/common");
cc.Class({
    extends: cc.Component,
    properties: {
        bumpers: {
            type: Bumper,
            default: []
        },
        lightStatus: [],
        surprise: cc.Node,
        jumper: cc.Node,
        plus: cc.Node,
        upgrade: cc.Node,
        hole: cc.Node
    },
    //首次加载完
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
        this.surpriseLight = this.surprise.getChildByName("light");
    },
    start(){
        this.init();
    },
    //初始化，开始和重置时调用
    init(){
        for (let i in this.bumpers) {
            this.bumpers[i].main = this;
        }
        this.jumper.active = false;
        //一组灯的总体级别，初始为0,一组全部点亮时加1
        this.groupLevel = 0;
        //设置surprise初始状态
        this.surprise.main = this;
        this.surpriseStatus = false;
        //赋予hole的父类方法
        this.hole.main = this;
    },
    //设置单个bumper对应的灯亮起
    setLight(tag) {
        this.lightStatus.push(tag);
        if (this.lightStatus.length == this.bumpers.length) {
            this.clearAllBumperLight();
            this.audio.audioEffectPlay(this.audio.allBumperOn);
            this.handleGroupLevel(this.groupLevel++);
            //加分
            score.addScore(score.scoreConfig["leftAllBumpers"]);
        } else {
            //音效
            this.audio.audioEffectPlay(this.audio.bumperOn);
            //加分
            score.addScore(score.scoreConfig["oneBumper"]);
        }
    },
    //处理不同的级别的事件触发
    handleGroupLevel(level) {
        if (level > 2) {
            level = common.getUpgradeStatus() ? 2 : 1;
        }
        if (this.jumper.active == false) {
            this.jumper.active = true;
        }
        //触发球的提升效果灯
        if (level == 1) {
            this.lightBlink(this.upgrade.children[0]);
            this.hole.upgradeStatus = true;
        }
        //触发加一个球效果灯
        if (level == 2) {
            this.lightBlink(this.plus.children[0]);
            this.hole.plusStatus = true;
        }
        if (this.surpriseStatus) {
            return;
        }
        this.surpriseStatus = true;
        this.lightBlink(this.surpriseLight);
    },
    //设置surprise加分
    setSurprise() {
        let surpriseScore = score.getSurpriseScore();
        //surprise计分加到总得分
        score.addScore(surpriseScore);
        //音效
        this.audio.audioEffectPlay(this.audio.surprise);
        this.resetSurprise();
    },
    //重置surprise状态
    resetSurprise(){
        //重置surprise计分
        score.resetSurpriseScore();
        this.surpriseLight.stopAllActions(this.linghtInterval);
        this.surpriseLight.opacity = 0;
        this.surpriseStatus = false;
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
    //提升小球
    upgradeBall() {
        this.resetUpupgradeBall();
        this.audio.audioEffectPlay(this.audio.levelUp);
        //调用父类提升小球逻辑
        this.node.main.upgrade();
    },
    //重置提升小球
    resetUpupgradeBall(){
        this.hole.upgradeStatus = false;
        this.upgrade.children[0].stopAllActions();
        this.upgrade.children[0].opacity = 0;
    },
    //加一个小球
    plusBall() {
        this.resetplusBall();
        //调用父类+1小球
        this.node.main.plusBall()
    },
    //重置加一个小球
    resetplusBall(){
        this.hole.plusStatus = false;
        this.plus.children[0].stopAllActions();
        this.plus.children[0].opacity = 0;
    },
    //重置
    reset(){
        this.init();
        this.hole.plusStatus = false;
        this.hole.upgradeStatus = false;
        this.resetSurprise();
        this.clearAllBumperLight();
        this.resetplusBall();
        this.resetUpupgradeBall();
    }
});
