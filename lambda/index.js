const Alexa = require('ask-sdk-core');
const WebAPI = require('./webapi');

// CONSTANTS
const LOG_INFO = "INFO";
const LOG_ERROR = "ERROR";
const LOG_WARNING = "WARNING";
const LOG_WEBAPI = "WEBAPI";

// CacheBuster - the index file on cloudfront/s3 will be at /dist/vX/index.html  where X is the version number below
// You would need to make sure when copying to S3 the /dist directory is copied to /dist/vX on S3
const VERSION = '1';

// CONFIG
// This will get the Domain from the lambda environment set during cloudformation deployment
const webAppBaseURL = `https://${process.env.Domain}`; 

// This is a convenient variable that you can set to an S3 bucket or elsewhere for instance when cloudfront takes a few min to propagate
// Set to '' if not in use. If set it will override the above. Leave it as it is if you don't know what I am talking about!
const webAppS3URL = ''
//const webAppS3URL = 'https://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog.s3.amazonaws.com/dist/index.html'
//const webAppLocalURL = ''
const webAppLocalURL = 'https://b160301b3f04.ngrok.io'

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speakOutput = "";
        //let reprompt = "";

        // Check that the device supports Web API
        if(supportsHTMLInterface(handlerInput)) {
            // Device is capable of utilizing WebAPI
            speakOutput = 'Welcome to the Alexa Web A P I Phaser 3 boilerplate.';
            //reprompt = 'Which would you like to try?';

            //speakOutput += reprompt;
            conditionallyLaunchWebApp(handlerInput);
            handlerInput.responseBuilder.speak(speakOutput);

            // Possibly future use where FireTV is handled differently
            // As it uses push to talk and there is no need to respond immediately
            if(isHTMLCapableFireTV(handlerInput)) {
                return handlerInput.responseBuilder.getResponse();
            }

            return handlerInput.responseBuilder
                //.reprompt(speakOutput) // removing the need to prompt to speed up WebAPI Loading
                .getResponse();
        }
        else
        {
            // exits the skill
            speakOutput = 'Apologies. It seems that your device is not capable of displaying the graphics needed for this game. Goodbye!';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }
    }
};

const conditionallyLaunchWebApp = (handlerInput) => {
    if(supportsHTMLInterface(handlerInput)) {
        dlog(LOG_INFO, "Supports Web API/HTML");

        // path for index.html, different if served locally than on s3/cloudfront
        let indexPath;

        if (webAppLocalURL) 
        {
            indexPath = '/index.html' 
        } 
        else  
        { 
            indexPath = `/dist/v${VERSION}/index.html`
        }


        let data = createStateFromSessionAttr(handlerInput.attributesManager.getSessionAttributes())
        let url = (webAppLocalURL || webAppS3URL || webAppBaseURL ) + indexPath
        let payload = {data,url}

        handlerInput.responseBuilder.addDirective(WebAPI.sendWebAPIMessage({type:WebAPI.MSGTYPE_START,payload}))
    }
}

const supportsHTMLInterface = (handlerInput) => {
    const supportedInterfaces = Alexa.getSupportedInterfaces(handlerInput.requestEnvelope);
    const htmlInterface = supportedInterfaces['Alexa.Presentation.HTML'];
    dlog(LOG_INFO, supportedInterfaces);
    
    return htmlInterface !== null && htmlInterface !== undefined;
}


const dlog = (type, message) => {
    console.log(type + " : " + message);
}

/**
 * Takes everying in the current sessions and pass it to the WEBApi portion
 *
 * @param {*} sessionAttrs
 * @returns
 */
const createStateFromSessionAttr = (sessionAttrs) => {
    let dataPayload = sessionAttrs;
    return dataPayload;
}

/**
 * Checks if a fireTV is requesting our skill. 
 * If so, use this to NOT include a reprompt to avoid push to talk experience.
 * @param {*} handlerInput 
 */
function isHTMLCapableFireTV(handlerInput) {
    return supportsHTMLInterface(handlerInput) 
            && Alexa.getViewportProfile(handlerInput.requestEnvelope).includes("TV")
}

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SaySomethingIntentHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === "SaySomethingIntent"
      );
    },
    handle(handlerInput) {
      const speakOutput = "<speak>I was asked to say something</speak>";
  
      if (supportsHTMLInterface(handlerInput)) {
        dlog(LOG_INFO,'Inside Saysomething')
        dlog(LOG_INFO,JSON.stringify(WebAPI.sendWebAPIMessage({type:"speak", payload:"And I have spoken"}),null,4))
        return handlerInput.responseBuilder
          .addDirective(WebAPI.sendWebAPIMessage({type:"speak", payload:"And I have spoken"}))
          .speak(speakOutput)
          .getResponse();
      } else {
        dlog(LOG_INFO,'SupportsHTML is false')
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }
    },
  };

  const BeginGameIntentHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === "BeginGameIntent"
      );
    },
    handle(handlerInput) {
      const speakOutput = "<speak>Starting the game</speak>";
  
      if (supportsHTMLInterface(handlerInput)) {
        return handlerInput.responseBuilder
          .addDirective(WebAPI.sendWebAPIMessage({type:"command", payload:"not applicable", cmd:"begingame"}))
          .speak(speakOutput)
          .getResponse();
      } else {
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }
    },
  };

  const EndGameIntentHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === "EndGameIntent"
      );
    },
    handle(handlerInput) {
      const speakOutput = "<speak>Ending the game</speak>";
  
      if (supportsHTMLInterface(handlerInput)) {
        return handlerInput.responseBuilder
          .addDirective(WebAPI.sendWebAPIMessage({type:"command", payload:"not applicable", cmd:"endgame"}))
          .speak(speakOutput)
          .getResponse();
      } else {
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }
    },
  };

  const PlayAgainIntentHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === "PlayAgainIntent"
      );
    },
    handle(handlerInput) {
      const speakOutput = "<speak>Beginning a new game</speak>";
  
      if (supportsHTMLInterface(handlerInput)) {
        return handlerInput.responseBuilder
          .addDirective(WebAPI.sendWebAPIMessage({type:"command", payload:"not applicable", cmd:"playagain"}))
          .speak(speakOutput)
          .getResponse();
      } else {
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }
    },
  };

  const TitleScreenIntentHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === "TitleScreenIntent"
      );
    },
    handle(handlerInput) {
      const speakOutput = "<speak>Going back to the title screen</speak>";
  
      if (supportsHTMLInterface(handlerInput)) {
        return handlerInput.responseBuilder
          .addDirective(WebAPI.sendWebAPIMessage({type:"command", payload:"not applicable", cmd:"titlescreen"}))
          .speak(speakOutput)
          .getResponse();
      } else {
        return handlerInput.responseBuilder.speak(speakOutput).getResponse();
      }
    },
  };

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        SaySomethingIntentHandler,
        BeginGameIntentHandler,
        EndGameIntentHandler,
        PlayAgainIntentHandler,
        TitleScreenIntentHandler,
        WebAPI.WebMessageHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
