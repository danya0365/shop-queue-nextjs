# Shop Queue - Clean Architecture

This project follows Clean Architecture and SOLID principles with a clear separation of concerns.

## Project Structure

```
src/
├── domain/                # Core business logic
│   ├── entities/          # Business entities
│   ├── repositories/      # Repository interfaces
│   ├── services/         # Domain services
│   ├── value-objects/    # Value objects
│   ├── exceptions/       # Custom exceptions
│   ├── events/           # Domain events
│   └── types/            # Shared TypeScript types
│
├── application/          # Application layer
│   ├── use-cases/       # Application use cases
│   ├── dto/             # Data Transfer Objects
│   ├── mappers/         # Mappers between layers
│   └── interfaces/      # Application interfaces
│
├── infrastructure/      # Infrastructure layer
│   ├── persistence/    # Database implementations
│   ├── http/           # HTTP clients
│   ├── auth/           # Authentication
│   └── config/         # Configuration
│
├── presentation/        # Presentation layer
│   ├── components/     # Reusable UI components
│   ├── containers/     # Container components
│   ├── pages/          # Next.js pages
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles
│   └── utils/          # Presentation utilities
│
└── di/                 # Dependency Injection
    ├── container.ts    # DI container configuration
    └── tokens.ts       # DI tokens
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Key Dependencies

- **InversifyJS** - For dependency injection
- **Zod** - For schema validation
- **class-validator** - For class property validation
- **class-transformer** - For object transformation
- **winston** - For logging

## Development Workflow

- Run type checking: `npm run type-check`
- Run linter: `npm run lint`
- Format code: `npm run format`

## Architecture Guidelines

- **Domain Layer**: Contains business logic and entities
- **Application Layer**: Contains use cases and application logic
- **Infrastructure Layer**: Implements interfaces defined in domain/application layers
- **Presentation Layer**: Handles UI and user interactions

Follow SOLID principles and clean architecture guidelines when adding new features.
