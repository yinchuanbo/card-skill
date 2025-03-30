---
title: 中国人
tags: [css, web-design, layout, flexbox]
createdAt: 2023-05-21T14:45:00Z
summary: A practical guide to CSS Flexbox layout system with examples and common use cases for responsive web design.
---

# CSS Flexbox Layout

Flexbox is a powerful CSS layout model that makes designing flexible responsive layouts without using float or positioning much easier.

## Basic Concepts

Flexbox works with a **flex container** (parent) and **flex items** (children):

```css
/* Create a flex container */
.container {
  display: flex;
  /* or display: inline-flex; */
}
```

## Container Properties

### Direction

Control the direction of flex items:

```css
.container {
  flex-direction: row; /* default: left to right */
  /* Other options: row-reverse, column, column-reverse */
}
```

### Wrapping

Control whether items must stay in a single line or can wrap:

```css
.container {
  flex-wrap: nowrap; /* default: no wrapping */
  /* Other options: wrap, wrap-reverse */
}
```

### Justify Content

Align items horizontally:

```css
.container {
  justify-content: flex-start; /* default: items at start */
  /* Other options: flex-end, center, space-between, space-around, space-evenly */
}
```

### Align Items

Align items vertically:

```css
.container {
  align-items: stretch; /* default: stretch to fill container */
  /* Other options: flex-start, flex-end, center, baseline */
}
```

### Align Content

Align wrapped lines:

```css
.container {
  align-content: flex-start;
  /* Other options: flex-end, center, space-between, space-around, stretch (default) */
}
```

## Item Properties

### Order

Change the order of specific flex items:

```css
.item {
  order: 0; /* default */
  /* Can be negative or positive */
}
```

### Flex Grow

Control how much an item can grow:

```css
.item {
  flex-grow: 0; /* default: don't grow */
  /* Higher values grow more */
}
```

### Flex Shrink

Control how much an item can shrink:

```css
.item {
  flex-shrink: 1; /* default: can shrink */
  /* Higher values shrink more */
}
```

### Flex Basis

Set the initial size of an item:

```css
.item {
  flex-basis: auto; /* default */
  /* Can be a length (e.g., 300px) or auto */
}
```

### Shorthand

The `flex` property combines grow, shrink, and basis:

```css
.item {
  flex: 0 1 auto; /* default (grow shrink basis) */
  /* Common values: flex: 1; (grow fully) */
}
```

### Align Self

Override alignment for specific items:

```css
.item {
  align-self: auto; /* default: use container's align-items */
  /* Other options: flex-start, flex-end, center, baseline, stretch */
}
```

## Common Flexbox Patterns

### Centering Content

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* For full-screen centering */
}
```

### Navigation Bar

```css
.navbar {
  display: flex;
  justify-content: space-between;
}

.nav-links {
  display: flex;
  gap: 20px; /* Modern way to add spacing between items */
}
```

### Card Layout

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 0 1 300px; /* Don't grow, can shrink, basis 300px */
}
```

## Browser Support

Flexbox is supported in all modern browsers. For older browsers, consider using a CSS preprocessor with appropriate polyfills. 