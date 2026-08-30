import { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const response = await fetch('http://localhost:3001/api');

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
    </div>
  );
}
