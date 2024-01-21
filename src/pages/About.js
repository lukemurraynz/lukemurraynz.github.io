import React from 'react';
import './About.css';

export default function About() {
    return (
        <main>
            <header>
                <h1>About Me</h1>
            </header>
            <section className="container">
                <div className="image-container">
                    <img src="LukeMurray.jpg" alt="Profile picture of Luke Murray" />
                </div>
                <div className="content-container">
                    <p>My name is ><strong>Luke Murray></strong>... so who am I?</p>
                    <p>I'm a Cloud Platforms Consultant/Architect, specializing in Microsoft Azure and related services. As a Microsoft MVP in Azure and a Microsoft Learn Expert, I'm passionate about cloud architecture, automation, Infrastructure as Code, and cloud-native solutions.</p>
                    <p>When I'm not working, I share my knowledge and experiences on this blog. It's both a personal reference and a way for me to continue learning.</p>
                    <p>I live and work in Hamilton, New Zealand, enjoying the diverse cultures and perspectives it offers.</p>
                    <p>Want to connect? You can reach me through the social media links in the navbar!</p>
                    <h2>Some of the technologies I work with</h2>
                    <ul>
                        <li>Microsoft Azure</li>
                        <li>Microsoft Entra</li>
                        <li>Infrastructure as Code (Terraform/Bicep)</li>
                        <li>Azure DevOps/GitHub</li>
                        <li>PowerShell</li>
                        <li>Microsoft Services</li>
                    </ul>
                </div>
            </section>
            <h2>Achievements and Certifications</h2>
            <section className="carousel">
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 1">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 1" />
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 2">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 2" />
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 3">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 3" />
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 4">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 4" />
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 5">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 5" />
                </a>
                <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" aria-label="Link to Google - Project 6">
                    <img src="https://via.placeholder.com/350" alt="Screenshot of project 6" />
                </a>
                {/* Add more as needed */}
            </section>
        </main>
    );
}