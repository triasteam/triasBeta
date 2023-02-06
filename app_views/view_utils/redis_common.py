from app_views.view_utils.localconfig import JsonConfiguration
import redis
from app_views.view_utils.logger import logger


jc = JsonConfiguration()

def init_redis_config(**kwargs):
    host = jc.data["tm"]["redis_ip"]
    port = jc.data["tm"]["redis_port"]
    password = jc.data["tm"]["redis_password"]
    if type(host) == list:
        from rediscluster import RedisCluster
        startup_nodes = []
        for index, host in enumerate(host):
            item = {}
            item["host"] = host
            item["port"] = port[index]
        startup_nodes.append(item)
        redis_password = password
        redis_conn = RedisCluster(startup_nodes=startup_nodes, password=redis_password, **kwargs)
        return redis_conn

    elif type(host) == str:
        redis_conn = redis.Redis(
            host,
            port,
            password=password)
        return redis_conn

    else:
        logger.error("init_redis_config config error: {} {}".format(type(host), port))


def get_redis_connection(**kwargs):
    redis_conn = init_redis_config(**kwargs)
    return redis_conn

