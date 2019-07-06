# The current system can support 100,000 daily active users. How do you design a new system to support 1,000,000 daily active users?

Although there are multiple solutions to scaling, I'll provide the methods that I have used while scaling servers at Tesco.

1. Cache: Use `redis` or `memcached` to support distributed caching.

2. Database cluster: Use a sharded MySql cluster instead of a single instance.

3. Cloning application servers: Since each node process runs on a single core of the CPU, spawn multiple instances of the same server on a single machine with multiple cores. [PM2](http://pm2.keymetrics.io/) provides this out of the box.

4. Dynamic scaling: Use CPU and memory metrics to spawn new machines automatically when usage reaches a certain threshold. AWS provides auto scaling where new ec2 containers are launched when certain thresholds are reached.

5. Micro services: Break up each each group of routes into seperate node apps with a dedicated database. For instance, `ProductRoutes` would be a seperate node server with a seperate database instance containing the `Products` table.
   
  My first major programming task at my first company was to build an orchestration layer over existing microservices.
  The layer recieves the request from a client, calls the appropriate microservices in the correct order, aggregates the results and responds back to the client.

  Although this worked reasonable well, the orchestration layer had too much complexity as it had to know the complete details of all microservices.

  A better option would have been to use a message broker (pub/sub) to communicate between microservices. There is no God service (orchestration layer) that has to know all the details of each microservice in this pattern.


# A half of the daily active users comes from United States. How do you design a new system to handle this case?

I'm not too sure of this. The only method I've used to handle localized requests was to deploy all our servers closest to our customers to reduce network latency.
