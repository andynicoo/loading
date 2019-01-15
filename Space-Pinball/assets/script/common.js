//公共状态管理类
module.exports = {
    shootStatus: false,
    audioStatus: true,
    upgradeStatus: false,
    accumulativeStatus : false, //是否是累计模式
    wRankStatus: false,
    fRankStatus: false,
    oneHandStatus: false,
    rankTab: "1",
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
    //好友排行榜刷新状态
    setFRankStatus: function(boolean){
        this.fRankStatus = boolean;
    },
    setWRankStatus: function(boolean){
        this.wRankStatus = boolean;
    },
    //设置rankTab
    setRankTab: function(val){
        this.rankTab = val;
    },
};
