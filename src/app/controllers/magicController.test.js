jest.mock("../services/magicService", () => ({
  find: jest.fn(),
  getMaxLevelById: jest.fn(),
}));

const magicService = require("../services/magicService");
const { showSkill } = require("./magicController");

function contextFor(replyFlex) {
  return {
    replyFlex,
    replyText: jest.fn(),
  };
}

describe("magicController.showSkill", () => {
  beforeEach(() => {
    magicService.find.mockResolvedValue({
      id: 4,
      level: 1,
      name: "怒擊",
      func_hit: 1,
      func_hit_p1: 95,
    });
    magicService.getMaxLevelById.mockResolvedValue({ level: 1 });
  });

  it("shows func_hit_p1 as a percentage instead of the opcode", async () => {
    let message;
    await showSkill(
      contextFor((_, payload) => {
        message = payload;
      }),
      { match: { groups: { id: 4, level: 1 } } }
    );

    const output = JSON.stringify(message);
    expect(output).toContain("命中率");
    expect(output).toContain("95%");
    expect(
      message.contents[0].body.contents
        .flatMap(section => section.contents || [])
        .some(
          row =>
            row.contents &&
            row.contents[0] &&
            row.contents[1] &&
            row.contents[0].text === "命中率" &&
            row.contents[1].text === "95%"
        )
    ).toBe(true);
    expect(output).not.toContain('"text":"命中率","color":"#585e68"},{"type":"text","text":"1"');
  });

  it.each([null, 0])("hides func_hit_p1 when it is %s", async hitRate => {
    magicService.find.mockResolvedValue({
      id: 4,
      level: 1,
      name: "怒擊",
      func_hit: 1,
      func_hit_p1: hitRate,
    });
    let message;
    await showSkill(
      contextFor((_, payload) => {
        message = payload;
      }),
      { match: { groups: { id: 4, level: 1 } } }
    );

    expect(JSON.stringify(message)).not.toContain("命中率");
  });
});
