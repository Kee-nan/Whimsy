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
          </>
        );

      case 'anime':
        return (
          <>
            <td><img src={item.images?.jpg?.image_url || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.title}</td>
          </>
        );

      case 'book':
        return (
          <>
            <td><img src={item.volumeInfo?.imageLinks?.thumbnail || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.volumeInfo?.title}</td>
          </>
        );

      case 'game':
        return (
          <>
            <td><img src={item.cover?.url?.replace('thumb', 'cover_small') || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.name}</td>
          </>
        );

      case 'manga':
        return (
          <>
            <td><img src={item.images?.jpg?.image_url || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.title}</td>
          </>
        );

      case 'movie':
        return (
          <>
            <td><img src={`https://image.tmdb.org/t/p/w500${item.poster_path}` || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.title}</td>
          </>
        );

      case 'show':
        return (
          <>
            <td><img src={item.show?.image?.medium || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.show?.name}</td>
          </>
        );

      default:
        return <td colSpan="3">Unknown item type</td>;
    }
  };

  return (
    <div className="whimsy-table-container">
      <div className="whimsy-table-wrapper">
        <Table className="whimsy-table table-striped table-hover" responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id || item.mal_id || item.key || item.show?.id}
                onClick={() => onRowClick(item.id || item.mal_id || item.key || item.show?.id)}
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TableView;

