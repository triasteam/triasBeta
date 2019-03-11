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

    try:
        node_status = request.GET.get('status', '')
        search = request.GET.get('search', '')
        page = int(request.GET.get('curr_page', 1))
        size = int(request.GET.get('page_size', 10))

        nodes = Node.objects.all().order_by('-block_heigth', '-status')

        if node_status:
            nodes = nodes.filter(status=node_status)

        if search:
            nodes = nodes.filter(node_ip__contains=search)

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
