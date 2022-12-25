describe('password hasher service', () => {
  const passwordHasherSvc = new PasswordHasherSvc();
  it('should hash a password', () => {
    // given
    const password = '123Soleil';
    // when
    const hash: string = passwordHasherSvc.hash(password);

    // then
    expect(hash).toBe('&é"');
  });
});
