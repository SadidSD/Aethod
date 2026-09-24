const INDEXNOW_KEY = "aeethod8941bf218a472c9183610de5e";
const HOST = "aeethod.com";

/**
 * Submits one or multiple URLs to IndexNow (Bing, Yandex, Naver, Seznam, etc.)
 * @param {string[]} urlList - List of absolute or relative URLs to notify search engines about
 * @returns {Promise<{ success: boolean, status: number, data?: any, error?: string }>}
 */
export async function submitToIndexNow(urlList = []) {
  if (!urlList.length) {
    return { success: false, error: "No URLs provided" };
  }

  const normalizedUrls = urlList.map((u) =>
    u.startsWith("http") ? u : `https://${HOST}${u.startsWith("/") ? u : `/${u}`}`
  );

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: normalizedUrls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return {
      success: res.ok,
      status: res.status,
    };
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
