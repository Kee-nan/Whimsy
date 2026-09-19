import React, { useState, useEffect } from 'react';
import { Modal, Form, Spinner } from 'react-bootstrap';
import Papa from 'papaparse';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;

const apiEndpoints = {
  album: { url: `${API_BASE}/api/search/album`, param: 'q', extract: (data) => data.results || [] },
  anime: { url: `${API_BASE}/api/search/anime`, param: 'q', extract: (data) => data.results || [] },
  book:  { url: `${API_BASE}/api/search/book`,  param: 'q', extract: (data) => data.results || [] },
  game:  { url: `${API_BASE}/api/search/game`,  param: 'q', extract: (data) => data.results || [] },
  manga: { url: `${API_BASE}/api/search/manga`, param: 'q', extract: (data) => data.results || [] },
  movie: { url: `${API_BASE}/api/search/movie`, param: 'q', extract: (data) => data.results || [] },
  show:  { url: `${API_BASE}/api/search/show`,  param: 'q', extract: (data) => data.results || [] },
};

function normalizeResult(result, mediaType) {
  switch (mediaType) {
    case 'album': return { id: String(result.id), media: 'album', title: result.name, image: result.images?.[0]?.url || '', listType: 'completed' };
    case 'anime': return { id: String(result.mal_id), media: 'anime', title: result.title, image: result.images?.jpg?.image_url || '', listType: 'completed' };
    case 'book': return { id: String(result.id), media: 'book', title: result.volumeInfo?.title, image: result.volumeInfo?.imageLinks?.thumbnail || '', listType: 'completed' };
    case 'game': return { id: String(result.id), media: 'game', title: result.name, image: result.background_image || '', listType: 'completed' };
    case 'manga': return { id: String(result.mal_id), media: 'manga', title: result.title, image: result.images?.jpg?.image_url || '', listType: 'completed' };
    case 'movie': return { id: String(result.id), media: 'movie', title: result.title, image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '', listType: 'completed' };
    case 'show': return { id: String(result.id), media: 'show', title: result.name, image: result.image?.medium || '', listType: 'completed' };
    default: return null;
  }
}

export default function CSVImportModal({ show, onHide, onImportDone }) {
  const [rows, setRows] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (result) => setRows(result.data.map((r) => ({ media: r.media?.trim().toLowerCase(), title: r.title?.trim() }))),
    });
  };

  useEffect(() => {
    if (!rows.length) return;
    (async () => {
      setLoading(true);
      const all = await Promise.all(rows.map(async (row) => {
        const cfg = apiEndpoints[row.media];
        if (!cfg) return { row, hits: [], selectedIndex: -1 };
        try {
          const resp = await axios.get(cfg.url, { params: { [cfg.param]: row.title } });
          const hits = cfg.extract(resp.data);
          return { row, hits: hits.slice(0, 5), selectedIndex: hits.length ? 0 : -1 };
        } catch {
          return { row, hits: [], selectedIndex: -1 };
        }
      }));
      setCandidates(all);
      setPage(1);
      setLoading(false);
    })();
  }, [rows]);

  const changeSelection = (ci, idx) => setCandidates((c) => c.map((blk, i) => (i === ci ? { ...blk, selectedIndex: idx } : blk)));

  const handleConfirm = async () => {
    // Applies to ALL matched candidates across every page, not just the visible one.
    const toAdd = candidates.filter((c) => c.selectedIndex >= 0).map((c) => normalizeResult(c.hits[c.selectedIndex], c.row.media)).filter(Boolean);
    const token = localStorage.getItem('user_token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    const results = await Promise.allSettled(toAdd.map((item) => axios.post(`${API_BASE}/api/list/upsert`, { media: item }, { headers })));
    const failures = results.filter((r) => r.status === 'rejected').length;
    if (failures > 0) alert(`${toAdd.length - failures} of ${toAdd.length} items imported. ${failures} failed.`);

    onImportDone(toAdd.length - failures);
    onHide();
  };

  const totalPages = Math.ceil(candidates.length / PAGE_SIZE) || 1;
  const paginated = candidates.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const matchedCount = candidates.filter((c) => c.selectedIndex >= 0).length;

  return (
    <Modal show={show} onHide={onHide} size="xl" className="custom-modal">
      <Modal.Header closeButton><Modal.Title>Import CSV</Modal.Title></Modal.Header>
      <Modal.Body>
        {!rows.length && (
          <Form.Group>
            <Form.Label>Upload CSV (columns: media,title)</Form.Label>
            <Form.Control type="file" accept=".csv" onChange={handleFile} />
          </Form.Group>
        )}
        {loading && <Spinner animation="border" className="my-3" />}

        {candidates.length > 0 && (
          <>
            <p style={{ color: '#999', margin: '0 0 0.5rem' }}>
              {matchedCount} of {candidates.length} rows matched — showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, candidates.length)}
            </p>
            <div className="whimsy-table-container">
              <div className="whimsy-table-wrapper">
                <table className="table whimsy-table table-striped table-hover">
                  <thead><tr><th>#</th><th>Image</th><th>Media</th><th>Title</th><th>Match</th></tr></thead>
                  <tbody>
                    {paginated.map((c, i) => {
                      const ci = (page - 1) * PAGE_SIZE + i;
                      const selected = c.hits[c.selectedIndex];
                      const norm = selected ? normalizeResult(selected, c.row.media) : null;
                      return (
                        <tr key={ci}>
                          <td>{ci + 1}</td>
                          <td>{norm?.image ? <img src={norm.image} alt={norm.title} style={{ width: '50px' }} /> : <span style={{ color: '#aaa' }}>No image</span>}</td>
                          <td>{c.row.media}</td>
                          <td>{c.row.title}</td>
                          <td>
                            <Form.Select value={c.selectedIndex} onChange={(e) => changeSelection(ci, +e.target.value)}>
                              {c.hits.length ? c.hits.map((h, hi) => {
                                const optNorm = normalizeResult(h, c.row.media);
                                return <option key={hi} value={hi}>{optNorm?.title} ({optNorm?.id})</option>;
                              }) : <option value={-1}>No matches</option>}
                            </Form.Select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                <button className="whimsy-btn whimsy-btn-ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button className="whimsy-btn whimsy-btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="whimsy-btn whimsy-btn-ghost" onClick={onHide}>Cancel</button>
        <button className="whimsy-btn" onClick={handleConfirm} disabled={matchedCount === 0}>
          Confirm & Add {matchedCount} Item{matchedCount !== 1 ? 's' : ''}
        </button>
      </Modal.Footer>
    </Modal>
  );
}


