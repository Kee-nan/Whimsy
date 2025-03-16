import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const GridCard = ({ items, renderItem, onCardClick }) => {
  return (
    <Container className="mt-5">
      <Row>
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} className="mb-4">
            <Card className="grid-card-body landscape" onClick={() => onCardClick(item.id)}>
              {renderItem(item)}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GridCard;






