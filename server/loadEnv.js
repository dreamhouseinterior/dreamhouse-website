import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Always load server/.env, no matter which folder the app is started from.
// On Hostinger there is no .env file; the variables you set in hPanel are used instead.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') })