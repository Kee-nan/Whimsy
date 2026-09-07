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
      case 'manga':
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
        // FIX: RAWG returns background_image, not cover.url (that was IGDB's field name)
        return (
          <>
            <td><img src={item.background_image || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.name}</td>
          </>
        );
      case 'movie':
        return (
          <>
            <td>
              <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'placeholder.jpg'} alt="" width="50" />
            </td>
            <td>{item.title}</td>
          </>
        );
      case 'show':
        // FIX: the backend already unwraps TVMaze's {show:{...}} wrapper —
        // fields live directly on item, not item.show
        return (
          <>
            <td><img src={item.image?.medium || 'placeholder.jpg'} alt="" width="50" /></td>
            <td>{item.name}</td>
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
            <tr><th>Image</th><th>Title</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id || item.mal_id} onClick={() => onRowClick(item.id || item.mal_id)}>
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

