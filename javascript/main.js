"use strict";
const SIZE = [77, 41]; // 设置迷宫大小
const START = [1, 1]; // 设置起点
const END = [SIZE[0] - 2, SIZE[1] - 2]; // 设置终点

const maze = new MAZEGenerator(...SIZE);
const canvas = new Draw(...SIZE);

// 将MAZEGenerator生成的迷宫画出来
const update = () => {
   for (let i = 0; i < SIZE[0]; i++) {
      for (let j = 0; j < SIZE[1]; j++) {
         canvas.drawBlock(maze.mazeGrid[i][j].blockType == blockAttributes["wall"].id ? 'wall' : 'air', i, j);
      }
   }
}

maze.createMOZE();
document.body.appendChild(canvas.element);

const rect = document.body.getBoundingClientRect();
const rec = canvas.element.getBoundingClientRect();
canvas.element.style = {
   "position": "absolute",
   "top": (rect.height - rec.height) / 2 + "px",
   "left": (rect.width - rec.width) / 2 + "px",
};


update();
pathfinding(maze, [START, END]).forEach(e => {
   canvas.drawBlockColor("#E945DC", ...e);
})




// 以下是方向键控制黑色方块移动代码
const move = (() => {
   let nowposition = START;
   canvas.drawBlockColor("#444444", ...nowposition);
   return event => {
      let direct = 0;

      switch (event.key) {
         case "ArrowUp":
            direct = 1;
            break;
         case "ArrowDown":
            direct = 3;
            break;
         case "ArrowLeft":
            direct = 4;
            break;
         case "ArrowRight":
            direct = 2;
            break;
      }

      const nextposition = maze.getDiretionBlock(nowposition, direct);
      if (nextposition != undefined && maze.getBlock(nextposition).blockType != blockAttributes["wall"].id) {
         canvas.drawBlockColor("#ffffff", ...nowposition); // 原位置盖上白色
         canvas.drawBlockColor("#444444", ...nextposition); // 现位置绘制黑色
         nowposition = nextposition;

         // 等待浏览器渲染完成再弹窗
         setTimeout(() => {
            if (isSameArray(nowposition, END)) {
               alert("按F5刷新页面可重新生成迷宫");
            }
         }, 1);
      }
   }
})()

window.addEventListener("keydown", move);