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
from app_views.views import index, node, activity

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^admin/', admin.site.urls),
    url(r'^api/event_list/', index.get_current_event),  # Current Event
    url(r'^api/visualization/', index.get_visualization),  # Visualization Data
    url(r'^api/general_static/', index.general_static),  # General tm Static
    url(r'^api/general_static_bsc/', index.general_static_bsc),  # General bsc Static
    url(r'^api/faulty_nodes/', index.get_faulty_nodes),  # Faulty Nodes
    url(r'^api/tps/', index.get_tps),  # TPS
    url(r'^api/fault_accetpance_rate/', index.get_fault_accetpance_rate),  # Fault Accetpance Rate
    url(r'^api/data_monitoring/', index.get_data_monitoring),  # Data Monitoring
    url(r'^api/instant_message/', index.get_instant_message),  # Instant Message
    url(r'^api/hardware_specifications/', index.get_hardware_specifications),  # Hardware Specifications
    url(r'^api/nodes_num/', index.get_nodes_num),  # Nodes Number
    url(r'^api/send_transaction/', index.send_transaction),  # Send Transaction
    url(r'^api/query_transactions_status/', index.query_transactions_status),  # Query Transactions Result
    url(r'^api/query_transactions/', index.query_transactions),  # Query Transactions

    url(r'^api/activity_list/', activity.get_activity_list),  # Activity List

    url(r'^api/node_list/', node.get_node_list),  # Node List
]
