//游戏界面设置控制类
cc.Class({
    extends: cc.Component,
    properties: {
        homeBtn: cc.Button,
        audioBtn: cc.Button,
        btns: {
            type: cc.Button,
            default: [],
        },
        mask: cc.Node
    },
    //首次加载完
    onLoad() {
        this.mask.on(cc.Node.EventType.TOUCH_START, this.goOn, this);
        this.node.on('click', this.pause, this);
    },
    start(){
        this.pathPosition = [];
        this.btnPositions = [];
        this.recordBtnsPostions();
        this.pauseStatus = false;
    },
    //点击设置按钮，游戏暂停，弹出设置菜单
    pause() {
        this.pauseStatus = !this.pauseStatus;
        if (this.pauseStatus) {
            this.mask.active = true;
            this.mask.runAction(cc.fadeTo(0.3, 180));
            this.show();
            this.node.main.pause();
        } else {
            this.goOn();
        }
    },
    //继续
    goOn() {
        this.pauseStatus = false;
        this.node.main.goOn();
        this.btnsReverse = this.btns.slice(0).reverse();
        this.mask.runAction(cc.sequence(
            cc.fadeTo(0.3, 0),
            cc.callFunc(() => {
                this.mask.active = false;
            })
        ));
        let delay = 100;
        for (let i in this.btnsReverse) {
            let node = this.btnsReverse[i].node;
            setTimeout(() => {
                node.runAction(cc.sequence(
                    cc.moveTo(0.3, cc.v2(46, 50)).easing(cc.easeQuinticActionInOut()),
                    cc.callFunc(() => {
                        node.active = false;
                    })
                ))
            }, delay);
            delay += 200;
        }
    },
    //记录所有button的位置
    recordBtnsPostions() {
        for (let i in this.btns) {
            this.btnPositions.push(this.btns[i].node.position);
        }
        this.hide();
    },
    //隐藏所有按钮、遮罩层
    hide() {
        this.mask.active = false;
        for (let i in this.btns) {
            let node = this.btns[i].node;
            node.active = false;
            //原始位置
            node.position = cc.v2(46, 50);
        }
    },
    //显示所有按钮、遮罩层
    show() {
        let delay = 100;
        for (let i in this.btns) {
            let node = this.btns[i].node;
            setTimeout(() => {
                node.active = true;
                node.runAction(
                    cc.moveTo(0.3, this.btnPositions[i]).easing(cc.easeQuinticActionInOut())
                )
            }, delay);
            delay += 200;
        }
    }
});