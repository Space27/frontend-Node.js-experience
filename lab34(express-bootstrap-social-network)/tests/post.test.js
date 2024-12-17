const addPost = require('../routes').post;

test('add small post', () => {
    expect(addPost(1, 'a').text).toBe('a');
});