import React from 'react';
import { Dropdown, Form } from 'react-bootstrap';

/**
 * Shared checkbox-dropdown filter. `mode='multi'` always allows checking
 * several boxes (List Status, Tags, Edit Columns). `mode='toggle'`
 * defaults to single-select behavior (checking one box unchecks the
 * previous one) until the "Select multiple" switch is turned on — this
 * is the Media Type filter's behavior as requested.
 */
const MultiCheckDropdown = ({
  label, options, selected, onChange,
  mode = 'multi', multiMode = false, onToggleMultiMode,
  includeAllOption = false, allKey = 'All',
}) => {
  const isMulti = mode === 'multi' ? true : multiMode;

  const handleToggle = (key) => {
    if (includeAllOption && key === allKey) {
      onChange([allKey]);
      return;
    }
    const currentlyAll = includeAllOption && selected.includes(allKey);
    let next;
    if (currentlyAll) {
      next = [key];
    } else if (!isMulti) {
      next = selected.includes(key) ? [] : [key];
    } else {
      next = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
    }
    if (includeAllOption && next.length === 0) next = [allKey];
    onChange(next);
  };

  const isShowingAll = includeAllOption && (selected.length === 0 || selected.includes(allKey));
  const buttonLabel = isShowingAll ? label : `${label} (${selected.length})`;

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle variant="outline-secondary" className="whimsy-btn-outline">{buttonLabel}</Dropdown.Toggle>
      <Dropdown.Menu style={{ padding: '0.75rem 1rem', minWidth: '220px', maxHeight: '320px', overflowY: 'auto' }}>
        {mode === 'toggle' && (
          <Form.Check
            type="switch"
            id={`${label}-multi-toggle`}
            label="Select multiple"
            checked={multiMode}
            onChange={(e) => onToggleMultiMode(e.target.checked)}
            className="mb-2 pb-2 border-bottom"
          />
        )}
        {includeAllOption && (
          <Form.Check
            type="checkbox"
            id={`${label}-all`}
            label="All"
            checked={selected.includes(allKey) || selected.length === 0}
            onChange={() => handleToggle(allKey)}
            className="mb-2"
          />
        )}
        {options.length === 0 ? (
          <div style={{ color: '#999', fontSize: '0.85rem' }}>No options available.</div>
        ) : (
          options.map((opt) => (
            <Form.Check
              key={opt.key}
              type="checkbox"
              id={`${label}-${opt.key}`}
              label={opt.label}
              checked={selected.includes(opt.key)}
              onChange={() => handleToggle(opt.key)}
              className="mb-2"
            />
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiCheckDropdown;