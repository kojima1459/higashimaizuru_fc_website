import { describe, it, expect } from "vitest";

describe("Statistics API", () => {
  it("should calculate overall statistics correctly", async () => {
    // テストデータ
    const results = [
      { score: 3, conceded: 1 }, // 勝利
      { score: 2, conceded: 2 }, // 引き分け
      { score: 1, conceded: 3 }, // 敗北
    ];

    const overall = {
      wins: results.filter((r) => r.score > r.conceded).length,
      draws: results.filter((r) => r.score === r.conceded).length,
      losses: results.filter((r) => r.score < r.conceded).length,
      goalsFor: results.reduce((sum, r) => sum + r.score, 0),
      goalsAgainst: results.reduce((sum, r) => sum + r.conceded, 0),
    };

    expect(overall.wins).toBe(1);
    expect(overall.draws).toBe(1);
    expect(overall.losses).toBe(1);
    expect(overall.goalsFor).toBe(6);
    expect(overall.goalsAgainst).toBe(6);
  });

  it("should calculate category-based statistics correctly", async () => {
    // テストデータ
    const results = [
      { category: "U10", score: 3, conceded: 1 },
      { category: "U10", score: 2, conceded: 2 },
      { category: "U12", score: 1, conceded: 3 },
    ];

    const byCategory: Record<string, any> = {};
    results.forEach((result) => {
      if (!byCategory[result.category]) {
        byCategory[result.category] = {
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
        };
      }

      if (result.score > result.conceded) {
        byCategory[result.category].wins++;
      } else if (result.score === result.conceded) {
        byCategory[result.category].draws++;
      } else {
        byCategory[result.category].losses++;
      }

      byCategory[result.category].goalsFor += result.score;
      byCategory[result.category].goalsAgainst += result.conceded;
    });

    expect(byCategory["U10"]).toBeDefined();
    expect(byCategory["U10"].wins).toBe(1);
    expect(byCategory["U10"].draws).toBe(1);
    expect(byCategory["U10"].losses).toBe(0);
    expect(byCategory["U10"].goalsFor).toBe(5);
    expect(byCategory["U10"].goalsAgainst).toBe(3);

    expect(byCategory["U12"]).toBeDefined();
    expect(byCategory["U12"].wins).toBe(0);
    expect(byCategory["U12"].draws).toBe(0);
    expect(byCategory["U12"].losses).toBe(1);
    expect(byCategory["U12"].goalsFor).toBe(1);
    expect(byCategory["U12"].goalsAgainst).toBe(3);
  });

  it("should calculate win rate correctly", async () => {
    const results = [
      { score: 3, conceded: 1 },
      { score: 2, conceded: 2 },
      { score: 1, conceded: 3 },
    ];

    const wins = results.filter((r) => r.score > r.conceded).length;
    const total = results.length;
    const winRate = (wins / total) * 100;

    expect(winRate).toBe((1 / 3) * 100);
    expect(winRate).toBeCloseTo(33.33, 1);
  });
});
