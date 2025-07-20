import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const particlesConfig = {
  fullScreen: false,
  detectRetina: true,
  fpsLimit: 60,
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: ["#007AFF", "#00C6FF", "#ffffff"] },
    shape: { type: "circle" },
    opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
    size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
    links: { enable: true, distance: 150, color: "#007AFF", opacity: 0.4, width: 1 },
    move: {
      enable: true, speed: 2, direction: "none", random: true, straight: false,
      outModes: { default: "out" }, attract: { enable: true, rotateX: 600, rotateY: 1200 }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: ["grab", "bubble"] },
      onClick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 200, links: { opacity: 0.8 } },
      bubble: { distance: 200, size: 6, duration: 0.2, opacity: 0.8, speed: 3 },
      push: { quantity: 4 }
    }
  }
};


const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
`;

const ParticlesBackground = styled(Particles)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 700px;
  margin: 12rem auto 60px auto;
  color: #fff;
  background: rgba(30, 34, 44, 0.85);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.12);
  position: relative;
  overflow: hidden;
  z-index: 1;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #007AFF, #00C6FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #cce6ff;
`;

const YearGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const YearCard = styled.div`
  background: rgba(255, 255, 255, 0.10);
  border-radius: 1.2rem;
  padding: 1.5rem 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(0, 122, 255, 0.08);
  border-left: 6px solid #007AFF;
  transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
  &:hover {
    background: rgba(0, 198, 255, 0.10);
    box-shadow: 0 8px 32px 0 rgba(0, 122, 255, 0.18);
    transform: translateY(-2px) scale(1.01);
  }
`;

const YearTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #00C6FF;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background: linear-gradient(90deg, #007AFF 0%, #00C6FF 100%);
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #00C6FF 0%, #007AFF 100%);
    transform: scale(1.08);
  }
`;


const Calendar = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/Calendar")
      .then(res => res.json())
      .then(data => setCalendarData(data))
      .catch(err => console.error("Error fetching calendar data:", err));
  }, []);

  const particlesInit = useCallback(async engine => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <Background />
      <ParticlesBackground
        id="tsparticles-curriculum"
        init={particlesInit}
        options={particlesConfig}
      />
      <ContentWrapper>
        <Navbar />
        <Container>
          <Header>
            <Title>Annual Academic Calendar</Title>
            <Subtitle>
              Download the latest academic calendar for the ECE department.
            </Subtitle>
          </Header>
          <YearGrid>
            {calendarData.map(({ _id, title, academicYear, pdfUrl }) => (
              <YearCard key={_id}>
                <YearTitle>{title}</YearTitle>
                <DownloadButton href={pdfUrl} download>
                  Download PDF
                </DownloadButton>
              </YearCard>
            ))}
          </YearGrid>
        </Container>
        <Footer />
      </ContentWrapper>
    </>
  );
};

export default Calendar;
