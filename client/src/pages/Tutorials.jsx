import { useState } from "react";
import styled from "styled-components";
import { FaRunning, FaDumbbell, FaHeartbeat } from "react-icons/fa";

// Exercise Data with Video Links
const exercises = {
  "Warm-up": [
    { name: "Jumping Jacks", description: "A great way to get your heart rate up.", video: "https://www.youtube.com/embed/c4DAnQ6DtF8" },
    { name: "Arm Circles", description: "Loosen up your shoulders with small and big circles.", video: "https://www.youtube.com/embed/Xn0qZwpSHQ0" },
    { name: "Leg Swings", description: "Improve mobility by swinging your legs forward and sideways.", video: "https://www.youtube.com/embed/8ZrE0uvSx48" },
    { name: "Lunges", description: "Stretch and strengthen your legs at the same time.", video: "https://www.youtube.com/embed/QOVaHwm-Q6U" },
  ],
  "Strength Training": [
    { name: "Push-ups", description: "Strengthen your chest, shoulders, and arms.", video: "https://www.youtube.com/embed/IODxDxX7oi4" },
    { name: "Squats", description: "Build lower body strength and improve posture.", video: "https://www.youtube.com/embed/aclHkVaku9U" },
    { name: "Planks", description: "Enhance core stability and endurance.", video: "https://www.youtube.com/embed/pSHjTRCQxIw" },
    { name: "Deadlifts", description: "Work your entire body with proper form.", video: "https://www.youtube.com/embed/op9kVnSso6Q" },
  ],
  "Cardio Workouts": [
    { name: "Jump Rope", description: "Burn calories quickly and improve coordination.", video: "https://www.youtube.com/embed/T-2Zf2w5p5U" },
    { name: "Burpees", description: "A full-body workout for strength and cardio.", video: "https://www.youtube.com/embed/qLBImHhCXSw" },
    { name: "High Knees", description: "Boost heart rate and improve leg speed.", video: "https://www.youtube.com/embed/O1H2KzDx0mA" },
    { name: "Mountain Climbers", description: "Engage your core and get your heart racing.", video: "https://www.youtube.com/embed/cnyTQDSE884" },
  ],
  "Stretching": [
    { name: "Hamstring Stretch", description: "Loosen up tight hamstrings.", video: "https://www.youtube.com/embed/1xvJ5VE0n4c" },
    { name: "Shoulder Stretch", description: "Relieve shoulder tension.", video: "https://www.youtube.com/embed/1lHMo8Oq2qM" },
    { name: "Cat-Cow Stretch", description: "Improve spine flexibility.", video: "https://www.youtube.com/embed/kqnua4rHVVA" },
    { name: "Child’s Pose", description: "A great cooldown stretch to relax your body.", video: "https://www.youtube.com/embed/gtrhiWJmW9A" },
  ],
};

const FitnessTutorial = () => {
  const [selectedCategory, setSelectedCategory] = useState("Warm-up");

  return (
    <Container>
      <Wrapper>
        <Title>Fitness Tutorials</Title>
        <FlexWrap>
          {Object.keys(exercises).map((category) => (
            <CategoryButton
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "Warm-up" && <FaRunning />} 
              {category === "Strength Training" && <FaDumbbell />} 
              {category === "Cardio Workouts" && <FaHeartbeat />} 
              {category}
            </CategoryButton>
          ))}
        </FlexWrap>
        <Section>
          <h2>{selectedCategory} Exercises</h2>
          <CardWrapper>
            {exercises[selectedCategory].map((exercise, index) => (
              <ExerciseCard key={index}>
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
                {exercise.video && (
                  <VideoFrame 
                    src={exercise.video} 
                    title={exercise.name} 
                    frameBorder="0" 
                    allowFullScreen
                  />
                )}
              </ExerciseCard>
            ))}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default FitnessTutorial;

// Styled Components
const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #333;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 10px;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: ${({ active }) => (active ? "#007bff" : "#ddd")};
  color: ${({ active }) => (active ? "white" : "black")};
  transition: all 0.3s ease;
  &:hover {
    background: ${({ active }) => (active ? "#0056b3" : "#bbb")};
  }
`;

const ExerciseCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-top: 10px;
`;
