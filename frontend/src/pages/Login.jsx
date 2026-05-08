
import './Login.css';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

function Login({ onLogin }) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLoginClick = async () => {
		setIsLoading(true);
		try {
			await onLogin();
		} catch (error) {
			console.error('Login failed:', error);
			setIsLoading(false);
		}
	};

	return (
		<div className="login-page">
			<div className="login-stage">
				<div className="login-card">
					<h3>EduChainNP</h3>

					<button
						type="button"
						className="login-btn"
						onClick={handleLoginClick}
						disabled={isLoading}
					>
						<FcGoogle size={24} /> Continue with Google
					</button>

					<p className="terms-copy">
						<a href="https://example.com/" target="_blank" rel="noreferrer">
							Terms and Conditions
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login
