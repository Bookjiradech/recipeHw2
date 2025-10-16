// src/store/MenuSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Menu, MenuResponse } from "../types/menu";

export type MenuState = {
  items: Menu[];
  status: "idle" | "loading" | "succeeded" | "failed";
  count: number;
  limit: number;
  offset: number;
  query: string;
  ordering: string;
  error: string | null;
};

const initialState: MenuState = {
  items: [],
  status: "idle",
  count: 0,
  limit: 20,
  offset: 0,
  query: "",
  ordering: "",
  error: null,
};

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string | undefined;

export const fetchMenus = createAsyncThunk<
  MenuResponse,
  { offset?: number; limit?: number; ordering?: string; query?: string },
  { rejectValue: string }
>(
  "menu/fetchMenus",
  async ({ offset = 0, limit = 20, ordering = "", query = "" }, { rejectWithValue }) => {
    try {
      if (!API_KEY) {
        return rejectWithValue("Missing API key. Please set VITE_SPOONACULAR_API_KEY in .env");
      }
      const response = await axios.get<MenuResponse>(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            apiKey: API_KEY,
            offset,
            number: limit,
            sort: ordering || undefined,
            query: query || undefined,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 402) {
        return rejectWithValue("Spoonacular quota/billing (402): You've exceeded your plan or billing is required.");
      }
      if (status === 401) {
        return rejectWithValue("Invalid API key (401): Check VITE_SPOONACULAR_API_KEY.");
      }
      return rejectWithValue(err?.message || "Request failed");
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.offset = 0;
    },
    setOrdering(state, action: PayloadAction<string>) {
      state.ordering = action.payload;
      state.offset = 0;
    },
    setOffset(state, action: PayloadAction<number>) {
      state.offset = action.payload;
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload;
      state.offset = 0;
    },
    resetFilters(state) {
      state.query = "";
      state.ordering = "";
      state.offset = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.results;
        state.count = action.payload.totalResults;
        state.error = null;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? action.error.message ?? "Request failed";
        state.items = [];
        state.count = 0;
      });
  },
});

export const { setQuery, setOrdering, setOffset, setLimit, resetFilters } =
  menuSlice.actions;
export default menuSlice.reducer;
