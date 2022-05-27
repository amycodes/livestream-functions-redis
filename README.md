# Working with DBaaS Redis Instance

## Introduction

A serverless functions project to interact with a DBaaS Redis instance. This provides a Redis command line interface
for your Redis instance to list keys, set/get/delete a key, expire a key or flush the Redis store. The list of available
commands is available [here](/packages/redis/cli/cli.js#L102-L108).

You can deploy it as DigitalOcean Functions project.
Documentation is available at https://docs.digitalocean.com/products/functions.

### Requirements

* You need a DigitalOcean account. If you don't already have one, you can sign up at [https://cloud.digitalocean.com/registrations/new](https://cloud.digitalocean.com/registrations/new).
* You will also need the [DigitalOcean `doctl` CLI](https://github.com/digitalocean/doctl/releases).

## Deploying the Function

```
# clone this repo
git clone git@github.com:digitalocean/functions-redis.git
```

```
# deploy the project
> doctl serverless deploy functions-redis
Deploying 'functions-redis'
  to namespace 'fn-...'
  on host 'https://faas-...'
...
Deployed functions ('doctl sls fn get <funcName> --url' for URL):
  - redis/cli
```

##### Set a key
```bash
doctl serverless functions invoke redis/cli -p command:set -p key:mykey -p value:myval
```
```json
{
  "value": "OK"
}
```

##### List all keys
```bash
doctl serverless functions invoke redis/cli -p command:keys
```
```json
{
  "value": [
    "mykey"
  ]
}
```

##### Get a key
```bash
doctl serverless functions invoke redis/cli -p command:get -p key:mykey
```
```json
{
  "value": "myval"
}
```

##### Flush all keys
```bash
doctl serverless functions invoke redis/cli -p command:flush -p flush:true
```
```json
{
  "value": true
}
```

Note the CLI command can be abbreviated as `doctl sls fn invoke redis/cli`.
