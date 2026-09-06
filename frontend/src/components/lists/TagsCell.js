import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

/** Shows the first tag; if there's more than one, hover to see all of them. */
const TagsCell = ({ tags }) => {
  if (!tags || tags.length === 0) return <span style={{ color: '#666' }}>—</span>;
  const [first, ...rest] = tags;
  if (rest.length === 0) return <span className="tag-chip">{first.name}</span>;
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tags.map((t) => t.name).join(', ')}</Tooltip>}>
      <span className="tag-chip">{first.name} <span className="tag-chip-more">+{rest.length}</span></span>
    </OverlayTrigger>
  );
};

export default TagsCell;