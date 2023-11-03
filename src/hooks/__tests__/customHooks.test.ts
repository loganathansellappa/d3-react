import axios from "axios";
import { NormalizedCompanySchema } from "../../@types/zodSchema";
import { fetchData } from "../customHooks";
import { mockOverviewResponse } from "../../utils/test";

describe("fetchData", () => {
  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({ data: mockOverviewResponse() });
  });

  it("fetches data for OVERVIEW function", async () => {
    const result = await fetchData("OVERVIEW");
    expect(result).toEqual(
      NormalizedCompanySchema.parse(mockOverviewResponse()),
    );
  });
});
