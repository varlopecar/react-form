# CI/CD React Components

A collection of React components for building user registration forms with validation.

## Features

- **RegistrationForm**: A fully featured registration form with validation
- **Zod Schema Validation**: Built-in validation using Zod
- **React Hook Form Integration**: Form state management with react-hook-form
- **TypeScript Support**: Full TypeScript support with type definitions
- **Tailwind CSS Styling**: Modern, responsive design with Tailwind CSS
- **Automated Testing**: Comprehensive test suite with Vitest
- **Documentation**: Auto-generated documentation with JSDoc
- **CI/CD Pipeline**: Automated build, test, and deployment process

## Installation

```bash
# Using pnpm (recommended)
pnpm add @varlopecar/ci-cd

# Using npm
npm install @varlopecar/ci-cd

# Using yarn
yarn add @varlopecar/ci-cd
```

## Usage

### RegistrationForm Component

```jsx
import { RegistrationForm } from "@varlopecar/ci-cd";

function App() {
  const handleSubmit = (data) => {
    console.log(data);
    // Process form data
  };

  return (
    <div>
      <h1>User Registration</h1>
      <RegistrationForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### Using the Schema Directly

```jsx
import {
  registrationSchema,
  type RegistrationFormData,
} from "@varlopecar/ci-cd";

// Use the schema with your own form implementation
const validateForm = (data) => {
  const result = registrationSchema.safeParse(data);
  if (!result.success) {
    return result.error.format();
  }
  return null;
};
```

## API Reference

### RegistrationForm

A form component for user registration with built-in validation.

#### Props

| Prop       | Type                                   | Description                                                         |
| ---------- | -------------------------------------- | ------------------------------------------------------------------- |
| `onSubmit` | `(data: RegistrationFormData) => void` | Callback function called when the form is submitted with valid data |

### RegistrationFormData

Type definition for the form data.

```typescript
interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  city: string;
  postalCode: string;
}
```

### registrationSchema

Zod schema for validating registration form data.

## Development

```bash
# Clone the repository
git clone https://github.com/varlopecar/vite-vitest-app.git

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Generate coverage report
pnpm coverage

# Generate documentation
pnpm doc

# Build for production
pnpm build
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. **Build and Test**: Runs on every push and pull request

   - Installs dependencies
   - Runs tests with coverage
   - Generates documentation
   - Builds the project

2. **GitHub Pages Deployment**: Deploys the demo site

   - Builds the project
   - Deploys to GitHub Pages

3. **NPM Package Publishing**: Publishes new versions
   - Builds the NPM package
   - Publishes to NPM registry
   - Automatically bumps version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
