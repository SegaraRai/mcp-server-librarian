---
tags: ["data", "ui", "display", "grid"]
---

# Table Component

A collection of table styles created with Tailwind CSS.

## Basic Table

```html
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
      <th scope="col" class="relative px-6 py-3">
        <span class="sr-only">Edit</span>
      </th>
    </tr>
  </thead>
  <tbody class="bg-white divide-y divide-gray-200">
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="flex-shrink-0 h-10 w-10">
            <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="">
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-gray-900">Jane Cooper</div>
            <div class="text-sm text-gray-500">jane.cooper@example.com</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">Regional Paradigm Technician</div>
        <div class="text-sm text-gray-500">Optimization</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
      </td>
    </tr>
    <!-- More rows... -->
  </tbody>
</table>
```

## Simple Table

A simpler table style with minimal styling.

```html
<table class="min-w-full">
  <thead>
    <tr>
      <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
      <th class="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    </tr>
  </thead>
  <tbody class="bg-white">
    <tr>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">John Doe</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">john@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">User</td>
    </tr>
    <tr>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">Jane Smith</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">jane@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">Admin</td>
    </tr>
    <tr>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">Bob Johnson</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">bob@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">Editor</td>
    </tr>
  </tbody>
</table>
```

## Striped Table

A table with alternating row colors for better readability.

```html
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    </tr>
  </thead>
  <tbody class="bg-white divide-y divide-gray-200">
    <tr class="bg-white">
      <td class="px-6 py-4 whitespace-nowrap">John Doe</td>
      <td class="px-6 py-4 whitespace-nowrap">john@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">User</td>
    </tr>
    <tr class="bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">Jane Smith</td>
      <td class="px-6 py-4 whitespace-nowrap">jane@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">Admin</td>
    </tr>
    <tr class="bg-white">
      <td class="px-6 py-4 whitespace-nowrap">Bob Johnson</td>
      <td class="px-6 py-4 whitespace-nowrap">bob@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">Editor</td>
    </tr>
    <tr class="bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">Alice Williams</td>
      <td class="px-6 py-4 whitespace-nowrap">alice@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">User</td>
    </tr>
  </tbody>
</table>
```

## Bordered Table

A table with borders around all cells.

```html
<table class="min-w-full border-collapse border border-gray-200">
  <thead>
    <tr>
      <th class="border border-gray-200 px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th class="border border-gray-200 px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
      <th class="border border-gray-200 px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">John Doe</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">john@example.com</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">User</td>
    </tr>
    <tr>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">Jane Smith</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">jane@example.com</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">Admin</td>
    </tr>
    <tr>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">Bob Johnson</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">bob@example.com</td>
      <td class="border border-gray-200 px-6 py-4 whitespace-nowrap">Editor</td>
    </tr>
  </tbody>
</table>
```

## Hoverable Table

A table with hover effects on rows.

```html
<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    </tr>
  </thead>
  <tbody class="bg-white divide-y divide-gray-200">
    <tr class="hover:bg-gray-100">
      <td class="px-6 py-4 whitespace-nowrap">John Doe</td>
      <td class="px-6 py-4 whitespace-nowrap">john@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">User</td>
    </tr>
    <tr class="hover:bg-gray-100">
      <td class="px-6 py-4 whitespace-nowrap">Jane Smith</td>
      <td class="px-6 py-4 whitespace-nowrap">jane@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">Admin</td>
    </tr>
    <tr class="hover:bg-gray-100">
      <td class="px-6 py-4 whitespace-nowrap">Bob Johnson</td>
      <td class="px-6 py-4 whitespace-nowrap">bob@example.com</td>
      <td class="px-6 py-4 whitespace-nowrap">Editor</td>
    </tr>
  </tbody>
</table>
```

## Responsive Table

A table that adapts to different screen sizes by allowing horizontal scrolling on small screens.

```html
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">John Doe</td>
        <td class="px-6 py-4 whitespace-nowrap">Software Engineer</td>
        <td class="px-6 py-4 whitespace-nowrap">john@example.com</td>
        <td class="px-6 py-4 whitespace-nowrap">Developer</td>
        <td class="px-6 py-4 whitespace-nowrap">Engineering</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
        </td>
      </tr>
      <!-- More rows... -->
    </tbody>
  </table>
</div>
```

## Table with Pagination

A table with pagination controls.

```html
<div>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">John Doe</td>
          <td class="px-6 py-4 whitespace-nowrap">john@example.com</td>
          <td class="px-6 py-4 whitespace-nowrap">User</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">Jane Smith</td>
          <td class="px-6 py-4 whitespace-nowrap">jane@example.com</td>
          <td class="px-6 py-4 whitespace-nowrap">Admin</td>
        </tr>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">Bob Johnson</td>
          <td class="px-6 py-4 whitespace-nowrap">bob@example.com</td>
          <td class="px-6 py-4 whitespace-nowrap">Editor</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <!-- Pagination -->
  <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Previous
      </a>
      <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Next
      </a>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">3</span> of <span class="font-medium">10</span> results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Previous</span>
            <!-- Heroicon name: solid/chevron-left -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </a>
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-gray-50">
            2
          </a>
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </a>
          <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            ...
          </span>
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            10
          </a>
          <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span class="sr-only">Next</span>
            <!-- Heroicon name: solid/chevron-right -->
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</div>
