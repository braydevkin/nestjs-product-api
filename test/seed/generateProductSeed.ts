import { faker } from '@faker-js/faker';
import { Model, Document } from 'mongoose';

export const generateProductSeed = async (connection: Model<Document>) => {
  const product = {
    id: faker.string.uuid(),
    productId: faker.string.alphanumeric(10),
    sku: faker.string.alphanumeric(10),
    name: faker.commerce.productName(),
    brand: faker.company.name(),
    model: faker.string.alphanumeric(10),
    category: faker.commerce.department(),
    color: faker.color.human(),
    price: parseFloat(faker.commerce.price({ min: 100, max: 1000, dec: 2 })),
    currency: faker.finance.currencyCode(),
    stock: faker.number.int({ min: 0, max: 100 }),
    externalId: faker.string.uuid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: faker.datatype.boolean(),
  };
  connection.create(product);
};
