import React from 'react';
import './about.css';

export default function About() {
    return (
        <div>
            <h1>About Me</h1>
            <div className="container">
                <div className="image-container">
                    <img src="your-image-url" alt="Your Image" />
                </div>
                <div className="content-container">
                    <p>Your summary...</p>
                    <h2>Technologies I work with</h2>
                    <ul>
                        <li>Technology 1</li>
                        <li>Technology 2</li>
                        {/* Add more as needed */}
                    </ul>
                </div>
            </div>
            <div className="carousel">
                <img src="carousel-image-1-url" alt="Carousel Image 1" />
                <img src="carousel-image-2-url" alt="Carousel Image 2" />
                {/* Add more as needed */}
            </div>
        </div>
    );
}