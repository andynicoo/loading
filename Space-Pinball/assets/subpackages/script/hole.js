//球洞控制类
cc.Class({
    extends: cc.Component,
    properties: {
        isTouchedBall: false
    },
    //加载完成
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.node.zIndex = 500;
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
        let dirPos = cc.v2(550, 370); //小球发出的方向位置
        let dir = dirPos.sub(this.node.position);

        let pathPos = [];
        pathPos.push(this.node.position);
        pathPos.push(dirPos);
        this.ball.node.runAction(cc.sequence(
            cc.cardinalSplineTo(0.5, pathPos, 0.5),
            cc.callFunc(() => {
                this.ballRigidBody.active = true;
                this.ballRigidBody.linearVelocity = dir;
            })
        ));
        //发射小球
        this.audio.audioEffectPlay(this.audio.shoot);
    },
    //更新
    update() {
        if (this.isTouchedBall) {
            if (this.isMagnet) {
                this.ballRigidBody.active = false;
                this.ballRigidBody.linearVelocity = cc.Vec2.ZERO;
                let pathPos = [];
                pathPos.push(this.ball.node.position);
                pathPos.push(this.node.position);
                //播放音效
                this.audio.audioEffectPlay(this.audio.magnet);
                this.audio.audioEffectPlay(this.audio.hole);
                this.ball.node.runAction(cc.sequence(
                    cc.cardinalSplineTo(0.1, pathPos, 0.9),
                    cc.callFunc(function () {
                        setTimeout(() => {
                            this.shootBall();
                            //判断是否满足球的提升效果
                            if (this.node.upgradeStatus) {
                                this.node.main.upgradeBall();
                            }
                            //判断是否满足加小球的效果
                            if (this.node.plusStatus) {
                                this.node.main.plusBall();
                            }
                        }, 1000)
                    }.bind(this))
                ))
                this.isTouchedBall = false;
            }
        }
    }
});
