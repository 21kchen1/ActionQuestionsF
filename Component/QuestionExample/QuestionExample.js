import {Template} from "../Template/Template.js";

/**
 * 问题示例组件
 */
class QuestionExample extends Template {
    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        super(cup);
        this.title = this.getElement(".Title");
        this.videoFrame = this.getElement(".VideoBox iframe");
        this._init();
    }

    _init() {
    }

    /**
     * 配置按钮
     * @param {QuestionExample.Config} config
     */
    setConfig(config) {
        if (config.color)
            this.setMainColor(config.color);
        if (config.title)
            this.title.textContent = config.title;
        if (config.videoPath)
            // @ts-ignore
            this.videoFrame.src = `https://player.bilibili.com/player.html?bvid=${config.videoPath}&page=1&autoplay=0`;
    }
}

/**
 * 配置子类
 */
QuestionExample.Config = class {
    /**
     * @param {string | null} color 颜色
     * @param {string | null} title 问题名称
     * @param {string | null} videoPath 视频路径
     */
    constructor(color, title, videoPath) {
        this.title = title;
        this.color = color;
        this.videoPath = videoPath;
    }
}

export default QuestionExample;