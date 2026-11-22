// Admin panel path. /admin/login now works.
// Anyone who guesses it still needs the email and password.
// To hide it better, change it (e.g. '/dh-studio-9x') or set VITE_ADMIN_PATH in client/.env
export const ADMIN_BASE = import.meta.env.VITE_ADMIN_PATH || '/admin'