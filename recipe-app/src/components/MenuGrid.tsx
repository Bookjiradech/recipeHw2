import type { Menu } from "../types/menu";
import MenuCard from "./MenuCard";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";

export default function MenuGrid({ menus }: { menus: Menu[] }) {
  const dispatch = useDispatch();
  const favIds = useSelector((s: RootState) => s.favorites.ids);

  if (!menus?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-muted-foreground text-center">No recipes found. Try adjusting your search.</p>
      </div>
    );
  }

  const toggleFav = (id: string | number) =>
    favIds.includes(String(id)) ? dispatch(removeFavorite(id as any)) : dispatch(addFavorite(id as any));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {menus.map((m) => (
        <MenuCard
          key={m.id}
          menu={{ ...m, isLocal: String(m.id).startsWith("local-") }}
          detailsHref={`/menu/${m.id}`}
          // favorite toggle passes through MenuCard’s internal button
        />
      ))}
    </div>
  );
}
