export default class AlexaComm extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene) {
      super(scene, scene.cameras.main.width - 15, 15, '', { color: 'black', fontSize: '24px' })
      scene.add.existing(this)
      this.setOrigin(1, 0)
    }
  
    public update() {
      this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)
    }
}