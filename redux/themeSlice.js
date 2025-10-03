import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark", // can be "light" | "dark" | "custom"
  accentColor: "#35DE4E", // default accent color (green)
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
    setTheme: (state, action) => {
      state.mode = action.payload; // explicitly set "light" | "dark" | "custom"
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;
