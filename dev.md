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
### 后端调整接口：
- `api/tps/`

Response json返回列表中补充了ethereum字段数据，对应bsc链的数据，目前看前端已可展示

- api/data_monitoring
Response json返回列表中补充了ethereum字段数据,现在数据库还没数据暂不确定展示效果

- `api/faulty_nodes/`

Response json返回列表中补充了ethereum字段数据，对应bsc链的数据，目前看前端已可展示

- `api/fault_accetpance_rate/`

Response json返回列表中补充了ethereum字段数据，对应bsc链的数据，目前看前端已可展示



- `api/instant_message/`
添加GET请求的chain_type字段支持

新的请求示例如下：
`http://127.0.0.1:8000/api/instant_message/?chain_type=bsc`

返回示例:
```json
{"status": "success", "result": {"node_time": 1676280307, "normal_nodes": ["106.3.133.178", "106.3.133.179", "106.3.133.180", "210.73.218.171", "210.73.218.172", "101.251.223.190"], "fault_nodes": [], "event": []}}
```



- `api/node_list/`
添加GET请求的chain_type字段支持
新的请求示例如下：
`http://0.0.0.0:8000/api/node_list/?group=3&curr_page=1&page_size=10&chain_type=bsc&search=`

返回示例：
```json
{"status": "success", "result": {"nodes_list": [{"id": 75, "node_ip": "106.3.133.178", "block_heigth": 120875, "latest_block_hash": "0xe9d6fbaa92c062794ca8419bd1b4ea64dfc018616dafc7b309098bf3a9a8c694", "latest_block_time": 1676277717, "status": 0, "pub_key": "-", "show_ip": "192.168.1.221"}], "num": 1, "page": 1, "total_page": 1}}
```





以上数据可在返回示例中找到