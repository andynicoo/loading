//球发射门的碰撞控制类
var Common = require("./../../script/common");
cc.Class({
    extends: cc.Component,
    //加载完成
    onLoad() {
        //引入公共音源类
        this.audio = cc.find('audio').getComponent('audio');
    },
    start(){
        this.record = [];
        this.shootStatus = Common.getShootStatus();
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
            if (normal.x > 0) {
                contact.disabled = true;
            }
        }
    },
    onEndContact(contact, self, other) {
        if (!this.shootStatus) {
            this.recordTag(self.tag)
        }
        //定义两个碰撞点，判断小球是否发射成功
        if (this.record.join("").toString() === "202101") {
            this.audio.audioEffectPlay(this.audio.gate);
            Common.setShootStatus(true);
        }
    },
    //记录标记
    recordTag(tag) {
        if (this.record.length >= 6) {
            this.record = this.record.splice(-5);
        }
        this.record.push(tag);
    }
});
