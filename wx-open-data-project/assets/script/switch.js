//切换好友排名和世界排名
cc.Class({
    extends: cc.Component,
    properties: {
        content: cc.Node
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
            if(data.type == 1){
                this.content.runAction(this.actions[2]);
            }
            if(data.type == 2){
                this.content.runAction(this.actions[1]);
            }
            if(data.type == 3){
                this.content.runAction(this.actions[3]);
            }
        });
    }
});
