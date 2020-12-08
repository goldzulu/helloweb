import Align from '../common/util/align'
import TextObj from '../common/ui/textObj'
import AlignGrid from '../common/util/alignGrid'
import Model from '../common/mc/model'
import EventDispatcher from '../common/mc/eventDispatcher'
import Background from '../common/comps/background'
import TextStyles from '../common/ui/textStyles'
import Controller from '../common/mc/controller'
// import
//   SoundPanel
//  from "../common/ui/soundPanel";
import MediaManager from '../common/util/mediaManager'

import AlexaClient from '../alexa/AlexaClient'
import ALEXA_CONST from '../constants/alexa_const'

export default abstract class BaseScene extends Phaser.Scene {
  alexa: AlexaClient
  emitter: Phaser.Events.EventEmitter
  gw: integer | string
  gh: integer | string
  mm: MediaManager
  controller: Controller
  model: Model
  textStyles: TextStyles
  aGrid: AlignGrid

  constructor(key) {
    super(key)
    this.alexa = AlexaClient.getInstance()
  }

  init() {}

  preload() {}

  create() {
    //
    //make the media manager
    this.mm = MediaManager.getInstance({
      scene: this,
    })
    //
    //create the controller to listen to events
    // WARNING, Media Manager must be initialised first
    this.controller = Controller.getInstance()
    //
    //set up model to hold global values
    //
    this.model = Model.getInstance()

    //
    //set up the text styles object
    //
    this.textStyles = TextStyles.getInstance(this.sys.game.config.width)
    this.gw = this.sys.game.config.width
    this.gh = this.sys.game.config.height
  }

  // Alexa related methods
  /**
   * Process any inbound message from the Alexa Skill
   *
   * @abstract
   * @param {*} message
   * @memberof BaseScene
   */
  abstract onAlexaMessage(message): void

  /**
   * Sends a message back to the Alexa Skill
   *
   * @protected
   * @param {*} { type, payload, cmd = '' }
   * @memberof BaseScene
   */
  protected sendMessageToAlexa({ type, payload, cmd = '' }): void {
    if (AlexaClient.getInstance()) {
      /** Ask alexa to speak but not wait for response */
      if (type == 'speak') {
        // @ts-ignore
        AlexaClient.getInstance().skill.sendMessage({
          type: 'speak',
          payload,
        })
      }
      /** Sends a command back to the Alexa Skill */
      if (type == 'command') {
        // @ts-ignore
        AlexaClient.getInstance().skill.sendMessage({
          type: 'speak',
          payload,
          cmd,
        })
      }
      /** Ask the Alexa Skill to prompt for a response */
      if (type == 'ask') {
        // @ts-ignore
        AlexaClient.getInstance().skill.sendMessage({
          type: 'ask',
          payload,
        })
      }
      /** Sends back information back to the Alexa Skill to be spoken as an FYI */
      if (type == 'info') {
        // @ts-ignore
        AlexaClient.getInstance().skill.sendMessage({
          type: 'info',
          payload,
        })
      }
      // if command not recognized
      console.log(`WARNING: Type ${type} with payload ` + JSON.stringify(payload, null, 4) + `not recognized\n`)
    } else {
      // Alexa object is not available. Most probably this is running on localhost
      console.log(`Alexa is not defined Message type ${type} with payload ${payload} and command "${cmd}" not sent`)
    }
  }

  //
  //set a background image
  //
  setBackground(key) {
    let bg = new Background({
      scene: this,
      key: key,
    })
    return bg
  }
  //
  //place an image on the stage, and scale it
  //
  placeImage(key, pos, scale, physics = false) {
    let image
    if (physics == false) {
      image = this.add.sprite(0, 0, key)
    } else {
      image = this.physics.add.sprite(0, 0, key)
    }
    if (isNaN(pos)) {
      this.aGrid.placeAt(pos.x, pos.y, image)
    } else {
      this.aGrid.placeAtIndex(pos, image)
    }
    if (scale != -1) {
      Align.scaleToGameW(image, scale, this)
    }
    return image
  }
  //
  //place text on the stage and style it
  //
  placeText(text, pos, style) {
    let textStyle = this.textStyles.getStyle(style)
    let textObj = new TextObj({
      scene: this,
      text: text,
      textStyle: textStyle,
    })
    if (isNaN(pos)) {
      this.aGrid.placeAt(pos.x, pos.y, textObj)
    } else {
      this.aGrid.placeAtIndex(pos, textObj)
    }
    return textObj
  }
  //
  //place an object on the grid by index
  //
  placeAtIndex(pos, item) {
    this.aGrid.placeAtIndex(pos, item)
  }
  //
  //place an object on the grid by x and y position
  //
  placeAt(xx, yy, item) {
    this.aGrid.placeAt(xx, yy, item)
  }
  //
  //make an align grid
  //
  makeAlignGrid(r = 11, c = 11) {
    this.aGrid = new AlignGrid({
      scene: this,
      rows: r,
      cols: c,
    })
  }
  //
  //make a gear to open the sound panel
  //
  // makeGear() {
  //     let gear = this.add.image(0, 0, "gear");
  //     Align.scaleToGameW(this,gear, .1);
  //     this.aGrid.placeAtIndex(110, gear);
  //     gear.setInteractive();
  //     gear.on('pointerdown', this.toggleSoundPanel.bind(this));
  // }
  //
  //make the sound panel
  //
  // makeSoundPanel() {
  //     this.soundPanel = new SoundPanel({
  //         scene: this
  //     })
  //     Align.center(this.soundPanel, this);
  //     this.soundPanel.visible = false;
  //     this.soundPanel.depth = 2000;
  // }
  //
  //open or close the sound panel
  //
  // toggleSoundPanel() {
  //     this.soundPanel.visible = !this.soundPanel.visible;
  // }
  //
  //place an effect on the stage - requires effect extension pack
  //
  /*    
  placeEffect(xx, yy, effect) {
      let fx = new Effect({
          scene: this,
          effect: effect,
          x: xx,
          y: yy
      });
  }*/
  //
  //get a text style object
  //
  getStyle(style) {
    let textStyle = this.textStyles.getStyle(style)
    return textStyle
  }

  update() {}
}
