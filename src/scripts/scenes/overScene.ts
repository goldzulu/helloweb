import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import AlexaComm from '../objects/alexaComm'
import AlignGrid from '../common/util/alignGrid'
import Align from '../common/util/align'
import AlexaClient from '../alexa/AlexaClient'
import EventDispatcher from '../common/mc/eventDispatcher'
import BaseScene from './baseScene'
import FlatButton from '../common/ui/flatButton'

import * as ALEXA_CONST from '../constants/alexa_const'

// says the the variable alexa exists
//declare var Alexa: any;

export default class OverScene extends BaseScene {
  fpsText: Phaser.GameObjects.Text
  alexaStatus: Phaser.GameObjects.Text
  video: Phaser.GameObjects.Video
  aGrid: any
  alexa: AlexaClient
  alexaComm: AlexaComm
  emitter: Phaser.Events.EventEmitter

  constructor() {
    super({ key: 'OverScene' })
  }

  preload() {}

  create() {
    super.create()

    //
    //set up the event dispatcher
    //
    this.emitter = EventDispatcher.getInstance()

    //Register all the alexa related events to listen to
    this.emitter.on(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage,this)
    
    //this.alexa = await AlexaClient.getInstance();
    //play the audio

    // const titleMusic = this.sound.add('intromusic')
    // titleMusic.play({ loop: true })

    // Helper grid system as per https://www.youtube.com/watch?v=ZWIZeGAXuSA
    // Can be turned on
    // this.aGrid = new AlignGrid({ game: this.game, scene: this, rows: 11, cols: 11 })
    this.setBackground('loadingscreen')
    this.makeAlignGrid(11, 11)

    this.aGrid.showNumbers()

    this.placeText('Game Over', 71, 'TITLE_TEXT')
    
    //TODO: Change the fpsText to conform to the structure of this start
    this.fpsText = new FpsText(this)

    //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
    let btnNext = new FlatButton({
      scene: this,
      textStyle: 'BUTTON_STYLE',
      key: 'default_button',
      text: 'PLAY AGAIN?',
      callback: this.playAgain.bind(this),
      scale: 0.3,
    })
    this.aGrid.placeAtIndex(104, btnNext)

    this.sendMessageToAlexa({type:'ask',payload:'Game over. Say play again to have another game, or say title screen to go back to the main title'})
  }

  onAlexaMessage(message): void {
    //TODO: To make it use a proper object like e.g. AlexaComm
    this.add
      .text(this.cameras.main.width - 15, 15, `m ${message.type}`, {
        color: '#ffffff',
        fontSize: 24,
      })
      .setOrigin(1, 0)

    if (message.type == "command") {
        if (message.cmd == "playagain") {
          this.playAgain()
        }
        if (message.cmd == "titlescreen") {
          this.titleScreen()
        }
      }
  
  }

  update() {
    this.fpsText.update()
  }

  playAgain() {
    this.emitter.off(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage,this)
    this.scene.start('MainScene')
  }

  titleScreen() {
    this.emitter.off(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage,this)
    this.scene.start("TitleScene");
  }

  

}
