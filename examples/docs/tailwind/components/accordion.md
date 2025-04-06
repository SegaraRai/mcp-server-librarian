---
tags: ["interactive", "ui", "collapse", "expand"]
---

# Accordion Component

A collection of accordion styles created with Tailwind CSS.

## Basic Accordion

A simple accordion with toggle functionality. This example uses a hidden checkbox to toggle the content visibility.

```html
<div class="w-full max-w-md mx-auto">
  <!-- Accordion Item 1 -->
  <div class="border border-gray-200 rounded-md mb-2">
    <div class="w-full">
      <input type="checkbox" id="accordion-1" class="hidden peer" />
      <label
        for="accordion-1"
        class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
      >
        Accordion Item #1
        <svg
          class="w-6 h-6 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-4 border-t border-gray-200">
        <p class="text-gray-700">
          This is the content for the first accordion item. You can put any
          content here, including text, images, or other HTML elements.
        </p>
      </div>
    </div>
  </div>

  <!-- Accordion Item 2 -->
  <div class="border border-gray-200 rounded-md mb-2">
    <div class="w-full">
      <input type="checkbox" id="accordion-2" class="hidden peer" />
      <label
        for="accordion-2"
        class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
      >
        Accordion Item #2
        <svg
          class="w-6 h-6 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-4 border-t border-gray-200">
        <p class="text-gray-700">
          This is the content for the second accordion item. You can put any
          content here, including text, images, or other HTML elements.
        </p>
      </div>
    </div>
  </div>

  <!-- Accordion Item 3 -->
  <div class="border border-gray-200 rounded-md">
    <div class="w-full">
      <input type="checkbox" id="accordion-3" class="hidden peer" />
      <label
        for="accordion-3"
        class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
      >
        Accordion Item #3
        <svg
          class="w-6 h-6 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-4 border-t border-gray-200">
        <p class="text-gray-700">
          This is the content for the third accordion item. You can put any
          content here, including text, images, or other HTML elements.
        </p>
      </div>
    </div>
  </div>
</div>
```

## Styled Accordion

An accordion with more styling and a different visual appearance.

```html
<div class="w-full max-w-md mx-auto space-y-4">
  <!-- Accordion Item 1 -->
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="w-full">
      <input type="checkbox" id="styled-accordion-1" class="hidden peer" />
      <label
        for="styled-accordion-1"
        class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <span class="text-lg">How do I create an account?</span>
        <svg
          class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-5">
        <p class="text-gray-700">
          To create an account, click on the "Sign Up" button in the top right
          corner of the page. Fill out the required information and click
          "Create Account". You'll receive a confirmation email to verify your
          account.
        </p>
      </div>
    </div>
  </div>

  <!-- Accordion Item 2 -->
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="w-full">
      <input type="checkbox" id="styled-accordion-2" class="hidden peer" />
      <label
        for="styled-accordion-2"
        class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <span class="text-lg">What payment methods do you accept?</span>
        <svg
          class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-5">
        <p class="text-gray-700">
          We accept all major credit cards (Visa, MasterCard, American Express),
          PayPal, and bank transfers. For enterprise customers, we also offer
          invoicing options.
        </p>
      </div>
    </div>
  </div>

  <!-- Accordion Item 3 -->
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="w-full">
      <input type="checkbox" id="styled-accordion-3" class="hidden peer" />
      <label
        for="styled-accordion-3"
        class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <span class="text-lg">How can I contact customer support?</span>
        <svg
          class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-5">
        <p class="text-gray-700">
          You can contact our customer support team via email at
          support@example.com, through the live chat on our website, or by
          calling our support line at (123) 456-7890 during business hours.
        </p>
      </div>
    </div>
  </div>
</div>
```

## FAQ Accordion

An accordion styled specifically for Frequently Asked Questions.

