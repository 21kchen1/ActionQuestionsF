import { setAll as functionSetAll } from "./functionBox.js";
import { setAll as questionSetAll } from "./questionBox.js";

/**
 * 执行功能并添加组件
 */
async function setAll() {
    await functionSetAll();
    await questionSetAll();
}

export { setAll };