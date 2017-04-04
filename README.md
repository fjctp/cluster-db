# cluster-db
In memory database for EMQ cluster

# Start
``` bash
npm install 
node server.js
```
server listens to 0.0.0.0:5000

# REST APIs
| Method | Path | Parameters | Action |
|---|---|---|---|
| GET | /master | None | Get master node name |
| GET | /nodes | None | Get cluster nodes name |
| POST | /nodes/:name | name | Add [name] to the database |
| DELETE | /nodes/:name | name | Remove [name] from the database |
