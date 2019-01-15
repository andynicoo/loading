//大圆灯控制类
cc.Class({
    extends: cc.Component,
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.blinking = false;
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        this.audio.audioEffectPlay(this.audio.bumper);
        if (this.blinking) {
            return;
        }
        this.blinking = true;
        this.node.children[0].runAction(cc.sequence(
            cc.fadeIn(0.16).easing(cc.easeCircleActionInOut()),
            cc.fadeOut(0.16).easing(cc.easeCircleActionInOut()),
            cc.fadeIn(0.16).easing(cc.easeCircleActionInOut()),
            cc.fadeOut(0.16).easing(cc.easeCircleActionInOut()),
            cc.fadeIn(0.16).easing(cc.easeCircleActionInOut()),
            cc.fadeOut(0.16).easing(cc.easeCircleActionInOut()),
            cc.callFunc(() => {
                this.blinking = false;
                this.node.children[0].opacity = 0;
            })
        ))
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        let vel = other.body.linearVelocity;
        let worldManifold = contact.getWorldManifold();
        // let vel1 = self.body.getLinearVelocityFromWorldPoint(worldManifold.points[0]);
        // let vel2 = other.body.getLinearVelocityFromWorldPoint(worldManifold.points[0]);
        // let relativeVelocity = vel1.sub(vel2);
        let normal = worldManifold.normal;
        if (normal.y > -0.5) {
            //other.body.linearVelocity = vel.mul(2.5)
            //other.body.applyLinearImpulse(cc.v2(-100,1000),other.body.getWorldCenter(),true)
            //other.body.linearVelocity = relativeVelocity.mul(1.5);
        }
        this.node.main.addScore();
    }
});
