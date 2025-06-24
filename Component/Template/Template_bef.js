/**
 * 抽象组件模板
 */
class Template {
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     * @param {String} scriptDir 当前 JS 路径
     */
    constructor(cup, scriptDir) {
        if (!(cup instanceof HTMLElement)) {
            throw new TypeError("Invalid HTML element provided.");
        }
        this.cup = cup;
        this.scriptDir = scriptDir;
    }

    /**
     * 根据路径载入 CSS 文件
     * @param {String} path CSS 文件路径
     */
    loadCSSByPath(path) {
        // 载入 CSS 文件
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        document.head.appendChild(link);
    }

    /**
     * 自动寻找同一目录下同名的 CSS
     */
    loadCSS() {
        // 构建 CSS 文件路径
        const cssPath = `${this.scriptDir}/${this.constructor.name}.css`;
        this.loadCSSByPath(cssPath);
    }

    /**
     * 根据路径载入 HTML 文件
     * @param {String} path HTML 文件路径
     */
    async loadHTMLByPath(path) {
        // 获取 HTML 模板
        var response = await fetch(path);
        if (!response.ok) {
            console.error(`Failed to load ${this.constructor.name} HTML template: ${response.statusText}`);
            return;
        }
        this.cup.innerHTML = await response.text();
    }

    /**
     * 自动寻找同一目录下同名的 HTML
     */
    async loadHTML() {
        // 构建 HTML 文件路径
        const htmlPath = `${this.scriptDir}/${this.constructor.name}.html`;
        await this.loadHTMLByPath(htmlPath);
    }

    /**
     * 设置组件相对于标准大小的比例
     * @param {Number} ratio 大于 0 的比例
     * @returns void
     */
    setSizeRatio(ratio) {
        const className = `.Template.${this.constructor.name}`;
        var element = this.cup.querySelector(className)
        if (!(element instanceof HTMLElement))
            return;
        element.style.setProperty("--controlRatio", String(ratio));
    }
}

export default Template;