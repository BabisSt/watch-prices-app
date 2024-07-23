import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import ForecastChart from '../components/ForecastChart'; // Import ForecastChart component
import { Dialog, DialogContent } from '@mui/material';

interface WatchDetailProps {
    title: string;
    img: string;
    oldPrice: string;
    newPrice: string;
	url: string;
}

const WatchDetail: React.FC<WatchDetailProps> = () => {
    const { watchId } = useParams<{ watchId: string }>();
    const [watchData, setWatchData] = useState<WatchDetailProps>({
        title: '',
        img: '',
        oldPrice: '',
        newPrice: '',
		url: ''
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchWatchDetails = async () => {
            try {
                const response = await fetch('/Watches.csv');

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const text = await response.text();
                const { data } = Papa.parse(text, { header: true });

                // Find the watch data corresponding to watchId
                const selectedWatch = data.find(
                    (watch: { Title: string }) => watch.Title === watchId,
                );

                if (selectedWatch) {
                    // Update watchData state with fetched data
                    setWatchData({
                        title: selectedWatch.Title,
                        img: selectedWatch.Img,
                        oldPrice: selectedWatch.Price_old,
                        newPrice: selectedWatch.Price_new,
						url: selectedWatch.Url
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

    const { title, img, oldPrice, newPrice, url  } = watchData;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

	const [isHovered, setIsHovered] = useState(false);

    const buttonStyle = {
        backgroundColor: isHovered ? '#5F8670' : '#76453B',
        color: isHovered ? 'black' : 'white',
        border: 'none',
        padding: '10px 10px',

        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    };
    return (
        <div className="container my-5">
            <div className="row mb-5">
                <div className="col-md-6">
                    <img
                        src={img}
                        alt={title}
                        className="img-fluid rounded shadow p-3 mb-5 bg-white rounded"
                        onClick={handleClickOpen}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.opacity = '0.7')
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.opacity = '1')
                        }
                    />
                </div>
                <div className="col-md-6">
                    <h2 className="mb-5">{title}</h2>
                    <p>
                        <strong>Old Price:</strong> {oldPrice}
                    </p>
                    <p>
                        <strong>New Price:</strong> {newPrice}
                    </p>
					<p>
					<a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={buttonStyle}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Click here to view in Jomashop
                        </a>
                    </p>
                </div>
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent>
                    <img src={img} alt={title} style={{ width: '100%' }} />
                </DialogContent>
            </Dialog>

            {/* Render ForecastChart component */}
            <ForecastChart watchId={watchId} />
        </div>
    );
};

export default WatchDetail;
