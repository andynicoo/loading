//home首页控制类
var common = require('./common');
cc.Class({
    extends: cc.Component,
    properties: {
        btns: {
            type: cc.Button,
            default: []
        },
        mainCamera: cc.Node,
        audio: cc.Node,
        friendBtn: cc.Button,
        worldBtn: cc.Button,
        todayBtn: cc.Button,
        msgboxs:{
            type: cc.Node,
            default: []
        },
        popTip: cc.Node,
        favorite: cc.Node
    },
    //加载完成
    onLoad() {
        this.matchMediaScreen();
        if (!common.openId) {
            this.getStorageOpenId();
        }
        this.btns[4].node.on('click',this.playGame,this);
        this.btns[5].node.on('click',this.oneHandplay,this);
        //this.code.on(cc.Node.EventType.TOUCH_START,this.codePreview,this);
        if(common.bannerAd){
            common.bannerAd.hide();
        }
    },
    start() {
        let _self = this;
        _self.btnPositions = [];
        _self.recordBtnsPostions();
        _self.showBtns();
        if (!common.openId) {
            _self.getOriginOpenId();
        }
        
        for(let i in _self.msgboxs){
            _self.msgboxs[i].main = this;
        }

        //重置模式
        common.oneHandStatus = false;
    },
    //显示“添加到我的小程序
    showFavorite(){
        let canvasSize = cc.view.getCanvasSize();
        this.favorite.opacity = 200;
        if(canvasSize.height !== 1624){
            let favoritePosX = this.favorite.position.x;
            let favoritePosY = this.favorite.position.y;
            this.favorite.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(0.5, cc.v2(favoritePosX+10,favoritePosY)).easing(cc.easeBackOut()),
                cc.moveTo(0.5, cc.v2(favoritePosX,favoritePosY)).easing(cc.easeBackIn())
            )))
        }
    },
    //预览二维码
    codePreview(){
        wx.previewImage({
            current: 'https://www.super-cell.club/wechat_image/code.png', // 当前显示图片的http链接
            urls: ['https://www.super-cell.club/wechat_image/code.png'] // 需要预览的图片http链接列表
        })
    },

    //开始按钮
    playGame(){
        this.gameClubButton.hide();
        this.popTip.getComponent('popTips').clearTap();
        cc.director.loadScene("game");
    },
    //单手开局
    oneHandplay(){
        common.oneHandStatus = true;
        this.playGame();
    },

    //获取本地openId
    getStorageOpenId() {
        wx.getStorage({
            key: 'openId',
            success(res) {
                common.openId = res.data;
            }
        })
    },
    //设置本地openId
    setStorageOpenId(id) {
        wx.setStorage({
            key: 'openId',
            data: id
        })
    },
    //请求获取远端openId
    getOriginOpenId() {
        let _self = this;
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://www.super-cell.club/weapp/toLogin',
                        method: "POST",
                        data: {
                            code: res.code
                        },
                        success: function (res) {
                            common.openId = res.data.data.openid,
                            _self.setStorageOpenId(res.data.data.openid);
                        }
                    })
                }
            }
        })

    },
    //匹配大部分分辨率
    matchMediaScreen() {
        let canvasSize = cc.view.getCanvasSize();
        let defaultWidth = 750;
        if (canvasSize.width >= defaultWidth) {
            this.mainCamera.height = canvasSize.height / (canvasSize.width / defaultWidth);
            this.mainCamera.width = defaultWidth;
        }
        if (canvasSize.height == 1624) {
            let favorite = this.mainCamera.getChildByName("favorite");
            let widget = favorite.getComponent(cc.Widget);
            widget.top = 70;
        }
    },
    //记录所有button的位置
    recordBtnsPostions() {
        for (let i in this.btns) {
            this.btnPositions.push(this.btns[i].node.position);
        }
        this.hideBtns();
    },
    //所有按钮隐藏
    hideBtns() {
        for (let i in this.btns) {
            let node = this.btns[i].node;
            node.active = false;
            //原始位置
            node.position = cc.v2(0, -860);
        }
    },
    //所有按钮显示
    showBtns() {
        let delay = 500;
        let _self = this;
        for (let i in this.btns) {
            let node = this.btns[i].node;
            setTimeout(() => {
                node.active = true;
                node.runAction(
                    cc.moveTo(0.6, this.btnPositions[i]).easing(cc.easeQuinticActionInOut())
                )
                if (i == 3) {
                    node.runAction(cc.repeatForever(cc.sequence(
                        cc.scaleTo(0.5, 1.2).easing(cc.easeBackOut()),
                        cc.scaleTo(0.5, 1).easing(cc.easeBackIn()),
                        cc.rotateTo(0.3, 10).easing(cc.easeBackOut()),
                        cc.rotateTo(0.3, -10).easing(cc.easeBackOut())
                    )));
                    _self.showGameClub();
                }
            }, delay);
            delay += 100;
        }
    },
    //查询总榜分数列表传给子域
    getOpenIdList() {
        wx.request({
            url: "https://www.super-cell.club/weapp/score/queryRecord",
            method: "POST",
            success: function (res) {
                var openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    data: JSON.stringify(res.data),
                    type: 2,
                    openId: common.openId
                });
            }
        })
    },
    //查询今日榜分数列表传给子域
    getOpenIdListToday() {
        wx.request({
            url: "https://www.super-cell.club/weapp/score/queryRecordToday",
            method: "POST",
            success: function (res) {
                var openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    data: JSON.stringify(res.data),
                    type: 3,
                    openId: common.openId
                });
            }
        })
    },
    setRankBtnStatus(type,btn1,btn2,btn3){
        let action1 = cc.scaleTo(0.2, 0.9, 0.9);
        let action2 = cc.scaleTo(0.2, 0.76, 0.76);
        let action3 = cc.scaleTo(0.2, 0.76, 0.76);
        common.setRankTab(type);
        btn1.interactable = false;
        btn1.node.runAction(action1);
        btn2.interactable = true;
        btn2.node.runAction(action2);
        btn3.interactable = true;
        btn3.node.runAction(action3);
    },
    //排名按钮切换
    toPostMessage(e,msg){
        let openDataContext = wx.getOpenDataContext();
        if(msg == 1){
            this.setRankBtnStatus(1,this.friendBtn,this.worldBtn,this.todayBtn);
            openDataContext.postMessage({
                type: 1,
                openId: common.openId
            });
        }
        if(msg == 2){
            this.setRankBtnStatus(2,this.worldBtn,this.friendBtn,this.todayBtn);
            this.getOpenIdList();
        }
        if(msg == 3){
            this.setRankBtnStatus(3,this.todayBtn,this.friendBtn,this.worldBtn);
            this.getOpenIdListToday();
        }
    },
    //显示游戏圈按钮和poptips
    showGameClub(){ //创建游戏圈按钮
        this.gameClubButton = wx.createGameClubButton({
            type: 'image',
            icon: 'light',
            style: {
                left: 15,
                top: 264,
                width: 38,
                height: 40,
                zIndex: -5
            },
            image: 'https://www.super-cell.club/wechat_image/wechat_yxq.png'
        })
        this.gameClubButton.show();
        this.popTip.getComponent('popTips').init();
        this.showFavorite();
    }
});