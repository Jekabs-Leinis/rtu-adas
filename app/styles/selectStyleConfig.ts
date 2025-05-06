import { StylesConfig } from "react-select";

export default {
  control: (base: any) => ({
    ...base,
    backgroundColor: "var(--color-bg-dark)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
    "&:hover": {
      borderColor: "var(--color-accent)",
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "var(--color-bg-dark)",
    color: "var(--color-text)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--color-accent-hover)" : "var(--color-bg-dark)",
    color: "var(--color-text)",
    "&:active": {
      backgroundColor: "var(--color-accent)",
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--color-text)",
  }),
  input: (base: any) => ({
    ...base,
    color: "var(--color-text)",
  }),
} as StylesConfig;