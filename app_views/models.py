from django.db import models

# Create your models here.


class Node(models.Model):
    node_ip = models.CharField(unique=True, max_length=255)
    block_heigth = models.BigIntegerField(default=0)
    latest_block_hash = models.CharField(max_length=255, default='x000000')
    latest_block_time = models.BigIntegerField(default=1517746076)
    status = models.IntegerField(default=0)  # 节点状态: 0正常 1异常

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
