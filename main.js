import { setAll } from "./Page/Questions/core.js";

/**
 * 设置控制全局组件比例的 controllLen
 */
function setSize() {
    // 获取窗口宽度
    let windowWide = window.innerHeight;
    document.documentElement.style.setProperty('--controlLen', String(windowWide));
}

document.addEventListener("DOMContentLoaded", async () => {
    // 初始化
    setSize();
    // 添加监视器
    window.addEventListener("resize", () => {
        setSize();
    })
    // 设置布局
    setAll();
});
