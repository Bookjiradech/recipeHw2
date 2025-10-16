// C:\File\lab2Website\recipe-app\src\routes\Favorites.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import MenuGrid from "../components/MenuGrid";
import axios from "axios";
import type { Menu } from "../types/menu";
import { removeMyRecipe } from "../store/myRecipesSlice";
import MenuCard from "../components/MenuCard";

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string | undefined;

export default function Favorites() {
  const dispatch = useDispatch<AppDispatch>();
  const ids = useSelector((s: RootState) => s.favorites.ids);
  const myRecipes = useSelector((s: RootState) => s.myRecipes.items);

  const [favMenus, setFavMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!ids.length) {
        setFavMenus([]);
        setErrMsg(null);
        return;
      }
      if (!API_KEY) {
        setFavMenus([]);
        setErrMsg("Missing API key. Favorites from API cannot be loaded.");
        return;
      }
      try {
        setLoading(true);
        setErrMsg(null);
        const { data } = await axios.get<Menu[]>(
          `https://api.spoonacular.com/recipes/informationBulk`,
          { params: { apiKey: API_KEY, ids: ids.join(",") } }
        );
        const mapped: Menu[] = (data as any[]).map((d) => ({
          id: d.id,
          title: d.title,
          image: d.image,
        }));
        setFavMenus(mapped);
      } catch (e: any) {
        const status = e?.response?.status;
        if (status === 402) {
          setErrMsg(
            "Spoonacular quota/billing (402): cannot load API favorites right now."
          );
        } else if (status === 401) {
          setErrMsg("Invalid API key (401): Check VITE_SPOONACULAR_API_KEY.");
        } else {
          setErrMsg(e?.message ?? "Failed to load favorites");
        }
        setFavMenus([]);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [ids]);


  return (
    <div className="space-y-8">
      {/* ========== API Favorites ========== */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">Favorites</h1>
        {loading && <p>Loading favorites…</p>}
        {errMsg && <p className="text-red-600">{errMsg}</p>}
        {!loading && favMenus.length === 0 && !errMsg && (
          <p className="text-gray-600">No favorite recipes yet.</p>
        )}
        {/* ใช้ MenuGrid ที่ส่ง detailsHref ให้การ์ดเรียบร้อย (ต้องเป็นเวอร์ชันที่แก้แล้ว) */}
        {!loading && favMenus.length > 0 && <MenuGrid menus={favMenus} />}
      </section>

      {/* ========== Local Recipes (behave like API) ========== */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">My Recipes (Local)</h2>


        {/* การ์ด Local: ใส่ detailsHref ให้กดได้ */}
        {myRecipes.length === 0 ? (
          <p className="text-gray-600">No local recipes yet. Add one above!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {myRecipes.map((r) => (
              <MenuCard
                key={r.id}
                menu={{ id: r.id, title: r.title, image: r.image }}
                detailsHref={`/menu/${r.id}`}  
                onRemove={() => dispatch(removeMyRecipe(r.id))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
