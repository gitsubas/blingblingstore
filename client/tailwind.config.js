/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#e5358dff', // Red
                    hover: '#D32F2F',
                    light: '#FFEBEE',
                }
            }
        },
    },
    plugins: [],
}
