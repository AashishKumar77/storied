import { getOS } from   './../../utils/getOS'
describe('Testcases for os', () => {
    it('match with windows', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return 'windows' // Return whatever you want here
        });
        expect(getOS()).toEqual('windows');
    });
    it('match with mac', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return 'Macintosh' // Return whatever you want here
        });
        expect(getOS()).toEqual('mac');
    });
    it('match with iPhone', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return 'iPhone' // Return whatever you want here
        });
        expect(getOS()).toEqual('iOS');
    });
    it('match with android', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return 'android' // Return whatever you want here
        });
        expect(getOS()).toEqual('android');
    });
    it('match with linux', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return 'linux' // Return whatever you want here
        });
        expect(getOS()).toEqual('linux');
    });
    it('match with default', () => {
        window.navigator['__defineGetter__']('userAgent', function(){
            return "anything" // Return whatever you want here
        });
        expect(getOS()).toEqual(null);
    });
});