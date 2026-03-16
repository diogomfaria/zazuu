import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        zazuu: {
          purple: { value: "#32124D" },
          lime: { value: "#B2D235" },
          offwhite: { value: "#FAFAFA" },
        },
      },
      fonts: {
        body: { value: "'Inter', sans-serif" },
        heading: { value: "'Plus Jakarta Sans', sans-serif" },
      },
      spacing: {
        subtle: { value: "1px" },
      },
      shadows: {
        subtle: { value: "0 2px 10px rgba(50, 18, 77, 0.05)" },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          primary: { value: "{colors.zazuu.purple}" },
          accent: { value: "{colors.zazuu.lime}" },
          bg: { value: "{colors.zazuu.offwhite}" },
        },
      },
    },
    recipes: {
      button: {
        variants: {
          primary: {
            container: {
              bg: "brand.accent",
              color: "#292929",
              borderRadius: "full",
              fontWeight: "bold",
              px: "8",
              _hover: {
                bg: "#c1e245",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(178, 210, 53, 0.3)",
              },
              _active: {
                transform: "translateY(0)",
              },
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            },
          },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "brand.bg",
      color: "brand.primary",
      fontFamily: "body",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "heading",
      fontWeight: "bold",
    },
    "*": {
      borderColor: "#E2E8F0",
    },
  },
})

export const system = createSystem(defaultConfig, config)
