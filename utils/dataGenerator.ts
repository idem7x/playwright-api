import { faker } from '@faker-js/faker';
import type {CreateUserRequest, UserGender} from 'types/userTypes';

export class DataGenerator {
  static generateEmail(options?: {
    firstName?: string;
    lastName?: string;
    provider?: string;
  }): string {
    const timestamp = Date.now();
    const random = faker.string.alphanumeric(6);

    if (options?.firstName && options?.lastName) {
      return `${options.firstName}.${options.lastName}.${timestamp}.${random}@${options?.provider || 'test.com'}`.toLowerCase();
    }

    return faker.internet.email({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      provider: options?.provider || 'test.com'
    }).replace('@', `.${timestamp}.${random}@`);
  }

  static generateInvalidEmail(): string {
    const invalidFormats = [
      faker.person.firstName().toLowerCase(), // no @ or domain
      `${faker.person.firstName()}@`, // no domain
      `@${faker.internet.domainName()}`, // no local part
      `${faker.person.firstName()} ${faker.person.lastName()}@test.com`, // spaces
      `${faker.person.firstName()}@@${faker.internet.domainName()}`, // double @
      faker.internet.domainName(), // no @ sign
      `${faker.person.firstName()}@.com`, // no domain name
    ];
    return faker.helpers.arrayElement(invalidFormats);
  }

  static generateName(gender?: UserGender): string {
    if (gender === 'male') {
      return faker.person.fullName({ sex: 'male' });
    } else if (gender === 'female') {
      return faker.person.fullName({ sex: 'female' });
    }
    return faker.person.fullName();
  }

  static generateFirstName(gender?: UserGender): string {
    if (gender === 'male') {
      return faker.person.firstName('male');
    } else if (gender === 'female') {
      return faker.person.firstName('female');
    }
    return faker.person.firstName();
  }

  static generateLastName(): string {
    return faker.person.lastName();
  }

  static generateUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    const gender = faker.helpers.arrayElement(['male', 'female'] as const);
    const status = faker.helpers.arrayElement(['active', 'inactive'] as const);
    const firstName = this.generateFirstName(gender);
    const lastName = this.generateLastName();

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateEmail({ firstName, lastName }),
      gender: gender,
      status: status,
      ...overrides
    };
  }

  static generateMaleUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    const firstName = this.generateFirstName('male');
    const lastName = this.generateLastName();

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateEmail({ firstName, lastName }),
      gender: 'male',
      status: faker.helpers.arrayElement(['active', 'inactive'] as const),
      ...overrides
    };
  }

  static generateFemaleUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    const firstName = this.generateFirstName('female');
    const lastName = this.generateLastName();

    return {
      name: `${firstName} ${lastName}`,
      email: this.generateEmail({ firstName, lastName }),
      gender: 'female',
      status: faker.helpers.arrayElement(['active', 'inactive'] as const),
      ...overrides
    };
  }

  static generateActiveUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    return this.generateUser({ status: 'active', ...overrides });
  }

  static generateInactiveUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    return this.generateUser({ status: 'inactive', ...overrides });
  }

  static generateUsers(count: number, overrides?: Partial<CreateUserRequest>): CreateUserRequest[] {
    return Array.from({ length: count }, () => this.generateUser(overrides));
  }
}