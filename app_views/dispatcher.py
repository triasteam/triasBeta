"""
# middleware for dispatch url
"""

from django.shortcuts import render


class QtsAuthentication(object):
    def __init__(self, get_response):
        self.get_response = get_response    
    def process_request(self, request):
        if 'api' in request.path:
            pass
        else:
            return render(request,'index.html')
