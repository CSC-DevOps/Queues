Cache, Proxies, Queues
=========================

![build](https://travis-ci.org/CSC-DevOps/Queues.svg?branch=master)

### Setup

* Clone this repo and change directory to the repo.
* Pull `queues` virtual machine image which has the prerequisites you need for this workshop (nodejs, redis):
  ```
  bakerx pull CSC-DevOps/Images#Spring2020 queues
  ```
* Create a new virtual machine using the `queues` image:
  ```bash
  bakerx run queues queues --ip 192.168.44.80 --sync
  ```
* Run `bakerx ssh queues` to connect to the virtual machine.
* Go to the sync folder (this repo) and install npm dependencies:
  ```bash
  cd /bakerx
  npm install
  ```

### A simple web server

In this workshop we use [express](http://expressjs.com/) to make a simple web server:

```js
let server = app.listen(3000, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
})
```

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions. You can simply write back a response body:

```js
app.get('/', function(req, res) {
	res.send('hello world')
})
```

This functionality already exists in [main.js](./main.js).

### Redis

You will be using [redis server](http://redis.io/) and [node-redis client](https://github.com/mranney/node_redis) to build some simple infrastructure components:

```js
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1', {});
```

In general, you can run all the [redis commands](https://redis.io/commands) in the following manner: `client.CMD(args)`. For example:

```js
client.set("key", "value");
client.get("key", function(err,value){ console.log(value)});
```

### Task 1: An expiring cache

Create two routes, `/get` and `/set`.

When [`/set`](http://192.168.44.80:3000/set) is visited (i.e. GET request), set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the [EXPIRE](https://redis.io/commands/expire) command to make sure this key will expire in 10 seconds.

When [`/get`](http://192.168.44.80:3000/get) is visited (i.e. GET request), fetch that key, and send its value back to the client: `res.send(value)`.


### Task 2: Recent visited sites

Create a new route, `/recent`, which will display the most recently visited sites.

There is already a [global hook (middleware) setup](https://github.com/ssmirr/Queues/blob/7f45eb3d7a31a2638bab419acc3b021246ff91ce/main.js#L14-L21), which will allow you to see each site that is requested:

```js
app.use(function (req, res, next) {
  ...
```

Use [`LPUSH`](https://redis.io/commands/lpush), [`LTRIM`](https://redis.io/commands/ltrim), and[`LRANGE`](https://redis.io/commands/lrange) redis commands to store the most recent 5 sites visited, and return that to the client.

### Task 3: Cat picture uploads using queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

```bash
curl -F "image=@./img/morning.jpg" http://192.168.44.80:3000/upload
```

Have `/upload` store the images in a queue.  Have [`/meow`](http://192.168.44.80:3000/meow) display the most recent image to the client and *remove* the image from the queue. Note, this is more like a stack and you can use [`LPOP`](https://redis.io/commands/lpop) redis command to implement this functionality.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?

See [rpoplpush](http://redis.io/commands/rpoplpush)
