import time
import requests
import json
from requests.adapters import HTTPAdapter
from app_views.models import Node
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
    node_list = get_ordered_node()
    try:
        for node in node_list:
            url = "http://%s:%s/QueryNodes" % (node, jc.ranking_port)
            params = {"period": 2, "numRank": 100}
            result = requests.post(url=url, json=params)
            if result:
                return result.json()
    except Exception as e:
        logger.error(e)


def get_validators():
    try:
        node_list = get_ordered_node()
        for node in node_list:
            url = "http://%s:%s/tri_block_validators" % (node, jc.server_port)
            result = url_data(url)
            if result and ('error' not in result):
                return result
    except Exception as e:
        logger.error(e)
        return


def send_transaction_util(id, content):
    params = {"tx": "\"%s\"" % content}
    nowtime = int(time.time())
    try:
        node_list = get_ordered_node()
        for node in node_list:
            url = "http://%s:%s/tri_bc_tx_commit" % (node, jc.server_port)
            result = url_data(url, params=params, time_out=120)
            if result:
                # save tx hash
                if 'error' not in result:
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


def get_ordered_node():
    try:
        return list(Node.objects.order_by('status', '-block_heigth', 'id').values_list('node_ip', flat=True))
    except Exception as e:
        logger.error(e)
        return []