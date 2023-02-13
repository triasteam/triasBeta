"""
Index message
"""
import time
import datetime
import random
import redis
import uuid
import hashlib
import base64
import threading
import traceback
import socket
from functools import reduce
from django.http import JsonResponse
from django.db.models import Q, Count
# from ratelimit.decorators import ratelimit
from app_views.models import Block, Node, Transaction, Activity, Hardware, TransactionLog, AbnormalNode, Address
from app_views.view_utils.localconfig import JsonConfiguration, ActivityConfiguration, get_node_show
from app_views.view_utils.logger import logger
from app_views.view_utils.block_util import get_ranking, get_validators, send_transaction_util, url_data
from app_views.view_utils.redis_util import get_monitoring
from app_views.view_utils.redis_common import get_redis_connection

jc = JsonConfiguration()
ac = ActivityConfiguration()
node_show = get_node_show()


# @ratelimit(key='ip', rate='30/m', block=True)
def get_current_event(request):

    try:
        result = {}
        now_str = datetime.datetime.now().strftime('%H:%M:%S')
        next_event_index = None
        ac_length = len(ac.activity_list)
        for index, value in enumerate(ac.activity_list):
            if value['start'] > now_str:
                next_event_index = index
                break

        if next_event_index == 0:
            # nothing happen
            event_list = cal(0, ac_length)
            current_index = 0
        elif next_event_index == None:
            # everything happened
            event_list = cal(0, ac_length)
            current_index = ac_length
        else:
            happened_list = cal(0, next_event_index)
            unhappen_list = cal(next_event_index, ac_length)
            event_list = happened_list + unhappen_list
            current_index = next_event_index

        all_nodes_num = Node.objects.count()
        fault_nodes_num = Node.objects.filter(status=1).count()
        status = 'success'
        result['event_list'] = event_list
        result['current_index'] = current_index - 1
        result['all_nodes_num'] = all_nodes_num
        result['fault_nodes_num'] = fault_nodes_num

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def cal(start, end):
    event_list = []
    now_str = datetime.datetime.now().strftime('%H:%M:%S')
    for index, item in enumerate(ac.activity_list[start:end]):
        # calculate time
        now_str_list = now_str.split(':')
        start_time_list = item['start'].split(':')
        now_second = int(now_str_list[0]) * 60 * 60 + int(
            now_str_list[1]) * 60 + int(now_str_list[2])
        start_second = int(start_time_list[0]) * 60 * 60 + int(
            start_time_list[1]) * 60 + int(start_time_list[2])

        event_list.append({
            'name': item['name'],
            'start': item['start'],
            'interval': abs(now_second - start_second)
        })

    return event_list


# @ratelimit(key='ip', rate='30/m', block=True)
def get_visualization(request):

    result = {
        "trias": {
            "links": [],
            "nodes": []
        },
        "hyperledger": {
            "links": [],
            "nodes": []
        },
        "ethereum": {
            "links": [],
            "nodes": []
        }
    }

    rank_list = []
    ctx_list = []

    try:
        response = get_ranking()
        if response:
            rank_list = [
                item['attestee'] for item in response['data']['dataScore']
            ]
            ctx_list = response['data']['dataCtx']
    except Exception as e:
        logger.error(e)

    try:
        # get validators
        validators = get_validators()
        validators_ips = []
        if validators:
            for validator in validators['result']['validators']:
                validator_ip = Node.objects.filter(
                    pub_key=validator['pub_key']['value'])
                if validator_ip.exists():
                    validators_ips.append(validator_ip[0].node_ip)

        node_rank = []
        all_nodes = list(
            Node.objects.order_by('status',
                                  '-block_heigth').values_list('node_ip',
                                                               flat=True))
        result['trias']['nodes'] = []

        for rank_item in rank_list:
            if rank_item in all_nodes:
                node_rank.append(rank_item)

        for mysql_node in all_nodes:
            if mysql_node not in rank_list:
                node_rank.append(mysql_node)

        # save ranking to redis
        # redis_client = redis.Redis(jc.redis_ip, jc.redis_port, socket_connect_timeout=1)
        redis_client = get_redis_connection(socket_connect_timeout=1)
        saved_ranking = redis_client.get('ranking')
        logger.info('previous ranking %s' % saved_ranking)

        for index, item in enumerate(node_rank):
            node_status = Node.objects.get(node_ip=item).status
            level = 0 if (item in validators_ips) else 1
            trend = 0
            if saved_ranking:
                pre_ranking = eval(saved_ranking)
                if item not in pre_ranking:
                    trend = 1
                else:
                    if index < pre_ranking.index(item):
                        trend = 1
                    elif index > pre_ranking.index(item):
                        trend = -1
            result['trias']['nodes'].append({
                "node_ip": node_show[item],
                "status": node_status,
                'level': level,
                'trend': trend
            })

        redis_client.delete('ranking')
        redis_client.set('ranking', str([i for i in node_rank]))

        # node link
        ctx_list = reduce(lambda x, y: x if y in x else x + [y], [
            [],
        ] + ctx_list)
        random.shuffle(ctx_list)
        for ctx_item in ctx_list[:20]:
            target = node_rank.index(ctx_item['attestee'])
            source = node_rank.index(ctx_item['attester'])
            result['trias']['links'].append({
                'target': target,
                'source': source
            })

        status = 'success'
    except Exception as e:
        logger.error(e)
        status = 'failure'
        logger.error(traceback.format_exc())

    return JsonResponse({'status': status, 'result': result})


