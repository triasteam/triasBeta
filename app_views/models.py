from django.db import models

# Create your models here.


class Node(models.Model):
    node_ip = models.CharField(unique=True, max_length=255)
    block_heigth = models.BigIntegerField(default=0)
    latest_block_hash = models.CharField(max_length=255, default='x000000')
    latest_block_time = models.BigIntegerField(default=1517746076)
    status = models.IntegerField(default=0)  # 节点状态: 0正常 1异常
    pub_key = models.CharField(max_length=255)
    show_ip = models.CharField(unique=True, max_length=255)

    class Meta:
        db_table = "node_base_info"


class Block(models.Model):
    number = models.BigIntegerField(default=0)
    hash = models.CharField(max_length=255)
    tx_num = models.IntegerField(default=0)
    time = models.BigIntegerField()

    class Meta:
        db_table = "block"


class Transaction(models.Model):
    hash = models.CharField(max_length=255, default='x111111')
    time = models.BigIntegerField()
    block_hash = models.CharField(max_length=255)
    block_number = models.BigIntegerField()

    class Meta:
        db_table = "transaction"


class Activity(models.Model):
    group = models.IntegerField(default=0)  # 0 trias   1 eth    2 hyperledger
    type = models.IntegerField()  # 1 宕机   2 由于时间导致的天榜变更  3 由于攻击导致的天榜变更  4 Ddos攻击  5 节点变化
    time = models.BigIntegerField()
    event = models.CharField(max_length=255, default='')

    class Meta:
        db_table = "activity"


class Hardware(models.Model):
    cpu = models.CharField(max_length=255, default='')
    gpu = models.CharField(max_length=255, default='')
    motherboard = models.CharField(max_length=255, default='')
    ram = models.CharField(max_length=255, default='')
    ssd = models.CharField(max_length=255, default='')

    class Meta:
        db_table = "hardware_info"


class TransactionLog(models.Model):
    status = models.IntegerField(default=2)  # transaction status: 0 success  1 error
    trias_hash = models.CharField(max_length=255)
    hash = models.CharField(max_length=255, default='')
    block_heigth = models.BigIntegerField(default=0)
    content = models.TextField(default='')
    log = models.CharField(max_length=255, default='')
    time = models.BigIntegerField(default=0)

    class Meta:
        db_table = "transaction_log"
