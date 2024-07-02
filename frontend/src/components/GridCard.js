
import React from 'react';
import { Container, Row, Card } from 'react-bootstrap';

const GridCard = ({ items, renderItem, onCardClick }) => {
  return (
    <Container className="mt-5">
      <Row className="mx-2 row row-cols-4">
        {items.map((item) => (
          <Card key={item.id} onClick={() => onCardClick(item.id)}>
            {renderItem(item)}
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default GridCard;


