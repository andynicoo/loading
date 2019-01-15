//surprise加分控制类
cc.Class({
    extends: cc.Component,
    start() {
        this.record = [];
    },
    //碰撞开始
    onBeginContact(contact, self, other) {
        if (this.node.main.surpriseStatus) {
            this.recordTag(self.tag);
        }
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        if (this.node.main.surpriseStatus) {
            this.recordTag(self.tag);
            //定义三个碰撞点，判断小球是否按顺序从管道滑过
            if (this.record.join("").toString() === "002211") {
                //调用父类加surprise分
                this.node.main.setSurprise();
            }
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
