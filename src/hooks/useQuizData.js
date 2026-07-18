import { useEffect, useState } from "react";
import { fetchCsvFromUrl, parseCsvFile } from "../utils/csvImport";
import { sampleRows } from "../data/sampleData";
import { SHEET_CSV_URL } from "../config";

const CACHE_KEY = "munegu_quiz_rows_cache";
const LAST_SYNC_KEY = "munegu_quiz_last_sync";
// Permet de tester un lien différent en local sans redéployer (voir /backstage).
const OVERRIDE_URL_KEY = "munegu_quiz_sheet_url_override";

function loadCachedRows() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // cache corrompu, on ignore
  }
  return sampleRows;
}

export function getActiveSheetUrl() {
  return localStorage.getItem(OVERRIDE_URL_KEY) || SHEET_CSV_URL;
}

export function setSheetUrlOverride(url) {
  if (url) localStorage.setItem(OVERRIDE_URL_KEY, url);
  else localStorage.removeItem(OVERRIDE_URL_KEY);
}

export function useQuizData() {
  const [rows, setRows] = useState(loadCachedRows);
  const [status, setStatus] = useState("idle"); // idle | loading | ok | error
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(localStorage.getItem(LAST_SYNC_KEY));

  async function sync() {
    const url = getActiveSheetUrl();
    if (!url) {
      setStatus("error");
      setError("Aucune source configurée (voir /backstage).");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const newRows = await fetchCsvFromUrl(url);
      setRows(newRows);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newRows));
      const now = new Date().toISOString();
      localStorage.setItem(LAST_SYNC_KEY, now);
      setLastSync(now);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  async function importFromFile(file) {
    const newRows = await parseCsvFile(file);
    setRows(newRows);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newRows));
    const now = new Date().toISOString();
    localStorage.setItem(LAST_SYNC_KEY, now);
    setLastSync(now);
    setStatus("ok");
  }

  useEffect(() => {
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rows, status, error, lastSync, sync, importFromFile };
}
