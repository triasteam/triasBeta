import time
import requests
import json
from requests.adapters import HTTPAdapter
from app_views.view_utils.logger import logger
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.models import TransactionLog

jc = JsonConfiguration()


def url_data(url, params=None, time_out=1):
    try:
        s = requests.Session()
        s.mount('http://', HTTPAdapter(max_retries=2))
        s.keep_alive = False
        response = s.get(url, params=params, headers={'Content-Type': 'application/json'},
                                 timeout=time_out)
        result = json.loads(response.text)
        return result
    except Exception as e:
        logger.error("%s: %s" % (url, e))
        return


def stamp2datetime(stamp):
    # stamp to date
    tl = time.localtime(int(stamp))
    format_time = time.strftime("%Y-%m-%d %H:%M:%S", tl)
    return format_time


def get_ranking():
    for node in jc.node_list:
        url = "http://%s:%s/trias/getranking" % (node['ip'], jc.ranking_port)
        result = url_data(url)
        if result:
            return result


def get_validators():
    try:
        for node in jc.node_list:
            url = "http://%s:%s/validators" % (node['ip'], node['port'])
            result = url_data(url)
            if result and (result['error'] == ""):
                return result
    except Exception as e:
        logger.error(e)
        return


def send_transaction_util(id, content):
    params = {"tx": content}
    nowtime = int(time.time())
    try:
        for node in jc.node_list:
            url = "http://%s:%s/tri_bc_tx_commit" % (node['ip'], node['port'])
            result = url_data(url, params=params, time_out=120)
            if result:
                # save tx hash
                if result['error'] == "":
                    # tx success
                    hash = result['result']['hash']
                    height = result['result']['height']
                    TransactionLog.objects.create(status=0, hash=hash, block_heigth=height,
                                                  content=content, trias_hash=id, log='', time=nowtime)
                else:
                    log = result['error']
                    TransactionLog.objects.create(status=1, content=content, trias_hash=id, log=log, time=nowtime)

                return

        TransactionLog.objects.create(status=1, content=content, trias_hash=id, log='transaction handling exception', time=nowtime)
    except Exception as e:
        logger.error(e)

