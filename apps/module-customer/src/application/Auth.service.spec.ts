import { AuthService } from './Auth.service';
import { LoginRequest } from '../presentation/LoginRequest';
import { CustomerService } from './Customer.service';
import { initConnectionMock } from './Customer.service.spec';
import { CustomerRequest } from '../presentation/CustomerRequest';
import { JwtService } from '@nestjs/jwt';

describe('Auth Service', () => {
  const jwtService = new JwtService({ secret: 'secret' });
  const authService = new AuthService(jwtService, null, null);
  const connectionMock = initConnectionMock();
  const customerService = new CustomerService(connectionMock, null, null);

  it('should hash a password', () => {
    // given
    const password = '123Soleil';
    // when
    const hash: string = AuthService.hash(password);
    // then
    expect(hash).toHaveLength(60);
  });
  it('should login', async () => {
    // given
    const customerRequest: CustomerRequest = new CustomerRequest('Sam', 'sbf@ftx.com', '123Soleil');
    await customerService.createCustomer(customerRequest);
    const loginRequest: LoginRequest = new LoginRequest('sbf@ftx.com', '123Soleil');
    // when
    const jwt: string = await authService.login(loginRequest);
    // then
    expect(jwt).toHaveLength(193);
  });
  it('should fail to login', async () => {
    // given
    const customerRequest: CustomerRequest = new CustomerRequest('Sam', 'sbf2@ftx.com', '123Soleil');
    await customerService.createCustomer(customerRequest);
    const loginRequest: LoginRequest = new LoginRequest('sbf2@ftx.com', '123Pluie');

    // expoect to throw InvalidPasswordException
    await expect(authService.login(loginRequest)).rejects.toThrow('Invalid password');
  });
});
