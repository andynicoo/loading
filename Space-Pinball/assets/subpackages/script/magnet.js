//磁铁吸引小球控制类
cc.Class({
    extends: cc.Component,
    properties: {
        isTouchedBall: false,
        type: "left"
    },
    //加载完成
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        if (other.node.name == 'ball') {
            this.isTouchedBall = true;
            this.isMagnet = true;
            this.ballRigidBody = other.body;
            this.ball = other;
        }
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        this.isMagnet = false;
    },
    //吸引后发射小球
    shootBall() {
        //设置几组可以弹出小球的冲量
        let impulse = {
            left: [cc.v2(-45, 1500), cc.v2(0, 820), cc.v2(-130, 3000)],
            right: [cc.v2(-45, 1500), cc.v2(0, 820), cc.v2(-120, 2500)]
        }
        this.ballRigidBody.gravityScale = 3;
        let random = Math.floor(Math.random() * impulse.left.length);
        let linearVelocity = impulse.left[random];
        if (this.type == "right") {
            linearVelocity = impulse.right[random];
        }
        this.ballRigidBody.linearVelocity = linearVelocity;
        //发射小球
        this.audio.audioEffectPlay(this.audio.shoot);
    },
    //更新
    update() {
        if (this.isTouchedBall) {
            if (this.isMagnet) {
                this.ballRigidBody.gravityScale = 0;
                this.ballRigidBody.linearVelocity = cc.Vec2.ZERO;
                let pathPos = [];
                pathPos.push(this.ball.node.position);
                pathPos.push(this.node.position);
                //播放音效
                this.audio.audioEffectPlay(this.audio.magnet);
                this.ball.node.runAction(cc.sequence(
                    cc.cardinalSplineTo(1, pathPos, 0.9),
                    cc.callFunc(function () {
                        setTimeout(() => {
                            this.shootBall();
                        }, 600)
                    }.bind(this))
                ))
                this.isTouchedBall = false;
            }
        }
    }
});
