"use strict";

/**
 * 各种方块的属性
 */
const blockAttributes = ((object) => {
   let index = 0;
   for (const i of Object.values(object)) {
      i["id"] = index++; // 给每一种方块自动添加id
   }
   return object;
})({
   "air": {
      color: "#ffffff",
      cost: 1,
   },
   "wall": {
      color: "#FF7667",
      cost: 0,
   },
});


// 为了不创建一大堆文件就放这里了...
/**
 * 判断两个数组是否相等
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Boolean}
 */
const isSameArray = (arr1, arr2) => {
   let out = 0;
   for (let index = 0; index < arr1.length; index++)
      if (arr1[index] == arr2[index]) out++;
   return out == arr1.length && arr1.length == arr2.length;
}