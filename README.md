**本分支版仅本用于前端开发联调测试,后续会将其合并入其它分支**

### 安装依赖:

`pip3 install -r requirements.txt`

### 运行

```
python3 manage.py runserver --insecure
```

### 后端新增接口:

`api/general_static_bsc`

返回示例:

```
{"status": "success", "result": {"trias": {"nodes": 5, "block_height": 669, "accounts": 14, "peak_tx": 0, "today_tx": 0, "tx_num": 96}, "ethereum": {"nodes": 0, "block_height": 0, "accounts": null, "peak_tx": 0, "today_tx": 0, "tx_num": 0}, "hyperledger": {"nodes": 0, "block_height": 0, "accounts": null, "peak_tx": 0, "today_tx": 0, "tx_num": 0}}}
```

PS: 新增接口返回数据与原有接口`api/general_static`一致,当前后端`api/general_static_bsc`中的返回数据只提供了:

```json
"trias": {"nodes": 5, "block_height": 669, "accounts": 14, "peak_tx": 0, "today_tx": 0, "tx_num": 96}

```
以上数据可在返回示例中找到