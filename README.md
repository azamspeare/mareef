# Mareef

A modern platform for teachers to create writing tasks and evaluate student submissions with rich feedback.

## Features

- **Teacher Portal** - Create and manage writing tasks with a rich text editor
- **Student Portal** - Complete timed writing tasks with auto-save functionality
- **Real-time Feedback** - Teachers can annotate submissions and provide detailed evaluations
- **Dashboard Analytics** - Track submissions, students, and writing metrics
- **Google OAuth** - Secure authentication for both teachers and students

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 18, Inertia.js, TypeScript
- **Editor**: BlockNote (rich text)
- **Styling**: Tailwind CSS 4, Radix UI
- **Database**: MySQL/PostgreSQL
- **Cache/Session**: Redis (recommended for production)

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+ or PostgreSQL 14+
- Redis (recommended for production)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mareef
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Set up database**
   ```bash
   php artisan migrate
   ```

5. **Build frontend assets**
   ```bash
   npm run build
   ```

6. **Start the development server**
   ```bash
   php artisan serve
   npm run dev
   ```

## Configuration

### Environment Variables

Key variables in `.env`:

```env
# App
APP_URL=http://localhost
APP_DOMAIN=localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=mareef

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_APP_REDIRECT_URL=http://app.localhost/auth/google/callback
GOOGLE_STUDENT_REDIRECT_URL=http://student.localhost/auth/google/callback
```

### Production Configuration

For high-traffic production (500+ RPS), use Redis:

```env
SESSION_DRIVER=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
```

Cache optimization:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Development

### Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
php artisan test

# Code formatting
./vendor/bin/pint
```

### Project Structure

```
app/
├── Actions/          # Domain actions
├── DTOs/             # Data transfer objects
├── Filters/          # Query filters
├── Http/Controllers/ # Route controllers
├── Models/           # Eloquent models
├── Queries/          # Complex query builders
├── Repositories/     # Data access layer
└── Services/         # Business logic

resources/js/
├── Pages/            # React page components
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
└── Layouts/          # Layout components
```

### Domains

The app uses subdomain routing:
- `app.{domain}` - Teacher portal
- `student.{domain}` - Student portal
- `{domain}` - Public landing pages

## License

Proprietary - All rights reserved.
