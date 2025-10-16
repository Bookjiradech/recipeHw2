import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type LocalRecipe = {
  id: string;                // e.g., "local-1728550000000"
  title: string;
  image?: string;
  summary?: string;          // เหมือน RecipeInfo.summary (HTML ได้/หรือ plain text)
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
  createdAt: number;
};

const KEY = "my_recipes_v1";
const canUse = typeof window !== "undefined" && !!window.localStorage;

const load = (): LocalRecipe[] => {
  if (!canUse) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const save = (items: LocalRecipe[]) => {
  if (!canUse) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
};

interface MyRecipesState {
  items: LocalRecipe[];
}
const initialState: MyRecipesState = { items: load() };

type AddInput = {
  title: string;
  image?: string;
  summary?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
};

const slice = createSlice({
  name: "myRecipes",
  initialState,
  reducers: {
    // ใช้ payload แบบอ็อบเจ็กต์ เพื่อรับฟิลด์ครบเหมือน API
    addMyRecipe: {
      prepare(input: AddInput) {
        const now = Date.now();
        return {
          payload: {
            id: `local-${now}`,
            title: input.title,
            image: input.image,
            summary: input.summary,
            readyInMinutes: input.readyInMinutes,
            servings: input.servings,
            sourceUrl: input.sourceUrl,
            createdAt: now,
          } as LocalRecipe,
        };
      },
      reducer(state, action: PayloadAction<LocalRecipe>) {
        state.items.unshift(action.payload);
        save(state.items);
      },
    },
    removeMyRecipe(state, action: PayloadAction<string>) {
      state.items = state.items.filter((r) => r.id !== action.payload);
      save(state.items);
    },
    updateMyRecipe(
      state,
      action: PayloadAction<{
        id: string;
        title?: string;
        image?: string;
        summary?: string;
        readyInMinutes?: number;
        servings?: number;
        sourceUrl?: string;
      }>
    ) {
      const it = state.items.find((r) => r.id === action.payload.id);
      if (it) {
        if (typeof action.payload.title === "string") it.title = action.payload.title;
        if (typeof action.payload.image === "string") it.image = action.payload.image;
        if (typeof action.payload.summary === "string") it.summary = action.payload.summary;
        if (typeof action.payload.readyInMinutes === "number") it.readyInMinutes = action.payload.readyInMinutes;
        if (typeof action.payload.servings === "number") it.servings = action.payload.servings;
        if (typeof action.payload.sourceUrl === "string") it.sourceUrl = action.payload.sourceUrl;
        save(state.items);
      }
    },
    clearMyRecipes(state) {
      state.items = [];
      save(state.items);
    },
  },
});

export const { addMyRecipe, removeMyRecipe, updateMyRecipe, clearMyRecipes } = slice.actions;
export default slice.reducer;
