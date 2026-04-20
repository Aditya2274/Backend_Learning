[text](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading#images_iframes_videos_and_audio)
To understand these concepts, think of your website as a physical library.

If you try to hand the user every single book in the library the moment they walk through the front door, they will be crushed under the weight. Code Splitting is the strategy of organizing the books onto shelves, and Dynamic Imports are the "request slips" the user uses to go get a specific book only when they are ready to read it.

1. Code Splitting (The Strategy)
By default, when you "build" a JavaScript application, the computer takes all your files and mashes them into one giant file called a bundle (e.g., app.js). As your app grows, this bundle becomes massive—often several megabytes.

Code Splitting is the process of telling your build tool (like Webpack or Vite): "Don't make one giant file. Make several smaller files (chunks) instead."

There are two main ways to split code:

A. Entry Point Splitting
This is based on the URL.

The Logic: If the user is on the /home page, they don't need the code for the /admin dashboard.

The Result: The builder creates a home.js and an admin.js. The browser only downloads the one it needs for the current page.

B. Dynamic Splitting
This is based on User Logic.

The Logic: Even on the home page, the user might never click the "Open Settings" modal.

The Result: The builder puts the "Settings Modal" code into its own tiny file. It sits on the server and is never downloaded unless that specific button is clicked.

2. Dynamic Imports (The Tool)
If Code Splitting is the idea of breaking files apart, Dynamic Import is the actual JavaScript syntax we use to make it happen.

Static Import (The "Weight")
A static import looks like this: import { HeavyMath } from './math.js';.

It must be at the top of the file.

It is synchronous.

The browser must download and parse math.js before it can finish the "Load" race and show the page.

Dynamic Import (The "Request")
A dynamic import uses the import() function. It looks like this:

JavaScript
// This does NOTHING when the page loads
const loadLibrary = async () => {
  // The browser only starts the download NOW
  const { HeavyMath } = await import('./math.js');
  HeavyMath.calculate();
};
Why it's a "Superpower":
It returns a Promise: Because it's asynchronous, it doesn't block the Main Thread or the Critical Rendering Path.

Variable Paths: You can decide what to load while the app is running: import(./themes/${userTheme}.js).

On-Demand: You can put it inside an if statement or an event listener.

3. How they work together
When your build tool (the "bundler") sees a dynamic import() in your code, it says: "Aha! This code is not needed immediately. I will automatically perform Dynamic Splitting and put everything inside that import into a separate file."

The "Internal" Timeline:
Initial Load: The browser downloads a tiny "Main" script. The page becomes interactive (DOM/CSSOM finishes) very fast.

The Trigger: The user clicks a button.

The Fetch: The import() function fires. The browser fetches the "chunk" file from the server.

The Update: The browser parses that new code and updates the "Dynamic Map" (Render Tree) with the new features.