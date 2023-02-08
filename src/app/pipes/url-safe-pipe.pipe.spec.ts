import { UrlSafePipePipe } from './url-safe-pipe.pipe';

describe('UrlSafePipePipe', () => {
  it('create an instance', () => {
    const pipe = new UrlSafePipePipe(null);
    expect(pipe).toBeTruthy();
  });
});
