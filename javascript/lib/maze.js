"use strict";

class MAZEGenerator {
   _wh = { width: 0, height: 0 };
   _mazeGrid = [];

   constructor(x, y) {
      this._wh = { width: x, height: y };

      // 创建对应迷宫每一格的二维数组，之后要用来存储{ [blockType]: 墙or空气, [visited]: 是否被访问过 }
      for (let i = 0; i < x; i++) {
         this._mazeGrid[i] = [];
      }
   }

   get mazeGrid() {
      return this._mazeGrid;
   }


   /**
    * 创建迷宫
    */
   createMOZE() {
      this._main();
      this._addBoundary();
   }


   getBlock([x, y]) {
      return this._mazeGrid[x][y];
   }


   /**
    * 返回从输入坐标向输入方向移动一格后的坐标
    * @param {Array} param0 [x, y] 坐标
    * @param {Number} direction 方向
    * @returns {Array} [x, y] / 无效移动返回undefined
    */
   getDiretionBlock([x, y], direction) {
      switch (direction) {
         case 1:
            if (y - 1 > 0) {
               return [x, y - 1];
            }
            break;
         case 2:
            if (x + 1 < this._wh.width - 1) {
               return [x + 1, y];
            }
            break;
         case 3:
            if (y + 1 < this._wh.height - 1) {
               return [x, y + 1];
            }
            break;
         case 4:
            if (x - 1 > 0) {
               return [x - 1, y];
            }
            break;
      }
   }


   /**
    * 翻转输入的方向 1->3; 2->4; 3->1; 4->2;
    * @param {Number} direction 需要被翻转的方向
    * @returns {Number}
   */
   overturn(direction) {
      return [0, 3, 4, 1, 2][direction]
   }


   /**
    * 迷宫生成函数
    */
   _main() {
      let nowBlock = [];
      let nowWall = [];
      let wallList = [{ location: [1, 2], direction: 3 }, { location: [2, 1], direction: 2 }];

      // 设置初始值，顺便创建矩阵洞洞迷宫
      for (let i = 1; i < this._wh.width - 1; i++) {
         for (let j = 1; j < this._wh.height - 1; j++) {
            this._mazeGrid[i][j] = { blockType: (i % 2 == 0 || j % 2 == 0) ? blockAttributes["wall"].id : blockAttributes["air"].id, visited: false };
         }
      }

      this._mazeGrid[1][1].visited = true;

      while (wallList.length != 0) {
         // 随机取出wallList内一面墙
         const n = Math.floor(Math.random() * wallList.length);
         nowWall = wallList[n];
         wallList.splice(n, 1);

         const adjBlock = [
            this.getDiretionBlock(nowWall.location, nowWall.direction),
            this.getDiretionBlock(nowWall.location, this.overturn(nowWall.direction))
         ]; // 墙两侧的方格

         if (this.getBlock(adjBlock[0]).visited == false || this.getBlock(adjBlock[1]).visited == false) { // 如果其中一面的方格未访问，则打通这面墙
            this.getBlock(nowWall.location).blockType = blockAttributes['air'].id;
            nowBlock = adjBlock[this.getBlock(adjBlock[0]).visited ? 1 : 0];
            this.getBlock(nowBlock).visited = true;

            for (let d = 1; d <= 4; d++) { // 用1-4表示方向，1：上，2：右，3：下，4：左
               const newWall = this.getDiretionBlock(nowBlock, d);
               if (newWall == undefined || this.getDiretionBlock(newWall, d) == undefined) continue; //过滤掉迷宫边界
               if (this.getBlock(newWall).blockType == blockAttributes['wall'].id) {
                  wallList.push({ location: newWall, direction: d }); // 添加墙; 额外记录朝向
               }
            }
         }
      }

      console.log("create final");
   }


   /**
    * 添加迷宫围墙
    */
   _addBoundary() {
      for (let i = 0; i < this._wh.width; i++) {
         this._mazeGrid[i][0] = { blockType: blockAttributes["wall"].id, visited: true };
         this._mazeGrid[i][this._wh.height - 1] = { blockType: blockAttributes["wall"].id, visited: true };
      }
      for (let j = 0; j < this._wh.height; j++) {
         this._mazeGrid[0][j] = { blockType: blockAttributes["wall"].id, visited: true };
         this._mazeGrid[this._wh.width - 1][j] = { blockType: blockAttributes["wall"].id, visited: true };
      }
   }
}



/**
 * 寻路
 * @param {MAZEGenerator} maze 输入迷宫类
 * @param {Array} param1 输入起点终点
 * @returns {Array} 由一系列最短通路上每个格子的坐标[x, y]组成的数组
 */
const pathfinding = (maze, [start, end]) => {
   let mazeGrid = JSON.parse(JSON.stringify(maze.mazeGrid));
   let open = [];
   let close = [];


   //以下是函数定义部分

   const hf = location => {
      return Math.sqrt((location[0] - end[0]) ** 2 + (location[1] - end[1]) ** 2);
   }


   //js自带排序需要的比较函数
   const compareFn = (a, b) => {
      if ((a.g + a.h) < (b.g + b.h)) {
         return -1;
      }
      if ((a.g + a.h) > (b.g + b.h)) {
         return 1;
      }
      return 0;
   }


   /**
    * 反推正确路径
    * @returns {Array} [[x0, y0], [x1, y1], ..., [xn, yn]]
    */
   const rebuildPath = () => {
      const lastNode = close[close.length - 1];
      
      let out = [lastNode.location];
      let [location, direct] = [lastNode.location, lastNode.direct];

      while (direct != 0) {
         direct = maze.overturn(direct);
         location = maze.getDiretionBlock(location, direct);
         direct = close.find(e => isSameArray(e.location, location)).direct;
         out.push(location);
      }

      return out.reverse();
   }


   //A*寻路代码开始
   for (const x of mazeGrid) {
      for (const y of x) {
         y.visited = false;
      }
   }

   open.push({
      location: start,
      direct: 0,
      g: 0,
      h: hf(start),
   });

   let nowusing = open[0];
   while (open.length != 0) {
      open.sort(compareFn); // 按代价从小到大排序
      nowusing = open.shift();
      close.push(nowusing);

      if (isSameArray(nowusing.location, end)) {
         return rebuildPath();
      };

      for (let direct = 1; direct <= 4; direct++) {
         const xy = maze.getDiretionBlock(nowusing.location, direct);
         if (xy == undefined) continue; // 剔除迷宫边界
         if (mazeGrid[xy[0]][xy[1]].blockType != blockAttributes['wall'].id && direct != maze.overturn(nowusing.direct)) { // 剔除倒退的方向
            if (mazeGrid[xy[0]][xy[1]].visited == false) {
               open.push({
                  location: xy,
                  direct: direct,
                  g: nowusing.g + blockAttributes["air"].cost,
                  h: hf(xy),
               });
               mazeGrid[xy[0]][xy[1]].visited = true;
            }
         }
      }
   }
}