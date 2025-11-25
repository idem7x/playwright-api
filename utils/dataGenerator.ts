import { faker } from '@faker-js/faker';
import { CreateUserRequest } from '@types/userTypes';

/**
 * Data generator using Faker.js for creating realistic test data
 * Provides methods to generate random, unique test data with real-looking values
 *
 * @see https://fakerjs.dev/api/
 */
export class DataGenerator {
  /**
   * Set seed for reproducible random data
   * @param seed - Seed value
   */
  static setSeed(seed: number): void {
    faker.seed(seed);
  }

  /**
   * Set locale for generated data
   * @param locale - Locale code (e.g., 'en', 'uk', 'de')
   */
  static setLocale(locale: string): void {
    faker.setDefaultRefDate(locale);
  }

  // ==================== EMAIL ====================

  /**
   * Generate unique email address using faker
   * @param options - Email options
   * @returns Unique email
   */
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

  /**
   * Generate invalid email for negative testing
   * @returns Invalid email string
   */
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

  // ==================== NAMES ====================

  /**
   * Generate random full name
   * @param gender - Optional gender
   * @returns Full name
   */
  static generateName(gender?: 'male' | 'female'): string {
    if (gender === 'male') {
      return faker.person.fullName({ sex: 'male' });
    } else if (gender === 'female') {
      return faker.person.fullName({ sex: 'female' });
    }
    return faker.person.fullName();
  }

  /**
   * Generate first name
   * @param gender - Optional gender
   * @returns First name
   */
  static generateFirstName(gender?: 'male' | 'female'): string {
    if (gender === 'male') {
      return faker.person.firstName('male');
    } else if (gender === 'female') {
      return faker.person.firstName('female');
    }
    return faker.person.firstName();
  }

  /**
   * Generate last name
   * @returns Last name
   */
  static generateLastName(): string {
    return faker.person.lastName();
  }

  // ==================== USER GENERATION ====================

  /**
   * Generate random user data
   * @param overrides - Optional field overrides
   * @returns User request object
   */
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

  /**
   * Generate male user
   * @param overrides - Optional field overrides
   * @returns Male user request object
   */
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

  /**
   * Generate female user
   * @param overrides - Optional field overrides
   * @returns Female user request object
   */
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

