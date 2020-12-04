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
The repo contains both the WEBApi portion and the Alexa Skill portion. Most of what you need to do can be done by using npm run xxx. Even alexa's ask deploy is encapsulated in package.json
</blockquote>

---
## Quick Start

Use ask cli new to both clone and initialise a new skill by using this template
```bash
$ ask new --template-url https://github.com/goldzulu/helloweb --template-branch main
```
* Select AWS with CloudFormation
* Answer Yes to _Would you like to continue download the skill template?_
* Here, you can name the skill and it's directory

<p align="center"><img src="/readme/alexawebapisetup.gif?raw=true"/></p>

> *IMPORTANT:* Just cloning using git clone does now work 
> By using the `ask new` command, you will setup the template as intended.

After that, go into the directory you have specified above
```bash
$ cd helloweb
```

Deploy Alexa Skill Portion Using CloudFormation 
```bash
$ ask deploy
```
*IMPORTANT:* Take note of the _s3BucketSecureUrl_ found in the file `ask-states.json` in the `.ask` folder 
In `ask-states.json`, locate the section `"OutputKey": "S3BucketSecureURL"` right towards the end of the file
> You JUST NEED the first part of the URL, normally in this example form of
> `ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog`

Open package.json in the root of the project. Modify the line 14 deploy:s3. replace `ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog` below
```
"deploy:s3": "(npm run build && aws s3 cp ./dist s3://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog/dist/v1 --recursive --acl public-read)",
```
with the s3 bucket name you have just recorded above.
> *IMPORTANT:* Make sure you leave the /dist/v1 at the end as it is below.
> Also note that it's s3:// in front and not https://
```bash
(npm run build && aws s3 cp ./dist s3://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog/dist/v1 --recursive --acl public-read)
```
Install all the node modules needed by running
```bash 
npm install
```
Build the WebAPI part of the game and deploy to s3 simultaneously
```bash
$ npm run deploy:s3
```
Thats it! You should be able to test using the default invocation if it has not been changed on your development Amazon Echo smart display devices but saying _Alexa, Open Hello Web_

## Optional Steps

Optionally, if you are on a mac and if you want to be able to test on s3 easily,
you can replace `ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog` on line 15 in package.json
```
"serve:s3": "open https://ask-helloweb-default-skillstack-16-s3webappbucket-1q2f8zuglbnog.s3.amazonaws.com/dist/v1/index.html"
```
with the S3 bucken name you recorded in the setup.
> This time, take note of the ENTIRE url related to the output key S3BucketSecureURL
> This time use https:// and include the domain names full url. 
> *IMPORTANT:* Again make sure you retain the /dist/v1/index.html at the end

To test the S3 url on the browser, the web api portion of the skill, you can then just execute
```bash
npm run serve:s3
```
You can also just take note of the full https url you have modified above, cut and paste that on the browser manual if you want or if you are running on Windows machine

You can also do
`npm run start` 
to start a local independent version of the webapi html game

## Changing Game Names and Default Invocation Name

If you have not changed from the default, the skill invocation is Hello Web. You can change the game name at the following locations
* Change the **gameName** in /webpack/webpack.common.js for the WebAPI portion
* Alexa skill invocation can be changed in skill-package/interactionModels/custom/en-US.json and en-GB.json
*  and skill-package/skill.json

## WebAPI Game Part

All your game code lies inside the **/src/scripts** folder. All assets need to be inside the **/src/assets** folder in order to get copied to /dist while creating the production build. Do not change the name of the index.html and game.ts files. Most files that you need to modify would be in the **/src/scripts/scenes** folder. Once you modify them, you can do `npm run deploy:s3` to deploy to s3. `npm run start` will run a local versio of the html game in the browser.

The WebAPI Part is all written in Typescript

## Alexa Skill Part

All the code and config for Alexa Skill resides in the usualy lambda directory for the source and the skill-package directory contains the interaction models.

The Alexa Skill part have been written in node/javascript

## Caching on Cloudfront

Please note that by default anything deployed to s3 will subsequently be served on CloudFront. Caching on cloudfront is set to 3600 seconds which is 60 mins so any update that is being done when you do deploy:s3 will take 60 mins to take effect. So when you do some changes to the webapi game, and run on Alexa it will not be reflected immediately.

There are ways to temporarily make this roundtrip faster.

### Use the S3 Secure URL instead of the default CloudFront URL

On line 20 of index.js in the lambda folder, there is a variable `webAppS3URL` that can be overidden. If set with the  url value of _s3BucketSecureUrl_ that can be found in `.ask/ask-states.json`, it will make the Alexa skill, once it has been deployed, to use the the s3 url instead. Set it back to '' when you are ready for production so it will use the CloudFront url instead.

### Use ngrok Secure URL instead of the default CloudFront URL - RECOMMENDED

If you are familiar with ngrok, on line 22 of index.js in the lambda folder, there is a variable `webAppLocalURL` that can be overidden. If set with the  https url value of _ngrok, it will make the Alexa skill, once it has been deployed, to use the the local https url instead instead. 

To serve using ngrok you have to do `npm run start` to start the web server locally and then `ngrok http 8080` to open the ngrok tunnel. Copy the https url generated and paste that into the variable `webAppLocalURL`. Don't forget to set this to '' again before you certify your skill or finish your dev session.

### Increment the version number for the html deployment to s3

On line 11 of index.js in the lambda folder, there is a variable called VERSION. This is default set to 1.
By incrementing this to 2 or another number and deploying the skill, the alexa skill will serve the webapi index.html  that is in the vX directory where X is the VERSION number.

Please note that you need to change also package.json for the script deploy:s3 to run with the /dist/v2 instead of /dist/v1 and change it to be in sync with the variable VERSION in index.js so that when you deploy, you are deploying at the right location.

---

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

## Support Me

The skills as many other contents that I've created are free to use. The best support you can give is by using it and giving feedback. If for some reason you wish to do more, you either become a patron <a href="https://www.patreon.com/bePatron?u=36519237" data-patreon-widget-type="become-patron-button">Become a Patron!</a> or if you want to be anonymous and give me a suprise, you can donate using <a href="https://commerce.coinbase.com/checkout/c04bf6a1-baf1-4f51-a643-eb54068b4446">Coinbase Crypto</a>

## Credits

A huge thank you to Rich [@photonstorm](https://github.com/photonstorm) for creating Phaser

## License

* This Alexa Skill WebAPI Phaser 3 TypeScript Webpack Starter Template The MIT License (MIT) 2019 - [GoldZulu VoiceTechGuy](https://github.com/goldzulu) [LICENSE](LICENSE.txt)
* Music: The Elevator Bossa Nova from [Bensound.com](https://www.bensound.com/licensing)
* Phaser-Starter-Template - The MIT License (MIT) 2019 - [Yannick Deubel](https://github.com/yandeu). [LICENSE-phaser-project-template](LICENSE-phaser-project-template.txt)
* Some convenient utilities have been adapted into Typescript from Ultimate Game Parts Template and Utilities written by [William Clarkson](https://phasergames.com) originally in javascript The MIT License (MIT) 2020 - [LICENSE-ultimate-game-parts-template](LICENSE-ultimate-game-parts-template.txt)
