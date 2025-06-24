import {Template} from "../Template/Template.js";

/**
 * 进度条组件
 */
class ProgressBar extends Template {
    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        super(cup);
        // 获取 Filler
        this.Filler = this.getElement(".Filler");
    }

    /**
     * 进度百分比 0 - 100 float
     * @param {Number} percentage
     */
    setProgress(percentage) {
        this.Filler.style.width = `${percentage}%`;
    }

    /**
     * 配置按钮
     * @param {ProgressBar.Config} config
     */
    setConfig(config) {
        if (config.color)
            this.setMainColor(config.color);
    }
}

/**
 * 配置子类
 */
ProgressBar.Config = class {
    /**
     * @param {string | null} color 颜色
     */
    constructor(color) {
        this.color = color;
    }
}

export default ProgressBar;