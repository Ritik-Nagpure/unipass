import { useState, useEffect } from 'react';
import Home from './pages/page'; 

export default function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:300/api');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result);

        setData(result.message);
      } catch (error) {
        console.error("Fetch error:", error);
        setData('Failed API Call');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-5xl">
      Response received from API says: {data}
      <Home />
    </div>
  );
}
