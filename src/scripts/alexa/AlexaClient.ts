// Alexa Singleton Class

import EventDispatcher from '../common/mc/eventDispatcher'
import ALEXA_CONST from '../constants/alexa_const'

// needed to import the externally declared Alexa client object
declare var Alexa: any

export default class AlexaClient {
  private static alexa: AlexaClient
  //private _emitter: Phaser.Events.EventEmitter;

  private constructor() {}

  public static getInstance(): AlexaClient {
    if (!AlexaClient.alexa) {
      const emitter = EventDispatcher.getInstance()

      Alexa.create({ version: '1.1' })
        .then((args) => {
          const { alexa, message } = args
          this.alexa = alexa

          // @ts-ignore
          this.alexa.voice.onMicrophoneOpened((reason) => {
            emitter.emit(ALEXA_CONST.ONMICROPHONEOPENED, reason)
          })

          // @ts-ignore
          this.alexa.voice.onMicrophoneClosed(() => {
            emitter.emit(ALEXA_CONST.ONMICROPHONECLOSED)
          })

          // @ts-ignore
          this.alexa.skill.onMessage((message) => {
            // This is invoked for every HandleMessage directive from the skill.
            emitter.emit(ALEXA_CONST.ONMESSAGE, message)
          })

          // @ts-ignore
          this.alexa.speech.onStarted(() => {
            //speech playing
            emitter.emit(ALEXA_CONST.ONSTARTED)
          })
          // @ts-ignore
          this.alexa.speech.onStopped(() => {
            //speech stopped
            emitter.emit(ALEXA_CONST.ONSTOPPED)
          })

          // Finally THIS IS Currently not captured because it is triggered before the phaser events are setup
          // emitter.emit(ALEXA_CONST.ONREADY, message)
        })
        .catch((error) => {
          // Emit the error
          emitter.emit(ALEXA_CONST.ONREADYFAILED, error)
        })
    }
    return AlexaClient.alexa
  }
}