def check_port(ip, port):
    a_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    if isinstance(port, str):
        port = int(port)
    ip_port = (ip, port)
    check = a_socket.connect_ex(ip_port)

    if check == 0:
        return True
    else:
        return False


def check_nodes(nodes):
    result = {
        "node_time": int(time.time()),
        "normal_nodes": [],
        "fault_nodes": [],
        "event": []
    }
    for node in nodes:
        if check_port(node["ip"], node["port"]):
            result['normal_nodes'].append(node["ip"])
        else:
            result['fault_nodes'].append(node["ip"])
    return result


# @ratelimit(key='ip', rate='30/m', block=True)
def get_instant_message(request):

    try:
        chain_type = request.GET.get('chain_type', 'tm')
        nodes = jc.data[chain_type]["node_list"]
        status = 'success'
        result = check_nodes(nodes)

        ###############################################################################
        # Old Version Code：
        # nowtime = int(time.time())
        # activity_list = list(
        #     Activity.objects.filter(time__gte=nowtime -
        #                             10).order_by('-time').values())
        # normal_nodes = list(
        #     Node.objects.filter(status=0).values_list('node_ip', flat=True))
        # fault_nodes = list(
        #     Node.objects.filter(status=1).values_list('node_ip', flat=True))

        # status = 'success'
        # result['node_time'] = nowtime
        # result['normal_nodes'] = normal_nodes
        # result['fault_nodes'] = fault_nodes
        # result['event'] = activity_list
        ###############################################################################
    except Exception as e:
        # import pdb
        # pdb.set_trace()
        logger.error(e)
        status, result = 'failure', {}
    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def general_static(request):

    try:
        # 节点总数
        nodes = Node.objects.count()
        # 交易总数
        tx_num = Transaction.objects.count()
        # 最新块高
        block_heigth_list = list(
            Node.objects.values_list('block_heigth', flat=True))
        block_heigth_list.append(0)
        block_height = max(block_heigth_list)

        # 今日交易总数
        today_start_time = int(
            time.mktime(
                datetime.datetime.fromtimestamp(
                    time.time()).date().timetuple()))
        today_end_time = today_start_time + 86400 - 1
        today_tx = Transaction.objects.filter(
            Q(timestamp__gte=today_start_time)
            & Q(timestamp__lte=today_end_time)).count()

        # 交易峰值(Peak Tx) (前30s)的每个块里的最高交易数
        start = today_start_time - 86400  # yesterday start timestamp
        end = today_start_time  # today start timestamp
        # >= 2019-02-26 00:00:00 & < 2019-02-27 00:00:00
        lastes_tx = list(
            Block.objects.filter(
                Q(timestamp__gte=start) & Q(timestamp__lt=end)).values_list(
                    'transactionsCount', flat=True))
        lastes_tx.append(0)
        peak_tx = max(lastes_tx)

        status = 'success'
        result = {}
        result['trias'] = {
            'nodes': nodes,
            'block_height': block_height,
            'accounts': None,
            'peak_tx': peak_tx,
            'today_tx': today_tx,
            'tx_num': tx_num
        }
        result['ethereum'] = {
            'nodes': 0,
            'block_height': 0,
            'accounts': None,
            'peak_tx': 0,
            'today_tx': 0,
            'tx_num': 0
        }
        result['hyperledger'] = {
            'nodes': 0,
            'block_height': 0,
            'accounts': None,
            'peak_tx': 0,
            'today_tx': 0,
            'tx_num': 0
        }

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def general_static_bsc(request):

    try:
        # 节点总数
        nodes = Node.objects.count()
        # 交易总数
        tx_num = Transaction.objects.using("bsc").count()
        # 最新块高
        block_heigth_list = list(
            Block.objects.using("bsc").values_list('number', flat=True))
        block_heigth_list.append(0)
        block_height = max(block_heigth_list)

        accounts = Address.objects.using("bsc").count()

        # 今日交易总数
        today_start_time = int(
            time.mktime(
                datetime.datetime.fromtimestamp(
                    time.time()).date().timetuple()))
        today_end_time = today_start_time + 86400 - 1
        today_tx = Transaction.objects.using("bsc").filter(
            Q(timestamp__gte=today_start_time)
            & Q(timestamp__lte=today_end_time)).count()

        # 交易峰值(Peak Tx) (前30s)的每个块里的最高交易数
        start = today_start_time - 86400  # yesterday start timestamp
        end = today_start_time  # today start timestamp
        # >= 2019-02-26 00:00:00 & < 2019-02-27 00:00:00
        lastes_tx = list(
            Block.objects.using("bsc").filter(
                Q(timestamp__gte=start) & Q(timestamp__lt=end)).values_list(
                    'transactionsCount', flat=True))
        lastes_tx.append(0)
        peak_tx = max(lastes_tx)

        status = 'success'
        result = {}
        result['trias'] = {
            'nodes': nodes,
            'block_height': block_height,
            'accounts': accounts,
            'peak_tx': peak_tx,
            'today_tx': today_tx,
            'tx_num': tx_num
        }
        result['ethereum'] = {
            'nodes': 0,
            'block_height': 0,
            'accounts': None,
            'peak_tx': 0,
            'today_tx': 0,
            'tx_num': 0
        }
        result['hyperledger'] = {
            'nodes': 0,
            'block_height': 0,
            'accounts': None,
            'peak_tx': 0,
            'today_tx': 0,
            'tx_num': 0
        }

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_tps(request):

    try:
        qtime = int(time.time()) - 3600 * 8
        isTMBlock = Block.objects.filter(
            Q(timestamp__lte=qtime) & Q(timestamp__gt=(qtime - 60)))
        data = 0
        if isTMBlock.exists():
            for tx in list(
                    isTMBlock.values_list('transactionsCount', flat=True)):
                data += tx
        logger.info('one minute tx num: %s' % data)
        data /= 60

        isBlock = Block.objects.using("bsc").filter(
            Q(timestamp__lte=qtime) & Q(timestamp__gt=(qtime - 60)))
        bsc_data = 0
        if isBlock.exists():
            for tx in list(isBlock.values_list('transactionsCount',
                                               flat=True)):
                data += tx
        logger.info('one minute bsc num: %s' % data)
        bsc_data /= 60

        result = {
            "trias": {
                'rate': round(data / 100, 2),
                'value': round(data, 2)
            },
            "ethereum": {
                'rate': round(data / 100, 2),
                'value': round(data, 2)
            },
            "hyperledger": {
                'rate': 0,
                'value': 0
            }
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_faulty_nodes(request):

    try:
        faulty_nodes_num = Node.objects.filter(status=1).count()
        all_nodes_num = Node.objects.count()
        eth_faulty_num = Node.objects.using("bsc").filter(status=1).count()
        all_eth_num = Node.objects.using("bsc").count()
        result = {
            "trias": {
                'rate': round(faulty_nodes_num / all_nodes_num, 2),
                'value': faulty_nodes_num
            },
            "ethereum": {
                'rate': round(eth_faulty_num / all_eth_num, 2),
                'value': eth_faulty_num
            },
            "hyperledger": {
                'rate': 0,
                'value': 0
            }
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_fault_accetpance_rate(request):

    try:
        nodes_num = Node.objects.count()
        faulty_nodes_num = Node.objects.filter(status=1).count()
        # TODO: 朝明组提供公式，webserver计算
        result = {
            "trias": {
                'rate': 0.3,
                'value': 30
            },
            "ethereum": {
                'rate': 0.5,
                'value': 50
            },
            "hyperledger": {
                'rate': 0,
                'value': 0
            }
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_data_monitoring(request):

    result = {
        "faulty_nodes_list": {
            "trias": {},
            "ethereum": {},
            "hyperledger": {}
        },
        "fault_accetpance_rate": {
            "trias": {},
            "ethereum": {},
            "hyperledger": {}
        },
        "tps_monitoring": {
            "trias": {},
            "ethereum": {},
            "hyperledger": {}
        }
    }

    try:
        now = datetime.datetime.now()
        end_timestamp = int(
            time.mktime(now.replace(second=0, microsecond=0).timetuple()))
        timestamp_list = [end_timestamp - 60 * i for i in range(11)][::-1]
        result_time = timestamp_list[:-1]
        result_tps = []
        event_list = []

        # get tps and event_list
        for tmp in range(len(timestamp_list) - 1):
            tx_nums = Block.objects.filter(
                Q(timestamp__gte=(timestamp_list[tmp] - 3600 * 8))
                & Q(timestamp__lt=(timestamp_list[tmp + 1] -
                                   3600 * 8))).aggregate(
                                       tx_nums=Count('transactionsCount'))
            result_tps.append(tx_nums['tx_nums'])

            activity_query = Activity.objects.filter(
                Q(time__gte=timestamp_list[tmp])
                & Q(time__lt=(timestamp_list[tmp + 1]))).order_by('time')
            activity = -1
            if activity_query.exists():
                for type in list(activity_query.values_list('type',
                                                            flat=True)):
                    if type == 1 or type == 4:
                        activity = type
                        break
            event_list.append(activity)

        # get faulty nodes
        result_faulty_nodes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        abnormal_nodes = AbnormalNode.objects.filter(
            timestamp__gte=timestamp_list[0]).order_by('id').values()
        for abnormal_node in abnormal_nodes:
            timestamp = abnormal_node.timestamp
            result_faulty_nodes[result_time.index(
                timestamp)] = abnormal_node.count

        result_fault_accetpance_rate = [
            0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3
        ]

        result['faulty_nodes_list']['event_list'] = event_list
        result['faulty_nodes_list']['trias']['time'] = result_time
        result['faulty_nodes_list']['trias']['value'] = result_faulty_nodes
        result['faulty_nodes_list']['ethereum']['time'] = result_time
        result['faulty_nodes_list']['ethereum']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
        result['faulty_nodes_list']['hyperledger']['time'] = result_time
        result['faulty_nodes_list']['hyperledger']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]

        result['fault_accetpance_rate']['event_list'] = event_list
        result['fault_accetpance_rate']['trias']['time'] = result_time
        result['fault_accetpance_rate']['trias'][
            'value'] = result_fault_accetpance_rate
        result['fault_accetpance_rate']['ethereum']['time'] = result_time
        result['fault_accetpance_rate']['ethereum']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
        result['fault_accetpance_rate']['hyperledger']['time'] = result_time
        result['fault_accetpance_rate']['hyperledger']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]

        result['tps_monitoring']['event_list'] = event_list
        result['tps_monitoring']['trias']['time'] = result_time
        result['tps_monitoring']['trias']['value'] = result_tps
        result['tps_monitoring']['ethereum']['time'] = result_time
        result['tps_monitoring']['ethereum']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
        result['tps_monitoring']['hyperledger']['time'] = result_time
        result['tps_monitoring']['hyperledger']['value'] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]

        status = 'success'

    except Exception as e:
        logger.error(e)
        status = 'failure'

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_hardware_specifications(request):

    try:
        hardware = Hardware.objects.last()
        result = {
            "CPU": hardware.cpu,
            "GPU": hardware.gpu,
            "Motherboard": hardware.motherboard,
            "RAM": hardware.ram,
            "SSD": hardware.ssd
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def get_nodes_num(request):

    try:
        all_nodes_num = Node.objects.count()
        fault_nodes_num = Node.objects.filter(status=1).count()
        status = 'success'
        result = {
            'all_nodes_num': all_nodes_num,
            'fault_nodes_num': fault_nodes_num
        }
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def send_transaction(request):
    try:
        content = request.POST.get('content', '')
        if not content:
            return JsonResponse({
                'status': 'failure',
                'result': 'parameter error'
            })
        if len(content) > 255:
            return JsonResponse({
                'status':
                'failure',
                'result':
                'the maximum length of the characters is 255'
            })

        id = str(uuid.uuid1())
        sha256 = hashlib.sha256()
        sha256.update(id.encode('utf-8'))
        sha256_id = sha256.hexdigest()
        t = threading.Thread(target=send_transaction_util,
                             args=[sha256_id, content])
        t.start()
        logger.info('create transaction sha256_id %s' % sha256_id)
        status, result = 'success', {'id': sha256_id}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', 'connect error'

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def query_transactions_status(request):
    try:
        id = request.GET.get('id', '')
        if (not id) or (len(id) != 64):
            return JsonResponse({
                'status': 'failure',
                'result': 'parameter error'
            })

        transaction_log = TransactionLog.objects.filter(trias_hash=id)
        if not transaction_log.exists():
            return JsonResponse({
                'status': 'pending',
                'result': 'trade not exists'
            })

        tx = transaction_log[0]
        id = tx.trias_hash
        hash = tx.hash
        block_height = tx.block_heigth
        content = tx.content
        log = tx.log
        result = {
            'id': id,
            'hash': hash,
            'block_height': block_height,
            'content': content,
            'log': log
        }
        if tx.status == 0:
            # tx success
            status = 'tx_success'
        else:
            status = 'tx_failure'

    except Exception as e:
        logger.error(e)
        status, result = 'failure', 'connect error'

    return JsonResponse({'status': status, 'result': result})


# @ratelimit(key='ip', rate='30/m', block=True)
def query_transactions(request):
    try:
        hash = request.GET.get('hash', '')
        if (not hash) or (len(hash) != 64):
            return JsonResponse({
                'status': 'failure',
                'result': 'parameter error'
            })

        status, result = 'failure', 'Tx (%s) not found' % hash
        # get from DB
        transaction_log = TransactionLog.objects.filter(hash=hash)
        if transaction_log.exists():
            tx = transaction_log[0]
            block_height = tx.block_heigth
            content = tx.content
            status, result = 'success', {
                'hash': hash,
                'block_height': block_height,
                'content': content
            }

        # get from BlockChain
        else:
            nodes = list(
                Node.objects.filter(
                    status=0).order_by('-block_heigth').values_list('node_ip',
                                                                    flat=True))
            params = {'hash': '0x%s' % hash}
            for node_ip in nodes:
                base_url = "http://%s:%s/tri_block_tx" % (
                    node_ip, jc.data["tm"]["node_list"][0]['port'])
                response = url_data(base_url, params)
                if response:
                    if 'error' not in response:
                        block_height = response['result']['height']
                        content = base64.b64decode(
                            response['result']['tx']).decode()[12:]
                        status, result = 'success', {
                            'hash': hash,
                            'block_height': block_height,
                            'content': content
                        }
                    else:
                        status, result = 'failure', response['error']
                    break
                else:
                    continue

    except Exception as e:
        logger.error(e)
        status, result = 'failure', 'connect error'

    return JsonResponse({'status': status, 'result': result})
