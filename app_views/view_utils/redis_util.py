import redis
from app_views.view_utils.localconfig import JsonConfiguration
from app_views.view_utils.logger import logger

jc = JsonConfiguration()


def get_monitoring():
    try:
        redis_client = redis.Redis(jc.redis_ip, jc.redis_port)
        faulty_nodes_list = get_single_data(redis_client, 'faulty_nodes_list')
        fault_accetpance_rate = get_single_data(redis_client, 'fault_accetpance_rate')
        tps_monitoring = get_single_data(redis_client, 'tps_monitoring')
        return faulty_nodes_list, fault_accetpance_rate, tps_monitoring
    except Exception as e:
        logger.error(e)
    return []


def get_single_data(client, key):
    try:
        redis_saved_list_exist = client.llen(key)
        if redis_saved_list_exist == 8:
            return client.lrange(key, 0, -1)
    except Exception as e:
        logger.error(e)


if __name__ == '__main__':
    a,b,c = get_monitoring()
    print(a,b,c)
