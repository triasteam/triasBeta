"""
Index message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from app_views.models import Block, Node, Transaction, Activity
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger
from app_views.view_utils.redis_util import get_monitoring

jc = JsonConfiguration()


def get_instant_message(request):

    try:
        result = {}
        nowtime = int(time.time())
        activity_list = list(Activity.objects.filter(time__gte=nowtime-10).order_by('-time').values())
        normal_nodes = list(Node.objects.filter(status=0).values_list('node_ip', flat=True))
        fault_nodes = list(Node.objects.filter(status=1).values_list('node_ip', flat=True))

        status = 'success'
        result['normal_nodes'] = normal_nodes
        result['fault_nodes'] = fault_nodes
        result['event'] = activity_list

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def general_static(request):

    try:
        # 节点总数
        nodes = Node.objects.count()
        # 交易总数
        tx_num = Transaction.objects.count()
        # 最新块高
        last_block = Block.objects.last()
        if not last_block:
            block_height = 0
        else:
            block_height = last_block.number

        # 今日交易总数
        today_start_time = int(time.mktime(datetime.datetime.fromtimestamp(time.time()).date().timetuple()))
        today_end_time = today_start_time + 86400 - 1
        today_tx = Transaction.objects.filter(Q(time__gte=today_start_time) & Q(time__lte=today_end_time)).count()

        # 交易峰值(Peak Tx) (前30s)的每个块里的最高交易数
        nowtime = int(time.time())
        start = today_start_time - 86400  # yesterday start timestamp
        end = today_start_time  # today start timestamp
        # >= 2019-02-26 00:00:00 & < 2019-02-27 00:00:00
        lastes_tx = list(Block.objects.filter(Q(time__gte=start) & Q(time__lt=end)).values_list('tx_num', flat=True))
        lastes_tx.append(0)
        peak_tx = max(lastes_tx)

        status = 'success'
        result = {}
        result['trias'] = {'nodes': nodes, 'block_height': block_height, 'accounts': None,
                           'peak_tx': peak_tx, 'today_tx': today_tx, 'tx_num': tx_num}
        result['ethereum'] = {'nodes': 0, 'block_height': 0, 'accounts': None,
                           'peak_tx': 0, 'today_tx': 0, 'tx_num': 0}
        result['hyperledger'] = {'nodes': 0, 'block_height': 0, 'accounts': None,
                           'peak_tx': 0, 'today_tx': 0, 'tx_num': 0}

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_tps(request):

    try:
        tps = 111
        result = {
            "trias": tps,
            "ethereum": 0,
            "hyperledger": 0
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_faulty_nodes(request):

    try:
        faulty_nodes_num = Node.objects.filter(status=1).count()
        result = {
            "trias": faulty_nodes_num,
            "ethereum": 0,
            "hyperledger": 0
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_fault_accetpance_rate(request):

    try:
        nodes_num = Node.objects.count()
        faulty_nodes_num = Node.objects.filter(status=1).count()
        # TODO: 朝明组提供公式，webserver计算
        result = {
            "trias": 1,
            "ethereum": 0,
            "hyperledger": 0
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_data_monitoring(request):

    result = {
        "faulty_nodes_list": {"trias": {}, "ethereum": {}, "hyperledger": {}},
        "fault_accetpance_rate": {"trias": {}, "ethereum": {}, "hyperledger": {}},
        "tps_monitoring": {"trias": {}, "ethereum": {}, "hyperledger": {}}
    }

    try:
        faulty_nodes_list, fault_accetpance_rate, tps_monitoring = get_monitoring()

        if faulty_nodes_list:
            new_faulty_nodes_list = [eval(i) for i in faulty_nodes_list]
            start_time = new_faulty_nodes_list[0]
            a_x_time = [(start_time-i*60) for i in range(7)][::-1]
            result['faulty_nodes_list']['trias']['time'] = a_x_time
            result['faulty_nodes_list']['trias']['value'] = new_faulty_nodes_list[1:][::-1]
            result['faulty_nodes_list']['ethereum']['time'] = a_x_time
            result['faulty_nodes_list']['ethereum']['value'] = [0,0,0,0,0,0,0]
            result['faulty_nodes_list']['hyperledger']['time'] = a_x_time
            result['faulty_nodes_list']['hyperledger']['value'] = [0,0,0,0,0,0,0,]

        if fault_accetpance_rate:
            new_fault_accetpance_rate = [eval(i) for i in fault_accetpance_rate]
            start_time = new_fault_accetpance_rate[0]
            b_x_time = [(start_time - i * 60) for i in range(7)][::-1]
            result['fault_accetpance_rate']['trias']['time'] = b_x_time
            result['fault_accetpance_rate']['trias']['value'] = new_fault_accetpance_rate[1:][::-1]
            result['fault_accetpance_rate']['ethereum']['time'] = b_x_time
            result['fault_accetpance_rate']['ethereum']['value'] = [0,0,0,0,0,0,0]
            result['fault_accetpance_rate']['hyperledger']['time'] = b_x_time
            result['fault_accetpance_rate']['hyperledger']['value'] = [0,0,0,0,0,0,0]

        if tps_monitoring:
            new_tps_monitoring = [eval(i) for i in tps_monitoring]
            start_time = new_tps_monitoring[0]
            c_x_time = [(start_time - i * 60) for i in range(7)][::-1]
            result['tps_monitoring']['trias']['time'] = c_x_time
            result['tps_monitoring']['trias']['value'] = new_tps_monitoring[1:][::-1]
            result['tps_monitoring']['ethereum']['time'] = c_x_time
            result['tps_monitoring']['ethereum']['value'] = [0,0,0,0,0,0,0]
            result['tps_monitoring']['hyperledger']['time'] = c_x_time
            result['tps_monitoring']['hyperledger']['value'] = [0,0,0,0,0,0,0]

        status = 'success'

    except Exception as e:
        logger.error(e)
        status = 'failure'

    return JsonResponse({'status': status, 'result': result})


def get_hardware_specifications(request):
    status = "success"
    result =  {
        "CPU": "xxxxxxx",
        "GPU": "xxxxxxx",
        "Motherboard": "xxxxxxx",
        "RAM": "xxxxxxx",
        "SSD": "xxxxxxx"
    }
    return JsonResponse({'status': status, 'result': result})
