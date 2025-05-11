import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import '../styles/modal.css'; // <- Make sure this path is correct

const AccountSettingsModal = ({ show, handleClose, user, updateUser, viewSetting, setViewSetting }) => {
  const [editableFields, setEditableFields] = useState({});
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const toggleEdit = (field) => {
    setEditableFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateUser(formData);
    setEditableFields({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      backdrop="static"
      className="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Account Settings</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* Left Column: User Info */}
          <Col md={6}>
            {['username', 'firstName', 'lastName', 'email'].map((field) => (
              <div key={field} className="mb-3 d-flex align-items-center justify-content-between">
                <Form.Label className="me-2 review-modal-label" style={{ width: '30%' }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </Form.Label>
                {editableFields[field] ? (
                  <Form.Control
                    type={field === 'email' ? 'email' : 'text'}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="me-2 review-modal-input"
                  />
                ) : (
                  <div className="me-2 text-white">{formData[field]}</div>
                )}
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => toggleEdit(field)}
                  className="secondaryButton"
                >
                  {editableFields[field] ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            ))}

            <div className="mt-4 d-flex gap-2">
              <button className="primaryButton" onClick={handleSave}>Save</button>
              <button className="secondaryButton" onClick={handleClose}>Close</button>
            </div>
          </Col>

          {/* Right Column: Settings */}
          <Col md={6}>
            <div className="mb-4">
              <Form.Label className="review-modal-label">View Setting</Form.Label>
              <Dropdown onSelect={(val) => setViewSetting(val)}>
                <Dropdown.Toggle variant="outline-light" className="w-100 review-modal-input text-start">
                  {viewSetting.charAt(0).toUpperCase() + viewSetting.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="card">Card</Dropdown.Item>
                  <Dropdown.Item eventKey="table">Table</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="text-muted mt-5">More settings coming soon...</div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AccountSettingsModal;
