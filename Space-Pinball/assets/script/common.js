//公共状态管理类
module.exports = {
    shootStatus: false,
    audioStatus: true,
    upgradeStatus: false,
    accumulativeStatus : false, //是否是累计模式
    oneHandStatus: false,
    rankTab: 1,
    step: '',
    //设置球的发射状态
    setShootStatus: function(boolean){
        this.shootStatus = boolean;
    },
    //获取球的发射状态
    getShootStatus: function(){
        return this.shootStatus;
    },
    //设置总声音开关状态
    setAudioStatus: function(boolean){
        this.audioStatus = boolean;
    },
    //获取总声音开关状态
    getAudioStatus: function(){
        return this.audioStatus;
    },
    //设置小球的提升状态
    setUpgradeStatus: function(boolean){
        this.upgradeStatus = boolean;
    },
    //获取小球的提升状态
    getUpgradeStatus: function(){
        return this.upgradeStatus;
    },
    //用户信息
    userInfo: null,
    openId: '',
    //设置累计模式
    SetAccumulativeStatus: function(boolean){
        this.accumulativeStatus = boolean;
    },
    //获取累计模式状态
    getAccumulativeStatus: function(){
        return this.accumulativeStatus;
    },
    //设置rankTab
    setRankTab: function(val){
        this.rankTab = val;
    },
    getWXFunction(name) {
        if(typeof(wx) == 'undefined' || wx == null) {
            return null;
        }
        return wx[name];
    },
    //固定广告代码
    showBannerAd() {
        var wxFunc = this.getWXFunction('createBannerAd');
        if(typeof(wxFunc) != 'undefined' && wxFunc != null) {
            var phone = wx.getSystemInfoSync();
            var w = phone.screenWidth / 2;
            var h = phone.screenHeight;
            // adunit-af61e6bc454ac540
            // adunit-fdd4022210bafac3
            let bannerAd = wxFunc({
                adUnitId: 'adunit-6cd8e695db2b2708',
                style: {
                    width: 100,
                    top: 0,
                    left: 0
                }
            });
            bannerAd.onResize(function() {
                bannerAd.style.left = w - bannerAd.style.realWidth / 2 + 0.1;
                bannerAd.style.top = h - bannerAd.style.realHeight + 0.1;
            })
            bannerAd.show();
            return bannerAd;
        } else {
            return;
        }
    }
};
