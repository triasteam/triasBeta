"""
local config for parse conf.json vars
"""
import json

from trias_beta.settings import CONF_JSON


class JsonConfiguration:

    def __init__(self):
        with open(CONF_JSON, 'r') as conf:
            rec = conf.read()
        records = json.loads(rec)

        self.node_list = records["node_list"]
        self.redis_ip = records["redis_ip"]
        self.redis_port = records["redis_port"]
        self.request_interval = records["request_interval"]