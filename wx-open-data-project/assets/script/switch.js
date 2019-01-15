//切换好友排名和世界排名
cc.Class({
    extends: cc.Component,
    properties: {
        friendCon: cc.Node,
        worldCon: cc.Node,
    },
    start(){
        //动作列表
        this.dur = 0.2;
        this.actions = {
            1: cc.moveTo(this.dur, cc.v2(0, 0)),
            2: cc.moveTo(this.dur, cc.v2(536, 0)),
            3: cc.moveTo(this.dur, cc.v2(-536, 0))
        };
        wx.onMessage(data => {
            if(data.type == "1" || data.type == "3"){
                this.showFriend();
            }
            if(data.type == "2" || data.type == "4"){
                this.showWorld();
            }
        });
    },
    //显示好友排名
    showFriend() {
        this.worldCon.stopAllActions();
        this.friendCon.runAction(this.actions[1]);
        this.worldCon.runAction(this.actions[2]);
    },
    //显示世界排名
    showWorld() {
        this.friendCon.stopAllActions();
        this.friendCon.runAction(this.actions[3]);
        this.worldCon.runAction(this.actions[1]);
    },
});
