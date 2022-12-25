import { CustomerRequest } from '../presentation/CustomerRequest';
import { CustomerService } from './Customer.service';
import { CustomerResource } from './Customer.resource';
import { PasswordRepositoryMemory } from '../infrastructure/Password.repository.memory';
import { Password } from '../domain/Password';

describe('customer service', () => {
  const connectionMock = initConnectionMock();
  const passwordRepository = new PasswordRepositoryMemory();
  const customerService = new CustomerService(connectionMock, null, null);
  it('should create a customer', async () => {
    // given
    const customerRequest: CustomerRequest = new CustomerRequest('Sam', 'bankman@fried.com', '123Soleil');
    // when
    const customerResource: CustomerResource = await customerService.createCustomer(customerRequest);
    // then
    expect(customerResource).toBeInstanceOf(CustomerResource);
    expect(customerResource.id).toHaveLength(36);
    expect(customerResource.name).toBe('Sam');
    expect(customerResource.email).toBe('bankman@fried.com');

    const password: Password = await passwordRepository.get(customerResource.id);

    expect(password.CustomerId).toBe(customerResource.id);
    expect(password.HashedPassword).toHaveLength(60);
  });
});

export function initConnectionMock(): any {
  const connectionMock = {} as any;
  const sessionMock = {} as any;
  connectionMock.startSession = jest.fn().mockReturnValue(sessionMock);
  sessionMock.startTransaction = jest.fn().mockReturnValue({});
  sessionMock.commitTransaction = jest.fn().mockReturnValue({});
  sessionMock.endSession = jest.fn().mockReturnValue({});
  return connectionMock;
}
