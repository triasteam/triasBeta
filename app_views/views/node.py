"""
Node list message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from app_views.models import Block, Node, Transaction
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger


def get_node_list(request):
    try:
        status = request.GET.get('status', '')
        if status == '':
            nodes_list = list(Node.objects.values())
        else:
            nodes_list = list(Node.objects.filter(status=status).order_by('-block_heigth').values())
        status, result = 'success', {'nodes_list': nodes_list, 'num': len(nodes_list)}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})
