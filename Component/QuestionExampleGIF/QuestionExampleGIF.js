import {Template} from "../Template/Template.js";

/**
 * 问题示例组件
 */
class QuestionExampleGIF extends Template {
    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        super(cup);
        this.title = this.getElement(".Title");
        this.gif = this.getElement(".GIFBox img");
        this._init();
    }

    _init() {
    }

    /**
     * 配置按钮
     * @param {QuestionExampleGIF.Config} config
     */
    setConfig(config) {
        if (config.color)
            this.setMainColor(config.color);
        if (config.title)
            this.title.textContent = config.title;
        if (config.gifPath)
            // @ts-ignore
            this.gif.src = config.gifPath;
    }
}

/**
 * 配置子类
 */
QuestionExampleGIF.Config = class {
    /**
     * @param {string | null} color 颜色
     * @param {string | null} title 问题名称
     * @param {string | null} gifPath GIF路径
     */
    constructor(color, title, gifPath) {
        this.title = title;
        this.color = color;
        this.gifPath = gifPath;
    }
}

export default QuestionExampleGIF;