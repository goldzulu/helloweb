const Alexa = require('ask-sdk-core');

// Web API Utilities
const WebAPI = {
  // Message.Type Constants
  MSGTYPE_SPEAK : 'speak',
    
  MSGTYPE_START :'start',
  
  MSGTYPE_INFO :'info',
  
  MSGTYPE_COMMAND : 'command',

  MSGTYPE_ASK: 'ask',
  

  // WEB HTML API HELPER FUNCTIONS

  sendWebAPIMessage({ type, payload, cmd }) {
    if (type == WebAPI.MSGTYPE_SPEAK) {
      return WebAPI.sendWebAPIMessageSpeak(payload)
    }
    if (type == WebAPI.MSGTYPE_START) {
      return WebAPI.sendWebAPIStart(payload)
    }
    if (type == WebAPI.MSGTYPE_COMMAND) {
      return WebAPI.sendWebAPIMessageCommand(cmd, payload)
    }
    // if command not recognized
    console.log(`WARNING: Type ${type} with payload ` + JSON.stringify(payload, null, 4) + `not recognized\n`)
    return {}
  },

  sendWebAPIStart(payload) {
    return {
      type: 'Alexa.Presentation.HTML.Start',
      data: payload.data,
      request: {
        uri: `${payload.url}`,
        method: 'GET',
      },
      configuration: {
        timeoutInSeconds: 300,
      },
    }
  },

  sendWebAPIMessageSpeak(SSMLSpeech) {
    return {
      type: 'Alexa.Presentation.HTML.HandleMessage',
      message: {
        type: WebAPI.MSGTYPE_SPEAK,
        mySsml: `${SSMLSpeech}`,
        speech: '',
      },
      transformers: [
        {
          inputPath: 'mySsml',
          transformer: 'ssmlToSpeech',
          outputName: 'speech',
        },
      ],
    }
  },

  sendWebAPIMessageCommand(cmd, payload) {
    return {
      type: 'Alexa.Presentation.HTML.HandleMessage',
      message: {
        type: WebAPI.MSGTYPE_COMMAND,
        cmd: `${cmd}`,
        param: `${payload}`,
      },
    }
  },

  // INBOUND MESSAGE FROM WEB API HANDLER

  WebMessageHandler : {
    canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'Alexa.Presentation.HTML.Message'
    },
    handle(handlerInput) {
      let speakOutput = ''
      let repromptOutput = 'What would you like do?'
      console.log('WEBAPI: Inbound message')
      const message = handlerInput.requestEnvelope.request.message
      if (!message && !message.type) {
        //nothing to see... move along!
        speakOutput = 'I am not sure what to do. ' + repromptOutput

        console.log('Unrecognized message received!\n')
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
      }

      // no reprompt
      if (message.type == WebAPI.MSGTYPE_SPEAK) {
        console.log('WEBAPI: SPEAK ' + JSON.stringify(message, null, 4))
        speakOutput = message.payload
        return handlerInput.responseBuilder.speak(speakOutput).getResponse()
      }

      // with reprompt
      if (message.type == WebAPI.MSGTYPE_ASK) {
        console.log('WEBAPI: ASK ' + JSON.stringify(message, null, 4))
        speakOutput = message.payload
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
      }

      if (message.type == WebAPI.MSGTYPE_INFO) {
        speakOutput = `An F Y I just came in for you, ${message.payload}`
        console.log('WEBAPI: INFO \n --------  ' + JSON.stringify(message, null, 4))

        return handlerInput.responseBuilder.speak(speakOutput).reprompt(reprompt).getResponse()
      }

      if (message.type == WebAPI.MSGTYPE_COMMAND) {
        console.log('WEBAPI: COMMAND \n --------  ' + JSON.stringify(message, null, 4))
        speakOutput = `I have received incomming command, ${message.payload}`
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
      }

      // If it reaches here then we don't know how to handle this particular message type
      console.log(`WARNING: Unkown message type ${message.type}`)
      speakOutput = '<speak>I have no idea how to handle this particular incoming message type</speak>'

      return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse()
    },
  }
}

module.exports = WebAPI
