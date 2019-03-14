import time
import requests
import json
import redis
from requests.adapters import HTTPAdapter
from app_views.view_utils.logger import logger
from app_views.view_utils.localconfig import JsonConfiguration

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
    redis_client = redis.Redis(jc.redis_ip, jc.redis_port)
    try:
        for node in jc.node_list:
            url = "http://%s:%s/broadcast_tx_commit" % (node['ip'], node['port'])
            result = url_data(url, params=params, time_out=120)
            if result:
                # save tx hash
                if result['error'] == "":
                    # tx success
                    query_url = "http://%s:%s/abci_query" % (node['ip'], node['port'])
                    query_params = {"path": "", "data": content, "prove": True}
                    query_result = url_data(query_url, query_params, time_out=10)
                    if query_result['error'] == "":
                        proof = query_result['result']['response']['proof']
                        # ["success", hash, height, proof, content]
                        redis_client.set(id, str(['success', result['result']['hash'],
                                                  result['result']['height'], proof, content]), 600)
                    else:
                        redis_client.set(id, str(['failure', query_result['error']]), 600)
                else:
                    # failure
                    redis_client.set(id, str(['failure', result['error']]), 600)
                return result
    except Exception as e:
        logger.error(e)
        return

