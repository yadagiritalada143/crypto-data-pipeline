# crypto-data-pipeline
Crypto currency data gathering solution using Hyperswarm RPC and Hypercores

# The Tether challenge

Create a simple crypto currency data gathering solution using Hyperswarm RPC and Hypercores.

The solution should fulfill these requirements:
- Data Collection
  - The data should be collected from coingecko public api
  - Collected data should include prices for top 5 crypto currencies (determined by coingecko) against USDt
  - Prices should be fetched from top 3 exchanges (determined by coingecko) and should calculate average price
- Data Preprocessing and Transformation
  - Ensure you store minimal data considering that dataset might grow large
  - Make sure you store necessary info about exchanges from which price is calculated
  - Handle data quality issues
- Data storage
  - The data should be stored using [Hypercore/Hyperbee databases](https://docs.pears.com/building-blocks/hypercore)
- Scheduling and Automation:
  - Implement a scheduling mechanism to run the data pipeline at regular intervals e.g. every 30s
  - Ensure the pipeline can be executed both on-demand and as a scheduled task
- Data exposure
  - Processed/stored data should be exposed via [Hypersawrm RPC](https://www.npmjs.com/package/@hyperswarm/rpc)
  - RPC methods should include:
    - getLatestPrices (pairs: string[])
    - getHistoricalPrices (pairs: string[], from: number, to: number)
  - Write a simple client demostrating an example for getting prices

Technical requirements:
- Code should be only in Javascript!
- There's no need for a UI!

Should not spend more time than 6-8 hours on the task. We know that its probably not possible to complete the task 100% in the given time.

If you don't get to the end, just write up what is missing for a complete implementation of the task. Also, if your implementation has limitation and issues, that's no big deal. Just write everything down and indicate how you could solve them, given there was more time.

Good luck!

## Tips

Useful resources:
- https://www.npmjs.com/package/@hyperswarm/rpc
- https://docs.holepunch.to/building-blocks/hyperbee
- https://docs.holepunch.to/building-blocks/hypercore
- https://docs.holepunch.to/building-blocks/hyperdht
- https://www.npmjs.com/package/hp-rpc-cli

### Example: simple RPC Server and Client

As first step you need to setup a private DHT network, to do this first install dht node package globally:
```
npm install -g hyperdht
```
Then run your first and boostrap node:
```
hyperdht --bootstrap --host 127.0.0.1 --port 30001
```

With this you have a new distrited hash table network that has boostrap node on 127.0.0.1:30001


## Below are the tasks which we have performed as a part of this development


### Part 01 - Initial Setup
- [x] Create node project
- [x] Install all the dependencies
- [x] Creted a server with name (rpcServer)
- [x] Create a demo key for coingecko to access the API's
- [x] Implement Logic to fetch the data from coingecko API's
- [x] Implement Logic to save the data in to DB

### Part 02 - Data Populating
- [x] Write a Logic to check if the data is populating to DB correctly or not. 
Note: For this we have implemented with name 'dbInspector.js'. Make sure to stop the server while running this file using the below command.
```bash
# Command to check all the entries in DB
node src/dbInspector.js
```

### Part 03 - Data Exposure
- [x] Write a Logic to Data exposure.
  - Used [Hypersawrm RPC](https://www.npmjs.com/package/@hyperswarm/rpc) to Process data
  - RPC methods implemented as below
    - getLatestPrices (pairs: string[])
    - getHistoricalPrices (pairs: string[], from: number, to: number)
- [x] Implemented a simple client demostrating for getting prices
Note: For this we have implemented with name 'rpcClient.js'. Make sure to run the server before running this file using the below command.
```bash
# Up and run hyperdht in new terminal 
hyperdht --bootstrap --host 127.0.0.1 --port 30001
```

```bash
# Up and run Server in new terminal 
node src/rpcServer.js
````


### Part 04 - Scheduling and Automation
- [x] Implement a scheduling mechanism to run the data pipeline at regular intervals e.g. every 30s
Note: For this we have implemented with name 'scheduler.js'. Make sure to stop the server before running this file.  Use the below command to run the scheduler.
```bash
# Command to run the scheduler to fetch the data
node scheduler.js
```

- [x] Ensure the pipeline can be executed on-demand
- [ ] Ensure the pipeline can be executed as a scheduled task
