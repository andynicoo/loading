//小球控制类
var Ball = cc.Class({
    extends: cc.Component,
    properties: () => ({
        rigidBody: {
            type: cc.RigidBody,
            default: null
        }
    }),
    //加载完成
    onLoad() {
        this.rigidBody = this.getComponent(cc.RigidBody);
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //开始碰撞
    onBeginContact(contact, self, other) {
        //碰到一次game-over减一个小球，减完游戏结束
        if (other.node.name == "game-over") {
            this.main.removeBall(this);
            this.audio.audioEffectPlay(this.audio.ballOut);
        }
    }
});
module.exports = Ball;