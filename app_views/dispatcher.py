"""
# middleware for dispatch url
"""

from django.shortcuts import render


class QtsAuthentication(object):
    def __init__(self, get_response):
        self.get_response = get_response    
    def __call__(self, request):
        if 'api' in request.path:
            response = self.get_response(request)
            return response
        else:
            return render(request,'index.html')
