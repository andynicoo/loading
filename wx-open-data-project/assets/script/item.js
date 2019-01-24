cc.Class({
    extends: cc.Component,
    properties: {
        label: cc.Label,
        itemID: 0
    },
    updateItem: function(items, itemId) {
        this.itemID = itemId;
        this.createUserBlock(items[itemId],itemId);
    },
    //创建每条用户排行信息
    createUserBlock(user,i) {
        let node = this.node;
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        let score = node.getChildByName('score').getComponent(cc.Label);
        let rank = node.getChildByName('rank').getComponent(cc.Label);
        userName.string = nickName;
        score.string = user.score.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
        rank.string = (parseInt(i)+1).toString();
        if(avatarUrl){
            cc.loader.load({
                url: avatarUrl, type: 'png'
            }, (err, texture) => {
                if (err) console.error(err);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
});