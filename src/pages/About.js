import React from 'react';

function About() {
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>About This App</h1>
      <p>This calorie counter app uses the Nutritionix API to fetch calorie data for foods you enter.</p>
      <p>Built with React and React Router v7.</p>
    </div>
  );
}

export default About;
