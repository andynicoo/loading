cc.Class({
    extends: cc.Component,
    properties: {
        itemTemplate: cc.Node,
        loading: cc.Prefab
    },
    start(){
        let _self = this;
        this.asyncStatus = false;
        this.scrollView = this.getComponent(cc.ScrollView);
        wx.onMessage(data => {
            if(data.openId){
                _self.openId = data.openId;
            }
            if(data.type == 3){
                _self.content = _self.scrollView.content;
                _self.items = []; // 存储实际创建的项数组
                _self.updateTimer = 0;  
                _self.updateInterval = 0.2;
                let _data = JSON.parse(data.data);
                _self.userData = _data.data;
                _self.getUserInfoList(_self.userData);
                _self.asyncStatus = true;
            }
            if(data.type == 100){
                _self.content = _self.scrollView.content;
                _self.content.removeAllChildren();
                let node = cc.instantiate(_self.loading);
                node.parent = _self.content;
                node.position = cc.v2(0,-45);
                _self.asyncStatus = false;
            }
        });
    },
    //批量获取用户信息
    getUserInfoList(userData){
        let _self = this;
        let openIdArr = [];
        for (let i in userData){
            openIdArr.push(userData[i].open_id);
        }
        wx.getUserInfo({
            openIdList : openIdArr,
            success: function(res){
                if(!res.data.length){
                    return;
                }
                _self.userItems = res.data;
                for(let i in userData){
                    for(let j in _self.userItems){
                        if(userData[i].open_id == _self.userItems[j].openId){
                            userData[i].avatarUrl = _self.userItems[j].avatarUrl;
                            userData[i].nickName = _self.userItems[j].nickName;
                        }
                    }
                }
                _self.initData(_self.userData);
            }
        })
    },
    initData(data){
        let _self = this;
        _self.totalCount = data.length;
        _self.spawnCount = 12; // 实际创建的项数量
        if(_self.totalCount <= 12){
            _self.spawnCount = _self.totalCount <= 7 ?  _self.totalCount : 7;
        }
        _self.spacing = 10; // 项之间的间隔大小
        _self.initialize(data);
        // 使用这个变量来判断滚动操作是向上还是向下
        _self.lastContentPosY = 0; 
        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        _self.bufferZone = _self.spawnCount * (_self.itemTemplate.height + _self.spacing) / 2;
    },
    // 列表初始化
    initialize: function (data) {
        this.content.removeAllChildren();
        // 获取整个列表的高度
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
    	for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
    		let item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
    		item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
    		item.getComponent('item').updateItem(data, i);
            this.items.push(item);
    	}
    },
    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
    update: function(dt) {
        if(!this.asyncStatus){
            return
        };
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            return; // we don't need to do the math every frame
        }
        this.updateTimer = 0;
        let items = this.items;
        // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
        let isDown = this.scrollView.content.y < this.lastContentPosY;
        // 实际创建项占了多高（即它们的高度累加）
        let offset = (this.itemTemplate.height + this.spacing) * items.length;
        let newY = 0;
        // 遍历数组，更新item的位置和显示
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // 提前计算出该item的新的y坐标
                newY = items[i].y + offset;
                // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y < -this.bufferZone && newY < 0) {
                    items[i].y = newY;
                    let item = items[i].getComponent('item');
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(this.userData, itemId);
                }
            } else {
                // 提前计算出该item的新的y坐标
                newY = items[i].y - offset;
                // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                    items[i].y = newY;
                    let item = items[i].getComponent('item');
                    let itemId = item.itemID + items.length;
                    item.updateItem(this.userData, itemId);
                }
            }
        }
        // 更新lastContentPosY和总项数显示
        this.lastContentPosY = this.scrollView.content.y;
    },
});
