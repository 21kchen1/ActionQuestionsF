#!/usr/bin/env python3.8
# -*- coding: utf-8 -*-

r"""
@DATE    :   2025-06-30 09:09:46
@Author  :   Chen
@File    :   Resource\checkResult.py
@Software:   VSCode
@Description:
    校对数据集与评分结果是否一一对应。
"""

import json
from typing import Dict, List
from buildFileJson import getFilePaths

# 数据集路径
datasetPath = r"G:\Badminton\BADS_CLL"
# 评分结果路径
resultPath = r".\Result"

def loadJSON(path: str) -> List[Dict]:
    """
    载入 json 文件

    Args:
        path (str): json 文件路径

    Returns:
        List[Dict]: 数据
    """
    with open(path, "r", encoding= "utf-8") as file:
        data = json.load(file)
    return data

def getDatasetNames(datasetJsonPaths: List[str]) -> List[str]:
    """
    获取数据集中各个数据单元的名称

    Args:
        datasetJsonPaths (List[str]): 数据集json文件路径列表

    Returns:
        List[str]: 名字列表
    """
    # 存储名称
    datasetNames = []

    for jsonPath in datasetJsonPaths:
        jsons = loadJSON(jsonPath)
        for index, json in enumerate(jsons):
            # 是否是有效数据
            if json["data"] is None:
                continue
            datasetNames.append(json['info']['recordName'] + f"@{index}")
    return datasetNames

def getResultNameDict(resultJsonPaths: List[str]) -> Dict[str, bool]:
    """
    获取结果中各个数据单元的名称的map

    Args:
        resultJsonPaths (List[str]): 结果json文件路径列表

    Returns:
        Dict[str, bool]: 名字map
    """
    # 存储名称
    resultNamesDict = {}

    for jsonPath in resultJsonPaths:
        jsons = loadJSON(jsonPath)
        for index, json in enumerate(jsons):
            resultNamesDict[json["fname"].split(".")[0]] = True
    return resultNamesDict


def main() -> None:
    # 获取文件路径
    datasetJsonPaths = [jsonPath for jsonPath in getFilePaths(datasetPath) if jsonPath.endswith(".json")]
    resultJsonPaths = [jsonPath for jsonPath in getFilePaths(resultPath) if jsonPath.endswith(".json")]
    # 所有数据集 有效数据单元名称
    resultNameDict = getResultNameDict(resultJsonPaths)
    print("载入数据集中")
    datasetNames = getDatasetNames(datasetJsonPaths)
    print("载入完成，开始比较")
    for datasetName in datasetNames:
        if resultNameDict[datasetName] is True:
            print(f"{datasetName} ok")
            continue
        print(f"{datasetName} error")
    print("比较完成")

if __name__ == "__main__":
    main()