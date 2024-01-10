import './intro-style.css';
import { Parallax } from "react-scroll-parallax";

const Introduction = () => {
	
	return (
		
		<section
			className="intro-section"
		>
			<Parallax speed={-15}>
				<center>
				<div className="intro-title"

				>
					<h1
					// style={{ fontFamily: `Tilt Warp, sans-serif` }}
					style={{ fontWeight: '700' }}
					>
						SCOTT s.r.l.
					</h1>
				</div>
				<p style={{ fontSize: "1.7rem" }}>
					Compravendita di beni immobili
				</p>
				</center>
			</Parallax>
		</section>
	);
};

export default Introduction;


