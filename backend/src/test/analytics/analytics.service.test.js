const analyticsService = require("../../service/analytics.service");

describe("getPollutantsDatas", () => {
	test("should return 2", () => {
		expect(analyticsService.getPollutantDatas()).toEqual(2);
	});
});
