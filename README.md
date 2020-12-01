<h1 align="center">
  <br>
  <a href="https://github.com/goldzulu/helloweb#readme"><img src="readme/header.png" alt="header" width="600"></a>
  <br>
  Alexa Skill WebAPI Phaser 3 TypeScript Webpack Starter Template
  <br>
</h1>

<h4 align="center">
A starter template for Alexa Skill WebAPI for Games Using <a href="https://phaser.io/" target="_blank" >Phaser 3</a> with <a href="https://www.typescriptlang.org/index.html" target="_blank" >TypeScript</a> and <a href="https://webpack.js.org/" target="_blank" >webpack</a> for building excellent Alexa WEB API Games that work great on Amazon Echo Smart Display Devices.</h4>

## AWS IAM Permisions
Your AWS entity associated with the CLI will need access to create and manage the following resources: Cloudformation, IAM, AWS Lambda, Cloudfront, S3. Go to the AWS console, and for your IAM user, add these permissions.

For instance, adding the following policies will grant all the deploy access you will need:
* AWSLambdaFullAccess
* IAMFullAccess
* AmazonS3FullAccess
* CloudFrontFullAccess
* AWSCloudFormationFullAccess

<blockquote align="center">
The repo contains both the WEBApi portion and the Alexa Skill portion. Most of what you need to do can be done by using npm run xxx. Even alexa's ask deploy and ask init is encapsulated in package.json
</blockquote>

---
## Quick Start
```bash
# Clone this repository
$ git clone --depth 1 https://github.com/goldzulu/helloweb.git alexa-webapi-game

# Go into the repository
$ cd alexa-webapi-game

# Initialise Alexa Skill
$ ask init

# Deploy Alexa Skill Portion Using CloudFormation - IMPORTANT: Take note of the s3BucketSecureUrl after you have deployed
# If you have missed it, look in .ask/ask-states.json for "OutputKey": "S3BucketSecureURL". You JUST NEED the first part of the 
# URL, normally in this form ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog
$ ask deploy

# Look package.json in the root of the project
# Modify the lines deploy:s3. replace the s3 bucket name below with the public read s3 bucket generated from the above
# Make sure you leave the /dist/v1 at the end as it is below. also note that it's s3:// in front and not https://
# 

(npm run build && aws s3 cp ./dist s3://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog/dist/v1 --recursive --acl public-read)

# Optionally, if on a mac and if you want to be able to test on s3 easily you can overwrite the url in package.json for the serve:s3  
# This time, take note of the ENTIRE url related to the output key S3BucketSecureURL
# This time use https:// and include the domain names full url. Again make sure you retain the /dist/v1/index.html at the end

open https://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog.s3.amazonaws.com/dist/v1/index.html

# Build the WebAPI part of the game and deploy to s3 simultaneously
$ npm run deploy:s3

# Thats it! You should be able to test on Amazon Echo smart display devices but saying Alexa, Open Hello Web
```

## Changing Game Names

Change the **gameName** in /webpack/webpack.common.js and alexa skill invocation in skill-packages/skill.json

## WebAPI Game Part

All your game code lies inside the **/src/scripts** folder. All assets need to be inside the **/src/assets** folder in order to get copied to /dist while creating the production build. Do not change the name of the index.html and game.ts files.

The WebAPI Part is all written in Typescript

## Alexa Skill Part

All the code and config for Alexa Skill resides in the usualy lambda directory and skill-package directory.

The Alexa Skill part have been written in node/javascript



## Useful Links

- [About Alexa Web API for Games](https://developer.amazon.com/en-GB/docs/alexa/web-api-for-games/alexa-games-about.html)
- [My Cactus Simulation Alexa Game Sample](https://github.com/alexa/skill-sample-nodejs-web-api-my-cactus)
- [Phaser Website](https://phaser.io/)
- [Phaser 3 Forum](https://phaser.discourse.group/)
- [Phaser 3 API Docs](https://photonstorm.github.io/phaser3-docs/)
- [Official Phaser 3 Examples](http://labs.phaser.io/)
- [Notes of Phaser 3](https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html)

## Reaching Me

You can find me on Twitter https://twitter.com/VoiceTechGuy1 or on Twitch at https://twitch.tv/goldzulu

## Credits

A huge thank you to Rich [@photonstorm](https://github.com/photonstorm) for creating Phaser

## License

MIT - This Alexa Skill WebAPI Phaser 3 TypeScript Webpack Starter Template
Music: The Elevator Bossa Nova from Bensound.com
Phaser-Starter-Template - The MIT License (MIT) 2019 - [Yannick Deubel](https://github.com/yandeu). Please have a look at the [LICENSE](LICENSE) for more details.
Some convenient utilities have been adapted into Typescript from Ultimate Game Parts Template and Utilities written by William Clarkson https://phasergames.com originally in Javascript The MIT License (MIT) 2020
