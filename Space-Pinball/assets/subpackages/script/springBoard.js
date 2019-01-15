//左右两个固定弹力板控制类
cc.Class({
    extends: cc.Component,
    properties: {
        type: "left",
    },
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //碰撞开始
    onBeginContact(contact, self) {
        if (self.tag == 1) {
            cc.loader.loadRes('pick-focus', cc.SpriteFrame, (err, spriteFrame) => {
                this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                this.audio.audioEffectPlay(this.audio.bumper, false, 1);
                setTimeout(() => {
                    this.node.getComponent(cc.Sprite).spriteFrame = null;
                }, 100);
            });
        }
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        if (self.tag == 1) {
            let impulse = cc.v2(1200, 2000);
            if (this.type == "right") {
                impulse = cc.v2(-1200, 2000);
            }
            other.body.applyLinearImpulse(impulse, other.body.getWorldCenter(), true)
        }
    }
});
