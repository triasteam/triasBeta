"""
Node list message
"""

from django.http import JsonResponse
from django.core.paginator import Paginator
# from ratelimit.decorators import ratelimit
from app_views.models import Node
from app_views.view_utils.logger import logger
from app_views.view_utils.localconfig import get_node_show

node_show = get_node_show()


# @ratelimit(key='ip', rate='30/m', block=True)
def get_node_list(request):

    try:
        chain_type = request.GET.get('chain_type', 'tm')
        node_status = request.GET.get('status', '')
        search = request.GET.get('search', '')
        page = int(request.GET.get('curr_page', 1))
        size = int(request.GET.get('page_size', 10))
        if chain_type == "bsc":
            nodes = Node.objects.using("bsc").all().order_by('-block_heigth', '-status', 'id')
        else:
            nodes = Node.objects.all().order_by('-block_heigth', '-status', 'id')


        if node_status:
            nodes = nodes.filter(status=node_status)

        if search:
            nodes = nodes.filter(show_ip__contains=search)

        # paging
        paginator = Paginator(nodes, size)
        if page > paginator.num_pages:
            page = 1
        nodes_list = list(paginator.page(page).object_list.values())
        for node in nodes_list:
            node['node_ip'] = node_show[node['node_ip']]

        status, result = 'success', {'nodes_list': nodes_list, 'num': len(nodes_list),
                                     'page': page, 'total_page': paginator.num_pages}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})
