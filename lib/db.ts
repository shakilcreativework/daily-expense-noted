/**
 * Database Connection Helper (Serverless-Safe Pattern)
 * 
 * WHY THIS PATTERN IS USED:
 * In a traditional Node.js/Express server, a single persistent database connection
 * is created when the server boots. However, in Next.js App Router (and serverless
 * platforms like Vercel), route handlers are executed as stateless serverless functions.
 * 
 * Without global caching, every incoming API request could spawn a brand new database
 * connection, rapidly exhausting MongoDB Atlas connection limits (connection pool starvation).
 * 
 * By caching the connection promise on Node's `global` object, connections are reused
 * across hot function invocations, drastically reducing latency and cold-start times.
 */

import mongoose from 'mongoose';
import dns from 'node:dns';

// Fix for Windows and local network/ISP DNS blocking MongoDB SRV queries
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch {
    // Ignore if not permitted in some edge runtimes
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Interface defining our global mongoose cache structure.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Extend the global scope in TypeScript to preserve cache across HMR in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Retrieve existing cache or initialize a fresh cache container
const cached: MongooseCache = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

/**
 * Connects to MongoDB Atlas using cached singleton connection pooling.
 * 
 * @returns {Promise<typeof mongoose>} Active mongoose instance
 */
export async function connectDB(): Promise<typeof mongoose> {
  // 1. If connection already established, return cached connection immediately
  if (cached.conn) {
    return cached.conn;
  }

  // Ensure public DNS resolver is used to prevent querySrv ECONNREFUSED on local networks
  if (typeof dns.setServers === 'function') {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch {
      // Ignore if not permitted
    }
  }

  // 2. If no connection promise is currently in-flight, initialize connection
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Fail fast if connection drops rather than hanging indefinitely
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise so subsequent requests can re-attempt connection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
