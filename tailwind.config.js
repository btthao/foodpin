module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      boxShadow: {
        elevated: "0 0 8px rgba(0,0,0,0.1)",
      },
      textColor: {
        grey1: "#efefef",
        "grey-muted": "#757575",
        "grey-icon": "#767676",
      },
      backgroundColor: {
        grey1: "#efefef",
        grey2: "#E2E2E2",
      },
      keyframes: {
        "slide-up": {
          "0%": {
            opacity: "0.8",
            transform: "translateY(12px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0px)",
          },
        },
      },
      animation: {
        "slide-up":
          "slide-up 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
      transitionProperty: {
        height: "height",
      },
      cursor: {
        "zoom-in": "zoom-in",
      },
    },
  },
  plugins: [],
};
