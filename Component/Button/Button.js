import {Template} from "../Template/Template.js";

/**
 * 进度条组件
 */
class Button extends Template {

    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        super(cup);
        // 获取 Button
        this.Button = this.getElement("Button");
    }

    /**
     * 配置按钮
     * @param {Button.Config} config
     */
    setConfig(config) {
        this.Button.textContent = config.text;
        if (config.color)
            this.setMainColor(config.color);
        if (config.callback)
            this.Button.addEventListener("click", config.callback);
    }
}

/**
 * 配置子类
 */
Button.Config = class {
    /**
     * 回调函数
     * @callback Callback
     * @returns {void}
     */

    /**
     * @param {string | null} text 文本
     * @param {string | null} color 颜色
     * @param {Callback | null} callback 回调函数
     */
    constructor(text, color, callback) {
        this.text = text;
        this.color = color;
        this.callback = callback;
    }
}

export default Button;