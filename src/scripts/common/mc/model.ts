import EventDispatcher from "./eventDispatcher";

// let instance = null;
export default class Model {
    private static instance: Model

    private _score : integer;
    private _soundOn: boolean;
    private _musicOn: boolean;
    private emitter: Phaser.Events.EventEmitter;

    private constructor() {}

    public static getInstance() {
        if (!Model.instance) {
            Model.instance = new Model();
            Model.instance._score = 0;
            Model.instance._soundOn = true;
            Model.instance._musicOn = true;
            Model.instance.emitter = EventDispatcher.getInstance();
        }
        return Model.instance;
    }
    toggleMusic() {
        this._musicOn = !this._musicOn;
        this.emitter.emit("MUSIC_STAT_CHANGED");
    }
    toggleSound() {
        this._soundOn = !this._soundOn;       
    }
    set score(val) {
        this._score = val;
        this.emitter.emit("SCORE_UPDATED");
    }
    get score() {
        return this._score;
    }

    get musicOn() {
        return this._musicOn;
    }

    get soundOn() {
        return this._soundOn
    }

    getStars() {
        return 3;
    }
}