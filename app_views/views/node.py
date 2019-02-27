"""
Node list message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
from app_views.models import Block, Node, Transaction
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger


def get_node_list(request):

    status = request.GET.get('status', '')
    page = request.GET.get('page', 1)
    size = request.GET.get('size', 10)

    try:
        if status == '':
            nodes = Node.objects.order_by('-block_heigth', '-status')
        else:
            nodes = Node.objects.filter(status=status).order_by('-block_heigth', '-status')

        # paging
        paginator = Paginator(nodes, size)
        if page > paginator.num_pages:
            page = 1
        nodes_list = list(paginator.page(page).object_list.values())

        status, result = 'success', {'nodes_list': nodes_list, 'num': len(nodes_list),
                                     'page': page, 'total_page': paginator.num_pages}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})
