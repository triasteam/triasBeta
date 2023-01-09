"""
local config for parse conf.json vars
"""
import json

from trias_beta.settings import CONF_JSON, ACTIVITY_JSON, NODE_SHOW_JSON


class JsonConfiguration:

    def __init__(self):
        with open(CONF_JSON, 'r') as conf:
            rec = conf.read()
        records = json.loads(rec)

        self.node_list = records["node_list"]
        self.server_port = records["server_port"]
        self.redis_ip = records["redis_ip"]
        self.redis_port = records["redis_port"]
        self.redis_password = records["redis_password"]


class ActivityConfiguration:

    def __init__(self):
        with open(ACTIVITY_JSON, 'r') as conf:
            rec = conf.read()
        records = json.loads(rec)

        self.activity_list = records["activity_list"]


def get_node_show():
    with open(NODE_SHOW_JSON, 'r') as conf:
        rec = conf.read()
    records = json.loads(rec)
    return records
