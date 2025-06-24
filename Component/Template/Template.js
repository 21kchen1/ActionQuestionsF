/**
 * 抽象组件模板
 */
class Template {
    static scriptPath = new URL(import.meta.url).pathname;
    static scriptDir = this.scriptPath.substring(0, this.scriptPath.lastIndexOf("/"));
    /**
     * 构造函数
     * @param {HTMLElement} cup 模板容器
     */
    constructor(cup) {
        if (!(cup instanceof HTMLElement))
            throw new TypeError("Invalid HTML element provided.");
        this.cup = cup;
        if (!(this.cup.firstElementChild instanceof HTMLElement))
            throw new Error("Template creation exception.");
        this.controlElement = this.cup.firstElementChild;
    }

    /**
     * 根据 selector 获取组件元素
     * @param {String} selector
     * @returns 组件元素
     */
    getElement(selector) {
        var element = this.cup.querySelector(selector);
        if (!(element instanceof HTMLElement))
            throw new Error("Selector exception.");
        return element;
    }

    /**
     * 设置组件主题颜色
     * @param {String} color 主题颜色
     */
    setMainColor(color) {
        this.controlElement.style.setProperty("--mainColor", String(color));
    }

    /**
     * 设置组件相对于标准大小的比例
     * @param {Number} ratio 大于 0 的比例
     * @returns void
     */
    setSizeRatio(ratio) {
        this.controlElement.style.setProperty("--controlRatio", String(ratio));
    }
}

/**
 * 模板工厂
 * 导入模板 CSS，HTML 并返回实例化组件
 */
class TemplateFactor {
    /**
     * 设置生产模板
     * @param {typeof Template} Template 模板类类型
     */
    constructor(Template) {
        this.Template = Template;
        this.TemplateCSS = null;
        this.TemplateHTML = null;
    }

    /**
     * 在 cup 中实例化并返回一个模板组件
     * 1. 载入 CSS 与 HTML
     * 2. 在 cup 中插入组件
     * 3. 返回组件
     * @param {HTMLElement} cup
     * @returns {Promise<Template>}
     */
    async create(cup) {
        // 载入单个 CSS 文件
        if (this.TemplateCSS === null) {
            this.TemplateCSS = this.loadCSS();
            document.head.appendChild(this.TemplateCSS);
        }
        // 载入单个 HTML 文件
        if (this.TemplateHTML === null) {
            this.TemplateHTML = await this.loadHTML();
        }
        // 插入到容器中
        cup.innerHTML = this.TemplateHTML;
        return new this.Template(cup);
    }

    /**
     * 根据路径载入 CSS 文件
     * @param {String} path CSS 文件路径
     * @returns {HTMLLinkElement} CSS 载入头
     */
    loadCSSByPath(path) {
        // 载入 CSS 文件
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        return link
    }

    /**
     * 自动寻找同一目录下同名的 CSS
     * @returns {HTMLLinkElement} CSS 载入头
     */
    loadCSS() {
        // 构建 CSS 文件路径
        const cssPath = `${this.Template.scriptDir}/${this.Template.name}.css`;
        return this.loadCSSByPath(cssPath);
    }

    /**
     * 根据路径载入 HTML 文件
     * @param {String} path HTML 文件路径
     * @returns {Promise<string>} HTML 模板
     */
    async loadHTMLByPath(path) {
        // 获取 HTML 模板
        var response = await fetch(path);
        if (!response.ok) {
            throw ReferenceError(`Failed to load ${this.Template.name} HTML template: ${response.statusText}`);
        }
        return await response.text();
    }

    /**
     * 自动寻找同一目录下同名的 HTML
     * @returns {Promise<string>} HTML 模板
     */
    async loadHTML() {
        try {
            // 构建 HTML 文件路径
            const htmlPath = `${this.Template.scriptDir}/${this.Template.name}.html`;
            return await this.loadHTMLByPath(htmlPath);
        } catch (e) {
            throw e;
        }
    }
}

export {Template, TemplateFactor};