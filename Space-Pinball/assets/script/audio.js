var common = require('./common');
//所有音频控制类
cc.Class({
    extends: cc.Component,
    properties: {
        //单个bumper亮时碰撞音
        bumperOn: {
            default: null,
            type: cc.AudioClip
        },
        //单个bumper已亮时碰撞音
        bumperOff: {
            default: null,
            type: cc.AudioClip
        },
        //一组bumper同时亮起时音
        allBumperOn: {
            default: null,
            type: cc.AudioClip
        },
        //小卫星toggle音
        toggle: {
            default: null,
            type: cc.AudioClip
        },
        //球被吸住的音
        magnet: {
            default: null,
            type: cc.AudioClip
        },
        //发射球的音
        shoot: {
            default: null,
            type: cc.AudioClip
        },
        //减震片音效
        jumper: {
            default: null,
            type: cc.AudioClip
        },
        //surprise计分牌得分音效
        surprise: {
            default: null,
            type: cc.AudioClip
        },
        //通过小门的音效
        gate: {
            default: null,
            type: cc.AudioClip
        },
        //弹簧释放音效
        launch: {
            default: null,
            type: cc.AudioClip
        },
        //旋转左右两个拨片
        flipper: {
            default: null,
            type: cc.AudioClip
        },
        //大圆灯碰撞音效
        bumper: {
            default: null,
            type: cc.AudioClip
        },
        //多倍灯multi字母同时亮起
        multi: {
            default: null,
            type: cc.AudioClip
        },
        //pinball字母全部亮起时
        pinball: {
            default: null,
            type: cc.AudioClip
        },
        //小球失败时
        ballOut: {
            default: null,
            type: cc.AudioClip
        },
        //开局时
        gameStart: {
            default: null,
            type: cc.AudioClip
        },
        //背景音乐
        music: {
            default: null,
            type: cc.AudioClip
        },
        //球洞声音
        hole: {
            default: null,
            type: cc.AudioClip
        },
        //机器声
        robot: {
            default: null,
            type: cc.AudioClip
        },
        //加球音
        plus:{
            default: null,
            type: cc.AudioClip
        },
        //升级
        levelUp:{
            default: null,
            type: cc.AudioClip
        }
    },
    //设置此节点为常驻节点
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.musicPlay(this.music);
    },
    //播放音效
    audioEffectPlay(audioClip) {
        //判断是否禁用了音效
        if (!common.getAudioStatus()) {
            return;
        }
        cc.audioEngine.playEffect(audioClip, false);
    },
    //播放背景音乐
    musicPlay(audioClip) {
        //判断是否禁用了音效
        if (!common.getAudioStatus()) {
            return;
        }
        cc.audioEngine.playMusic(audioClip, true);
    }
});