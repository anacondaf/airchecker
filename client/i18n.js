const lngs = {
	en: { nativeName: "English" },
	vn: { nativeName: "Vietnamese" },
};

const rerender = () => {
	// start localizing, details:
	// https://github.com/i18next/jquery-i18next#usage-of-selector-function
	$("body").localize();
};

$(function () {
	// use plugins and options as needed, for options, detail see
	// https://www.i18next.com
	i18next
		// detect user language
		// learn more: https://github.com/i18next/i18next-browser-languageDetector
		.use(i18nextBrowserLanguageDetector)
		// init i18next
		// for all options read: https://www.i18next.com/overview/configuration-options
		.init(
			{
				debug: true,
				fallbackLng: "en",
				resources: {
					en: {
						translation: {
							intro: {
								title: "Today's air quality",
								location: "Ho Chi Minh City, Viet Nam",
							},
							pollutant: {
								temp: "Temperature",
								humid: "Humidity",
								co: "Cacbon Monoxide",
							},
							accordion: {
								title: "View detail pollutants",
							},
						},
					},
					vn: {
						translation: {
							intro: {
								title: "Chất lượng không khí hôm nay",
								location: "Thành phố Hồ Chí Minh, Việt Nam",
							},
							pollutant: {
								temp: "Nhiệt độ",
								humid: "Độ ẩm",
								co: "Cacbon Monoxide",
							},
							accordion: {
								title: "Xem chi tiết chất ô nhiễm",
							},
						},
					},
				},
			},
			(err, t) => {
				if (err) return console.error(err);

				// for options see
				// https://github.com/i18next/jquery-i18next#initialize-the-plugin
				jqueryI18next.init(i18next, $, { useOptionsAttr: true });

				// fill language switcher
				Object.keys(lngs).map((lng) => {
					const opt = new Option(lngs[lng].nativeName, lng);

					if (lng === i18next.resolvedLanguage) {
						opt.setAttribute("selected", "selected");
					}
				});

				rerender();
			}
		);
});

function langDropdownClick() {
	document.getElementById("lang-drop-down").classList.toggle("drop-down-show");
}

function langBoxOnClick(event) {
	document.getElementById("lang-drop-down").classList.toggle("drop-down-show");

	var languageButton = document.getElementById("language-button");
	languageButton.children[0].src = event.children[1].src;

	var langButtonImageClassList = languageButton.children[0].classList;

	langButtonImageClassList.remove(
		langButtonImageClassList.item(langButtonImageClassList.length - 1)
	);

	var langClass = event.children[1].classList[1];

	langButtonImageClassList.add(langClass);
	var chosenLng = langClass;

	sessionStorage.setItem("lang", chosenLng);

	i18next.changeLanguage(chosenLng, () => {
		rerender();
	});
}
