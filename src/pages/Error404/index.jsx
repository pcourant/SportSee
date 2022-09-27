import React from 'react';
import styled from 'styled-components';
import HeaderMain from '../../components/HeaderMain';
import colors from '../../utils/styles/colors';

const MainWrapper = styled.div`
  padding-top: 200px;
  padding-bottom: 100px;
  text-align: center;
`;

const StyledTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 160px;
  font-size: 200px;
  font-weight: 700;
  color: ${colors.secondary};
`;

const StyledText = styled.p`
  color: ${colors.secondary};
  margin-bottom: 100px;
`;

const Error404 = () => {
  return (
    <MainWrapper>
      <StyledTitle>404</StyledTitle>
      <StyledText>{`Oups! La page que vous demandez n'existe pas.`}</StyledText>
    </MainWrapper>
  );
};

export default Error404;
