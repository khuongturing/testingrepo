import cache from 'memory-cache';

const memCache = new cache.Cache();

const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        const key = '__express__' + req.originalUrl || req.url
        const cacheContent = memCache.get(key);
        if (cacheContent) {
            res.send(cacheContent);
            return
        } else {
            res.sendResponse = res.json
            res.json = (body) => {
                memCache.put(key, body, duration * 1000);
                res.sendResponse(body)
            }
            next()
        }
    }
}

export default cacheMiddleware;
