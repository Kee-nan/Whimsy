// src/components/CSVImportModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Spinner, Table } from 'react-bootstrap';
import Papa from 'papaparse';
import axios from 'axios';

// per‑media endpoint definitions outside component so they are stable
const apiEndpoints = {
  album:  { url: '/api/spotify/search',      param: 'q', extract: data => data },
  anime:  { url: 'https://api.jikan.moe/v4/anime', param: 'q', extract: data => data.data },
  book:   { url: 'https://www.googleapis.com/books/v1/volumes', param: 'q', extract: data => data.items || [] },
  game:   { url: '/api/search/games',        param: 'q', extract: data => data.results || [] },
  manga:  { url: 'https://api.jikan.moe/v4/manga', param: 'q', extract: data => data.data },
  movie:  { url: '/api/search/movies',       param: 'q', extract: data => data.results || [] },
  show:   { url: 'https://api.tvmaze.com/search/shows', param: 'q', extract: data => data.map(r => r.show) },
};

function normalizeResult(result, mediaType) {
  switch (mediaType) {
    case 'album':
      return { id: result.id, media: 'album', title: result.name, image: result.images?.[0]?.url || '', listType: 'completed' };
    case 'anime':
      return { id: result.mal_id, media: 'anime', title: result.title, image: result.images?.jpg?.image_url || '', listType: 'completed' };
    case 'book':
      return { id: result.id, media: 'book', title: result.volumeInfo?.title, image: result.volumeInfo?.imageLinks?.thumbnail || '', listType: 'completed' };
    case 'game':
      return { id: result.id, media: 'game', title: result.name, image: result.background_image || '', listType: 'completed' };
    case 'manga':
      return { id: result.mal_id, media: 'manga', title: result.title, image: result.images?.jpg?.image_url || '', listType: 'completed' };
    case 'movie':
      return { id: result.id, media: 'movie', title: result.title, image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '', listType: 'completed' };
    case 'show':
      return { id: result.id, media: 'show', title: result.name, image: result.image?.medium || '', listType: 'completed' };
    default:
      return null;
  }
}

export default function CSVImportModal({ show, onHide, onImportDone }) {
  const [rows, setRows] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // parse CSV file
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        setRows(result.data.map(r => ({ media: r.media?.trim().toLowerCase(), title: r.title?.trim() })));
      }
    });
  };

  // fetch top‑5 hits whenever rows change
  useEffect(() => {
    if (!rows.length) return;
    (async () => {
      setLoading(true);
      const all = await Promise.all(rows.map(async row => {
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
      setLoading(false);
    })();
  }, [rows]);

  const changeSelection = (ci, idx) => {
    setCandidates(c => c.map((blk, i) => i === ci ? { ...blk, selectedIndex: idx } : blk));
  };

  const handleConfirm = async () => {
    const toAdd = candidates
      .filter(c => c.selectedIndex >= 0)
      .map(c => normalizeResult(c.hits[c.selectedIndex], c.row.media))
      .filter(Boolean);

    const token = localStorage.getItem('user_token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    await Promise.all(toAdd.map(item => axios.post('/api/list/upsert', { media: item }, { headers })));

    onImportDone(toAdd.length);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Import CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!rows.length && (
          <Form.Group>
            <Form.Label>Upload CSV (columns: media,title)</Form.Label>
            <Form.Control type="file" accept=".csv" onChange={handleFile}/>
          </Form.Group>
        )}
        {loading && <Spinner animation="border" className="my-3" />}
        {candidates.length > 0 && (
          <Table hover responsive className="mt-3">
            <thead>
              <tr><th>#</th><th>Image</th><th>Media</th><th>Title</th><th>Match</th></tr>
            </thead>
            <tbody>
              {candidates.map((c, ci) => {
                const selected = c.hits[c.selectedIndex];
                const norm = selected ? normalizeResult(selected, c.row.media) : null;
                return (
                  <tr key={ci}>
                    <td>{ci + 1}</td>
                    <td>
                      {norm?.image
                        ? <img src={norm.image} alt={norm.title} className="modal-table-img" />
                        : <span style={{ color: '#aaa' }}>No image</span>
                      }
                    </td>
                    <td>{c.row.media}</td>
                    <td>{c.row.title}</td>
                    <td>
                      <Form.Select value={c.selectedIndex} onChange={e => changeSelection(ci, +e.target.value)}>
                        {c.hits.length
                          ? c.hits.map((h, i) => {
                              const optNorm = normalizeResult(h, c.row.media);
                              return <option key={i} value={i}>{optNorm?.title} ({optNorm?.id})</option>;
                            })
                          : <option value={-1}>No matches</option>
                        }
                      </Form.Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="secondaryButton" onClick={onHide}>Cancel</button>
        <button className="primaryButton" onClick={handleConfirm} disabled={!candidates.length}>Confirm & Add Completed</button>
      </Modal.Footer>
    </Modal>

  );
}




