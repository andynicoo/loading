var common = require("./common");
//音效开关控制类
cc.Class({
    extends: cc.Component,
    //加载完成
    onLoad() {
        this.node.on('click', this.setAudioStatus, this);
    },
    start() {
        this.setDefaultStatus();
    },
    //设置总声音开关状态
    setAudioStatus() {
        if (common.getAudioStatus()) {
            this.off();
            return;
        }
        this.on();
    },
    //音效开
    on() {
        common.setAudioStatus(true);
        cc.audioEngine.resumeAllEffects();
        cc.audioEngine.resumeMusic();
        cc.loader.loadRes('btn-audio-on', cc.SpriteFrame, (err, spriteFrame) => {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    //音效关
    off() {
        common.setAudioStatus(false);
        cc.audioEngine.pauseMusic();
        cc.audioEngine.stopAllEffects();
        cc.loader.loadRes('btn-audio-off', cc.SpriteFrame, (err, spriteFrame) => {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    },
    //设置默认开关状态
    setDefaultStatus() {
        if (common.getAudioStatus()) {
            this.on();
            return;
        }
        this.off();
    }
});