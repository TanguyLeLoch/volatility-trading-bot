// import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '../.env' });
import { Method } from './method';
import fetch from 'node-fetch';
import { ports } from './module.ports';

export async function callModule(
  module: string,
  method: Method,
  path: string,
  body: Object,
): Promise<any> {
  const baseUrl = process.env.BASE_URL_DEV;
  const port: number = ports[module];
  const url = `${baseUrl}:${port}/${path}`;
  console.log(`url: ${url}`);
  const options: any = { method };
  body && (options.body = JSON.stringify(body));
  const response = await fetch(url, options);
  return await response.json();
}
