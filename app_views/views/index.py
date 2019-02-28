"""
Index message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from app_views.models import Block, Node, Transaction
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger
from app_views.view_utils.redis_util import get_monitoring

jc = JsonConfiguration()


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
        result = {'nodes': nodes, 'block_height': block_height, 'accounts': None,
                  'peak_tx': peak_tx, 'today_tx': today_tx, 'tx_num': tx_num}

    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_faulty_nodes(request):

    try:
        faulty_nodes_num = Node.objects.filter(status=1).count()
        status, result = 'success', {'faulty_nodes_num': faulty_nodes_num}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_fault_accetpance_rate(request):

    try:
        nodes_num = Node.objects.count()
        faulty_nodes_num = Node.objects.filter(status=1).count()
        # TODO: 朝明组提供公式，webserver计算
        status, result = 'success', {'fault_accetpance_rate': 1}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_data_monitoring(request):

    result = {
        "faulty_nodes_list": {"time": [], "value": []},
        "fault_accetpance_rate": {"time": [], "value": []},
        "tps_monitoring": {"time": [], "value": []}
    }

    try:
        faulty_nodes_list, fault_accetpance_rate, tps_monitoring = get_monitoring()

        if faulty_nodes_list:
            new_faulty_nodes_list = [eval(i) for i in faulty_nodes_list]
            start_time = new_faulty_nodes_list[0]
            a_x_time = [(start_time-i*60) for i in range(7)]
            result['faulty_nodes_list']['time'] = a_x_time[::-1]
            result['faulty_nodes_list']['value'] = new_faulty_nodes_list[1:][::-1]

        if fault_accetpance_rate:
            new_fault_accetpance_rate = [eval(i) for i in fault_accetpance_rate]
            start_time = new_fault_accetpance_rate[0]
            b_x_time = [(start_time - i * 60) for i in range(7)]
            result['fault_accetpance_rate']['time'] = b_x_time[::-1]
            result['fault_accetpance_rate']['value'] = new_fault_accetpance_rate[1:][::-1]

        if tps_monitoring:
            new_tps_monitoring = [eval(i) for i in tps_monitoring]
            start_time = new_tps_monitoring[0]
            c_x_time = [(start_time - i * 60) for i in range(7)]
            result['tps_monitoring']['time'] = c_x_time[::-1]
            result['tps_monitoring']['value'] = new_tps_monitoring[1:][::-1]

        status = 'success'

    except Exception as e:
        logger.error(e)
        status = 'failure'

    return JsonResponse({'status': status, 'result': result})
