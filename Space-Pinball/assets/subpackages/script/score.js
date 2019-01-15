//分数、加分控制类
var common = require("./../../script/common");
module.exports = {
    //得分
    score: 0,
    //缓存surprise计分
    surpriseScore: 0,
    //分数map
    scoreConfig: {
        //一组的灯单个亮起时或者单灯亮起
        "oneBumper": 50,
        //右侧一组侧边灯（4个）同时亮起时，同时激活闪烁级别灯
        "rightAllBumpers": 500,
        //右侧大级别闪烁灯
        "rightBrands": {
            "lv1": 1000,
            "lv2": 5000,
            "lv3": 10000,
            "lv4": 50000,
            "lv5": 100000,
            "lv6": 500000,
            "lv7": 1000000
        },
        //左侧一组侧边灯(5个)同时亮起时
        "leftAllBumpers": 1000,
        //左侧侧边弯道灯
        "routerLights": {
            "lv1": 50,
            "lv2": 100,
            "lv3": 200,
            "lv4": 500,
            "lv5": 1000,
            "lv6": 2000,
            "lv7": 5000
        },
        //右上角一组侧边灯（3个)同时亮起时
        "topAllBumpers": 1000,
        //三个大圆灯级别,单个被碰撞时即加分
        "bigLights": {
            "lv1": 10,
            "lv2": 20,
            "lv3": 50,
            "lv4": 100,
            "lv5": 200,
            "lv6": 500,
            "lv7": 1000
        },
        //顶部多倍分数灯同时亮起,分数翻倍
        "multiLights": 1000,
        "multiLevels": {
            "lv1": 2,
            "lv2": 3,
            "lv3": 4,
            "lv4": 5,
            "lv5": 6,
            "lv6": 7
        },
        //左侧三角curves
        "allCurves": 500,
        "curvesLevels": {
            "lv1": 1000,
            "lv2": 2000,
            "lv3": 3000,
            "lv4": 5000,
            "lv5": 10000
        },
        //pinball字母全部亮起时
        "pinball": 100000
    },

    //传值加分
    addScore: function (score) {
        if (common.getUpgradeStatus()) {
            this.score += score * 2;
            this.surpriseScore += score * 2;
            return;
        }
        this.score += score;
        this.surpriseScore += score;
    },
    //倍数加分
    setMultiScore: function (level) {
        this.score *= level
        this.surpriseScore *= level
    },
    //获取分数
    getScore: function () {
        return this.score;
    },
    //重置总分数为0
    resetScore: function () {
        this.score = 0;
    },
    //获取一个球的得分，用于设置surprise计分，分数为当前球得分的2倍
    getSurpriseScore() {
        return this.surpriseScore * 2;
    },
    //重置某个球的开始得分为0
    resetSurpriseScore() {
        this.surpriseScore = 0;
    }
}
