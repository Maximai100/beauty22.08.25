import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { randomBytes, pbkdf2Sync, randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { LandingPageData, User } from './types';
import { getInitialData } from './data';

const app: express.Express = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ==========================================================================
// File-based Database Layer
// ==========================================================================
const DB_PATH = path.join(__dirname, 'db');
const USERS_DB_FILE = path.join(DB_PATH, 'users.json');
const SITES_DB_FILE = path.join(DB_PATH, 'sites.json');

// In-memory cache, populated from files on start
let userSiteDatabase = new Map<string, LandingPageData>();
let usersDatabase = new Map<string, User>(); // Stores users by email

const mapToObject = <T>(map: Map<string, T>): { [key: string]: T } => Object.fromEntries(map.entries());
const objectToMap = <T>(obj: { [key: string]: T }): Map<string, T> => new Map(Object.entries(obj));

const readDbFile = async <T>(filePath: string): Promise<{ [key: string]: T }> => {
  try {
    await fs.access(filePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {}; // File doesn't exist, return empty object
    }
    throw error;
  }
};

const writeDbFile = async (filePath: string, data: any) => {
  await fs.mkdir(DB_PATH, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

const loadDatabases = async () => {
    const usersData = await readDbFile<User>(USERS_DB_FILE);
    usersDatabase = objectToMap(usersData);

    const sitesData = await readDbFile<LandingPageData>(SITES_DB_FILE);
    userSiteDatabase = objectToMap(sitesData);
    
    console.log('Databases loaded from files into memory.');
};

// ==========================================================================
// Security / Hashing
// ==========================================================================
const hashPassword = (password: string, salt: string): string => {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

// ==========================================================================
// Error Handling Utilities
// ==========================================================================
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// ==========================================================================
// Middleware
// ==========================================================================
const extractUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') {
    return res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
  }
  res.locals.userId = userId;
  next();
};

// ==========================================================================
// API Routes
// ==========================================================================

// --- Auth Routes ---
const authRouter = express.Router();

authRouter.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (usersDatabase.has(email)) {
    return res.status(409).json({ message: 'User with this email already exists.' });
  }

  const userId = randomUUID();
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt);

  const newUser: User = { id: userId, email, salt, hashedPassword };

  usersDatabase.set(email, newUser);
  const initialData = getInitialData();
  userSiteDatabase.set(userId, initialData);

  // Persist changes to files
  await Promise.all([
    writeDbFile(USERS_DB_FILE, mapToObject(usersDatabase)),
    writeDbFile(SITES_DB_FILE, mapToObject(userSiteDatabase))
  ]);

  console.log(`New user registered and data saved: ${email}`);
  res.status(201).json({ id: newUser.id, email: newUser.email });
}));

authRouter.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = usersDatabase.get(email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isPasswordCorrect = hashPassword(password, user.salt) === user.hashedPassword;
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log(`User logged in: ${email}`);
    res.status(200).json({ id: user.id, email: user.email });
});


// --- Data Routes ---
const dataRouter = express.Router();
dataRouter.use(extractUser);

dataRouter.get('/data', (req: Request, res: Response) => {
  const userId = res.locals.userId;
  
  if (!userSiteDatabase.has(userId)) {
    console.log(`First login for user ${userId}. Creating initial data set.`);
    const initialData = getInitialData();
    userSiteDatabase.set(userId, initialData);
    // Persist this new user's default data, but don't wait for it
    writeDbFile(SITES_DB_FILE, mapToObject(userSiteDatabase))
        .catch(err => console.error("Failed to save initial data for new user:", err));
  }

  res.json(userSiteDatabase.get(userId));
});

dataRouter.put('/data', asyncHandler(async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const newData = req.body as LandingPageData;
  
  if (!newData || !newData.hero || !newData.services) {
    return res.status(400).json({ message: 'Invalid data format provided.' });
  }

  userSiteDatabase.set(userId, newData);
  await writeDbFile(SITES_DB_FILE, mapToObject(userSiteDatabase));

  console.log(`Data updated and saved successfully for user ${userId}.`);
  res.status(200).json({ message: 'Data updated successfully' });
}));

dataRouter.post('/reset', asyncHandler(async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const initialData = getInitialData();
  userSiteDatabase.set(userId, initialData);
  await writeDbFile(SITES_DB_FILE, mapToObject(userSiteDatabase));

  console.log(`Data for user ${userId} has been reset and saved.`);
  res.json(initialData);
}));

// --- Server Startup ---
const startServer = async () => {
  await loadDatabases();
  
  // Mount the API routers first
  app.use('/api/auth', authRouter);
  app.use('/api', dataRouter);

  // --- Serve Frontend Application ---
  const frontendDir = path.join(__dirname, '..');

  // Serve all static files from the root directory
  app.use(express.static(frontendDir));

  // For any other GET request, send the index.html file
  // This is required for a Single Page Application (SPA) to work correctly with client-side routing
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
  });
  
  // Global Error Handler
  // This should be the last middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('An unhandled error occurred:', err.stack);
    res.status(500).json({ message: 'An internal server error occurred.' });
  });

  app.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
    console.log('Serving both backend API and frontend application.');
  });
};

startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});