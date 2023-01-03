from django.db import models

# Create your models here.


class Node(models.Model):
    node_ip = models.CharField(unique=True, max_length=255)
    block_heigth = models.BigIntegerField(default=0)
    latest_block_hash = models.CharField(max_length=255, default='x000000')
    latest_block_time = models.BigIntegerField(default=1517746076)
    status = models.IntegerField(default=0)  # node status: 0 normal 1 abnormal
    pub_key = models.CharField(max_length=255)
    show_ip = models.CharField(unique=True, max_length=255)

    class Meta:
        db_table = "node_base_info"


class Block(models.Model):
    number = models.BigIntegerField(default=0)
    hash = models.CharField(max_length=255)
    transactionsCount = models.IntegerField(default=0)
    timestamp = models.BigIntegerField()

    class Meta:
        db_table = "block"


class Address(models.Model):
    number = models.BigIntegerField(default=0)
    balance = models.IntegerField(default=0)
    time = models.BigIntegerField()

    class Meta:
        db_table = "address"








class Transaction(models.Model):
    hash = models.CharField(max_length=255, default='x111111')
    timestamp = models.BigIntegerField()
    blockHash = models.CharField(max_length=255)
    blockNumber = models.BigIntegerField()

    class Meta:
        db_table = "transaction"


class Activity(models.Model):
    group = models.IntegerField(default=0)  # 0 trias  1 eth  2 hyperledger
    type = models.IntegerField()
    # 1 power down  2 ranking change for time  3 ranking change for attack  4 Ddos attack  5 node status change
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


class AbnormalNode(models.Model):
    count = models.IntegerField(default=0)
    timestamp = models.BigIntegerField(default=1517746076)

    class Meta:
        db_table = "abnormal_node_log"


