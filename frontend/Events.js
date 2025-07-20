import React, { useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const particlesConfig = {
  background: { color: { value: "transparent" } },
  fullScreen: false,
  particles: {
    color: { value: "#00C6FF" },
    links: { enable: true, color: "#00C6FF", distance: 150, opacity: 0.5, width: 1 },
    move: { enable: true, speed: 1, outModes: { default: "bounce" } },
    number: { value: 40, density: { enable: true, area: 800 } },
    opacity: { value: 0.5 },
    size: { value: 2 },
  },
  detectRetina: true,
};

const Events = () => {
  const [eventsData, setEventsData] = useState([]);
  const [openCards, setOpenCards] = useState([]);
  const cardHeights = useRef([]);
  const today = new Date();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const toggleCard = (index) => {
    setOpenCards((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => {
        setEventsData(data);
        setOpenCards(Array(data.length).fill(false));
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  useEffect(() => {
    const detailSections = document.querySelectorAll('.event-details-content');
    detailSections.forEach((section, idx) => {
      if (section) cardHeights.current[idx] = section.scrollHeight;
    });
  }, [eventsData]);

  return (
    <Wrapper>
      <ParticlesWrapper>
        <Particles
          id="tsparticles-events"
          init={particlesInit}
          options={particlesConfig}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}
        />
      </ParticlesWrapper>
      <ContentWrapper>
        <Navbar />
        <Container>
          <Header>
            <Title>Events in PICT</Title>
            <Subtitle>Explore all technical & non-technical events hosted by Pune Institute of Computer Technology.</Subtitle>
          </Header>
          <EventsGrid>
          {eventsData.map(({ title, date, time, venue, description }, index) => {
  const eventDate = new Date(date);
  const isUpcoming = eventDate > today;
  const formattedDay = eventDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = eventDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <EventCard key={index}>
      <Badge upcoming={isUpcoming}>{isUpcoming ? 'UPCOMING' : 'PAST'}</Badge>
      <EventTitle>{title}</EventTitle>
      <LearnMoreButton onClick={() => toggleCard(index)}>
        {openCards[index] ? 'Hide Details' : 'Learn More'}
      </LearnMoreButton>
      <Collapsible isOpen={openCards[index]} height={cardHeights.current[index]}>
        <div className="event-details-content">
          <EventDetail><strong>Date:</strong> {formattedDate}</EventDetail>
          <EventDetail><strong>Day:</strong> {formattedDay}</EventDetail>
          <EventDetail><strong>Time:</strong> {time}</EventDetail>
          <EventDetail><strong>Venue:</strong> {venue}</EventDetail>
          <EventDetail><strong>About:</strong> {description}</EventDetail>
        </div>
      </Collapsible>
    </EventCard>
  );
})}

          </EventsGrid>
        </Container>
        <Footer />
      </ContentWrapper>
    </Wrapper>
  );
};

export default Events;
const Wrapper = styled.div`
  position: relative;
  background: rgba(0, 0, 20, 0.95);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const ParticlesWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  padding-top: 4rem;
`;

const Container = styled.div`
  max-width: 960px;
  margin: auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(to right, #007AFF, #00C6FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #cce6ff;
`;

const EventsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.10);
  border-left: 6px solid #007AFF;
  border-radius: 1.2rem;
  padding: 1.5rem 1.2rem;
  box-shadow: 0 4px 24px rgba(0, 122, 255, 0.08);
  position: relative;
  transition: 0.3s ease-in-out;

  &:hover {
    background: rgba(0, 198, 255, 0.08);
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 32px rgba(0, 122, 255, 0.18);
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${({ upcoming }) => (upcoming ? "#00c853" : "#d50000")};
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border-radius: 12px;
  font-weight: 700;
`;

const EventTitle = styled.h2`
  font-size: 1.5rem;
  color: #00C6FF;
  margin-bottom: 0.6rem;
`;

const LearnMoreButton = styled.button`
  background: none;
  border: 2px solid #00C6FF;
  color: #00C6FF;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 0.8rem;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #00C6FF;
    color: #001f33;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 198, 255, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Collapsible = styled.div`
  max-height: ${({ isOpen, height }) => (isOpen ? `${height}px` : '0')};
  overflow: hidden;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: max-height 0.5s ease, opacity 0.5s ease;

  .event-details-content {
    padding-top: 0.5rem;
  }
`;

const EventDetail = styled.p`
  color: #e0f7fa;
  font-size: 1rem;
  margin: 0.3rem 0;
`;

