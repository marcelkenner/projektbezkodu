import { describe, expect, it } from "vitest";

import { RedirectPathRecoveryManager } from "@/app/lib/url/RedirectPathRecoveryManager";

describe("RedirectPathRecoveryManager", () => {
  const manager = new RedirectPathRecoveryManager();

  it("keeps a normal canonical path unchanged", () => {
    expect(manager.recover("/narzedzia/bigcommerce/recenzja/")).toBe(
      "/narzedzia/bigcommerce/recenzja/",
    );
  });

  it("recovers a merged location value containing a duplicated path", () => {
    expect(
      manager.recover(
        "/narzedzia/bigcommerce/recenzja/, /narzedzia/bigcommerce/recenzja/",
      ),
    ).toBe("/narzedzia/bigcommerce/recenzja/");
  });

  it("recovers encoded-space merged location values", () => {
    expect(
      manager.recover(
        "/narzedzia/bigcommerce/recenzja/,%20/narzedzia/bigcommerce/recenzja/",
      ),
    ).toBe("/narzedzia/bigcommerce/recenzja/");
  });

  it("does not rewrite comma values that are not merged paths", () => {
    expect(manager.recover("/artykuly/a,b/")).toBe("/artykuly/a,b/");
  });
});
