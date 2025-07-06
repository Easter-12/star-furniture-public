import React from 'react';
import Slider from 'react-slick';
import './BillboardSlider.css';

function BillboardSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const slidesData = [
    {
      // Paste your first image URL here
      image: "https://splmzdoyeshqsrasqcqz.supabase.co/storage/v1/object/public/billboard-image//SKU00009190-FurnitureOffice-FurnitureOffice-Chairs%20(1).jpg", 
      heading: 'Premium Ergonomic Office Chairs',
      description: 'Designed for Comfort & Productivity'
    },
    {
      // Paste your second image URL here
      image: "https://splmzdoyeshqsrasqcqz.supabase.co/storage/v1/object/public/billboard-image//SKU00009190-FurnitureOffice-FurnitureOffice-Chairs.jpg",
      heading: 'Modern Designs for Your Workspace',
      description: 'Style That Meets Functionality'
    },
    {
      // Paste your third image URL here
      image: "https://splmzdoyeshqsrasqcqz.supabase.co/storage/v1/object/public/billboard-image//898ffh.jpg",
      heading: 'Timeless Classics, Reimagined',
      description: 'Durability and Elegance in Every Piece'
    },
  ];

  return (
    <div className="billboard-slider">
      <Slider {...settings}>
        {slidesData.map((slide, index) => (
          <div key={index} className="slide">
            <img src={slide.image} alt={slide.heading} className="slide-image" />
            <div className="slide-content">
              <h2>{slide.heading}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default BillboardSlider;