import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import AlexaComm from '../objects/alexaComm'
import AlignGrid from '../common/util/alignGrid'
import Align from '../common/util/align'
import AlexaClient from '../alexa/AlexaClient'
import EventDispatcher from '../common/mc/eventDispatcher'
import BaseScene from './baseScene'
import FlatButton from '../common/ui/flatButton'

import ALEXA_CONST from '../constants/alexa_const'

export default class MainScene extends BaseScene {
  fpsText: Phaser.GameObjects.Text
  alexaStatus: Phaser.GameObjects.Text
  video: Phaser.GameObjects.Video
  aGrid: any
  alexa: AlexaClient
  alexaComm: AlexaComm
  emitter: Phaser.Events.EventEmitter

  constructor() {
    super({ key: 'MainScene' })
  }

  //init() {}

  preload() {}

  create() {
    super.create()
    //
    //set up the event dispatcher
    //
    this.emitter = EventDispatcher.getInstance()

    //Register all the alexa related events to listen to
    this.emitter.on(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage, this)

    this.setBackground('loadingscreen')

    // Helper grid system as per https://www.youtube.com/watch?v=ZWIZeGAXuSA
    this.makeAlignGrid(11, 11)
    //this.aGrid.showNumbers()

    //this.placeImage('loadingscreen',60,1);
    this.placeText('Main Scene', 60, 'WHITE')

    //TODO: Change the fpsText to conform to the structure of this start
    this.fpsText = new FpsText(this)

    //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
    let btnNext = new FlatButton({
      scene: this,
      textStyle: 'BUTTON_STYLE',
      key: 'default_button',
      text: 'END GAME',
      callback: this.endGame.bind(this),
      scale: 0.3,
    })
    this.aGrid.placeAtIndex(104, btnNext)

    this.sendMessageToAlexa({ type: 'ask', payload: 'Game started' })
  }

  onAlexaMessage(message): void {
    this.add
      .text(this.cameras.main.width - 36, 15, `m ${message.type}`, {
        color: '#ffffff',
        fontSize: "36",
      })
      .setOrigin(1, 0)

    if (message.type == 'command') {
      if (message.cmd == 'endgame') {
        this.endGame()
      }
      if (message.cmd == 'titlescreen') {
        this.titleScreen()
      }
    }
  }

  update() {
    this.fpsText.update()
  }

  endGame() {
    this.emitter.off(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage, this)
    this.scene.start('OverScene')
  }

  titleScreen() {
    this.emitter.off(ALEXA_CONST.ONMESSAGE, this.onAlexaMessage, this)
    this.scene.start('TitleScene')
  }
}
