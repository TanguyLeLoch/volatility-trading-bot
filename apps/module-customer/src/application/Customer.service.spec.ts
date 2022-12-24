import { CustomerRequest } from '../presentation/CustomerRequest';
import { PasswordHasherService } from './Password.hasher.service';
import { CustomerService } from './Customer.service';
import { CustomerRepositoryMemory } from '../infrastructure/customer.repository.memory';
import { CustomerResource } from './Customer.resource';
import { PasswordRepositoryMemory } from '../infrastructure/Password.repository.memory';

describe('customer service', () => {
  const passwordHasherService = new PasswordHasherService();
  const connectionMock = {} as any;
  const sessionMock = {} as any;
  connectionMock.startSession = jest.fn().mockReturnValue(sessionMock);
  sessionMock.startTransaction = jest.fn().mockReturnValue({});
  sessionMock.commitTransaction = jest.fn().mockReturnValue({});
  sessionMock.endSession = jest.fn().mockReturnValue({});

  const customerRepository = new CustomerRepositoryMemory();
  const passwordRepository = new PasswordRepositoryMemory();
  const customerService = new CustomerService(
    passwordHasherService,
    connectionMock,
    customerRepository,
    passwordRepository,
  );
  it('should create a customer', async () => {
    // given
    const customerRequest: CustomerRequest = new CustomerRequest('Sam', 'bankman@fried.com', '123Soleil');

    // when
    const customerResource: CustomerResource = await customerService.createCustomer(customerRequest);
    // then
    expect(customerResource).toBeInstanceOf(CustomerResource);
    expect(customerResource.Id).toHaveLength(36);
    expect(customerResource.Name).toBe('Sam');
    expect(customerResource.Email).toBe('bankman@fried.com');

    console.log(customerResource);
  });
});
