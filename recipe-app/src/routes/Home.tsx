import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMenus,
  setOffset,
  setOrdering,
  setQuery,
  resetFilters,
} from "../store/MenuSlice";
import { addMyRecipe } from "../store/myRecipesSlice";
import type { RootState, AppDispatch } from "../store/store";

import MenuGrid from "../components/MenuGrid";
import Pagination from "../components/Pagination";
import type { Menu } from "../types/menu";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error, count, limit, offset, query, ordering } =
    useSelector((state: RootState) => state.menu);
  const myRecipes = useSelector((s: RootState) => s.myRecipes.items);

  // --- Modal state for Add Recipe (full fields) ---
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [summary, setSummary] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState<number | "">("");
  const [servings, setServings] = useState<number | "">("");
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    // โหลดข้อมูลเมื่อ parameters เปลี่ยน
    dispatch(fetchMenus({ offset, limit, query, ordering }));
    // เมื่อมีการค้นหาหรือเรียงลำดับใหม่ ให้ Scroll กลับไปด้านบน
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, offset, limit, query, ordering]);

  // รวมผลจาก API + local ให้โชว์ในกริดเดียวกัน
  const combined: Menu[] = useMemo(() => {
    const apiPart = items;
    const localPart: Menu[] = myRecipes.map((r) => ({
      id: r.id, // "local-..."
      title: r.title,
      image:
        r.image ||
        "https://via.placeholder.com/600x400?text=Local+Recipe",
    }));

    // Local recipes จะอยู่บนสุด
    const merged = [...localPart, ...apiPart];

    // กรองผลลัพธ์ถ้ามีการค้นหา (query)
    if (!query) return merged;
    const q = query.toLowerCase();
    // กรองทั้ง local และ API
    return merged.filter((m) => m.title.toLowerCase().includes(q));
  }, [items, myRecipes, query]);

  const canAdd = title.trim().length > 0;

  const submitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdd) return;
    dispatch(
      addMyRecipe({
        title: title.trim(),
        image: image.trim() || undefined,
        summary: summary.trim() || undefined,
        readyInMinutes: typeof readyInMinutes === "number" ? readyInMinutes : undefined,
        servings: typeof servings === "number" ? servings : undefined,
        sourceUrl: sourceUrl.trim() || undefined,
      })
    );
    // reset & close
    setTitle("");
    setImage("");
    setSummary("");
    setReadyInMinutes("");
    setServings("");
    setSourceUrl("");
    setShowAdd(false);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(setOffset(0)); // กลับไปหน้า 1
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      {/* Search, Filter, and Action Bar */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 p-4 bg-white rounded-xl shadow-md sticky top-0 z-10 border border-gray-100">
        
        {/* Search Input */}
        <div className="flex-grow min-w-[200px]">
          <input
            type="text"
            placeholder="Search recipes (e.g., pasta, chicken)..."
            value={query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          />
        </div>

        {/* Sort Select */}
        <select
          value={ordering}
          onChange={(e) => dispatch(setOrdering(e.target.value))}
          className="border border-gray-300 rounded-lg p-2.5 min-w-[150px] focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white bg-[url('data:image/svg+xml;base64,...')]"
        >
          <option value="">Sort by Relevance</option>
          <option value="title">Alphabetical (Title)</option>
          <option value="popularity">Popularity</option>
        </select>
        
        {/* Search & Reset Buttons */}
        <div className="flex gap-2">
            <button
              className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-700 transition duration-150 shadow-md"
              onClick={() =>
                dispatch(fetchMenus({ offset: 0, limit, query, ordering }))
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              Search
            </button>
            <button
              className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2.5 font-medium hover:bg-gray-300 transition duration-150"
              onClick={handleReset}
            >
              Reset
            </button>
        </div>

        {/* Add Recipe Button */}
        <button
          className="flex items-center bg-green-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-green-700 transition duration-150 shadow-md ml-auto"
          onClick={() => setShowAdd(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Add Recipe
        </button>
      </div>

      {/* Status Messages */}
      {status === "loading" && (
        <div className="flex justify-center p-8">
          <p className="text-xl font-medium text-blue-600">Loading delicious recipes...</p>
        </div>
      )}
      {status === "failed" && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">API Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Recipe Grid (Combined Local + API) */}
      <MenuGrid menus={combined} />

      {/* Pagination */}
      {/* แสดง Pagination เฉพาะเมื่อไม่มีการค้นหา (query) และไม่มีการเรียงลำดับแบบ Local (Local recipes ถูกรวมใน Combined) */}
      {!query && (
        <div className="mt-8">
          <Pagination total={count} limit={limit} offset={offset} />
        </div>
      )}

      {/* Modal: Add Local Recipe with full fields (Improved UI) */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border w-full max-w-lg p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
            
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Create New Local Recipe</h2>
                <button 
                    type="button" 
                    onClick={() => setShowAdd(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <form onSubmit={submitAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Recipe Title <span className="text-red-500">*</span></label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Mom's Famous Curry"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.com/dish.jpg"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Source URL</label>
                <input
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://blog.com/original-recipe"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
              </div>

              {/* Ready in Minutes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ready in (Minutes)</label>
                <input
                  value={readyInMinutes}
                  onChange={(e) =>
                    setReadyInMinutes(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  type="number"
                  min={0}
                  placeholder="e.g., 45"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
              </div>

              {/* Servings */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Servings</label>
                <input
                  value={servings}
                  onChange={(e) =>
                    setServings(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  type="number"
                  min={1}
                  placeholder="e.g., 4"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />
              </div>

              {/* Summary */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Summary (Description)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A short description of the recipe..."
                  rows={4}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-4 border-t mt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canAdd}
                  className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Save Recipe
                </button>
              </div>

              {/* Info Text */}
              <p className="md:col-span-2 text-xs text-gray-500 mt-2">
                Note: Local recipes are stored only in your browser's local storage.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}