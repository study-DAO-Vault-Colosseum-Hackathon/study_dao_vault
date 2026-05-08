import './Login.css';
import { FcGoogle } from "react-icons/fc";

function Login({ onLogin }) {
	return (
		<div className="login-page">
			<div className="login-card">
				

				<h3>Study DAO</h3>

				<button type="button" className="login-btn" onClick={onLogin}>
                    <FcGoogle size={24} /> Continue with Google
				</button>

				<p className="terms-copy">
					<a href="https://example.com/" target="_blank" rel="noreferrer">
						Terms and Conditions
					</a>
				</p>
			</div>
		</div>
	)
}

export default Login
