# React TypeScript Standards
## Status: ✅ ACTIVE

## Overview
Development standards and best practices for React TypeScript components in the Dead Scroll project.

## TypeScript Configuration

### Strict Mode Settings
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Type Safety Rules
- No `any` types allowed (use `unknown` if necessary)
- All function parameters must be typed
- All function return types must be explicit
- All component props must have interfaces
- Use strict null checks

## Component Structure

### Functional Component Template
```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComponentNameProps {
  requiredProp: string;
  optionalProp?: number;
  onAction: (value: string) => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  requiredProp,
  optionalProp = 0,
  onAction
}) => {
  // State declarations
  const [state, setState] = useState<string>('');

  // Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, []);

  // Event handlers
  const handleAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    onAction(state);
  };

  // Render
  return (
    <motion.div>
      {/* Component JSX */}
    </motion.div>
  );
};
```

### Interface Naming Conventions
```typescript
// Props interfaces
interface ComponentNameProps { }

// State interfaces
interface ComponentState { }

// Data models
interface BuriedSite { }
interface QuestSection { }

// API responses
interface GeminiResponse { }

// Event handlers
type ClickHandler = (event: React.MouseEvent) => void;
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
```

## State Management

### useState Patterns
```typescript
// Primitive types
const [count, setCount] = useState<number>(0);
const [text, setText] = useState<string>('');
const [isActive, setIsActive] = useState<boolean>(false);

// Complex types
const [sites, setSites] = useState<BuriedSite[]>([]);
const [error, setError] = useState<string | null>(null);
const [view, setView] = useState<'dashboard' | 'horror' | 'ritual'>('dashboard');

// Object state
interface FormState {
  name: string;
  days: number;
}
const [form, setForm] = useState<FormState>({ name: '', days: 1 });
```

### useEffect Patterns
```typescript
// Data fetching
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiCall();
      setData(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };
  fetchData();
}, [dependency]);

// Event listeners
useEffect(() => {
  const handleEvent = (event: Event) => {
    // Handle event
  };
  window.addEventListener('event', handleEvent);
  return () => window.removeEventListener('event', handleEvent);
}, []);

// Chrome storage sync
useEffect(() => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['key'], (result) => {
      if (result.key) {
        setState(result.key);
      }
    });
  }
}, []);
```

## Event Handling

### Event Handler Types
```typescript
// Mouse events
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { };
const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => { };

// Form events
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// Keyboard events
const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    handleSubmit();
  }
};
```

### Callback Props
```typescript
interface CallbackProps {
  onComplete: () => void;
  onError: (error: Error) => void;
  onChange: (value: string) => void;
  onSubmit: (data: FormData) => Promise<void>;
}
```

## API Integration

### Async Function Patterns
```typescript
// API call with error handling
const generateContent = async (topic: string): Promise<QuestSection[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    return processResponse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate content: ${error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};
```

### Type Guards
```typescript
// Type guard functions
function isBuriedSite(obj: unknown): obj is BuriedSite {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'url' in obj &&
    'buriedAt' in obj
  );
}

// Usage
if (isBuriedSite(data)) {
  // TypeScript knows data is BuriedSite
  console.log(data.url);
}
```

## Performance Optimization

### React.memo Usage
```typescript
interface MemoComponentProps {
  data: string;
  onAction: () => void;
}

export const MemoComponent = React.memo<MemoComponentProps>(
  ({ data, onAction }) => {
    return <div onClick={onAction}>{data}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data === nextProps.data;
  }
);
```

### useCallback and useMemo
```typescript
// useCallback for event handlers
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## Error Handling

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### Try-Catch Patterns
```typescript
// Async error handling
const safeAsyncOperation = async () => {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Type error:', error.message);
    } else if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};
```

## Code Organization

### File Structure
```
components/
├── ComponentName.tsx       # Component implementation
├── ComponentName.types.ts  # Type definitions
├── ComponentName.styles.ts # Styled components (if used)
└── index.ts               # Barrel export
```

### Import Organization
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skull, Ghost } from 'lucide-react';

// 2. Internal utilities
import { generateContent } from '../services/api';
import { playSound } from '../utils/audio';

// 3. Types
import type { BuriedSite, QuestSection } from '../types';

// 4. Styles
import './ComponentName.css';
```

## Testing Patterns

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName requiredProp="test" onAction={() => {}} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const mockAction = jest.fn();
    render(<ComponentName requiredProp="test" onAction={mockAction} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

## Best Practices Checklist

### Component Development
- [ ] All props have TypeScript interfaces
- [ ] No `any` types used
- [ ] Event handlers properly typed
- [ ] State properly typed with generics
- [ ] Effects have cleanup functions
- [ ] Async operations have error handling
- [ ] Components are properly memoized
- [ ] Accessibility attributes included

### Code Quality
- [ ] Consistent naming conventions
- [ ] Proper import organization
- [ ] No unused imports or variables
- [ ] Comments for complex logic
- [ ] Error boundaries implemented
- [ ] Performance optimizations applied

---
**Standards Status**: Active ✅
**Last Updated**: November 2024
**Compliance Rate**: 100%
