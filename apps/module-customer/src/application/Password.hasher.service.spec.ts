import { PasswordHasherService } from './Password.hasher.service';

describe('password hasher service', () => {
  const passwordHasherSvc = new PasswordHasherService();
  it('should hash a password', () => {
    // given
    const password = '123Soleil';
    // when
    const hash: string = passwordHasherSvc.hash(password);

    // then
    expect(hash).toBe('&é"');
  });
});
