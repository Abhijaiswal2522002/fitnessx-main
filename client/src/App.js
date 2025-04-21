import { ThemeProvider, styled } from "styled-components";
import { lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Authentication from "./pages/Authentication";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Contact from "./pages/Contact";



import FitnessTutorials from "./pages/Tutorials";

import FitnessAI from "./pages/FitnessAI";
import StorePage from "./pages/Store";
import ChatPage from "./pages/Chatpage";



const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: auto;
  transition: all 0.2s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <>
            <Navbar currentUser={currentUser} />
            <Container>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workouts" element={<Workouts />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/store" element={<StorePage/>}/>
                <Route path="/chat" element={<ChatPage/>}/>

                <Route path="/tutorials" element={<FitnessTutorials/>}/>
              </Routes>
              <FitnessAI/>
            </Container>
          </>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;