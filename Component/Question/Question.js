import {Template} from "../Template/Template.js";

/**
 * 问题组件
 */
class Question extends Template {
    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        super(cup);
        this.title = this.getElement(".Title");
        this.gifImg = this.getElement(".Gif img");
        this.inputSlider = this.getElement(".Rating input");
        this.inputLabel = this.getElement(".Rating .RatingValue");

        this._init();
    }

    /**
     *
     * @param {Number} value 设置问题数值
     */
    setQuestionValue(value) {
        // @ts-ignore
        this.inputSlider.value = value;
        this.inputSlider.click();
    }

    updateState() {
        // @ts-ignore
        this.inputLabel.textContent = this.inputSlider.value;
        // 设置完成后的颜色
        this.controlElement.classList.remove("finish");
        // @ts-ignore
        if (this.inputSlider.value !== "0") {
            this.controlElement.classList.add("finish");
        }
    }

    _init() {
        this.inputSlider.addEventListener("input", this.updateState.bind(this));
        this.inputSlider.addEventListener("click", this.updateState.bind(this));
    }

    /**
     * 配置按钮
     * @param {Question.Config} config
     */
    setConfig(config) {
        if (config.color)
            this.setMainColor(config.color);
        if (config.finishColor)
            this.controlElement.style.setProperty("--finishColor", String(config.finishColor));
        if (config.title)
            this.title.textContent = config.title;
        if (config.imgPath)
            // @ts-ignore
            this.gifImg.src = config.imgPath;
        if (config.callback) {
            this.inputSlider.addEventListener("input", () => {
                // @ts-ignore
                config.callback(this.inputSlider.value);
            });
        }
    }
}

/**
 * 配置子类
 */
Question.Config = class {
    /**
     * 输入回调函数
     * @callback Callback
     * @param {Number} value 评分
     * @returns {void}
     */

    /**
     * @param {string | null} color 颜色
     * @param {string | null} finishColor 完成颜色
     * @param {string | null} title 问题名称
     * @param {string | null} imgPath 图像路径
     * @param {Callback | null} callback
     */
    constructor(color, finishColor, title, imgPath, callback) {
        this.title = title;
        this.color = color;
        this.finishColor = finishColor;
        this.imgPath = imgPath;
        this.callback = callback;
    }
}

export default Question;