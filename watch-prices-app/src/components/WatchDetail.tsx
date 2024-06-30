import React from 'react';
import { useParams } from 'react-router-dom';

interface WatchDetailProps {
  title: string;
  img: string;
  oldPrice: string;
  newPrice: string;
}

const WatchDetail: React.FC = () => {
  const { watchId } = useParams<{ watchId: string }>();

  // Fetch or use static data based on watchId to get title, img, oldPrice, newPrice

  const title = 'Watch Title'; // Replace with actual data retrieval
  const img = 'https://example.com/watch.jpg'; // Replace with actual data retrieval
  const oldPrice = '$200.00'; // Replace with actual data retrieval
  const newPrice = '$150.00'; // Replace with actual data retrieval

  return (
    <div>
      <img src={img} alt={title} style={{ float: 'right', maxWidth: '50%' }} />
      <div>
        <h1>{title}</h1>
        <p>Old Price: {oldPrice}</p>
        <p>New Price: {newPrice}</p>
      </div>
    </div>
  );
};

export default WatchDetail;
