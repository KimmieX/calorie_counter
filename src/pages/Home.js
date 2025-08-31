import React, { useState } from 'react';
import axios from 'axios';

const APP_ID = 'cd6cd44b'; // Replace with your Nutritionix App ID
const API_KEY = '1a4ba580c742df6ddb8f5fb55b699f1d'; // Replace with your Nutritionix API Key

function Home() {
  const [query, setQuery] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchFood = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://trackapi.nutritionix.com/v2/natural/nutrients',
        { query },
        {
          headers: {
            'x-app-id': APP_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      const foods = response.data.foods;
      if (foods && foods.length > 0) {
        const newItems = foods.map(food => ({
          id: food.food_name + Date.now(),
          name: food.food_name,
          calories: food.nf_calories,
        }));
        setFoodItems(prev => [...prev, ...newItems]);
        setTotalCalories(prev => prev + newItems.reduce((sum, item) => sum + item.calories, 0));
      }
      setQuery('');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const deleteItem = (id, calories) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
    setTotalCalories(prev => prev - calories);
  };
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Calorie Counter</h1>
      <form onSubmit={searchFood}>
        <input
          type="text"
          placeholder="Enter food item (e.g., 1 apple)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          style={{ width: '80%', padding: 10, marginRight: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? 'Searching...' : 'Add'}
        </button>
    </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {foodItems.map(item => (
          <li key={item.id} style={{ margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.name} - {item.calories.toFixed(2)} cal</span>
            <button onClick={() => deleteItem(item.id, item.calories)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
              X
            </button>
          </li>
        ))}
      </ul>
      <h2>Total Calories: {totalCalories.toFixed(2)}</h2>
    </div>
  );
}
export default Home;