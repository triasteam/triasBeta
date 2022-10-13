"""
# middleware for dispatch url
"""

from django.shortcuts import render
import threading
request_cfg = threading.local()

class QtsAuthentication(object):
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        if 'api' not in request.path:
            return render(request,'index.html')

        db_name =  request.GET.get('chain','default')
        if db_name not in ('default','tm'):
            db_name = 'default'
        request_cfg.db = db_name

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response