```html
<div class="w-full max-w-3xl mx-auto">
  <h2 class="text-2xl font-bold mb-6 text-center">
    Frequently Asked Questions
  </h2>

  <div class="space-y-4">
    <!-- FAQ Item 1 -->
    <div class="border border-gray-200 rounded-lg">
      <div class="w-full">
        <input type="checkbox" id="faq-1" class="hidden peer" />
        <label
          for="faq-1"
          class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer rounded-lg hover:bg-gray-50"
        >
          <span class="text-lg">What is Tailwind CSS?</span>
          <svg
            class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </label>
        <div
          class="hidden peer-checked:block p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <p class="text-gray-700">
            Tailwind CSS is a utility-first CSS framework that allows you to
            build custom designs without leaving your HTML. It provides
            low-level utility classes that let you build completely custom
            designs without ever leaving your HTML.
          </p>
        </div>
      </div>
    </div>

    <!-- FAQ Item 2 -->
    <div class="border border-gray-200 rounded-lg">
      <div class="w-full">
        <input type="checkbox" id="faq-2" class="hidden peer" />
        <label
          for="faq-2"
          class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer rounded-lg hover:bg-gray-50"
        >
          <span class="text-lg">How is Tailwind different from Bootstrap?</span>
          <svg
            class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </label>
        <div
          class="hidden peer-checked:block p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <p class="text-gray-700">
            While Bootstrap provides pre-designed components that you can drop
            into your projects, Tailwind provides utility classes that you can
            combine to create your own custom designs. Bootstrap is
            component-based, while Tailwind is utility-based.
          </p>
        </div>
      </div>
    </div>

    <!-- FAQ Item 3 -->
    <div class="border border-gray-200 rounded-lg">
      <div class="w-full">
        <input type="checkbox" id="faq-3" class="hidden peer" />
        <label
          for="faq-3"
          class="flex justify-between items-center p-5 w-full font-medium text-left text-gray-900 cursor-pointer rounded-lg hover:bg-gray-50"
        >
          <span class="text-lg">Is Tailwind responsive?</span>
          <svg
            class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </label>
        <div
          class="hidden peer-checked:block p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg"
        >
          <p class="text-gray-700">
            Yes, Tailwind is fully responsive. It includes a responsive variant
            system that lets you apply utility classes at specific breakpoints.
            For example, you can use classes like <code>md:flex</code> to apply
            the flex display only on medium-sized screens and larger.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Accordion with JavaScript

For more complex behavior, you can use JavaScript to control the accordion. This example uses Alpine.js for the toggle functionality.

```html
<!-- Include Alpine.js -->
<script
  src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"
  defer
></script>

<div class="w-full max-w-md mx-auto" x-data="{selected:null}">
  <!-- Accordion Item 1 -->
  <div class="border border-gray-200 rounded-md mb-2">
    <button
      @click="selected !== 1 ? selected = 1 : selected = null"
      class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 hover:bg-gray-100 focus:outline-none"
      :class="{'bg-gray-100': selected === 1}"
    >
      <span>Accordion Item #1</span>
      <svg
        class="w-6 h-6 text-gray-500 transition-transform duration-200"
        :class="{'rotate-180': selected === 1}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <div
      x-show="selected === 1"
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="opacity-0 transform -translate-y-2"
      x-transition:enter-end="opacity-100 transform translate-y-0"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100 transform translate-y-0"
      x-transition:leave-end="opacity-0 transform -translate-y-2"
      class="p-4 border-t border-gray-200"
    >
      <p class="text-gray-700">
        This is the content for the first accordion item. You can put any
        content here, including text, images, or other HTML elements.
      </p>
    </div>
  </div>

  <!-- Accordion Item 2 -->
  <div class="border border-gray-200 rounded-md mb-2">
    <button
      @click="selected !== 2 ? selected = 2 : selected = null"
      class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 hover:bg-gray-100 focus:outline-none"
      :class="{'bg-gray-100': selected === 2}"
    >
      <span>Accordion Item #2</span>
      <svg
        class="w-6 h-6 text-gray-500 transition-transform duration-200"
        :class="{'rotate-180': selected === 2}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <div
      x-show="selected === 2"
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="opacity-0 transform -translate-y-2"
      x-transition:enter-end="opacity-100 transform translate-y-0"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100 transform translate-y-0"
      x-transition:leave-end="opacity-0 transform -translate-y-2"
      class="p-4 border-t border-gray-200"
    >
      <p class="text-gray-700">
        This is the content for the second accordion item. You can put any
        content here, including text, images, or other HTML elements.
      </p>
    </div>
  </div>

  <!-- Accordion Item 3 -->
  <div class="border border-gray-200 rounded-md">
    <button
      @click="selected !== 3 ? selected = 3 : selected = null"
      class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 hover:bg-gray-100 focus:outline-none"
      :class="{'bg-gray-100': selected === 3}"
    >
      <span>Accordion Item #3</span>
      <svg
        class="w-6 h-6 text-gray-500 transition-transform duration-200"
        :class="{'rotate-180': selected === 3}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <div
      x-show="selected === 3"
      x-transition:enter="transition ease-out duration-200"
      x-transition:enter-start="opacity-0 transform -translate-y-2"
      x-transition:enter-end="opacity-100 transform translate-y-0"
      x-transition:leave="transition ease-in duration-200"
      x-transition:leave-start="opacity-100 transform translate-y-0"
      x-transition:leave-end="opacity-0 transform -translate-y-2"
      class="p-4 border-t border-gray-200"
    >
      <p class="text-gray-700">
        This is the content for the third accordion item. You can put any
        content here, including text, images, or other HTML elements.
      </p>
    </div>
  </div>