  /**
   * Generate active user
   * @param overrides - Optional field overrides
   * @returns Active user request object
   */
  static generateActiveUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    return this.generateUser({ status: 'active', ...overrides });
  }

  /**
   * Generate inactive user
   * @param overrides - Optional field overrides
   * @returns Inactive user request object
   */
  static generateInactiveUser(overrides?: Partial<CreateUserRequest>): CreateUserRequest {
    return this.generateUser({ status: 'inactive', ...overrides });
  }

  /**
   * Generate multiple users
   * @param count - Number of users to generate
   * @param overrides - Optional field overrides for all users
   * @returns Array of user request objects
   */
  static generateUsers(count: number, overrides?: Partial<CreateUserRequest>): CreateUserRequest[] {
    return Array.from({ length: count }, () => this.generateUser(overrides));
  }

  // ==================== STRINGS & NUMBERS ====================

  /**
   * Generate random string
   * @param length - Length of string
   * @returns Random string
   */
  static generateRandomString(length: number = 10): string {
    return faker.string.alphanumeric(length);
  }

  /**
   * Generate random word
   * @returns Random word
   */
  static generateWord(): string {
    return faker.lorem.word();
  }

  /**
   * Generate random sentence
   * @param wordCount - Number of words
   * @returns Random sentence
   */
  static generateSentence(wordCount?: number): string {
    return faker.lorem.sentence(wordCount);
  }

  /**
   * Generate random paragraph
   * @param sentenceCount - Number of sentences
   * @returns Random paragraph
   */
  static generateParagraph(sentenceCount?: number): string {
    return faker.lorem.paragraph(sentenceCount);
  }

  /**
   * Generate random number in range
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  static generateRandomNumber(min: number = 0, max: number = 1000): number {
    return faker.number.int({ min, max });
  }

  /**
   * Generate random float in range
   * @param min - Minimum value
   * @param max - Maximum value
   * @param precision - Decimal precision
   * @returns Random float
   */
  static generateRandomFloat(min: number = 0, max: number = 1000, precision: number = 2): number {
    return faker.number.float({ min, max, fractionDigits: precision });
  }

  /**
   * Generate random boolean
   * @returns Random boolean
   */
  static generateRandomBoolean(): boolean {
    return faker.datatype.boolean();
  }

  // ==================== UTILITIES ====================

  /**
   * Pick random element from array
   * @param array - Array to pick from
   * @returns Random element
   */
  static pickRandom<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Pick multiple random elements from array
   * @param array - Array to pick from
   * @param count - Number of elements to pick
   * @returns Array of random elements
   */
  static pickRandomMultiple<T>(array: T[], count: number): T[] {
    return faker.helpers.arrayElements(array, count);
  }

  /**
   * Shuffle array
   * @param array - Array to shuffle
   * @returns Shuffled array
   */
  static shuffle<T>(array: T[]): T[] {
    return faker.helpers.shuffle(array);
  }

  // ==================== CONTACT INFO ====================

  /**
   * Generate phone number
   * @param format - Phone format
   * @returns Formatted phone number
   */
  static generatePhoneNumber(format?: string): string {
    return faker.phone.number(format);
  }

  /**
   * Generate username
   * @param firstName - Optional first name
   * @param lastName - Optional last name
   * @returns Username
   */
  static generateUsername(firstName?: string, lastName?: string): string {
    return faker.internet.username({ firstName, lastName });
  }

  /**
   * Generate display name (like social media)
   * @returns Display name
   */
  static generateDisplayName(): string {
    return faker.internet.displayName();
  }

  // ==================== DATES ====================

  /**
   * Generate date in ISO format
   * @param options - Date options
   * @returns ISO date string
   */
  static generateDate(options?: {
    years?: number;
    refDate?: Date;
  }): string {
    return faker.date.recent(options).toISOString();
  }

  /**
   * Generate past date
   * @param years - Years in the past
   * @returns Past date
   */
  static generatePastDate(years: number = 1): string {
    return faker.date.past({ years }).toISOString();
  }

  /**
   * Generate future date
   * @param years - Years in the future
   * @returns Future date
   */
  static generateFutureDate(years: number = 1): string {
    return faker.date.future({ years }).toISOString();
  }

  /**
   * Generate birthdate
   * @param minAge - Minimum age
   * @param maxAge - Maximum age
   * @returns Birthdate
   */
  static generateBirthdate(minAge: number = 18, maxAge: number = 80): string {
    return faker.date.birthdate({ min: minAge, max: maxAge, mode: 'age' }).toISOString();
  }

  // ==================== INTERNET ====================

  /**
   * Generate URL
   * @returns URL string
   */
  static generateUrl(): string {
    return faker.internet.url();
  }

  /**
   * Generate domain name
   * @returns Domain name
   */
  static generateDomainName(): string {
    return faker.internet.domainName();
  }

  /**
   * Generate IP address
   * @returns IP address
   */
  static generateIpAddress(): string {
    return faker.internet.ip();
  }

  /**
   * Generate IPv6 address
   * @returns IPv6 address
   */
  static generateIpv6Address(): string {
    return faker.internet.ipv6();
  }

  /**
   * Generate MAC address
   * @returns MAC address
   */
  static generateMacAddress(): string {
    return faker.internet.mac();
  }

  /**
   * Generate user agent
   * @returns User agent string
   */
  static generateUserAgent(): string {
    return faker.internet.userAgent();
  }

  // ==================== IDS & CODES ====================

  /**
   * Generate UUID v4
   * @returns UUID string
   */
  static generateUUID(): string {
    return faker.string.uuid();
  }

  /**
   * Generate nanoid
   * @returns Nanoid string
   */
  static generateNanoid(): string {
    return faker.string.nanoid();
  }

  /**
   * Generate hexadecimal
   * @param length - Length of hex string
   * @returns Hex string
   */
  static generateHex(length: number = 16): string {
    return faker.string.hexadecimal({ length, prefix: '' });
  }

  // ==================== LOCATION ====================

  /**
   * Generate city name
   * @returns City name
   */
  static generateCity(): string {
    return faker.location.city();
  }

  /**
   * Generate country
   * @returns Country name
   */
  static generateCountry(): string {
    return faker.location.country();
  }

  /**
   * Generate country code
   * @returns Country code
   */
  static generateCountryCode(): string {
    return faker.location.countryCode();
  }

  /**
   * Generate street address
   * @returns Street address
   */
  static generateStreetAddress(): string {
    return faker.location.streetAddress();
  }

  /**
   * Generate zip code
   * @returns Zip code
   */
  static generateZipCode(): string {
    return faker.location.zipCode();
  }

  /**
   * Generate latitude
   * @returns Latitude
   */
  static generateLatitude(): number {
    return faker.location.latitude();
  }

  /**
   * Generate longitude
   * @returns Longitude
   */
  static generateLongitude(): number {
    return faker.location.longitude();
  }

  // ==================== COMMERCE ====================

  /**
   * Generate product name
   * @returns Product name
   */
  static generateProductName(): string {
    return faker.commerce.productName();
  }

  /**
   * Generate product description
   * @returns Product description
   */
  static generateProductDescription(): string {
    return faker.commerce.productDescription();
  }

  /**
   * Generate price
   * @param min - Minimum price
   * @param max - Maximum price
   * @param dec - Decimal places
   * @param symbol - Currency symbol
   * @returns Price string
   */
  static generatePrice(min: number = 1, max: number = 1000, dec: number = 2, symbol: string = '$'): string {
    return faker.commerce.price({ min, max, dec, symbol });
  }

  // ==================== COMPANY ====================

  /**
   * Generate company name
   * @returns Company name
   */
  static generateCompanyName(): string {
    return faker.company.name();
  }

  /**
   * Generate job title
   * @returns Job title
   */
  static generateJobTitle(): string {
    return faker.person.jobTitle();
  }

  // ==================== COLOR ====================

  /**
   * Generate color hex code
   * @returns Hex color code
   */
  static generateColor(): string {
    return faker.internet.color();
  }

  // ==================== HELPERS ====================

  /**
   * Generate slug from text
   * @param text - Text to convert to slug
   * @returns Slugified string
   */
  static generateSlug(text?: string): string {
    if (text) {
      return text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
    }
    return faker.lorem.slug();
  }
}