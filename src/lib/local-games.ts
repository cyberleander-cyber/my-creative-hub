import type { GameEntry } from "./github.functions";

export const LOCAL_GAMES: GameEntry[] = [
  {
    id: "local:snake",
    name: "snake",
    displayName: "Snake",
    embedUrl: "/games/snake/index.html",
    sourceUrl: "/games/snake/index.html",
    path: "public/games/snake",
  },
  {
    id: "local:clicker",
    name: "clicker",
    displayName: "Clicker",
    embedUrl: "/games/clicker/index.html",
    sourceUrl: "/games/clicker/index.html",
    path: "public/games/clicker",
  },
  {
    id: "local:pong",
    name: "pong",
    displayName: "Pong",
    embedUrl: "/games/pong.html",
    sourceUrl: "/games/pong.html",
    path: "public/games/pong.html",
  },
];
