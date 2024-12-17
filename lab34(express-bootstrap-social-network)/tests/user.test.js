const addUser = require('../routes').user;

test('add empty user', () => {
    expect(addUser(null, null)).toBe(-1);
});

test('add small user', () => {
    expect(addUser({name: 'n', email: 'e', birth: '2024-12-12'}, null, 1)).toBe(1);
});

test('add small user without id', () => {
    expect(addUser({name: 'n', email: 'e', birth: '2024-12-12'}, null)).toBe(11);
});