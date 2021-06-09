import {replaceOfString} from '../src/string';

test('replaceOfString article/:id => article/123', () => {
    expect(replaceOfString('article/:id', {':id': '123'})).toBe('article/123');
});
