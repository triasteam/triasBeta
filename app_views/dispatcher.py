"""
# middleware for dispatch url
"""

from django.shortcuts import render


class QtsAuthentication(object):
    def process_request(self, request):
        if 'api' in request.path:
            pass
        else:
            return render('index.html')
