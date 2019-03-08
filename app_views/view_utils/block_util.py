import time
import requests
import json
from requests.adapters import HTTPAdapter
from app_views.view_utils.logger import logger


def url_data(url, params=None):
    try:
        s = requests.Session()
        s.mount('http://', HTTPAdapter(max_retries=2))
        s.keep_alive = False
        response = s.get(url, params=params, headers={'Content-Type': 'application/json'},
                                 timeout=1)
        result = json.loads(response.text)
        return result
    except Exception as e:
        logger.error("%s: %s" % (url, e))
        return


def stamp2datetime(stamp):
    # stamp to date
    tl = time.localtime(int(stamp))
    format_time = time.strftime("%Y-%m-%d %H:%M:%S", tl)
    return format_time

