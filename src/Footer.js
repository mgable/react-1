import React from 'react';
import './Footer.css';

class Footer extends React.Component {
	render(){
		return (
			<footer className="py-5 bg-dark">
				<div className="container">
					<p className="m-0 text-center text-white">Copyright © Mark Gable 2018</p>
				</div>
			</footer>
		);
	}
}

export default Footer;