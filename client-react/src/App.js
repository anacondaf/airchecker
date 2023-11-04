import logo from "./logo.svg";
import "./App.css";
import "./styles/style.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				{/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

				<div class="container">
					<section class="top section">
						<div class="top-left">
							<h1 data-i18n="intro.title"></h1>
							<p>
								<span id="today"></span> -
								<span data-i18n="intro.location"></span>
							</p>
						</div>

						<div class="dropdown">
							<div
								class="language-button"
								id="language-button"
								onclick="langDropdownClick()"
							>
								<img src="assets/flags/uk.png" class="lang en" />
							</div>

							<div id="lang-drop-down" class="dropdown-content">
								<div
									class="lang-box"
									id="lang-box"
									onclick="langBoxOnClick(this)"
								>
									<p>Tiếng Việt</p>
									<img src="assets/flags/vn.png" class="lang vn" />
								</div>

								<div
									class="lang-box"
									id="lang-box"
									onclick="langBoxOnClick(this)"
								>
									<p>English</p>
									<img src="assets/flags/uk.png" class="lang en" />
								</div>
							</div>
						</div>
					</section>

					<div class="divider"></div>

					<section class="time-seriers-db">
						<div class="air-info">
							<div class="index-circle">
								<div class="index">
									<span id="aqi"></span>
								</div>
							</div>

							<div class="text">
								<h4 id="aqi-level">Moderate</h4>
								<p id="aqi-desc">
									Air quality is acceptable. However, for some pollutants there
									may be a moderate health concern for a very small number of
									people who are unusually sensitive to air pollution.
								</p>
							</div>
						</div>

						<canvas id="myChart"></canvas>
					</section>

					<div class="divider"></div>

					<div class="detail-pollutants">
						<div class="accordion">
							<p data-i18n="accordion.title" id="accordion-title">
								View detail pollutants
							</p>
							<i class=" fa-solid fa-caret-down" id="acc-icon"></i>
						</div>

						<div class="panel">
							<div class="pollutant-card">
								<div class="info">
									<p data-i18n="pollutant.temp"></p>
									<p>(&deg;C)</p>
								</div>

								<div class="index-pollutant">
									<span id="temp">nan</span>
								</div>
							</div>

							<div class="pollutant-card">
								<div class="info">
									<p data-i18n="pollutant.humid"></p>
								</div>

								<div class="index-pollutant">
									<span id="humidity"></span>
								</div>
							</div>

							<div class="pollutant-card">
								<div class="info">
									<p data-i18n="pollutant.co"></p>
									<p>(ppm)</p>
								</div>

								<div class="index-pollutant">
									<span id="co"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
}

export default App;
