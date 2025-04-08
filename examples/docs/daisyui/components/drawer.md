---
tags: ["daisyui", "components", "drawer", "sidebar", "layout", "responsive", "checkbox"]
source: "https://daisyui.com/llms.txt"
---

### drawer
Drawer is a grid layout that can show/hide a sidebar on the left or right side of the page

[drawer docs](https://daisyui.com/components/drawer/)

#### Class names
- component: `drawer`
- part: `drawer-toggle`, `drawer-content`, `drawer-side`, `drawer-overlay`
- placement: `drawer-end`
- modifier: `drawer-open`

#### Syntax
```html
<div class="drawer {MODIFIER}">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">{CONTENT}</div>
  <div class="drawer-side">{SIDEBAR}</div>
</div>
```
where {CONTENT} can be navbar, site content, footer, etc
and {SIDEBAR} can be a menu like:
```html
<ul class="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
</ul>
```

#### Rules
- {MODIFIER} is optional and can have one of the modifier/placement class names
- `id` is required for the `drawer-toggle` input. change `my-drawer` to a unique id according to your needs
- `lg:drawer-open` can be used to make sidebar visible on larger screens
- `drawer-toggle` is a hidden checkbox. Use label with "for" attribute to toggle state
- if you want to open the drawer when a button is clicked, use `<label for="my-drawer" class="btn drawer-button">Open drawer</label>` where `my-drawer` is the id of the `drawer-toggle` input
- when using drawer, every page content must be inside `drawer-content` element. for example navbar, footer, etc should not be outside of `drawer`
