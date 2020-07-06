const axios = require('../util');

exports.addLikeByUserId = async obj => {
    const result = await axios.post('/api/addLikeByUserId', {
        ...obj
    }).then(res => res.data);
    return result;
}

exports.deleteLikeByArticleIdAndUserId = async (article_id, user_id) => {
    const result = await axios.post('/api/deleteLikeByArticleIdAndUserId', {
        article_id,
        user_id
    }).then(res => res.data);
    return result;
}

exports.queryLikesByArticleIdAndUserId = async (article_id, user_id ) => {
    const result = await axios.get('/api/queryLikesByArticleIdAndUserId', {
        params: {
            article_id,
            user_id
        }
    }).then(res => res.data);
    return result;
}

exports.queryLikesByArticleTypeAndUserId = async (type, user_id) => {
    const result = await axios.get('/api/queryLikesByArticleTypeAndUserId', {
        params: {
            type,
            user_id
        }
    }).then(res => res.data);
    return result;
}