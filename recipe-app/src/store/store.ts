import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './MenuSlice';
import favoritesReducer from './favoritesSlice';
import myRecipesReducer from './myRecipesSlice';


export const store = configureStore({
reducer: {
menu: menuReducer,
favorites: favoritesReducer,
myRecipes: myRecipesReducer,
},
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;