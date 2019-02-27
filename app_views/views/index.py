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
        now = int(time.time())
        lastes_tx = list(Block.objects.filter(Q(time__gte=(now-30)) & Q(time__lte=now)).values_list('tx_num', flat=True))
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


