//小卫星闪灯控制类
var score = require("./score");
cc.Class({
    extends: cc.Component,
    //加载完成
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //碰撞开始
    onEndContact() {
        let _node = this.node.children[0];
        _node.opacity = 255;
        _node.runAction(cc.sequence(
            cc.blink(1, 3),
            cc.callFunc(() => {
                _node.opacity = 0;
            })
        ));
        //加分
        score.addScore(score.scoreConfig["oneBumper"]);
        //播放音效
        this.audio.audioEffectPlay(this.audio.toggle);
    }
});
