import 
    EventDispatcher
 from "../mc/eventDispatcher";
import 
    Model
 from "../mc/model";
import 
    MediaManager
 from "../../common/util/mediaManager";

export default class Controller {
    private static instance: Controller;
    model: Model;
    mm: MediaManager;
    emitter: EventDispatcher;

    private constructor() {}

    public static getInstance() {
        if (!Controller.instance) {
            Controller.instance = new Controller();
            Controller.instance.model = Model.getInstance(); 
            Controller.instance.mm = MediaManager.getInstance();
            Controller.instance.emitter = EventDispatcher.getInstance();
            Controller.instance.emitter.on("TOGGLE_MUSIC", this.instance.toggleMusic.bind(this.instance));
            Controller.instance.emitter.on("TOGGLE_SOUND", this.instance.toggleSound.bind(this.instance));
            Controller.instance.emitter.on('SET_SCORE', this.instance.setScore.bind(this.instance));
            Controller.instance.emitter.on('UP_POINTS', this.instance.upPoints.bind(this.instance));
        }
        return Controller.instance;
    }
    toggleMusic() {
        this.model.toggleMusic();
        this.mm.musicChanged();
    }
    toggleSound() {
        this.model.toggleSound();
    }
    setScore(score) {
        this.model.score = score;
    }
    upPoints(points) {
        var score = this.model.score;
        score += points;
        this.model.score = score;
    }
}