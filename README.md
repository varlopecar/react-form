# CI/CD React Components

A collection of React components for building user registration forms with validation.

## Features

- **RegistrationForm**: A fully featured registration form with validation
- **Zod Schema Validation**: Built-in validation using Zod
- **React Hook Form Integration**: Form state management with react-hook-form
- **TypeScript Support**: Full TypeScript support with type definitions
- **Tailwind CSS Styling**: Modern, responsive design with Tailwind CSS

## Installation

```bash
npm install @varlopecar/ci-cd
# or
yarn add @varlopecar/ci-cd
# or
pnpm add @varlopecar/ci-cd
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
npm install

# Run tests
npm test

# Build the package
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
