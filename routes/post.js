const router = require('express').Router();
const verify = require('./verifyToken')

/**
 * Sample route demonstrates that the route is protected. 
 * The route is protected by interception of middleware via the verify module
 */
router.get('/', verify, (req, res) => {
    res.json({posts: {title: 'My first post', description: 'Random data you should not access'}})
})

module.exports = router