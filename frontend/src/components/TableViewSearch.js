// src/components/TableViewSearch.js
// src/components/TableViewSearch.js
import React from 'react';
import { Table } from 'react-bootstrap';

const TableView = ({ items, onRowClick, placeholder }) => {
  const renderRow = (item) => {
    const type = placeholder.toLowerCase();

    switch (type) {
      case 'album':
        return (
          <>
            <td><img src={item.images?.[0]?.url || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.name}</td>
            <td>{item.artists?.map(a => a.name).join(', ')}</td>
          </>
        );

      case 'anime':
        return (
          <>
            <td><img src={item.images?.jpg?.image_url || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.title}</td>
            <td>{item.type || 'Anime'}</td>
          </>
        );

      case 'book':
        return (
          <>
            <td><img src={item.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.volumeInfo?.title}</td>
            <td>{item.volumeInfo?.authors?.join(', ') || 'Unknown Author'}</td>
          </>
        );

      case 'game':
        return (
          <>
            <td><img src={item.cover?.url?.replace('thumb', 'cover_small') || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.name}</td>
            <td>{item.first_release_date ? new Date(item.first_release_date * 1000).getFullYear() : 'Unknown Year'}</td>
          </>
        );

      case 'manga':
        return (
          <>
            <td><img src={item.images?.jpg?.image_url || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.title}</td>
            <td>{item.type || 'Manga'}</td>
          </>
        );

      case 'movie':
        return (
          <>
            <td><img src={item.Poster !== 'N/A' ? item.Poster : 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.Title}</td>
            <td>{item.Year}</td>
          </>
        );

      case 'show':
        return (
          <>
            <td><img src={item.show?.image?.medium || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.show?.name}</td>
            <td>{item.show?.premiered?.slice(0, 4) || 'Unknown Year'}</td>
          </>
        );

      default:
        return <td colSpan="3">Unknown item type</td>;
    }
  };

  return (
    <div className="p-4">
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr
              key={item.id || item.mal_id || item.key || item.show?.id}
              onClick={() => onRowClick(item.id || item.mal_id || item.key || item.show?.id)}
              style={{ cursor: 'pointer' }}
            >
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableView;

