import BaseScene from './baseScene'
/**
 * Sole purpose of this scene is to load the loadingscreen graphics quickly for
 * it's use in the LoadScene
 * @export
 * @class PreloadScene
 * @extends {BaseScene}
 */
export default class PreloadScene extends BaseScene {
  
  constructor() {
    super({ key: 'PreloadScene' })
  }
  preload() {
    let common = './assets/'
    let imagePath = common + 'images/'
    
    // The key for the loadingscreen image
    let key = 'loadingscreen'

    this.load.image(key, imagePath + key + '.png')
  }

  create() {

    //this.sendMessageToAlexa({type:'speak',payload:'Loading'})
    this.scene.start('LoadScene')
  }
  
  onAlexaMessage(message): void {}

  update() {}
}
