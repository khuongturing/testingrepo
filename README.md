# Wajed B. Isleem Turing BackEnd Challenge

## Online Hosted link
  * http://195.154.29.201:88/

## API documentation :
  * https://documenter.getpostman.com/view/7123985/SVSPonAf

## Postman Api collection
  * https://www.getpostman.com/collections/5895e0d99564a8ddf465
  
## Advanced requirements
  ### The current system can support 100,000 daily active users. How do you design a new system to support 1,000,000 daily active users?
  * Using `cluster` package and `fork` function, I implemented it in `master.js`.
  * Run `npm run master` to start the app in cluster mode to support 1,000,000 daily active users.
