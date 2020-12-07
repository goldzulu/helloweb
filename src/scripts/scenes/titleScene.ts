import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import AlexaComm from '../objects/alexaComm'
import AlignGrid from '../common/util/alignGrid'
import Align from '../common/util/align'
import AlexaClient from '../alexa/AlexaClient'
import EventDispatcher from '../common/mc/eventDispatcher'
import BaseScene from './baseScene'
import FlatButton from "../common/ui/flatButton";
import MediaManager from '../common/util/mediaManager'

import * as ALEXA_CONST from '../constants/alexa_const'

// says the the variable alexa exists
//declare var Alexa: any;

export default class TitleScene extends BaseScene {
  fpsText: Phaser.GameObjects.Text
  alexaStatus: Phaser.GameObjects.Text
  video: Phaser.GameObjects.Video
  loadingscreen: Phaser.GameObjects.Sprite;
  aGrid: any
  alexa: AlexaClient
  alexaComm: AlexaComm
  mm: MediaManager
  emitter: Phaser.Events.EventEmitter

  constructor() {
    super({ key: 'TitleScene' })
  }

  init() {}

  preload() {
    //super.preload();
    //this.load.video('intro', 'assets/video/intro.mp4', 'loadedData', false, true)
    //this.load.audio('intromusic','assets/audio/bensound-theelevatorbossanova.mp3')
  }

  create() {
    super.create();

    //play the audio
    this.mm.setBackgroundMusic('bensound-theelevatorbossanova')
    //this.controller.mm.setBackgroundMusic('bensound-theelevatorbossanova')

    //const titleMusic = this.sound.add("intromusic");
    //titleMusic.play({ loop: true });

    // Helper grid system as per https://www.youtube.com/watch?v=ZWIZeGAXuSA
    // Can be turned on
    this.aGrid=new AlignGrid({game:this.game, scene:this, rows:11,cols:11});
    this.aGrid.showNumbers();

    // play the intro start video
     this.video = this.add.video(0,0, 'intro'); 
    // // 60 is the center of an 11x11 grid
     this.aGrid.placeAtIndex(60,this.video)
     Align.scaleToGameW(this.video,1,this);
     this.video.play(true);

    // new PhaserLogo(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)

    // Show an invisible button over the Say Begin To Start the Game
    //  let buttonStyle = this.textStyles.getStyle(TextStyles.BUTTON_STYLE);
    let btnNext = new FlatButton({
      scene: this,
      textStyle: 'BUTTON_STYLE',
      key: "transparent_button",
      text: "",
      callback: this.beginGame.bind(this),
      scale: 0.4
    });
    
    this.aGrid.placeAtIndex(103, btnNext);

    this.sendMessageToAlexa({type:'ask',payload:'When ready, say begin to start the game'})

  }

  onAlexaMessage(message): void {
    //TODO: To make it use a proper object like e.g. AlexaComm 
    this.add
      .text(this.cameras.main.width - 36, 15, `m ${message.type}`, {
        color: '#000000',
        fontSize: 36,
      })
      .setOrigin(1, 0)

    if (message.type == "command") {
      if (message.cmd == "begingame") {
        this.beginGame()
      }
    }
  }

  update() {
    this.fpsText.update()
  }

  beginGame() {
    this.scene.start("MainScene");
  }
}
