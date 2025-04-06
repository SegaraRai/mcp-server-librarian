---
tags: ["interactive", "form", "ui"]
---

# Button Component

A collection of button styles created with Tailwind CSS.

## Basic Button

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
  Button
</button>
```

## Button Variants

### Primary Button

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  Primary
</button>
```

### Secondary Button

```html
<button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
  Secondary
</button>
```

### Success Button

```html
<button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
  Success
</button>
```

### Danger Button

```html
<button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
  Danger
</button>
```

## Button Sizes

### Small Button

```html
<button class="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
  Small
</button>
```

### Large Button

```html
<button class="px-6 py-3 text-lg bg-blue-500 text-white rounded hover:bg-blue-600">
  Large
</button>
```

## Disabled Button

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded opacity-50 cursor-not-allowed" disabled>
  Disabled
</button>
```

## Button with Icon

```html
<button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
  </svg>
  Button with Icon
</button>
```
