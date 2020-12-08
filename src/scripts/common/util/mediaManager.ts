import Model from "../mc/model"
import EventDispatcher from "../mc/eventDispatcher";

export default class MediaManager {
    public static instance: MediaManager;
    emitter: Phaser.Events.EventEmitter;
    model: Model;
    scene: Phaser.Scene;
    background: Phaser.Sound.BaseSound

    private constructor() {}
    static getInstance(config?) {
        if (!MediaManager.instance) {
            MediaManager.instance = new MediaManager();
            MediaManager.instance.scene = config.scene;
            MediaManager.instance.model = Model.getInstance();
            MediaManager.instance.emitter = EventDispatcher.getInstance();
            MediaManager.instance.emitter.on('PLAY_SOUND', this.instance.playSound.bind(this.instance));
            MediaManager.instance.emitter.on('MUSIC_CHANGED', this.instance.musicChanged, this.instance);
        }
        return MediaManager.instance;
    }
    musicChanged() {
        if (MediaManager.instance.background) {
            if (MediaManager.instance.model.musicOn == false) {
                MediaManager.instance.background.stop();
            } else {
                MediaManager.instance.background.play();
            }
        }
    }
    playSound(key) {
        if (MediaManager.instance.model.soundOn == true) {
            var sound = this.scene.sound.add(key);
            sound.play();
        }
    }
    setBackgroundMusic(key) {
        if (MediaManager.instance.model.musicOn == true) {
            // cross check that the sound is not already playing
            if (this.scene.sound.get(key) == null) {
              MediaManager.instance.background = this.scene.sound.add(key, {
                    volume: .5,
                    loop: true
                });
              MediaManager.instance.background.play();
            }
        }
    }
}