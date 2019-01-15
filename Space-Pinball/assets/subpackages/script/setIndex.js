//设置顶层元素的index，高于生成的小球(zIndex = 0)显示
cc.Class({
    extends: cc.Component,
    onLoad(){
        this.node.zIndex = 5;
    },
});