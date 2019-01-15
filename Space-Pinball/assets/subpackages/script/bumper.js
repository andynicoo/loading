//单个bumper碰撞类
cc.Class({
    extends: cc.Component,
    properties: {
        tag: {
            default: 0,
            type: cc.Integer
        }
    },
    //首次加载完
    onLoad() {
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.isLight = false;
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        if (other.being) {
            return;
        }
        if (this.isLight) {
            this.audio.audioEffectPlay(this.audio.bumperOff);
            return;
        }
        other.being = true;
        this.isLight = true;
        this.node.children[0].opacity = 255;
        this.main.setLight(this.tag);
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        other.being = false;
    }
});
