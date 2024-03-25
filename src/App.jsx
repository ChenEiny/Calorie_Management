/*
Roy Megidish 209277458
Hen Einy 209533785 
*/

import React, { useState, useEffect } from 'react';
import { openCostsDB } from './idb';
import FeelingLucky from './components/feelingLucky';

const Category = {
  BREAKFAST: 'BREAKFAST',
  LUNCH: 'LUNCH',
  DINNER: 'DINNER',
  OTHER: 'OTHER',
};

function App() {
  const [items, setItems] = useState([]);
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState(Category.BREAKFAST);
  const [description, setDescription] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    openCostsDB().then((db) => {
      db.getAll().then((items) => setItems(items));
    });
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const filtered = items.filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() + 1 === parseInt(selectedMonth) && date.getFullYear() === parseInt(selectedYear);
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]);
    }
  }, [selectedMonth, selectedYear, items]);

  const handleAddItem = () => {
    const item = {
      calories,
      category,
      description,
      date: new Date().toISOString(),
    };
    openCostsDB().then((db) => {
      db.addCalories(item).then(() => {
        setItems([...items, item]); 
        setCalories('');
        setCategory(Category.BREAKFAST);
        setDescription('');
        window.location.reload(); 
      });
    });
  };
  

  const handleDeleteItem = (item) => {
    openCostsDB().then((db) => {
      db.deleteCalories(item).then(() => {
        openCostsDB().then((db) => {
          db.getAll().then((items) => setItems(items));
        });
      });
    })
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calorie Management Application</h1>
      <div className="mb-4">
        <label className="block mb-2">
          Calories:
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="block mb-2">
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          >
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="block mb-2">
          Description:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <button onClick={handleAddItem} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Item
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">
          Month:
          <input
            type="number"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="block mb-2">
          Year:
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
      </div>
      <h2 className="text-2xl font-bold mb-2">Items</h2>
      <ul>
        {filteredItems.map((item) => (
          <li key={item.description} className="border-b border-gray-300 py-2">
            {item.description} ({item.calories} calories, {item.category}, {new Date(item.date).toLocaleString()})
            <button
            key={item.description}
              onClick={() => handleDeleteItem(item)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <FeelingLucky/>
    </div>
  );
}

export default App;