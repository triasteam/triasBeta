"""
Index message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from app_views.models import Block, Node, Transaction, Activity, Hardware
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration, ActivityConfiguration
from app_views.view_utils.logger import logger
from app_views.view_utils.redis_util import get_monitoring

jc = JsonConfiguration()
ac = ActivityConfiguration()


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
            event_list = cal(0,ac_length)
            current_index = 0
        elif next_event_index == None:
            # everything happened
            event_list = cal(0,ac_length)
            current_index = ac_length
        else:
            happened_list = cal(0,next_event_index)
            unhappen_list = cal(next_event_index,ac_length)
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
        now_second = int(now_str_list[0])*60*60 + int(now_str_list[1])*60 + int(now_str_list[2])
        start_second = int(start_time_list[0])*60*60 + int(start_time_list[1])*60 + int(start_time_list[2])

        event_list.append({'name': item['name'], 'start': item['start'], 'interval': abs(now_second - start_second)})

    return event_list


def get_visualization(request):
    result =  {
        "trias": {
            "links": [ {"source": 0, "target": 2}, {"source": 2, "target": 1},
                       {"source": 0, "target": 4}, {"source": 4, "target": 1},
                       {"source": 1, "target": 0}, {"source": 0, "target": 3}],

            "nodes": [ {"node_ip": "192.168.1.178", "status": "0"}, {"node_ip": "192.168.1.206", "status": "1"},
                       {"node_ip": "192.168.1.207", "status": "0"}, {"node_ip": "192.168.1.208", "status": "1"},
                       {"node_ip": "192.168.1.209", "status": "0"}]   # 0 正常    1 异常
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

    return JsonResponse({'status': 'success', 'result': result})


def get_instant_message(request):

    try:
        result = {}
        nowtime = int(time.time())
        activity_list = list(Activity.objects.filter(time__gte=nowtime-10).order_by('-time').values())
        normal_nodes = list(Node.objects.filter(status=0).values_list('node_ip', flat=True))
        fault_nodes = list(Node.objects.filter(status=1).values_list('node_ip', flat=True))

        status = 'success'
        result['node_time'] = nowtime
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
        tps = 1  # 1 即 100%
        result = {
            "trias": {'rate': 0.3, 'value': 370},
            "ethereum": {'rate': 0, 'value': 0},
            "hyperledger": {'rate': 0, 'value': 0}
        }
        status = 'success'
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})


def get_faulty_nodes(request):

    try:
        faulty_nodes_num = Node.objects.filter(status=1).count()
        all_nodes_num = Node.objects.count()
        result = {
            "trias": {'rate': round(faulty_nodes_num/all_nodes_num, 2), 'value': faulty_nodes_num},
            "ethereum": {'rate': 0, 'value': 0},
            "hyperledger": {'rate': 0, 'value': 0}
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
            "trias": {'rate': 0.3, 'value': 30},
            "ethereum": {'rate': 0, 'value': 0},
            "hyperledger": {'rate': 0, 'value': 0}
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

            # Get recent events
            event_list = []
            for item in a_x_time:
                activity_query = Activity.objects.filter(time__gte=item).order_by('time')
                activity = -1
                if activity_query.exists():
                    activity = activity_query[0].type
                event_list.append(activity)

            result['faulty_nodes_list']['event_list'] = event_list
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

            # Get recent events
            event_list = []
            for item in b_x_time:
                activity_query = Activity.objects.filter(time__gte=item).order_by('time')
                activity = -1
                if activity_query.exists():
                    activity = activity_query[0].type
                event_list.append(activity)

            result['fault_accetpance_rate']['event_list'] = event_list
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

            # Get recent events
            event_list = []
            for item in c_x_time:
                activity_query = Activity.objects.filter(time__gte=item).order_by('time')
                activity = -1
                if activity_query.exists():
                    activity = activity_query[0].type
                event_list.append(activity)

            result['tps_monitoring']['event_list'] = event_list
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


def get_nodes_num(request):

    try:
        all_nodes_num = Node.objects.count()
        fault_nodes_num = Node.objects.filter(status=1).count()
        status = 'success'
        result = {'all_nodes_num': all_nodes_num, 'fault_nodes_num': fault_nodes_num}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})
