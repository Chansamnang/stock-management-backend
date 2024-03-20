import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const username =
  process.env.DB_USERNAME !== undefined ? process.env.DB_USERNAME : 'root';
const password =
  process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '123456';
const dbName =
  process.env.DB_NAME !== undefined ? process.env.DB_NAME : 'testdb';

const host =
  process.env.DB_HOSTNAME !== undefined ? process.env.DB_HOSTNAME : '127.0.0.1';
const synchronize = process.env.NODE_ENV === 'production' ? false : true;

console.log(
  `host ${host}, username ${username}, password ${password}, dbName ${dbName}`,
);

console.log(`node env ${process.env.NODE_ENV}`);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: host,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: username,
  password: password,
  database: dbName,
  entities: [],
  synchronize: synchronize,
  autoLoadEntities: true,
  logging: true,
  logger: 'file',
  dateStrings: ['DATE', 'DATETIME', 'TIMESTAMP'],
};
