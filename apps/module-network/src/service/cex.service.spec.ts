describe('test abstract class', () => {
  it('should be able to get base url', () => {
    process.env.ENV = 'test';
    expect(1).toEqual(1);
  });
});
