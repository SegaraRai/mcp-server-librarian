---
tags: ["layout", "responsive", "ui", "structure"]
---

# Page Layout Patterns

A collection of common page layout patterns created with Tailwind CSS.

## Basic Page Container

A centered container with responsive padding.

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Page content goes here -->
</div>
```

## Responsive Grid Layout

A responsive grid layout that adjusts columns based on screen size.

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-lg shadow">Item 1</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 2</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 3</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 4</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 5</div>
  <div class="bg-white p-6 rounded-lg shadow">Item 6</div>
</div>
```

## Sidebar Layout

A responsive layout with a sidebar that collapses on mobile.

```html
<div class="flex flex-col md:flex-row">
  <!-- Sidebar -->
  <div class="w-full md:w-64 bg-gray-100 p-4">
    <nav>
      <ul>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Home</a></li>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">About</a></li>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Services</a></li>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Contact</a></li>
      </ul>
    </nav>
  </div>
  
  <!-- Main content -->
  <div class="flex-1 p-4">
    <h1 class="text-2xl font-bold mb-4">Main Content</h1>
    <p>This is the main content area of the page.</p>
  </div>
</div>
```

## Holy Grail Layout

The classic "Holy Grail" layout with header, footer, and three columns.

```html
<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-blue-600 text-white p-4">
    <h1 class="text-xl font-bold">Site Header</h1>
  </header>
  
  <!-- Main content area with sidebar and aside -->
  <div class="flex-1 flex flex-col md:flex-row">
    <!-- Left sidebar -->
    <nav class="w-full md:w-64 bg-gray-100 p-4">
      <h2 class="font-bold mb-2">Navigation</h2>
      <ul>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Link 1</a></li>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Link 2</a></li>
        <li class="mb-2"><a href="#" class="block p-2 hover:bg-gray-200 rounded">Link 3</a></li>
      </ul>
    </nav>
    
    <!-- Main content -->
    <main class="flex-1 p-4">
      <h2 class="text-xl font-bold mb-4">Main Content</h2>
      <p class="mb-4">This is the main content area of the page.</p>
      <p>It takes up the remaining space between the sidebars.</p>
    </main>
    
    <!-- Right sidebar -->
    <aside class="w-full md:w-64 bg-gray-100 p-4">
      <h2 class="font-bold mb-2">Sidebar</h2>
      <p>Additional information or widgets can go here.</p>
    </aside>
  </div>
  
  <!-- Footer -->
  <footer class="bg-gray-800 text-white p-4">
    <p>&copy; 2025 Example Company</p>
  </footer>
</div>
```

## Card Grid Layout

A responsive grid of cards, perfect for displaying products or articles.

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h2 class="text-2xl font-bold mb-6">Featured Items</h2>
  
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <!-- Card 1 -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <img src="https://via.placeholder.com/300x200" alt="Card image" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-bold mb-2">Card Title</h3>
        <p class="text-gray-700 mb-2">This is a description for the card content that might span multiple lines.</p>
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">View Details</button>
      </div>
    </div>
    
    <!-- Repeat for other cards -->
  </div>
</div>
```

## Hero Section

A full-width hero section with a background image and centered content.

```html
<div class="relative bg-gray-900 text-white">
  <!-- Background image with overlay -->
  <div class="absolute inset-0">
    <img src="https://via.placeholder.com/1920x1080" alt="Hero background" class="w-full h-full object-cover">
    <div class="absolute inset-0 bg-black opacity-60"></div>
  </div>
  
  <!-- Content -->
  <div class="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">Welcome to Our Site</h1>
    <p class="text-xl max-w-3xl mb-8">A brief description of your company or the purpose of the website goes here. Make it compelling and concise.</p>
    <div class="flex flex-col sm:flex-row gap-4">
      <a href="#" class="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700">Get Started</a>
      <a href="#" class="px-8 py-3 bg-white text-blue-900 font-medium rounded-md hover:bg-gray-100">Learn More</a>
    </div>
  </div>
</div>
```

## Dashboard Layout

A common dashboard layout with a sidebar navigation and a main content area.

```html
<div class="min-h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside class="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white overflow-y-auto">
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
      
      <nav>
        <ul>
          <li class="mb-1">
            <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Dashboard
              </span>
            </a>
          </li>
          <li class="mb-1">
            <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Users
              </span>
            </a>
          </li>
          <li class="mb-1">
            <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Reports
              </span>
            </a>
          </li>
          <li class="mb-1">
            <a href="#" class="block px-4 py-2 rounded hover:bg-gray-700">
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
  
  <!-- Main content -->
  <main class="ml-64 p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Dashboard Overview</h1>
    </div>
    
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-10">
            <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="font-semibold text-gray-500">Total Users</h2>
            <p class="text-2xl font-bold">12,345</p>
          </div>
        </div>
      </div>
      
      <!-- More stat cards would go here -->
    </div>
    
    <!-- Content panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
        <!-- Activity content would go here -->
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Performance</h2>
        <!-- Performance content would go here -->
      </div>
    </div>
  </main>
</div>
