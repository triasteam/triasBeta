"""
Activity list message
"""
from django.http import JsonResponse
from django.db.models import Q
from django.core.paginator import Paginator
# from ratelimit.decorators import ratelimit
from app_views.models import Activity
from app_views.view_utils.logger import logger


# @ratelimit(key='ip', rate='30/m', block=True)
def get_activity_list(request):

    try:
        group = int(request.GET.get('group', 3))
        search = request.GET.get('search', '')
        start = int(request.GET.get('start', 0))//1000
        end = int(request.GET.get('end', 4704624000000))//1000
        page = int(request.GET.get('curr_page', 1))
        size = int(request.GET.get('page_size', 10))
        activities = Activity.objects.filter(Q(time__gte=start) & Q(time__lte=end)).order_by('-time')

        if group and (group != 3):
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