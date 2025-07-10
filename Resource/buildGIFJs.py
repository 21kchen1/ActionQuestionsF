#!/usr/bin/env python3.8
# -*- coding: utf-8 -*-

r"""
@DATE    :   2025-06-24 12:20:46
@Author  :   Chen
@File    :   Resource\buildFileJson.py
@Software:   VSCode
@Description:
    用于生产图像路径依赖，并完成类型划分
"""

import json
import os
import random
from typing import List, Union

def getFilePaths(rootPath: str) -> List[str]:
    """
    获取根目录中所有文件路径

    Args:
        rootPath (str): 根目录

    Returns:
        list: 文件路径列表
    """
    filePaths = []
    for root, _, fileNames in os.walk(rootPath):
        filePaths.extend([os.path.join(root, fileName) for fileName in fileNames])
    return filePaths

def getFirstFloorDirPaths(rootPath: str) -> List[str]:
    """
    获取根目录下第一层文件夹路径

    Args:
        rootPath (str): 根目录

    Returns:
        list: 文件夹路径列表
    """
    filePaths = []
    for root, dirNames, _ in os.walk(rootPath):
        filePaths.extend([os.path.join(root, dirName) for dirName in dirNames])
        break
    return filePaths

def getAllGIF(path: str) -> List[str]:
    """
    获取路径中所有GIF文件的地址

    Args:
        path (str): 路径

    Returns:
        List[str]: GIF文件地址列表
    """
    return [gifPath for gifPath in getFilePaths(path) if gifPath.endswith(".gif")]

class GIFJson:
    def __init__(self, src: str, fname: str, atype: str, value: int) -> None:
        """
        GIF数据

        Args:
            src (str): 包含文件名的路径
            fname (str): 文件名
            atype (str): 中文动作名称
            value (int): 默认评分
        """
        self.src = src
        self.fname = fname
        self.atype = atype
        self.value = value

atypeDict = {
    "BackhandTransition": "反手过渡球",
    "ForehandHigh": "正手高远球",
    "ForehandKill": "正手杀球",
    "ForehandLob": "正手吊球",
}

def buildJSON(path: str) -> List[GIFJson]:
    """
    获取当前文件夹下所有GIF文件地址，并为各个GIF生成JSON数据

    Args:
        path (str): 文件地址

    Returns:
        List[GIFJson]: GIFjson列表
    """
    jsons = []
    for gifPath in getAllGIF(path):
        src = ".\\Resource\\" + gifPath[2 :]
        fname = os.path.basename(gifPath)
        atype = atypeDict.get(fname.split("_")[2])
        if atype is None:
            atype = fname.split("_")[2]
        jsons.append(GIFJson(src, fname, atype,0).__dict__)

    return jsons

def splitListRandomly(theList: List, splitNum: int, seed: Union[int, None] = None) -> List[List]:
    """
    打乱并划分list

    Args:
        theList (List): 列表
        splitNum (int): 划分数量
        seed (Union[int, None], optional): 打乱随机数种子. Defaults to None.

    Returns:
        List[List]: 划分列表
    """
    if not seed is None:
        random.seed(seed)
    # 打乱
    random.shuffle(theList)

    # 子集大小
    subSize = len(theList) // splitNum
    # 需要均匀弥补的子集
    avgIndex = len(theList) % splitNum

    result = []
    startIndex = 0
    for i in range(0, splitNum):
        endIndex = startIndex + subSize + (1 if i < avgIndex else 0)
        result.append(theList[startIndex : endIndex])
        startIndex = endIndex

    return result

# 开启测试模式，不生成 js 文件，生成 json 文件
TEST = True

def main() -> None:
    jsonsList = []
    # 获取所有 gif json
    jsons = buildJSON("./GIF")
    # 打乱
    jsonsList.extend(splitListRandomly(jsons, 18, 114514))
    # 测试页面
    # jsonsList.append(jsons[0:3])
    if TEST:
        with open("gifResource.json", "w", encoding= "utf-8") as file:
            file.write(json.dumps(jsonsList, ensure_ascii= False, indent= 4))
        return
    # 生成 js 文件，对网页生效
    with open(f"gifResource.js", "w", encoding= "utf-8") as file:
        file.write(f"const gifJsonListSet = {jsonsList};\nexport default gifJsonListSet;")

if __name__ == "__main__":
    main()