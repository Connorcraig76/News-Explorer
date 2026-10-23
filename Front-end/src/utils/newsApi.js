const NEWS_API_URL = "https://newsapi.org/v2/everything";
const NEWS_API_PROXY_URL =
  "https://news-api-proxy.up.railway.app/news/v2/everything";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

const formatDateToString = (date) => date.toISOString().split("T")[0];

const calculateSearchDates = () => {
  const currentDate = new Date();
  const pastDate = new Date(currentDate);

  pastDate.setDate(pastDate.getDate() - 7);

  return {
    from: formatDateToString(pastDate),
    to: formatDateToString(currentDate),
  };
};

const handleApiResponse = async (response) => {
  if (response.ok) {
    return response.json();
  }

  try {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`,
    );
  } catch {
    throw new Error(
      `Sorry, something went wrong during the request. Please try again later.`,
    );
  }
};

export const fetchNewsArticles = async (searchQuery) => {
  const trimmedQuery = searchQuery.trim();

  if (!trimmedQuery) {
    throw new Error("Please enter a keyword");
  }

  if (!NEWS_API_KEY && !import.meta.env.PROD) {
    throw new Error(
      "VITE_NEWS_API_KEY is missing in your environment variables.",
    );
  }

  const { from, to } = calculateSearchDates();

  const queryParameters = new URLSearchParams({
    q: trimmedQuery,
    from,
    to,
    language: "en",
    sortBy: "publishedAt",
    pageSize: "100",
    ...(NEWS_API_KEY ? { apiKey: NEWS_API_KEY } : {}),
  });

  const endpointUrl = import.meta.env.PROD ? NEWS_API_PROXY_URL : NEWS_API_URL;

  const response = await fetch(`${endpointUrl}?${queryParameters.toString()}`);
  const data = await handleApiResponse(response);

  const mappedArticles = (data.articles || []).map((article) => ({
    keyword: trimmedQuery,
    title: article.title,
    description: article.description,
    url: article.url,
    image: article.urlToImage,
    source:
      typeof article.source === "object"
        ? article.source?.name
        : article.source,
    date: article.publishedAt,
  }));

  return { articles: mappedArticles };
};

const newsApi = {
  getArticles: fetchNewsArticles,
};

export default newsApi;
