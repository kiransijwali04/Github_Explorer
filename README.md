# GitHub Explorer — Premium Developer Dashboard

A production-quality GitHub user and repository explorer styled with modern SaaS developer aesthetics (inspired by Vercel, Linear, and Raycast). Built as a high-performance monorepo utilizing an Express.js backend API proxy with an in-memory caching layer to avoid GitHub rate limits.

---

## 🚀 Features

- **Monorepo Architecture**: Clean separation between `client` (React + Vite) and `server` (Node.js + Express).
- **Secure GitHub API Proxy**: The frontend NEVER calls GitHub directly. All requests pass through our backend.
- **60-Second In-Memory Caching**: Implements `node-cache` on the server to store request results for fast rendering and rate limit protection.
- **Advanced Language Analytics**: Interactive charts (Donut + Bar charts using `recharts`) showing repository language distributions and volume.
- **Developer Metrics Dashboard**: Summarized aggregate statistics of users (Total Stars, Total Forks, Open Issues, and Average Repo Size).
- **Real-Time Debounced Repository Search**: Keystroke search queries optimized via custom debounce hooks for real-time repository discovery.
- **LocalStorage Search History**: Interactive chips showing recent user searches with clear individual item or batch history options.
- **Premium Dark Aesthetics**: Glassmorphism cards, glowing border hover effects, and custom animated layouts using Tailwind V4 and Framer Motion.
- **Clean Architecture & Quality**: Centralized service layers, error middleware routing, custom React hooks, and strict environment isolation.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS V4 (Modern CSS theme overrides)
- **Charts**: Recharts (Pie & Bar visualizer)
- **Animations**: Framer Motion (Transitions and fades)
- **Client Networking**: Axios (Interceptors & custom errors)

### Backend (Server)
- **Runtime**: Node.js + Express.js
- **Caching**: Node Cache (TTL: 60s)
- **Rate-Limiting**: Express Rate Limit
- **Request Log**: Morgan Dev Logger
- **Server Networking**: Axios (Proxy requests)

---

## 📁 Folder Structure

```text
Github_Explorer/
├── package.json             # Root monorepo workspace scripts
├── README.md                # Project documentation
├── client/                  # React + Vite frontend
│   ├── package.json
│   ├── src/
│   │   ├── components/      # UI Cards, Charts, Modals, Forms
│   │   ├── hooks/           # useDebounce, useSearchHistory
│   │   ├── services/        # Axios API client setup (pointing to backend)
│   │   ├── index.css        # Tailwind theme variables & design tokens
│   │   ├── App.jsx
│   │   └── main.jsx
└── server/                  # Node.js + Express proxy API
    ├── package.json
    ├── server.js            # Express server configuration
    ├── services/            # GitHub REST API service
    ├── controllers/         # GitHub endpoint request controller
    ├── middleware/          # Rate-limiter & Error-handling middlewares
    └── routes/              # Express API router configuration
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/Github_Explorer.git
   cd Github_Explorer
   ```

2. **Configure Environment Variables**
   Create a `.env` file inside the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   Add your optional GitHub personal access token to `.env` to raise the API rate limit:
   ```env
   PORT=5000
   GITHUB_TOKEN=your_github_personal_access_token_here
   NODE_ENV=development
   ```

3. **Install Dependencies**
   Run the following command at the monorepo root to install all workspace dependencies:
   ```bash
   npm run install:all
   ```

4. **Run in Development Mode**
   Start both the client and server concurrently:
   ```bash
   npm run dev
   ```
   - Frontend client: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 📡 API Documentation

All server endpoints are prefix-nested under `/api/github`:

| Endpoint | Method | Query / Route Params | Description |
| :--- | :--- | :--- | :--- |
| `/api/github/:username` | `GET` | `username` (string) | Fetches GitHub user profile data. |
| `/api/github/:username/repos` | `GET` | `page` (number), `per_page` (number) | Retrieves list of repositories with pagination. |
| `/api/github/:username/stats` | `GET` | `username` (string) | Computes and returns custom language statistics and top repositories. |
| `/api/github/search/repos` | `GET` | `q` (query), `page`, `sort`, `order` | Proxies global repository search. |
| `/api/github/repos/:owner/:repo` | `GET` | `owner` (string), `repo` (string) | Retrieves detailed specs for a specific repository. |

---

## 🚢 Deployment

### Frontend (Vercel)
1. Import the repository into your Vercel dashboard.
2. In the project settings, set the **Root Directory** to `client`.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Add the environment variable `VITE_API_URL` pointing to your deployed backend URL.

### Backend (Render)
1. Create a new Web Service on Render.
2. Set the **Root Directory** to `server`.
3. Select Node.js environment, set build command to `npm install` and start command to `node server.js`.
4. Add your `GITHUB_TOKEN` under Render's environment settings.

---

## ✨ Future Improvements
1. **GitHub OAuth Integration**: Allow users to log in with their GitHub account to view private repositories and bypass rate-limiting under their own token scope.
2. **Interactive Chart Drilldowns**: Enable filtering repository list feeds in real-time when clicking on a specific language segment inside Recharts.
3. **Advanced Timeline Graphs**: Plot commits, issues, and stars timelines over the last 12 months.
