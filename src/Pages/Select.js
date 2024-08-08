import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SquatImage from '../Assets/Squat.jpeg';
import ShoulderPressImage from '../Assets/ShoulderPress.jpeg';
import LatPullDownImage from '../Assets/LatPullDown.jpeg';

const Container = styled.div`
  text-align: center;
  padding: 100px;

`;

const Title = styled.h2`
  margin-bottom: 20px;
  color:white;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 300px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardTitle = styled.h3`
  margin: 16px 0;
`;

const CardButton = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

function Select() {

  return (
    <Container>
      <Title>Select Your Exercise</Title>
      <CardContainer>
        <Card>
          <CardImage src={ShoulderPressImage} alt="Shoulder Press" />
          <CardTitle>Shoulder Press</CardTitle>
          <CardButton to="/ShoulderLive">Start Shoulder Press</CardButton>
        </Card>
        <Card>
          <CardImage src={LatPullDownImage} alt="Lat Pull Down" />
          <CardTitle>Lat Pull Down</CardTitle>
          <CardButton to="/LatPullDown">Start Lat Pull Down</CardButton>
        </Card>
      </CardContainer>
    </Container>
  );
}

export default Select;
