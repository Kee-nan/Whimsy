import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const GridCard = ({ items, renderItem, onCardClick }) => {
  return (
    <Container className="mt-5">
      <Row className="mx-2 custom-row-margin">
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="card-container">
            <Card className="grid-card-body" onClick={() => onCardClick(item.id)}>
              {renderItem(item)}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GridCard;






