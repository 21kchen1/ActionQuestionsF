import Button from "../../Component/Button/Button.js";
import ProgressBar from "../../Component/ProgressBar/ProgressBar.js";
import { TemplateFactor } from "../../Component/Template/Template.js"
import { saveToJSONandDownload, saveToCache } from "../../Util/SaveTo.js";
import { gifJsonList } from "./questionBox.js"

/**
 * 添加控制栏浮空
 */
function addFloat() {
    const embedBox = document.querySelector(".coreBox .embedBox");
    const floatBox = document.querySelector(".coreBox .floatBox");
    window.addEventListener("scroll", () => {
        if (!(embedBox instanceof HTMLElement) || !(floatBox instanceof HTMLElement)) return;
        // 获取顶部位置信息
        let topDis = embedBox.getBoundingClientRect().top;
        if (topDis >= 0) {
            floatBox.style.position = "static";
            floatBox.style.boxShadow = "none";
            floatBox.style.width = "100%"
            return;
        }
        floatBox.style.position = "fixed";
        floatBox.style.top = "0";
        floatBox.style.width = "80%"
        floatBox.style.boxShadow = "0 5px 10px -5px rgba(0, 0, 0, 0.5)";
    });
}

/**
 * 缓存数据
 */
function cachingData() {
    if (gifJsonList.length <= 0) {
        alert(`本问卷类型数据不存在。`);
        return;
    }
    // 获取当前页面的 URL
    const url = new URL(window.location.href);
    // 使用 URLSearchParams 解析查询字符串
    const params = new URLSearchParams(url.search);
    saveToCache(gifJsonList, `${params}`);
    alert("数据暂存成功！");
}

/**
 * 跳转到未完成题目回调函数
 */
function scrollToUndone() {
    for (let index = 0; index < gifJsonList.length; index++) {
        const gifJson = gifJsonList[index];
        if (gifJson.value !== 0)
            continue;
        // 获取未完成题目元素
        var undoneQuestion = document.getElementById(gifJson.fname);
        // 滚动
        undoneQuestion?.scrollIntoView({
            // 平滑滚动
            behavior: 'smooth',
            // 将目标元素置于视口中央
            block: 'center'
        })
        break;
    }
}

/**
 * 结果保存回调函数
 */
function saveToJSON() {
    // 检测是否载入完成
    if (gifJsonList.length <= 0) {
        alert(`本问卷类型数据不存在。`);
        return;
    }
    // 检测所有题目是否完成
    for (let index = 0; index < gifJsonList.length; index++) {
        const gifJson = gifJsonList[index];
        if (gifJson.value !== 0)
            continue;
        alert(`${index + 1}. ${gifJson.atype} 未评估。`);
        scrollToUndone();
        return;
    }
    // 获取当前页面的 URL
    const url = new URL(window.location.href);
    // 使用 URLSearchParams 解析查询字符串
    const params = new URLSearchParams(url.search);
    // 获取参数
    const type = params.get("type")
    saveToJSONandDownload(gifJsonList, `问卷_${type}_评估质量数据`);
    cachingData();
}

/**
 * 执行功能并添加组件
 */
async function setAll() {
    addFloat();

    // 获取问卷完成率记录
    const finishNumLabel = document.querySelector(".hidden.finishNumLabel");
    // 添加进度条
    var barFactor = new TemplateFactor(ProgressBar);
    const progressBox = document.querySelector(".coreBox .floatBox .progressBox");
    /**
     * @type {ProgressBar}
     */
    // @ts-ignore
    var theBar = await barFactor.create(progressBox);
    // 添加进度条控制
    if (finishNumLabel !== null) {
        finishNumLabel.addEventListener("click", () => {
            // 百分比进度
            theBar.setProgress(Number(finishNumLabel.textContent) * 100 / gifJsonList.length);
        })
    }

    // 添加控制按钮
    var buttonFactor = new TemplateFactor(Button)

    // 缓存
    const saveButtonBox = document.querySelector(".coreBox .floatBox .controlButton#save");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var saveButton = await buttonFactor.create(saveButtonBox);
    saveButton.setConfig(new Button.Config("暂存", "var(--MainGreen)", cachingData));

    // 跳转
    const jumpButtonBox = document.querySelector(".coreBox .floatBox .controlButton#jump");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var jumpButton = await buttonFactor.create(jumpButtonBox);
    jumpButton.setConfig(new Button.Config("跳转", "var(--MainRed)", scrollToUndone));

    // 提交
    const submitButtonBox = document.querySelector(".coreBox .floatBox .controlButton#submit");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var submitButton = await buttonFactor.create(submitButtonBox);
    submitButton.setConfig(new Button.Config("提交", null, saveToJSON));
}

export { setAll };