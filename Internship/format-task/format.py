import csv
from csv import reader
import json
import os
import xml.etree.ElementTree as Xet
import pandas as pd


def mapper_function(obj):
    output_dictionary = {'a': {"sku":obj['SKU']},"b": {"price":float(obj['Price'])},"title": obj['title']}
    print(output_dictionary)

def flatten_json(b, delim):
    val = {}
    for i in b.keys():
        if isinstance(b[i], dict):
            get = flatten_json(b[i], delim)
            for j in get.keys():
                val[i + delim + j] = get[j]
        else:
            val[i] = b[i]
            
    return val

def file_extension_finder(file_path):
    filename, file_extension = os.path.splitext(file_path)
    return file_extension

def list_to_json(list):
    json_obj = { 'SKU':list[0],'Price':list[1],'title':list[2]}
    return json_obj


def any_format_to_json(file):
    file_extension = file_extension_finder(file)
    if file_extension == '.json':
        json_file = open(file,)
        obj = json.load(json_file)
        obj = flatten_json(obj,"_")
        list = []
        for keys in obj:
            list.append(obj[keys])
        mapper_function(list_to_json(list))
    if file_extension == '.csv':
        with open(file, 'r') as read_obj:
            csv_reader = reader(read_obj)
            header = next(csv_reader)
            if header != None:
                for row in csv_reader:
                    mapper_function(list_to_json(row))
    if file_extension == '.xml':
        cols = ["SKU", "Price", "title"]
        rows = []
        
        # Parsing the XML file
        xmlparse = Xet.parse('data.xml')
        root = xmlparse.getroot()
        
        for i in root:
            list = []
            list.append(i.find("sku").text)
            list.append(i.find("price").text)
            list.append(i.find("title").text)
            # print(list)
            mapper_function(list_to_json(list))

any_format_to_json('data.xml')