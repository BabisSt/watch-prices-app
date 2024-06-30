import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import WatchCard from '../components/WatchCard';
import { WatchData } from '../types';

const Home = () => {
	const [watches, setWatches] = useState<WatchData[]>([]);

	useEffect(() => {
		const fetchCSV = async () => {
			try {
				const response = await fetch('/Watches.csv'); // Correct path to fetch from the public directory

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const text = await response.text();

				Papa.parse<WatchData>(text, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						setWatches(results.data.slice(0, 10));
					},
				});
			} catch (error) {
				console.error('Error fetching the CSV file:', error);
			}
		};

		fetchCSV();
	}, []);

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<div style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
				{watches.map((watch, index) => (
					<WatchCard
						key={index}
						title={watch.Title}
						img={watch.Img}
						url={watch.Url}
						oldPrice={watch.Price_old}
						newPrice={watch.Price_new}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;