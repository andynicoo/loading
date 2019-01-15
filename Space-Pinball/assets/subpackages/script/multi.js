//单个multi控制类
cc.Class({
    extends: cc.Component,
    properties: {
        tag: {
            default: 0,
            type: cc.Integer
        }
    },
    //首次加载完
    start() {
        this.node.isLight = false;
        this.node.children[0].opacity = 0;
    },
    //碰撞结束
    onEndContact(contact, self, other) {
        if (this.node.isLight) {
            return;
        }
        this.node.isLight = true;
        this.node.children[0].opacity = 255;
        this.node.main.setLight(this.tag);
    }
});
