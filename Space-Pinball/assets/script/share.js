//分享转发控制类
cc.Class({
    extends: cc.Component,
    //加载完成
    onLoad() {
        this.node.on('click', this.share, this);
    },
    start(){
        wx.showShareMenu({ withShareTicket: true })
        cc.loader.loadRes('share', (err, data) => {
            wx.onShareAppMessage(() => {
                return this.shareData(data);
            })
        })
    },
    //分享
    share() {
        cc.loader.loadRes('share', (err, data) => {
            wx.shareAppMessage(this.shareData(data))
        })
    },
    //分享数据
    shareData(data) {
        return {
            title: "经典玩法，极致画面，炫酷音效，来回味经典的乐趣吧~",
            imageUrl: data.url
        }
    }
});