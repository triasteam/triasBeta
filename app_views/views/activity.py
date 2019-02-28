"""
Activity list message
"""
import time
import datetime
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
from app_views.models import Activity
from app_views.view_utils.block_util import stamp2datetime
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger


def get_activity_list(request):

    group = request.GET.get('group', '')
    search = request.GET.get('search', '')
    start = request.GET.get('start', 0)
    end = request.GET.get('end', 4704624000)
    page = request.GET.get('page', 1)
    size = request.GET.get('size', 10)

    try:
        activities = Activity.objects.filter(Q(time__gte=start) & Q(time__lte=end)).order_by('-time')

        if group:
            activities = activities.filter(group=group)

        if search:
            activities = activities.filter(event__icontains=search)

        # paging
        paginator = Paginator(activities, size)
        if page > paginator.num_pages:
            page = 1
        activities_list = list(paginator.page(page).object_list.values())

        status, result = 'success', {'activities_list': activities_list, 'num': len(activities_list),
                                     'page': page, 'total_page': paginator.num_pages}
    except Exception as e:
        logger.error(e)
        status, result = 'failure', {}

    return JsonResponse({'status': status, 'result': result})