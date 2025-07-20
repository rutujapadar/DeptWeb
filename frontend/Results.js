import React, { useState ,useEffect} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

const semesters = ['Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];


 
const Results = () => {
  const [activeSection, setActiveSection] = useState('Academics');
  const [activeSem, setActiveSem] = useState('Sem 3');
  const [data, setData] = useState({}); //from DB
  
 useEffect(() => {
    fetch("http://localhost:3000/results")
      .then(res => res.json())
      .then(results => {
        const formatted = {};
        results.forEach(({ semester, students }) => {
          formatted[semester] = students
            .sort((a, b) => b.sgpa - a.sgpa) // descending
            .map(({ name, sgpa }) => ({ name, cgpa: sgpa }));
        });
        setData(formatted);
      })
      .catch(err => {
        console.error("Error fetching academic results:", err);
      });
  }, []);

  return (
    <Wrapper>
      <Navbar />
      <Main>
        <CursorEffect />
        <NavButtons>
          {['Academics', 'Placements', 'Hackathons'].map((section) => (
            <NavButton
              key={section}
              isActive={activeSection === section}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </NavButton>
          ))}
        </NavButtons>

        <ContentGlass>
          <AnimatePresence mode="wait">
            {activeSection === 'Academics' && (
              <motion.div
                key="academics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs>
                  {semesters.map((sem) => (
                    <TabButton
                      key={sem}
                      isActive={activeSem === sem}
                      onClick={() => setActiveSem(sem)}
                    >
                      {sem}
                    </TabButton>
                  ))}
                </Tabs>
                <RankTable>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data[activeSem] || []).map((student, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{student.name}</td>
                        <td>{student.cgpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </RankTable>
              </motion.div>
            )}

            {activeSection === 'Placements' && (
              <motion.div
                key="placements"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Placement Statistics</h2>
                <p>Coming soon with detailed charts and company data.</p>
              </motion.div>
            )}

            {activeSection === 'Hackathons' && (
              <motion.div
                key="hackathons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Hackathon Achievements</h2>
                <p>Coming soon with participation and prize details.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ContentGlass>
      </Main>
      <Footer />
    </Wrapper>
  );
};

const CursorEffect = () => {
  return (
    <motion.div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
      animate={{ background: [
        'radial-gradient(circle at 10% 10%, #1f1f1f, #000)',
        'radial-gradient(circle at 90% 90%, #1f1f1f, #000)',
      ] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
    />
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a, #111);
  color: #fff;
`;

const Main = styled.main`
  flex: 1;
  padding: 9rem 2rem 4rem; // accounts for navbar and footer
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const NavButton = styled.button`
  background: ${({ isActive }) => (isActive ? '#007AFF' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#fff' : '#ccc')};
  border: 1px solid #007aff;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  &:hover {
    background: #007aff;
    color: #fff;
  }
`;

const ContentGlass = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
`;

const TabButton = styled.button`
  background: ${({ isActive }) => (isActive ? '#00c6ff' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#000' : '#ccc')};
  border: 1px solid #00c6ff;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: 0.3s ease;
  &:hover {
    background: #00c6ff;
    color: #000;
  }
`;

const RankTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #333;
    text-align: center;
  }
  th {
    background: rgba(0, 198, 255, 0.1);
    color: #00c6ff;
  }
  tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export default Results;
