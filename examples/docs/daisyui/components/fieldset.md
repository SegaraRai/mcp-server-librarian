---
tags: ["daisyui", "components", "fieldset", "form", "grouping", "legend", "label"]
source: "https://daisyui.com/llms.txt"
---

### fieldset
Fieldset is a container for grouping related form elements. It includes fieldset-legend as a title and fieldset-label as a description

[fieldset docs](https://daisyui.com/components/fieldset/)

#### Class names
- Component: `fieldset`
- Parts: `fieldset-legend`, `fieldset-label`

#### Syntax
```html
<fieldset class="fieldset">
  <legend class="fieldset-legend">{title}</legend>
  {CONTENT}
  <p class="fieldset-label">{description}</p>
</fieldset>
```

#### Rules
- You can use any element as a direct child of fieldset to add form elements
