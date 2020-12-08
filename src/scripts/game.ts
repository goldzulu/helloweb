import 'phaser'

import TitleScene from './scenes/titleScene'
import LoadScene from './scenes/loadScene'
import PreloadScene from './scenes/preloadScene'
import MainScene from './scenes/mainScene'
import OverScene from './scenes/overScene'

// Nicest on Most Echos
const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

// Nicest on Echo Show
// const DEFAULT_WIDTH = 960
// const DEFAULT_HEIGHT = 480

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, LoadScene, TitleScene, MainScene, OverScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
