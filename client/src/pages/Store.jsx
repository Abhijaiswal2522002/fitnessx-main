import React, { useState } from "react";
import styled from "styled-components";


// Styled Components
const StoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 8%;
  background: #007bff;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CartButton = styled.button`
  background: white;
  color: #007bff;
  border: none;
  padding: 12px 18px;
  font-size: 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    background: #e6e6e6;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 40px 8%;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  justify-content: center;
`;

const ProductCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  text-align: center;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductName = styled.h3`
  font-size: 1.4rem;
  margin-top: 12px;
`;

const ProductPrice = styled.p`
  font-size: 1.2rem;
  color: #007bff;
  font-weight: bold;
  margin: 8px 0;
`;

const BuyButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

// Cart Sidebar Styles
const CartWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ show }) => (show ? "100vw" : "0")};
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
`;

const CartSidebar = styled.div`
  width: 360px;
  height: 100%;
  background: white;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ show }) => (show ? "translateX(0)" : "translateX(100%)")};
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
`;

const RemoveButton = styled.button`
  background: red;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
`;

const TotalPrice = styled.h4`
  font-size: 1.2rem;
  margin: 20px 0;
`;

const CheckoutButton = styled.button`
  background: green;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #004d00;
  }
`;

// Sample Products
const products = [
  { id: 1, name: "Protein Powder", price: 2499, image: "https://source.unsplash.com/300x300/?protein,supplements" },
  { id: 2, name: "Dumbbell Set", price: 1999, image: "https://source.unsplash.com/300x300/?dumbbell,gym" },
  { id: 3, name: "Gym Gloves", price: 499, image: "https://source.unsplash.com/300x300/?gym,gloves" },
  { id: 4, name: "Yoga Mat", price: 899, image: "https://source.unsplash.com/300x300/?yoga,mat" },
  { id: 5, name: "Pre-Workout Booster", price: 1599, image: "https://source.unsplash.com/300x300/?preworkout,fitness" },
  { id: 6, name: "Omega-3 Fish Oil", price: 899, image: "https://source.unsplash.com/300x300/?fishoil,health" },
  { id: 7, name: "Creatine Monohydrate", price: 1299, image: "https://source.unsplash.com/300x300/?creatine,muscle" },
  { id: 8, name: "Resistance Bands", price: 799, image: "https://source.unsplash.com/300x300/?resistancebands,workout" },
  { id: 9, name: "Adjustable Kettlebell", price: 2499, image: "https://source.unsplash.com/300x300/?kettlebell,fitness" },
  { id: 10, name: "Pull-Up Bar", price: 1799, image: "https://source.unsplash.com/300x300/?pullupbar,exercise" },
  { id: 11, name: "Compression T-Shirt", price: 999, image: "https://source.unsplash.com/300x300/?compression,tshirt" },
  { id: 12, name: "Training Shorts", price: 699, image: "https://source.unsplash.com/300x300/?gymshorts,training" },
  { id: 13, name: "Smart Fitness Watch", price: 3499, image: "https://source.unsplash.com/300x300/?smartwatch,fitness" },
];
const Influencer=[
  // Fitness Influencer Packs
  { id: 14, name: "Chris Bumstead Pack", price: 5999, image: "https://source.unsplash.com/300x300/?bodybuilder,gym" },
  { id: 15, name: "David Goggins Pack", price: 7499, image: "https://source.unsplash.com/300x300/?running,marathon" },
  { id: 16, name: "Simeon Panda Pack", price: 6999, image: "https://source.unsplash.com/300x300/?weightlifting,gym" },
];

const StorePage = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [purchasedPacks, setPurchasedPacks] = useState([]);


  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handlePayment = () => {
    const influencerItems = cart.filter((item) => item.id >= 14); // Filtering influencer packs
    setPurchasedPacks([...purchasedPacks, ...influencerItems]);
    alert(`Payment Successful! Total: ₹${getTotal()}`);
    setCart([]);
    setShowCart(false);
  };
  

  return (
    <StoreContainer>
      {/* Navbar */}
      <Navbar>
        <h2>🏋️‍♂️ Fitness Store</h2>
        <CartButton onClick={() => setShowCart(!showCart)}>
          Cart 🛒 ({cart.length})
        </CartButton>
      </Navbar>

      <Content>
  {/* Fitness Gear Section */}
  <Title>Shop Your Fitness Gear</Title>
  <ProductGrid>
    {products.map((product) => (
      <ProductCard key={product.id}>
        <ProductImage src={product.image} alt={product.name} />
        <ProductName>{product.name}</ProductName>
        <ProductPrice>₹{product.price}</ProductPrice>
        <BuyButton onClick={() => addToCart(product)}>Add to Cart</BuyButton>
      </ProductCard>
    ))}
  </ProductGrid>

  {/* Influencer Packs Section */}
  <Title>Exclusive Influencer Packs</Title>
  <ProductGrid>
    {Influencer.map((influencer) => (
      <ProductCard key={influencer.id}>
        <ProductImage src={influencer.image} alt={influencer.name} />
        <ProductName>{influencer.name}</ProductName>
        <ProductPrice>₹{influencer.price}</ProductPrice>
        <BuyButton onClick={() => addToCart(influencer)}>Add to Cart</BuyButton>
      </ProductCard>
    ))}
  </ProductGrid>
</Content>

      {/* Cart Sidebar with Click-to-Close */}
      <CartWrapper show={showCart} onClick={() => setShowCart(false)}>
        <CartSidebar show={showCart} onClick={(e) => e.stopPropagation()}>
          <CartHeader>
            <span>🛒 Your Cart</span>
            <button onClick={() => setShowCart(false)}>❌</button>
          </CartHeader>
          {cart.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>Your cart is empty.</p>
          ) : (
            cart.map((item, index) => (
              <CartItem key={index}>
                <span>{item.name}</span>
                <RemoveButton onClick={() => removeFromCart(index)}>Remove</RemoveButton>
              </CartItem>
            ))
          )}
          {cart.length > 0 && (
            <>
              <TotalPrice>Total: ₹{getTotal()}</TotalPrice>
              <CheckoutButton onClick={handlePayment}>Checkout</CheckoutButton>
            </>
          )}
        </CartSidebar>
      </CartWrapper>
    </StoreContainer>
  );
};

export default StorePage;
