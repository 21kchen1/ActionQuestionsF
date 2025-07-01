
/**
 * 生成范围内随机一个整数
 * @param {Number} min 最小范围
 * @param {Number} max 最大范围
 * @returns 范围间的一个随机整数
 */
function getRandomInt(min, max) {
    // 向上取整
    min = Math.ceil(min);
    // 向下取整
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {getRandomInt}