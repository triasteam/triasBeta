"""trias_demo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.views.generic import TemplateView
from django.contrib import admin
from app_views.views import index, node

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/general_static/', index.general_static),  # General Static
    url(r'^api/faulty_nodes/', index.get_faulty_nodes),  # Faulty Nodes
    url(r'^api/fault_accetpance_rate/', index.get_fault_accetpance_rate),  # Fault Accetpance Rate
    url(r'^api/data_monitoring/', index.get_data_monitoring),  # Data Monitoring

    url(r'^api/node_list/', node.get_node_list),  # Node List
]
