import { minStarsOnly, minWatchersOnly } from "../lib/repos"

describe("Repo Functions", () => {
  describe("minStarsOnly", () => {
    it("Should take in an array of github repos and return an array", () => {
      const inputArray = [{
        stargazers_count: 0
      }];

      const result = minStarsOnly(inputArray, 0);

      expect(result).toEqual(inputArray)
    })
    it("Should take in an array of github repos and return an array excluding repos with less than the minimum stargazers", () => {
      const inputArray = [
        {
        stargazers_count: 0
        },
        {
          stargazers_count: 1
        }
      ];

      const outputArray = [
        {
          stargazers_count: 1
        }
      ]
    
      const result = minStarsOnly(inputArray, 1);
      expect(result).toEqual(outputArray)
    })
  })
  describe("minWatchersOnly", () => {
    it("Should take in an array of github repos and return an array", () => {
      const inputArray = [{
        watchers_count: 0
      }];

      const result = minWatchersOnly(inputArray, 0);

      expect(result).toEqual(inputArray)
    })
    it("Should take in an array of github repos and return an array excluding repos with less than the minimum watchers", () => {
      const inputArray = [
        {
          watchers_count: 0
        },
        {
          watchers_count: 1
        }
      ];

      const outputArray = [
        {
          watchers_count: 1
        }
      ]
    
      const result = minWatchersOnly(inputArray, 1);
      expect(result).toEqual(outputArray)
    })
  })
})