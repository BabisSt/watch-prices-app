import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, styled } from '@mui/material';
import { Link } from 'react-router-dom';

interface WatchCardProps {
	title: string;
	img: string;
	url: string;
	oldPrice: string;
	newPrice: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
	maxWidth: 300,
	borderRadius: 8,
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '#ECB159', // Green background
	boxShadow: `0px 3px 6px #5F8670`, // Green shadow
	transition: 'box-shadow 0.3s, background-color 0.3s',
	'&:hover': {
		backgroundColor: '#B67352', // Grey background on hover
		boxShadow: `0px 5px 10px #76453B`, // Stronger shadow on hover
	},
	margin: theme.spacing(1), // Adds margin using MUI theme spacing
}));

const StyledCardMedia = styled(CardMedia)({
	borderRadius: '8px 8px 0 0',
	maxHeight: 275,
	objectFit: 'cover',
});

const WatchCard: React.FC<WatchCardProps> = ({ title, img, url, oldPrice, newPrice }) => {
	return (
		<StyledCard>
			<Link to={`/watch/${encodeURIComponent(title)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
				<CardActionArea>
					<StyledCardMedia
						component="img" // This is valid for CardMedia to render an img element
						src={img}
						alt={title}
					/>
					<CardContent style={{ flex: '1 0 auto' }}>
						<Typography variant="body2" color="text.secondary" style={{ fontSize: 14, fontWeight: 'bold' }}>
							{title}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Old Price: {oldPrice}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							New Price: {newPrice}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Link>
		</StyledCard>
	);
};

export default WatchCard;
