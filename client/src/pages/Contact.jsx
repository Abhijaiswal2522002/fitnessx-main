import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import emailjs from "emailjs-com";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.bg_primary || "#f7f7f7"};
  overflow-y: auto;
`;

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  background: ${({ theme }) => theme.bg_secondary || "#fff"};
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: ${fadeIn} 0.8s ease-in-out;
`;

const Title = styled.h2`
  font-size: 36px;
  color: ${({ theme }) => theme.primary || "#ff5733"};
  margin-top: 50px;
  margin-bottom: 5px;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary || "#666"};
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  width: 100%;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary || "#ff5733"};
    box-shadow: 0 0 5px ${({ theme }) => theme.primary || "#ff5733"};
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  width: 100%;
  height: 150px;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.primary || "#ff5733"};
    box-shadow: 0 0 5px ${({ theme }) => theme.primary || "#ff5733"};
  }
`;

const Button = styled.button`
  padding: 12px;
  background: ${({ theme }) => theme.primary || "#ff5733"};
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.secondary || "#d43f00"};
  }
`;

const ContactDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding: 20px;
  background: ${({ theme }) => theme.bg_secondary || "#fff"};
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  color: ${({ theme }) => theme.text_secondary || "#444"};
`;

const IconWrapper = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.primary || "#ff5733"};
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs
      .send(
        "service_6di7bpo", // Replace with your Email.js service ID
        "template_kyi8kea", // Replace with your Email.js template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        "YMb_OxT5eeuxQMUqx" // Replace with your Email.js public key
      )
      .then(
        (response) => {
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          alert("Failed to send message. Please try again later.");
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Contact Me</Title>
        <Subtitle>Have questions? Reach out and I'll get back to you soon!</Subtitle>

        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextArea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <Button type="submit" disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </Form>

        <ContactDetails>
          <ContactItem>
            <IconWrapper>
              <FaPhoneAlt />
            </IconWrapper>
            <span>+91 86908 96522</span>
          </ContactItem>
          <ContactItem>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <span>abhijaiswal2503@gmail.com</span>
          </ContactItem>
          <ContactItem>
            <IconWrapper>
              <FaMapMarkerAlt />
            </IconWrapper>
            <span>Ghaziabad, India</span>
          </ContactItem>
        </ContactDetails>
      </Container>
    </PageWrapper>
  );
};

export default Contact;
