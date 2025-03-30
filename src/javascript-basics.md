---
title: JavaScript Basics - Essential Concepts
tags: [javascript, programming, basics]
createdAt: 2023-04-15T09:30:00Z
summary: A comprehensive overview of JavaScript fundamentals including variables, data types, functions, and control flow.
---

# JavaScript Basics

JavaScript is a versatile programming language that powers the interactive elements of websites. Here's a quick overview of essential JavaScript concepts.

## Variables

JavaScript has three ways to declare variables:

```javascript
// Using let (block-scoped, can be reassigned)
let name = "John";
name = "Jane"; // Valid reassignment

// Using const (block-scoped, cannot be reassigned)
const pi = 3.14159;
// pi = 3; // This would cause an error

// Using var (function-scoped, older way)
var age = 30;
```

## Data Types

JavaScript has several primary data types:

- **String**: Text values (`"Hello"`, `'World'`)
- **Number**: Numeric values (`42`, `3.14`)
- **Boolean**: `true` or `false`
- **Object**: Collection of key-value pairs (`{name: "John", age: 30}`)
- **Array**: Ordered collection of values (`[1, 2, 3, 4]`)
- **Null**: Intentional absence of value
- **Undefined**: Unassigned variable

## Functions

Functions are blocks of reusable code:

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function (ES6)
const greet = (name) => `Hello, ${name}!`;

// Function expression
const greet = function(name) {
  return `Hello, ${name}!`;
};
```

## Control Flow

JavaScript includes various control structures:

### Conditionals

```javascript
if (condition) {
  // code to run if condition is true
} else if (anotherCondition) {
  // code to run if anotherCondition is true
} else {
  // code to run if all conditions are false
}
```

### Loops

```javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// While loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// For...of loop (arrays)
const numbers = [1, 2, 3];
for (const num of numbers) {
  console.log(num);
}

// For...in loop (objects)
const person = {name: "John", age: 30};
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

## Modern JavaScript Features

ES6 and beyond introduced many powerful features:

- **Template literals**: `` `Hello, ${name}!` ``
- **Destructuring**: `const {name, age} = person;`
- **Spread operator**: `const newArray = [...oldArray];`
- **Default parameters**: `function greet(name = "Guest") {...}`
- **Classes**: `class Person {...}`
- **Modules**: `import { function } from "./module.js";`

This card covers just the basics - JavaScript has many more powerful features to explore! 