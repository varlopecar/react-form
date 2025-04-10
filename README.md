# Registration Form Project

[![Build and Test React App](https://github.com/varlopecar/vitest-vite-app/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/varlopecar/vitest-vite-app/actions/workflows/ci_cd.yml)
[![codecov](https://codecov.io/gh/varlopecar/vitest-vite-app/branch/main/graph/badge.svg?token=YOUR_CODECOV_TOKEN)](https://codecov.io/gh/varlopecar/vitest-vite-app)
[![npm version](https://badge.fury.io/js/@varlopecar%2Fci-cd.svg)](https://badge.fury.io/js/@varlopecar%2Fci-cd)

A comprehensive user registration form with robust validation, built with React, TypeScript, and modern frontend practices.

## Features

- **Form Validation**: Complete form validation with Zod schemas
- **User Experience**:
  - Disabled submit button until all fields are filled
  - Error messages displayed under each invalid field
  - Toast notifications for success and failure
  - Local storage saving of user data
- **Validation Rules**:
  - Age verification (18+ years)
  - French postal code format
  - Name validation (allowing accents, hyphens, spaces)
  - Email validation
- **Testing**: 100% code coverage with unit and integration tests
- **Documentation**: Auto-generated documentation with JSDoc
- **CI/CD Pipeline**: Automated build, test, and deployment process

## Live Demo

Visit the live demo at: [https://varlopecar.github.io/vitest-vite-app/](https://varlopecar.github.io/vitest-vite-app/)

## Documentation

The documentation is available directly from the application by clicking the "Documentation" link, or you can access it at:
[https://varlopecar.github.io/vitest-vite-app/docs/](https://varlopecar.github.io/vitest-vite-app/docs/)

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

## Form Behavior

1. **Field Validation**: All fields are validated in real-time
2. **Submit Button**: Disabled until all fields have values
3. **Success Case**:
   - Data is saved to localStorage
   - A success toast notification is displayed
   - Form fields are cleared
4. **Error Case**:
   - Error messages displayed under each invalid field
   - Error toast notification
   - Form remains filled for user correction

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

Zod schema for validating registration form data with rules for:

- Names (allowing letters, accents, hyphens)
- Email format
- Age verification (18+ years)
- French postal code format (5 digits)

## Development

```bash
# Clone the repository
git clone https://github.com/varlopecar/vitest-vite-app.git

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

## Test Coverage

This project maintains 100% test coverage across all metrics:

- 100% Statement Coverage
- 100% Branch Coverage
- 100% Function Coverage
- 100% Line Coverage

Tests include:

- Age calculation validation
- Age 18+ validation
- French postal code format validation
- Name format validation with special cases
- Email format validation
- Button state based on form completion
- Local storage functionality
- Toast notifications
- Error message display
- Error handling

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
