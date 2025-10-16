import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type RecipeInfo = {
  id: number | string;
  title: string;
  image: string;
  summary?: string;
  readyInMinutes?: number;
  servings?: number;
  sourceUrl?: string;
};

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY as string | undefined;

export default function MenuDetail() {
  const { id } = useParams<{ id: string }>();
  const myRecipes = useSelector((s: RootState) => s.myRecipes.items);

  const isLocal = useMemo(() => !!id && id.startsWith("local-"), [id]);
  const localData = useMemo(() => myRecipes.find((r) => r.id === id), [myRecipes, id]);

  const [data, setData] = useState<RecipeInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (!id) {
        setStatus("failed");
        setError("Invalid recipe id.");
        return;
      }

      // กรณี local: map ข้อมูลแล้วจบ
      if (isLocal) {
        if (!localData) {
          setStatus("failed");
          setError("Local recipe not found.");
          return;
        }
        const mapped: RecipeInfo = {
          id: localData.id,
          title: localData.title,
          image:
            localData.image ||
            "https://via.placeholder.com/800x500?text=Local+Recipe",
          summary: localData.summary,
          readyInMinutes: localData.readyInMinutes,
          servings: localData.servings,
          sourceUrl: localData.sourceUrl,
        };
        if (mounted) {
          setData(mapped);
          setStatus("succeeded");
        }
        return;
      }

      // กรณี API
      try {
        if (!API_KEY) {
          setStatus("failed");
          setError("Missing API key. Set VITE_SPOONACULAR_API_KEY in .env");
          return;
        }
        setStatus("loading");
        setError(null);

        const res = await axios.get<RecipeInfo>(
          `https://api.spoonacular.com/recipes/${id}/information`,
          { params: { apiKey: API_KEY, includeNutrition: false } }
        );
        if (mounted) {
          setData(res.data);
          setStatus("succeeded");
        }
      } catch (e: any) {
        const statusCode = e?.response?.status;
        if (statusCode === 402) setError("Spoonacular quota/billing (402): Your plan/credits may be exhausted.");
        else if (statusCode === 401) setError("Invalid API key (401): Check VITE_SPOONACULAR_API_KEY.");
        else setError(e?.message ?? "Failed to load");
        setStatus("failed");
        setData(null);
      }
    }

    run();
    return () => { mounted = false; };
  }, [id, isLocal, localData]);

  // --- สถานะการโหลด/ข้อผิดพลาดที่ได้รับการปรับปรุง ---
  if (status === "loading")
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-xl font-medium text-gray-700">Loading recipe details...</p>
      </div>
    );
  if (status === "failed")
    return (
      <div className="p-8">
        <p className="text-xl font-semibold text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg">
          Error: {error}
        </p>
      </div>
    );
  if (!data) return <p className="p-8 text-lg text-gray-500">Recipe not found.</p>;

  const isLocalItem = typeof data.id === "string" && String(data.id).startsWith("local-");

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Recipes</span>
        </Link>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Recipe Image */}
        <img
          src={data.image}
          alt={data.title}
          // ปรับความสูงเป็น h-80
          className="w-full h-80 object-cover" 
        />

        <div className="p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{data.title}</h1>

          {/* Metadata (Ready In, Servings, Local Tag) */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-6 border-b pb-4">
            {typeof data.readyInMinutes === "number" && (
              <span className="flex items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-semibold">
                {/* Clock Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {data.readyInMinutes} min
              </span>
            )}

            {typeof data.servings === "number" && (
              <span className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                {/* Plate/User Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M10 12l2-2 2 2m0 0l-2-2-2 2"
                  />
                </svg>
                {data.servings} servings
              </span>
            )}

            {isLocalItem && (
              <span className="ml-auto px-4 py-1 text-sm font-bold rounded-full bg-amber-500 text-white shadow-md">
                🏠 LOCAL RECIPE
              </span>
            )}
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">
                Recipe Summary
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {isLocalItem ? (
                  // ถ้าเป็น local ให้แสดงเป็น <p> ป้องกัน XSS
                  <p>{data.summary}</p>
                ) : (
                  // ถ้าเป็น API ใช้ dangerouslySetInnerHTML
                  <div dangerouslySetInnerHTML={{ __html: data.summary }} />
                )}
              </div>
            </div>
          )}

          {/* Source Link - ปรับเป็นปุ่ม Call to Action */}
          {data.sourceUrl && (
            <div className="mt-8 pt-6 border-t">
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 transition duration-200 transform hover:scale-[1.01]"
              >
                View Full Source Recipe ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}