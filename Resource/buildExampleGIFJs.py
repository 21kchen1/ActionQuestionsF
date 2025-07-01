#!/usr/bin/env python3.8
# -*- coding: utf-8 -*-

r"""
@DATE    :   2025-07-01 10:52:45
@Author  :   Chen
@File    :   Resource\buildExampleGIFJs.py
@Software:   VSCode
@Description:
    获取样例文件路径，并基于此构建样例结构体字典
"""

import os
from buildGIFJs import getFilePaths, getFirstFloorDirPaths

# 根路径
ROOT_PATH = r".\Resource"
# 相对样例路径
EXAMPLE_PATH = r".\ExampleGIF"

class ExampleGIF:
    def __init__(self, src: str) -> None:
        """
        载入路径

        Args:
            src (str): 示例图片路径
        """
        self.src = src
        self.image = 0


def main() -> None:
    # 样例字典
    exampleDict = {}
    # 获取每个类型的样例文件夹
    exampleDirPaths = getFirstFloorDirPaths(EXAMPLE_PATH)
    # 构建字典
    for exampleDirPath in exampleDirPaths:
        # 获取所有样例链接
        exampleSrcs = [os.path.join(ROOT_PATH, filePath) for filePath in getFilePaths(exampleDirPath) if filePath.endswith(".gif")]
        # 构建结构体
        examples = [ExampleGIF(exampleSrc).__dict__ for exampleSrc in exampleSrcs]
        # 设置字典
        exampleDict[exampleDirPath.split("\\")[-1]] = examples
    # 输出 js 文件
    with open(f"exampleGIFResource.js", "w", encoding= "utf-8") as file:
        file.write(f"const exampleGIFListDict = {exampleDict};\nexport default exampleGIFListDict;")

if __name__ == "__main__":
    main()