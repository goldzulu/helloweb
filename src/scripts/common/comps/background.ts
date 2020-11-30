export default class Background {
    scene: Phaser.Scene;

    constructor(config) {
        this.scene = config.scene;
        let game = this.scene.sys.game;
        var back = this.scene.add.image(game.config.width as number / 2, game.config.height as number / 2, config.key);
        back.displayWidth = game.config.width as number;
        back.displayHeight = game.config.height as number;
    }
}