//左侧边弯道碰撞控制类
var score = require("./score");
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
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.init();
    },
    //初始化，开始和重置时调用
    init(){
        this.record = [];
        this.routerLevel = 0;
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        if (!this.shootStatus) {
            this.recordTag(self.tag)
        }
    },
    //碰撞更新时
    onPreSolve: function (contact, self, other) {
        if (!this.shootStatus && self.tag == 0) {
            var worldManifold = contact.getWorldManifold();
            var normal = worldManifold.normal;
            if (normal.x < 0) {
                contact.disabled = true;
            }
        }
    },
    //碰撞结束时
    onEndContact(contact, self, other) {
        if (!this.shootStatus) {
            this.recordTag(self.tag)
        }
        //定义3个碰撞点，判断小球是否从侧边弯道通过
        if (this.record.join("").toString() === "110202") {
            this.audio.audioEffectPlay(this.audio.gate);
            score.addScore(score.scoreConfig["oneBumper"]);
            this.setRouterLevel(this.routerLevel++);
        }
    },
    //记录标记
    recordTag(tag) {
        if (this.record.length >= 6) {
            this.record = this.record.splice(-5);
        }
        this.record.push(tag);
    },
    //设置组的加分级别
    setRouterLevel(level) {
        if (level == 0) {
            this.lightBlink(this.lights[0]);
            return;
        }
        let scoreLv = '';
        if (level >= 7) {
            level = 6;
            scoreLv = level + 1;
        } else {
            this.lights[level - 1].stopAllActions(this.linghtInterval);
            this.lights[level - 1].opacity = 255;
            scoreLv = level;
        }
        score.addScore(score.scoreConfig["routerLights"]['lv' + scoreLv]);
        for (let i = 0; i <= level; i++) {
            if (i == level) {
                this.lightBlink(this.lights[level]);
            }
        }
    },
    //重置级别灯
    resetRouterLevel(){
        if(this.routerLevel > 0){
            let level = this.routerLevel >= 7 ? 6 : this.routerLevel;
            for(let i = 0; i <= level; i++){
                this.lights[i].stopAllActions(this.linghtInterval);
                this.lights[i].opacity = 0;
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
    //重置
    reset(){
        this.resetRouterLevel();
        this.init();
    }
});
