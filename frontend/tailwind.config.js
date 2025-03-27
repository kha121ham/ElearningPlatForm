export const content = [
  "./src/**/*.{js,jsx,ts,tsx}", // Analyze all JS/JSX/TS/TSX files in the src folder
  "./public/index.html", // Analyze the main HTML file
];
export const theme = {
  extend: {
    animation: {
      "fade-in": "fadeIn 0.5s ease-out", // Define the fade-in animation
    },
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 }, // Start with opacity 0
        "100%": { opacity: 1 }, // End with opacity 1
      },
    },
  },
};
export const plugins = [
  require('@tailwindcss/line-clamp'), // Add the line-clamp plugin
];