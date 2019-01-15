//减震片控制类
cc.Class({
    extends: cc.Component,
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        this.audio.audioEffectPlay(this.audio.jumper);
        this.node.children[0].opacity = 255;
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        this.node.children[0].opacity = 0;
    }
});
