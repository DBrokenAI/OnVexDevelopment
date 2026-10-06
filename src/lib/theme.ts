export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "onvex-theme";

/**
 * Runs before first paint (see app/layout.tsx) so the page never flashes the
 * wrong theme. Uses the saved choice, otherwise the system setting.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
