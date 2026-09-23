import 'dotenv/config';
import { DataSource } from 'typeorm';
import { buildTypeOrmOptions } from './typeorm.options';
import configuration from '../config/configuration';

export const AppDataSource = new DataSource(buildTypeOrmOptions(configuration()));
