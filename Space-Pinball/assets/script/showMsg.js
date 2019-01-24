
//主页按钮弹窗控制类
var common = require('./common');
cc.Class({
    extends: cc.Component,
    properties: {
        popBox: cc.Node,
        mask: cc.Node,
        btn: cc.Button,
        dispaly: cc.Node,
        tag: cc.Integer
    },
    //首次加载完
    onLoad() {
        this.mask.on(cc.Node.EventType.TOUCH_START, this.hidePopBox, this);
        this.popBox.on(cc.Node.EventType.TOUCH_START, (e) => { }, this);
        this.node.on(cc.Node.EventType.TOUCH_START, () => { }, this);
        this.btn.node.on('click', this.showPopBox, this);
    },
    start(){
        this.node.active = false;
        this.popBoxDefaultPosition = this.popBox.position;
        this.pathPosition = [];
        //判断是否是排行榜弹窗，禁用子域视图刷新
        if (this.isRankPopBox()) {
            this.dispaly.getComponent(cc.WXSubContextView).updateSubContextViewport();
            //this.dispaly.getComponent(cc.WXSubContextView).enabled = false;
        }
        
    },
    //显示弹窗
    showPopBox() {
        this.node.main.gameClubButton.hide();
        this.node.active = true;
        this.pathPosition.push(this.popBoxDefaultPosition);
        this.pathPosition.push(cc.v2(0, 50));
        this.pathPosition.push(cc.v2(0, 0));
        this.mask.runAction(cc.fadeTo(0.3, 180));
        common.bannerAd = common.showBannerAd();
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, this.pathPosition, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => {
                //开启子域视图刷新
                if (this.isRankPopBox()) {
                    this.dispaly.getComponent(cc.WXSubContextView).enabled = true;
                    this.dispaly.getComponent(cc.WXSubContextView).updateSubContextViewport();
                    this.node.main.toPostMessage('',common.rankTab);
                }
            })
        ))
    },
    //判断是不是排行榜弹窗
    isRankPopBox() {
        return this.tag == 3
    },
    //关闭弹窗
    hidePopBox() {
        common.bannerAd.hide();
        //禁用子域视图刷新
        if (this.isRankPopBox()) {
            let openDataContext = wx.getOpenDataContext();
            openDataContext.postMessage({
                type: 100
            });
            this.dispaly.getComponent(cc.WXSubContextView).enabled = false;
        }
        if (this.running) {
            return;
        }
        setTimeout(() => {
            this.node.main.gameClubButton.show();
        }, 300);
        this.running = true;
        let pathPos = this.pathPosition.slice(0).reverse();
        this.mask.runAction(cc.fadeTo(0.3, 0));
        this.popBox.runAction(cc.sequence(
            cc.cardinalSplineTo(1.5, pathPos, 0.9).easing(cc.easeQuinticActionOut()),
            cc.callFunc(() => {
                this.node.active = false;
                this.pathPosition = []
                this.running = false;
            })
        ));
    }
});