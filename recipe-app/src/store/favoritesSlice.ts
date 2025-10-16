// src/store/favoritesSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const FAV_KEY = "fav_recipe_ids";

// Guard for SSR/Node (no localStorage)
const canUseStorage =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const loadFavouritesFromStorage = (): string[] => {
  if (!canUseStorage) return [];
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavouritesToStorage = (ids: string[]) => {
  if (!canUseStorage) return;
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(ids));
  } catch {
    // ignore write errors
  }
};

interface FavoritesState {
  ids: string[]; // store as string to be robust with JSON/localStorage
}

const initialState: FavoritesState = {
  ids: loadFavouritesFromStorage(),
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<number | string>) {
      const v = String(action.payload);
      if (!state.ids.includes(v)) {
        state.ids.push(v);
        saveFavouritesToStorage(state.ids);
      }
    },
    removeFavorite(state, action: PayloadAction<number | string>) {
      const v = String(action.payload);
      state.ids = state.ids.filter((id) => id !== v);
      saveFavouritesToStorage(state.ids);
    },
    clearFavorites(state) {
      state.ids = [];
      saveFavouritesToStorage(state.ids);
    },
    setFavorites(state, action: PayloadAction<(number | string)[]>) {
      state.ids = action.payload.map(String);
      saveFavouritesToStorage(state.ids);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites, setFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
