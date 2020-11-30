// WEB HTML API HELPER FUNCTIONS

function sendWebAPIMessage({type, payload, cmd}) {
    if (type == "speak") {
      return sendWebAPIMessageSpeak(payload);
    }
    if (type == "start") {
      return sendWebAPIStart(payload);
    }
    if (type == "command") {
      return sendWebAPIMessageCommand(cmd, payload);
    }
    // if command not recognized
    console.log(
      `WARNING: Type ${type} with payload ` +
        JSON.stringify(payload, null, 4) +
        `not recognized\n`
    );
    return {};
  }
  
  function sendWebAPIStart(url) {
    return {
      type: "Alexa.Presentation.HTML.Start",
      data: {
        mySsml: "<speak>Hello World from the Web!</speak>",
      },
      request: {
        //uri: "https://alexaweb.glitch.me",
        uri: `${url}`,
        method: "GET",
        // headers: {
        //     Authorization: "Basic"
        // }
      },
      transformers: [
        {
          inputPath: "mySsml",
          transformer: "ssmlToSpeech",
          outputName: "myTransformedSsml",
        },
      ],
      configuration: {
        timeoutInSeconds: 300,
      },
    };
  }
  
  function sendWebAPIMessageSpeak(speech) {
    return {
      type: "Alexa.Presentation.HTML.HandleMessage",
      message: {
        type: "speak",
        mySsml: `${speech}`,
        myTransformedSsml: "",
      },
      transformers: [
        {
          inputPath: "mySsml",
          transformer: "ssmlToSpeech",
          outputName: "myTransformedSsml",
        },
      ],
    };
  }
  
  function sendWebAPIMessageCommand(cmd, payload) {
    return {
      type: "Alexa.Presentation.HTML.HandleMessage",
      message: {
        type: "command",
        cmd: `${cmd}`,
        param: `${payload}`,
      },
    };
  }

  module.exports = {
    sendWebAPIMessage
  }