import Question from "../../Component/Question/Question.js";
import { TemplateFactor } from "../../Component/Template/Template.js";
import gifJsonListSet from "../../Resource/gifResource.js";

/**
 * @typedef {Object} GifJsonItem
 * @property {string} src - 图片的路径
 * @property {string} fname - 文件名
 * @property {string} atype - 类型
 * @property {number} value - 数值
 */

/**
 * 全局数据存储
 * @type {GifJsonItem[]}
 */
var gifJsonList = [];

/**
 * 获取题目信息
 * 包含缓存数据校验
 */
function getGifJsonList() {
    // 获取当前页面的 URL
    const url = new URL(window.location.href);
    // 使用 URLSearchParams 解析查询字符串
    const params = new URLSearchParams(url.search);
    // 获取参数
    const type = params.get("type");
    if (Number(type) >= gifJsonListSet.length) {
        return [];
    }

    // 当前问卷列表
    var nowGifJsonList = gifJsonListSet[Number(type)];
    // 先尝试从缓存获取
    var cacheData = localStorage.getItem(`${params}`);
    // 没有缓存
    if (cacheData == null)
        return nowGifJsonList;

    // 缓存问卷列表
    var cacheGifJsonList = JSON.parse(cacheData);
    // 缓存与当前问卷列表长度不一致
    if (cacheGifJsonList.length !== nowGifJsonList.length)
        return nowGifJsonList;

    // 检测缓存是否与当前问卷列表信息一致
    for (let index = 0; index < cacheGifJsonList.length; index++) {
        const cacheJson = cacheGifJsonList[index];
        if (cacheJson.src === nowGifJsonList[index].src)
            continue;
        return nowGifJsonList;
    }
    // 如果一致
    return JSON.parse(cacheData);
}

/**
 * 执行功能并添加组件
 */
async function setAll() {
    // 获取问卷信息
    gifJsonList = getGifJsonList();
    // 获取问卷框
    const questionList = document.querySelector(".questionBox .questionList");
    // 获取问卷完成数量记录
    const finishNumLabel = document.querySelector(".hidden.finishNumLabel");
    // 题目完成数量
    var finishNum = 0;

    var questionFactor = new TemplateFactor(Question);
    // 为每一个图片设置题目和回调
    gifJsonList.forEach(async (gifJson, index) => {
        var newDiv = document.createElement('div');
        newDiv.className = "theQuestion";
        newDiv.id = gifJson.fname;
        /**
         * @type {Question}
         */
        // @ts-ignore
        var question = await questionFactor.create(newDiv);
        // 设置标题及变化时的回调函数
        question.setConfig(new Question.Config(null, null, `${index + 1}. ${gifJson.atype}`, gifJson.src, (value) => {
            // 如果前后状态相同，则不处理
            if (gifJson.value === Number(value))
                return;
            // 记录完成数量
            // 从未完成到完成
            if (gifJson.value === 0) {
                finishNum += 1;
            // 从完成到未完成
            }else if (Number(value) === 0 && finishNum > 0) {
                finishNum -= 1;
            }
            // 保存分数数据
            gifJson.value = Number(value);
            // 记录完成数量到页面
            if (finishNumLabel !== null) {
                finishNumLabel.textContent = String(finishNum);
                // 触发回调函数
                // @ts-ignore
                finishNumLabel.click();
            }
            // 设置完成比例
            console.log(`index: ${index + 1}, fname: ${gifJsonList[index].fname}, value: ${gifJsonList[index].value}`);
        }));
        // 设置数值
        question.setQuestionValue(gifJson.value);
        questionList?.append()
        questionList?.appendChild(newDiv);
    })

    // 初始化进度条
    if (finishNumLabel !== null) {
        // 避免 async 导致数据异常
        gifJsonList.forEach((gifJson) => {
            if (gifJson.value > 0) finishNum++;
        })
        finishNumLabel.textContent = String(finishNum);
        // 触发回调函数
        // @ts-ignore
        finishNumLabel.click();
    }
}

export { setAll, gifJsonList };