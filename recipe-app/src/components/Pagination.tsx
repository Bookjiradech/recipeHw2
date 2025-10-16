import { useDispatch, useSelector } from "react-redux";
import { setOffset } from "../store/MenuSlice";
import type { RootState } from "../store/store";

export default function Pagination({ total, limit, offset }: { total: number; limit: number; offset: number }) {
  const dispatch = useDispatch();
  const { status } = useSelector((s: RootState) => s.menu);

  const totalPages = Math.max(1, Math.ceil(total / (limit || 1)));
  const currentPage = Math.floor((offset || 0) / (limit || 1)) + 1;

  const go = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages);
    dispatch(setOffset((p - 1) * limit));
  };

  if (totalPages <= 1) return null;

  const disabled = status === "loading";
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const btn =
    "px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card";

  return (
    <div className="py-8 flex items-center justify-center gap-2">
      <button className={btn} onClick={() => go(1)} disabled={disabled || isFirst} title="First page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
      <button className={btn} onClick={() => go(currentPage - 1)} disabled={disabled || isFirst} title="Previous page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span className="px-4 py-2 text-sm font-medium text-foreground">
        Page {currentPage} / {totalPages}
      </span>
      <button className={btn} onClick={() => go(currentPage + 1)} disabled={disabled || isLast} title="Next page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <button className={btn} onClick={() => go(totalPages)} disabled={disabled || isLast} title="Last page">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
