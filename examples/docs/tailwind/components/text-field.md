---
tags: ["interactive", "form", "ui", "input"]
---

# Text Field Component

A collection of text field styles created with Tailwind CSS.

## Basic Text Field

```html
<input
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Enter text here"
/>
```

## Text Field Variants

### Default Text Field

```html
<input
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Default text field"
/>
```

### Success Text Field

```html
<input
  type="text"
  class="w-full px-4 py-2 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
  placeholder="Success text field"
/>
```

### Error Text Field

```html
<input
  type="text"
  class="w-full px-4 py-2 border border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
  placeholder="Error text field"
/>
```

## Text Field Sizes

### Small Text Field

```html
<input
  type="text"
  class="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Small text field"
/>
```

### Large Text Field

```html
<input
  type="text"
  class="w-full px-5 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Large text field"
/>
```

## Disabled Text Field

```html
<input
  type="text"
  class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
  placeholder="Disabled text field"
  disabled
/>
```

## Text Field with Icon

```html
<div class="relative">
  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
    </svg>
  </div>
  <input
    type="text"
    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Search"
  />
</div>
```

## Text Field with Label

```html
<div>
  <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    id="email"
    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="you@example.com"
  />
</div>
```

## Text Field with Helper Text

```html
<div>
  <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
  <input
    type="text"
    id="username"
    class="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your username"
  />
  <p class="mt-1 text-sm text-gray-500">Your username must be 8-20 characters long.</p>
</div>
