import { Handler } from '@netlify/functions';
import express from 'express';
import cors from 'cors';
import { routes } from '../../server/routes';

const app = express();

// Configure CORS
const corsHandler = cors({
  origin: process.env.SITE_URL || 'https://dreamcanvas.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
});

// Apply middleware
app.use(express.json());
app.use(corsHandler);
app.use('/api', routes);

const handler: Handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.SITE_URL || 'https://dreamcanvas.netlify.app',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '600',
      },
    };
  }

  const { path, httpMethod, body, headers } = event;
  
  // Convert Netlify event to Express request
  const req = {
    method: httpMethod,
    path,
    body: body ? JSON.parse(body) : {},
    headers,
  } as any;

  // Create a response object
  const res = {
    statusCode: 200,
    body: '',
    headers: {
      'Access-Control-Allow-Origin': process.env.SITE_URL || 'https://dreamcanvas.netlify.app',
      'Access-Control-Allow-Credentials': 'true',
    },
    setHeader: (key: string, value: string) => {
      res.headers[key] = value;
    },
    send: (data: any) => {
      res.body = typeof data === 'string' ? data : JSON.stringify(data);
    },
    json: (data: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    },
    status: (code: number) => {
      res.statusCode = code;
      return res;
    },
  } as any;

  // Handle the request
  try {
    // Use the router to handle the request
    await new Promise((resolve, reject) => {
      routes(req, res, (err?: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });

    return {
      statusCode: res.statusCode,
      body: res.body,
      headers: res.headers,
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.SITE_URL || 'https://dreamcanvas.netlify.app',
        'Access-Control-Allow-Credentials': 'true',
      },
    };
  }
};

export { handler }; 