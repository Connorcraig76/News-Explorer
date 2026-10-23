class MainApi {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _handleResponse(response) {
    return response.json().then((data) => {
      if (response.ok) {
        return data;
      }
      return Promise.reject(
        new Error(data.message || `Error: ${response.status}`),
      );
    });
  }

  signup({ email, password, name }) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    }).then(this._handleResponse);
  }

  signin({ email, password }) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(this._handleResponse);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }

  getSavedArticles(token) {
    return fetch(`${this._baseUrl}/articles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }

  saveArticle(article, token) {
    return fetch(`${this._baseUrl}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(article),
    }).then(this._handleResponse);
  }

  removeArticle(articleId, token) {
    return fetch(`${this._baseUrl}/articles/${articleId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(this._handleResponse);
  }
}

const apiBaseUrl = import.meta.env.PROD
  ? "https://api.yourdomain.com"
  : "http://localhost:3000";

export const mainApi = new MainApi({ baseUrl: apiBaseUrl });

export default mainApi;
