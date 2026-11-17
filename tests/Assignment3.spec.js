import { test, expect } from "@playwright/test";

test("EventHub login", async ({ page }) => {
    // Step 1
    await page.goto("/login");
    await page.getByLabel("Email").fill("sktester@gmail.com");
    await page.getByLabel("Password").fill("Secret@123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.getByRole("link", { name: "Browse Events →" }).click();

    // Step 2
    await expect(
        page.getByRole("heading", { name: "Upcoming Events" }),
    ).toBeVisible();

    // Step 3
    await page.getByPlaceholder("Search events, venues…").fill("World");
    await page
        .getByRole("combobox")
        .filter({ hasText: "All Categories" })
        .selectOption({ value: "Conference" });
    await page
        .getByRole("combobox")
        .filter({ hasText: "All Cities" })
        .selectOption({ value: "Hyderabad" });

    // Step 4
    const cards = page.getByTestId("event-card");
    await expect(cards.first()).toBeVisible();
    const matchingcard = cards.filter({ hasText: "World Tech Summit" });
    await expect(matchingcard).toHaveCount(1);

    // Step 5
    const eventTitle = await matchingcard
        .getByRole("heading", { name: "World Tech Summit" })
        .innerText();
    const priceText = await matchingcard
        .locator("p")
        .filter({ hasText: "$" })
        .innerText();
    const seatsText = await matchingcard
        .locator("span")
        .filter({ hasText: "left!" })
        .innerText();
    const seatsNum = parseInt(seatsText, 10);

    // Step 6
    expect(eventTitle).toBe("World Tech Summit");
    expect(priceText).toContain("$");
    expect(seatsNum).toBeGreaterThan(0);

    // Step 7
    await matchingcard.getByRole("link", { name: "Book Now" }).click();

    // Step 8
    await expect(page).toHaveURL(RegExp("/events/"));
    // await expect(page).toHaveURL(/\/events\//);
    await expect(page.getByRole("heading", { name: "World Tech Summit", level: 1 })).toHaveText(eventTitle);
    const priceSection = page.getByText("Price per ticket").locator("..").locator("p").nth(1);
    await expect(priceSection).toHaveText(priceText);

    // Step 9
    await page.goBack();
    await page.getByPlaceholder("Search events, venues…").fill("");
    await page.getByRole("combobox").filter({ hasText: "All Categories" }).selectOption({ label: "All Categories" });
    await page.getByRole("combobox").filter({ hasText: "All Cities" }).selectOption({ label: "All Cities" });
    await expect(cards.nth(0)).toBeVisible();
    await expect(cards.nth(1)).toBeVisible();
    await expect(cards.nth(2)).toBeVisible();

    // Step 10
    const firstCardTitle = await cards.first().locator("h3").innerText()
    const secondCardTitle = await cards.nth(1).locator("h3").innerText()
    const lastCardTitle = await cards.last().locator("h3").innerText()

    expect(firstCardTitle.trim()).not.toBe("")
    expect(secondCardTitle.trim()).not.toBe("")
    expect(lastCardTitle.trim()).not.toBe("")
    expect(firstCardTitle).not.toBe(lastCardTitle);



});
