import { ThousandSeparatorPipe } from './thousand-seperator.pipe';

describe('ThousandSeparatorPipe', () => {
  it('create an instance', () => {
    const pipe = new ThousandSeparatorPipe();
    expect(pipe).toBeTruthy();
  });
});
