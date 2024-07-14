"use strict"; //本文的所有代码都在严格模式下运行

const BLOCKSL = 15; // SL -> side length : 边长

class Draw {
   _mainCanvas = {
      element: document.createElement('canvas'),
      ctx: undefined, //存储canvas渲染上下文
      width: 0,
      height: 0,
   };

   /**
    * @constructor
    * 通过输入行数和列数来设置迷宫的大小
    * @param {Number} width 行数
    * @param {Number} height 列数
    */
   constructor(width, height) {
      this._mainCanvas.element.id = "main-canvas";

      [this._mainCanvas.width, this._mainCanvas.height] = [width, height];
      [this._mainCanvas.element.width, this._mainCanvas.element.height] = [width * BLOCKSL, height * BLOCKSL];
      this._mainCanvas.ctx = this._mainCanvas.element.getContext('2d');
   }

   /**
    * 通过指定 (方块类型，列数，行数) 来决定在什么位置画什么方块
    * @param {String} blockType 方块类型
    * @param {Number} x 行
    * @param {Number} y 列
    */
   drawBlock(blockType, x, y) {
      this.drawBlockColor(blockAttributes[blockType].color, x, y);
   }

   /**
    * 在对应行列画指定颜色方块
    * @param {String} color 颜色
    * @param {Number} x 行
    * @param {Number} y 列
    */
   drawBlockColor(color, x, y) {
      this._mainCanvas.ctx.fillStyle = color;
      this._mainCanvas.ctx.fillRect(x * BLOCKSL, y * BLOCKSL, BLOCKSL, BLOCKSL);
   }

   // 获取canvas元素
   get element() {
      return this._mainCanvas.element;
   }
}