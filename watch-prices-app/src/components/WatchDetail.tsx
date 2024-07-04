import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import ForecastChart from '../components/ForecastChart'; // Import ForecastChart component

interface WatchDetailProps {
  title: string;
  img: string;
  oldPrice: string;
  newPrice: string;
}

const WatchDetail: React.FC<WatchDetailProps> = () => {
  const { watchId } = useParams<{ watchId: string }>();
  const [watchData, setWatchData] = useState<WatchDetailProps>({
    title: '',
    img: '',
    oldPrice: '',
    newPrice: ''
  });

  useEffect(() => {
    const fetchWatchDetails = async () => {
      try {
        const response = await fetch('/Watches.csv'); // Adjust path to match your public directory

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const text = await response.text();
        const { data } = Papa.parse(text, { header: true });

        // Find the watch data corresponding to watchId
        const selectedWatch = data.find((watch: { Title: string }) => watch.Title === watchId);

        if (selectedWatch) {
          // Update watchData state with fetched data
          setWatchData({
            title: selectedWatch.Title,
            img: selectedWatch.Img,
            oldPrice: selectedWatch.Price_old,
            newPrice: selectedWatch.Price_new
          });
        } else {
          console.error(`Watch with ID ${watchId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching watch details:', error);
      }
    };

    fetchWatchDetails();
  }, [watchId]);

  const { title, img, oldPrice, newPrice } = watchData;

  return (
    <div>
      <img src={img} alt={title} style={{ float: 'right', maxWidth: '50%' }} />
      <div>
        <h1>{title}</h1>
        <p>Old Price: {oldPrice}</p>
        <p>New Price: {newPrice}</p>
      </div>

      {/* Render ForecastChart component */}
      <ForecastChart watchId={watchId} />
    </div>
  );
};

export default WatchDetail;