</div>
```

## Nested Accordion

An accordion with nested items.

```html
<div class="w-full max-w-md mx-auto">
  <!-- Parent Accordion Item -->
  <div class="border border-gray-200 rounded-md mb-4">
    <div class="w-full">
      <input type="checkbox" id="parent-accordion" class="hidden peer" />
      <label
        for="parent-accordion"
        class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
      >
        Parent Accordion Item
        <svg
          class="w-6 h-6 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-4 border-t border-gray-200">
        <p class="text-gray-700 mb-4">
          This is the parent accordion content. Below are nested accordion
          items.
        </p>

        <!-- Nested Accordion Items -->
        <div class="space-y-2 pl-4 border-l-2 border-gray-200">
          <!-- Nested Item 1 -->
          <div class="border border-gray-200 rounded-md">
            <div class="w-full">
              <input
                type="checkbox"
                id="nested-accordion-1"
                class="hidden peer"
              />
              <label
                for="nested-accordion-1"
                class="flex justify-between items-center p-3 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Nested Item #1
                <svg
                  class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </label>
              <div
                class="hidden peer-checked:block p-3 border-t border-gray-200"
              >
                <p class="text-gray-700">
                  This is the content for the first nested accordion item.
                </p>
              </div>
            </div>
          </div>

          <!-- Nested Item 2 -->
          <div class="border border-gray-200 rounded-md">
            <div class="w-full">
              <input
                type="checkbox"
                id="nested-accordion-2"
                class="hidden peer"
              />
              <label
                for="nested-accordion-2"
                class="flex justify-between items-center p-3 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Nested Item #2
                <svg
                  class="w-5 h-5 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </label>
              <div
                class="hidden peer-checked:block p-3 border-t border-gray-200"
              >
                <p class="text-gray-700">
                  This is the content for the second nested accordion item.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Another Parent Accordion Item -->
  <div class="border border-gray-200 rounded-md">
    <div class="w-full">
      <input type="checkbox" id="parent-accordion-2" class="hidden peer" />
      <label
        for="parent-accordion-2"
        class="flex justify-between items-center p-4 w-full font-medium text-left text-gray-900 cursor-pointer hover:bg-gray-100"
      >
        Another Parent Item
        <svg
          class="w-6 h-6 text-gray-500 peer-checked:rotate-180 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </label>
      <div class="hidden peer-checked:block p-4 border-t border-gray-200">
        <p class="text-gray-700">
          This is the content for another parent accordion item without nested
          items.
        </p>
      </div>
    </div>
  </div>
</div>
```
