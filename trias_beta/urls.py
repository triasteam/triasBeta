"""trias_demo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  re_path(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  re_path(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  re_path(r'^blog/', include('blog.urls'))
"""
from django.urls import include, re_path

from django.views.generic import TemplateView
from django.contrib import admin
from app_views.views import index, node, activity

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='index.html')),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^api/event_list/', index.get_current_event),  # Current Event
    re_path(r'^api/visualization/', index.get_visualization),  # Visualization Data
    re_path(r'^api/general_static/', index.general_static),  # General Static
    re_path(r'^api/faulty_nodes/', index.get_faulty_nodes),  # Faulty Nodes
    re_path(r'^api/tps/', index.get_tps),  # TPS
    re_path(r'^api/fault_accetpance_rate/', index.get_fault_accetpance_rate),  # Fault Accetpance Rate
    re_path(r'^api/data_monitoring/', index.get_data_monitoring),  # Data Monitoring
    re_path(r'^api/instant_message/', index.get_instant_message),  # Instant Message
    re_path(r'^api/hardware_specifications/', index.get_hardware_specifications),  # Hardware Specifications
    re_path(r'^api/nodes_num/', index.get_nodes_num),  # Nodes Number
    re_path(r'^api/send_transaction/', index.send_transaction),  # Send Transaction
    re_path(r'^api/query_transactions_status/', index.query_transactions_status),  # Query Transactions Result
    re_path(r'^api/query_transactions/', index.query_transactions),  # Query Transactions

    re_path(r'^api/activity_list/', activity.get_activity_list),  # Activity List

    re_path(r'^api/node_list/', node.get_node_list),  # Node List
]
