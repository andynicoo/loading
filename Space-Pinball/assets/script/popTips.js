//游戏提示文字
cc.Class({
    extends: cc.Component,
    properties: {
        label: cc.Label
    },
    onLoad() {
        this.contents = [
            '去瞄瞄高分秘籍~',
            '呼.z..zZ.呼呼...zZ~',
            '人呢？地球人都被抓走了吗~',
            '小红球能获得更多分喔~ 点亮UpGrade灯',
            '游戏中也有增加小球的方法喔~ 点亮BALL+1灯',
            '同一组合灯，再次触发确认得分喔~',
            '高手攻略来这里呀~',
            '按住左半屏幕控制左侧弹板喔~',
            '按住右半屏幕控制右侧弹板喔~',
            '发射小球时，按住屏幕越久，弹簧力度越大喔~',
            'Superise闪灯是个大礼物~',
            '顶部MULTI全部点亮，分数翻倍喔~',
            '组合灯最高可以获得一百万分喔~',
            '一直按住屏幕，左右弹板也可以不释放的喔~',
            '好玩就记得分享给好友喔~',
            '老板，你好~',
            '拯救地球人，就靠你啦~',
            '鼓励！鼓励鼓励！~',
            '喜欢就加到“我的小程序”喔~',
            '生命不息，奋斗不止~',
            '你好厉害喔，咋不上天~',
            '休息一下，玩一局~',
            '按闪烁箭头指示，往往会得到高分~',
            '小心球被吃掉喔~ 不过也会有惊喜~',
            '多次触发同一组合，亮起更高级别指示灯~',
            '乐趣，就是自己探索~',
            '没有什么不可能~',
            '带上耳机体验效果更好喔~',
            '我发现你骨骼清奇，一定是干大事的~',
            '爬起来比跌倒多一次就是成功~',
            '世界上比教育小孩更难的是早睡早起~',
            '你喜欢玩游戏吗？反正我喜欢~',
            '游戏持续优化更新中，谢谢您的关注~',
            '魅果佬一定会垮掉的~',
            '🇨🇳🇨🇳🇨🇳🇨🇳万岁~🇨🇳🇨🇳🇨🇳🇨🇳',
            '🇨🇳🇨🇳🇨🇳🇨🇳🇨🇳🇨🇳🇨🇳🇨🇳是地球人的希望~',
            '有部动画片还不错，叫..叫.. 名字我忘了~',
            '有空去看看一个叫“路飞”的家伙~',
            '我亲爱的战友，你过的还好吗？~',
            '我亲爱的高中同学，你一定要好好的~',
            '睡在我上铺的兄弟，你还好吧~',
            '分给我烟抽的兄弟，我又没烟抽了~',
            '新的一天，新的开始，新的希望~',
        ];
        
        
        this.contentsCache = this.contents.slice(0);
        this.label.node.on(cc.Node.EventType.SIZE_CHANGED,this.sizeChanged,this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.tap,this);
        this.taping = false;
    },
    //初始化，home场景加载完调用
    init(){
        this.tap();
        this.auto = setInterval(()=>{
            this.tap();
        },4500)
    },
    //改变父容器的大小
    sizeChanged(){
        let bothSideSpace = 40;
        this.node.width = this.label.node.width + bothSideSpace;
    },

    //判断是否正在打出文字
    tap(){
        if(this.taping){
            return;
        }
        this.taping = true;
        this.showOne();
    },
    //打出文字动作
    showOne(){
        if(!this.contentsCache.length){
            this.contentsCache = this.contents.slice(0);
        }
        let random = Math.floor(Math.random()*this.contentsCache.length);
        let content = this.contentsCache[random];
        this.contentsCache.splice(random,1);
        let arr = content.split('');
        let delay = 70;
        let index = 0;
        let str = '';
        this.interval = setInterval(() => {
            if(index >= content.length){
                this.taping = false;
                clearInterval(this.interval);
                return;
            }
            str = str + arr[index];
            index++;
            this.label.string = str;
        }, delay);
    },
    clearTap(){
        clearInterval(this.auto);
    }
    
});