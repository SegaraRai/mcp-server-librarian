---
tags: ["state", "persistence", "browser"]
---

# useLocalStorage Hook

A custom React hook that provides localStorage integration with React state.

## Usage

```jsx
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [name, setName] = useLocalStorage("name", "John Doe");

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

## Implementation

```jsx
import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Get stored value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
```

## Parameters

- `key` (string): The key to use in localStorage
- `initialValue` (any): The initial value to use if no value is found in localStorage

## Return Value

- An array containing:
  - The current value from localStorage
  - A setter function to update the value

## Notes

- The value is automatically serialized to JSON when storing and deserialized when retrieving
- If there's an error reading from or writing to localStorage, it will fall back to using the initialValue
- Changes to the same key in other components or browser tabs will not be reflected automatically
