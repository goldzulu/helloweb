import UIBlock from './uiblock'
import TextObj from './textObj'
import Align from '../util/align'
import AlignGrid from '../util/alignGrid'
import TextStyles from './textStyles'

export default class BaseUi extends UIBlock {
  protected scene: Phaser.Scene

  private gw: string | number
  private gh: string | number
  protected config: any
  private textStyles: TextStyles

  private aGrid: AlignGrid

  protected back: Phaser.GameObjects.Image

  private pgrid: AlignGrid

  constructor(config) {
    super()
    this.scene = config.scene
    this.config = config
    this.gw = this.scene.sys.game.config.width
    this.gh = this.scene.sys.game.config.height
    //
    //
    //
    this.textStyles = TextStyles.getInstance(this.gw)
    //
    //
    //
    //
  }
  initPos() {
    if (this.config.x) {
      this.x = this.config.x
    }
    if (this.config.y) {
      this.y = this.config.y
    }
    if (this.config.grid) {
      this.pgrid = this.config.grid
      this.pgrid.placeAtIndex(this.config.pos, this)
    }
  }
  setAlignGrid(rows, cols) {
    if (!this.back) {
      console.log('Back Not Set')
      return
    }
    let startX = this.back.x - this.back.displayWidth / 2
    let startY = this.back.y - this.back.displayHeight / 2
    //
    //
    //
    this.aGrid = new AlignGrid({
      scene: this.scene,
      rows: rows,
      cols: cols,
      width: this.back.displayWidth,
      height: this.back.displayHeight,
      startX: startX,
      startY: startY,
    })
  }
  fixGrid() {
    let startX = this.back.x - this.back.displayWidth / 2
    let startY = this.back.y - this.back.displayHeight / 2
    this.aGrid.startX = startX
    this.aGrid.startY = startY
  }
  showGrid() {
    this.fixGrid()
    this.aGrid.show()
  }
  showGridNumbers() {
    this.fixGrid()
    //this.aGrid.showNumbers(this.back.x - this.back.displayWidth / 2, this.back.y - this.back.displayHeight / 2)
    this.aGrid.showNumbers()
  }
  setBack(key, scale = -1) {
    this.back = this.scene.add.image(0, 0, key)
    if (scale != -1) {
      this.scale(this.back, scale)
    }
    this.add(this.back)
    this.initPos()
  }
  scale(obj, scale) {
    Align.scaleToGameW(obj, scale, this.scene)
  }
  scaleToBackW(obj, scale) {
    //TODO: verify that per = scale
    let per = scale;
    obj.displayWidth = this.back.displayWidth * per
    obj.scaleY = obj.scaleX
  }
  scaleToBackH(obj, scale) {
    //TODO: verify that per = scale
    let per = scale;
    obj.displayHeight = this.back.displayHeight * per
    obj.scaleX = obj.scaleY
  }
  placeImage(key, pos, scale) {
    let image = this.scene.add.sprite(0, 0, key)
    this.aGrid.placeAtIndex(pos, image)
    if (scale != -1) {
      Align.scaleToGameW(image, scale, this.scene)
    }
    this.add(image)
    return image
  }
  placeText(text, pos, style) {
    let textStyle = this.textStyles.getStyle(style)
    let textObj = new TextObj({
      scene: this.scene,
      text: text,
      textStyle: textStyle,
    })
    this.add(textObj)

    let pos2 = this.aGrid.placeAtIndex(pos, textObj)
    return textObj
  }

  setSize(w, h) {
      super.setSize(w,h)
  }
}
