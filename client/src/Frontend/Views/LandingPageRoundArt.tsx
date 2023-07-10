import React from 'react';
import styled from 'styled-components';

export function LandingPageRoundArt() {
  return (
    <Container>
      <ImgContainer>
        <LandingPageRoundArtImg src={'/public/DFARES.png'} />
        {/* <Smaller>
          <Text>Art by</Text> <TwitterLink twitter='JannehMoe' />{' '}
        </Smaller> */}
      </ImgContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImgContainer = styled.div`
  display: inline-block;
  text-align: right;
  width: 750px;
  max-width: 80vw;

  @media only screen and (max-device-width: 1000px) {
    width: 100%;
    max-width: 100%;
    padding: 8px;
    font-size: 80%;
  }
`;

const LandingPageRoundArtImg = styled.img``;
