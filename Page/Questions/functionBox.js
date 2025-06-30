import Button from "../../Component/Button/Button.js";
import ProgressBar from "../../Component/ProgressBar/ProgressBar.js";
import QuestionExampleVideo from "../../Component/QuestionExampleVideo/QuestionExampleVideo.js";
import { TemplateFactor } from "../../Component/Template/Template.js"
import { saveToJSONandDownload, saveToCache } from "../../Util/SaveTo.js";
import { gifJsonList } from "./questionBox.js"

// 网页链接
const Url = new URL(window.location.href);
// 网页参数
const Params = new URLSearchParams(Url.search);
/**
 * 记录开始时间
 */
const StartTime = new Date();
/**
 * 已经完成时间
 */
const HaveTime = localStorage.getItem(`${Params}_Time`);

/**
 * 获取完成时间
 * @returns {Number} 当前完成时间
 */
function getFinishTime() {
    var nowTime = new Date();
    // @ts-ignore
    var finishTime = Math.floor((nowTime - StartTime) / 1000) + Number(HaveTime);
    console.log(`当前时间: ${finishTime}`);
    return  finishTime;
}

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
 * 缓存数据与执行时间
 */
function cachingData() {
    if (gifJsonList.length <= 0) {
        alert(`本问卷类型数据不存在。`);
        return;
    }
    // 缓存数据
    saveToCache(gifJsonList, `${Params}_Data`);
    // 缓存持续时间
    saveToCache(getFinishTime(), `${Params}_Time`);
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
 * 显示样例
 */
function showExample() {
    // 样例盒子
    const examplePanelHeight = "70vh";
    var examplePanel = document.querySelector(".coreBox .embedBox .examplePanel");
    // @ts-ignore
    if (examplePanel.style.height !== examplePanelHeight)
    // @ts-ignore
        examplePanel.style.height = examplePanelHeight;
    else
    // @ts-ignore
        examplePanel.style.height = "0";
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
    // 每个题目平均不得小于 3 秒
    if (getFinishTime() < gifJsonList.length * 3) {
        alert(`答题时间过短！`);
        return;
    }

    // 获取参数
    var type = Params.get("type")
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
    const progressBox = document.querySelector(".coreBox .floatBox .controlPanel .progressBox");
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
    const saveButtonBox = document.querySelector(".coreBox .floatBox .controlPanel .controlButton#save");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var saveButton = await buttonFactor.create(saveButtonBox);
    saveButton.setConfig(new Button.Config("暂存", "var(--MainGreen)", cachingData));

    // 跳转
    const jumpButtonBox = document.querySelector(".coreBox .floatBox .controlPanel .controlButton#jump");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var jumpButton = await buttonFactor.create(jumpButtonBox);
    jumpButton.setConfig(new Button.Config("跳转", "var(--MainPurple)", scrollToUndone));

    // 示例
    const exampleButtonBox = document.querySelector(".coreBox .floatBox .controlPanel .controlButton#example");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var exampleButton = await buttonFactor.create(exampleButtonBox);
    exampleButton.setConfig(new Button.Config("示例", "var(--MainRed)", showExample));

    // 提交
    const submitButtonBox = document.querySelector(".coreBox .floatBox .controlPanel .controlButton#submit");
    /**
     * @type {Button}
     */
    // @ts-ignore
    var submitButton = await buttonFactor.create(submitButtonBox);
    submitButton.setConfig(new Button.Config("提交", null, saveToJSON));

    // 样例
    var exampleFactor = new TemplateFactor(QuestionExampleVideo)
    // 正手高远球
    const frehandHighBox = document.querySelector(".coreBox .floatBox .examplePanel .theExample#ForehandHigh");
    /**
     * @type {QuestionExampleVideo}
     */
    // @ts-ignore
    var frehandHighExample = await exampleFactor.create(frehandHighBox);
    frehandHighExample.setConfig(new QuestionExampleVideo.Config(null, "正手高远球", "BV1TJ411K7Lh"))

    // 正手吊球
    const forehandLobBox = document.querySelector(".coreBox .floatBox .examplePanel .theExample#ForehandLob");
    /**
     * @type {QuestionExampleVideo}
     */
    // @ts-ignore
    var forehandLobExample = await exampleFactor.create(forehandLobBox);
    forehandLobExample.setConfig(new QuestionExampleVideo.Config(null, "正手吊球", "BV1Z4411R7zw"))

    // 正手杀球
    const forehandKillBox = document.querySelector(".coreBox .floatBox .examplePanel .theExample#ForehandKill");
    /**
     * @type {QuestionExampleVideo}
     */
    // @ts-ignore
    var forehandKillExample = await exampleFactor.create(forehandKillBox);
    forehandKillExample.setConfig(new QuestionExampleVideo.Config(null, "正手杀球", "BV1gq4y1U7y7"))

    // 反手过渡球
    const backhandTransitionBox = document.querySelector(".coreBox .floatBox .examplePanel .theExample#BackhandTransition");
    /**
     * @type {QuestionExampleVideo}
     */
    // @ts-ignore
    var backhandTransitionExample = await exampleFactor.create(backhandTransitionBox);
    backhandTransitionExample.setConfig(new QuestionExampleVideo.Config(null, "反手过渡球", "BV1fb1aYGEGb"))

}

export { setAll };