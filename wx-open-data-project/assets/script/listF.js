cc.Class({
    extends: cc.Component,
    properties: {
        itemTemplate: cc.Node,
        mine:cc.Node,
        prefabMine: cc.Prefab,
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
            if(data.type == 1){
                _self.content = _self.scrollView.content;
                _self.items = []; // 存储实际创建的项数组
                _self.updateTimer = 0;  
                _self.updateInterval = 0.2;
                _self.getFriendCloudStorage();
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
    //获取好友信息
    getFriendCloudStorage(){
        let _self = this;
        _self.content.removeAllChildren();
        wx.getFriendCloudStorage({
            keyList: ["score","time"],
            success: function (res) {
                let _data = _self.bubbleSort(res.data).reverse();
                if (!_data.length) {
                    return;
                }
                for(let i in _data){
                    _data[i].score = _data[i].KVDataList[0].value;
                    if(_data[i].openid == _self.openId){
                        _self.createMine(_data[i],i);
                    }
                }
                _self.userData = _data;
                _self.initData(_self.userData);
            }
        });
    },
    //排名排序
    bubbleSort(arr) {
        if (Object.prototype.toString.call(arr) !== '[object Array]') return;
        let _arr = [];
        let _weekHm = 7 * 24 * 3600 *1000;
        for(let i in arr){
            if(arr[i].KVDataList[1] && (parseInt(new Date().getTime()) - parseInt(arr[i].KVDataList[1].value) <= _weekHm)){
                _arr.push(arr[i])
            }
        }
        if(!_arr.length){
            return _arr;
        }
        let [low, high] = [0, _arr.length - 1];
        let j;
        while (low < high) {
            for (j = low; j < high; j++) {
                if (parseInt(_arr[j].KVDataList[0].value) > parseInt(_arr[j + 1].KVDataList[0].value)) {
                    [_arr[j], _arr[j + 1]] = [_arr[j + 1], _arr[j]];
                }
            }
            --high;
            for (j = high; j > low; --j) {
                if (parseInt(_arr[j].KVDataList[0].value) < parseInt(_arr[j - 1].KVDataList[0].value)) {
                    [_arr[j], _arr[j - 1]] = [_arr[j - 1], _arr[j]];
                }
            }
            ++low;
        }
        return _arr;
    },
    initData(data){
        let _self = this;
        _self.totalCount = data.length;
        _self.spawnCount = 11; // 实际创建的项数量
        if(_self.totalCount <= 11){
            _self.spawnCount = _self.totalCount <= 6 ?  _self.totalCount : 6;
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
    //创建当前用户
    createMine(user,i) {
        this.mine.removeAllChildren();
        let node = cc.instantiate(this.prefabMine);
        node.parent = this.mine;
        this.createBlock(node,user,i);
    },
    //创建每条信息块
    createBlock(node,user,i){
        let nickName = user.nickName ? user.nickName : user.nickname;
        let avatarUrl = user.avatarUrl;
        let userName = node.getChildByName('userName').getComponent(cc.Label);
        let userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        let score = node.getChildByName('score').getComponent(cc.Label);
        let rank = node.getChildByName('rank').getComponent(cc.Label);
        userName.string = nickName;
        score.string = user.KVDataList[0].value.replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
        rank.string = (parseInt(i)+1).toString();
        cc.loader.load({
            url: avatarUrl, type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
    }
});
