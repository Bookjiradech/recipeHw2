import { Link } from "react-router-dom";
import type { Menu } from "../types/menu";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../store/favoritesSlice";
import type { RootState } from "../store/store";

// เพิ่ม isLocalItem ใน type definition เพื่อความชัดเจนในการส่ง prop
export default function MenuCard({
  menu,
  detailsHref,
  onRemove,
  isLocalItem = false,
}: {
  menu: Menu | { id: string | number; title: string; image?: string; isLocal?: boolean };
  detailsHref?: string;
  onRemove?: () => void;
  isLocalItem?: boolean;
}) {
  const dispatch = useDispatch();
  const favIds = useSelector((s: RootState) => s.favorites.ids);
  
  // ตรวจสอบ ID ว่าเป็น Favorite โดยต้องแปลงเป็น string เพื่อเปรียบเทียบกับ ID ใน Redux slice
  const isFav = favIds.includes(String(menu.id));
  
  // ตรวจสอบว่าเป็นสูตร Local โดยดูจาก prefix หรือ prop ที่ส่งมา
  const isLocal = String(menu.id).startsWith("local-") || isLocalItem;
  
  // ใช้ placeholder image ถ้าไม่มี image
  const defaultImage = "https://placehold.co/600x400/805ad5/ffffff?text=Delicious+Recipe";
  const img = (menu as any).image || defaultImage;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-indigo-500/50">
      
      {/* Image Section */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={img} 
          alt={menu.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          onError={(e) => {
            // Fallback in case of broken image URL
            e.currentTarget.src = defaultImage;
          }}
        />
        
        {/* LOCAL Tag */}
        {isLocal && (
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase rounded-full bg-indigo-600 text-white shadow-md">
            LOCAL
          </span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[3rem] text-balance">
          {menu.title}
        </h3>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-3">
          {/* Details Link/Button */}
          {detailsHref ? (
            <Link
              to={detailsHref}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold text-center shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition duration-150"
            >
              View Details
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-500 text-sm font-medium cursor-not-allowed"
            >
              Details N/A
            </button>
          )}

          {/* Remove or Favorite Button */}
          {onRemove ? (
            // Remove (for Local Recipes in Favorites view)
            <button
              onClick={onRemove}
              className="px-3 py-2 rounded-lg bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition duration-150 shadow-sm"
              title="Remove recipe"
            >
              {/* trash icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            // Favorite Toggle (for API Recipes)
            <button
              onClick={() => (isFav ? dispatch(removeFavorite(menu.id as any)) : dispatch(addFavorite(menu.id as any)))}
              className={`px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 transition duration-150 shadow-sm ${
                isFav 
                ? "bg-yellow-400 text-white hover:bg-yellow-500 focus:ring-yellow-500/50" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 focus:ring-gray-400/50"
              }`}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              {/* star icon */}
              <svg className="w-5 h-5" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
