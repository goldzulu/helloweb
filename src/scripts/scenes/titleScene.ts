import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import AlexaComm from '../objects/alexaComm'
import AlignGrid from '../common/util/alignGrid'
import Align from '../common/util/align'
import AlexaClient from '../alexa/AlexaClient'
import EventDispatcher from '../common/mc/eventDispatcher'
import BaseScene from './baseScene'
import 
  FlatButton from "../common/ui/flatButton";

import * as ALEXA_CONST from '../constants/alexa_const'

// says the the variable alexa exists
//declare var Alexa: any;

export default class TitleScene extends BaseScene {
  fpsText: Phaser.GameObjects.Text
  alexaStatus: Phaser.GameObjects.Text
  video: Phaser.GameObjects.Video
  aGrid: any
  alexa: AlexaClient
  alexaComm: AlexaComm
  emitter: Phaser.Events.EventEmitter

  constructor() {
    super({ key: 'TitleScene' })
  }

  init() {}

  preload() {
    super.preload();
    // this.load.video('intro', 'assets/video/intro.webm', 'loadedData', false, true)
    // this.load.audio('intromusic', 'assets/audio/bensound-theelevatorbossanova.mp3')
  }

  create() {
    super.create();
    //this.alexa = await AlexaClient.getInstance();
    //play the audio

    // const titleMusic = this.sound.add('intromusic')
    // titleMusic.play({ loop: true })

    // Helper grid system as per https://www.youtube.com/watch?v=ZWIZeGAXuSA
    // Can be turned on
    // this.aGrid = new AlignGrid({ game: this.game, scene: this, rows: 11, cols: 11 })
    this.setBackground('sky')
    this.makeAlignGrid(11,11)

    this.aGrid.showNumbers()

    this.placeText("Game Title",27,"TITLE_TEXT");

    // // play the intro start video
    // this.video = this.add.video(0, 0, 'intro')
    // // 60 is the center of an 11x11 grid
    // this.aGrid.placeAtIndex(60, this.video)
    // Align.scaleToGameW(this.video, 1, this)
    // this.video.play(true)

   

    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    //TODO: Change the fpsText to conform to the structure of this start
    this.fpsText = new FpsText(this)

      //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
      let btnNext = new FlatButton({
        scene: this,
        textStyle: 'BUTTON_STYLE',
        key: "button",
        text: "START GAME",
        callback: this.startGame.bind(this),
        scale: 0.3
    });
    this.aGrid.placeAtIndex(104, btnNext);

  }

  onAlexaMessage(message): void {
    //TODO: To make it use a proper object like e.g. AlexaComm 
    this.add
      .text(this.cameras.main.width - 15, 15, `m ${message.type}`, {
        color: '#ffffff',
        fontSize: 24,
      })
      .setOrigin(1, 0)
  }

  update() {
    this.fpsText.update()
  }

  startGame() {
    this.scene.start("MainScene");
}
}