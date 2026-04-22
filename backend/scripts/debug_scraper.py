"""
Debug script to inspect the HTML structure of a single employer page.
Usage: python debug_scraper.py

1. Log in when the browser opens
2. Click on any employer from the employers list
3. The script will detect you're on an employer page and print the structure
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from colorama import Fore, Style


def dump_element(driver, element_id):
    print(f"\n--- Element ID: {element_id!r} ---")
    try:
        el = driver.find_element(By.ID, element_id)
        print(f"  .text (first 400 chars):\n    {el.text[:400]!r}")
        children = el.find_elements(By.XPATH, "./*")
        print(f"  Direct children ({len(children)}):")
        for child in children[:10]:
            print(f"    <{child.tag_name} class={child.get_attribute('class')!r}> "
                  f"{child.text[:100].replace(chr(10), '\\n')!r}")
        paras = el.find_elements(By.TAG_NAME, "p")
        print(f"  <p> children ({len(paras)}):")
        for p in paras[:5]:
            print(f"    {p.text[:200]!r}")
    except Exception as e:
        print(f"  NOT FOUND: {e}")


def dump_dts(driver):
    print("\n--- All <dt>/<dd> pairs on page ---")
    try:
        dts = driver.find_elements(By.TAG_NAME, "dt")
        if not dts:
            print("  None found")
        for dt in dts[:20]:
            try:
                dd = dt.find_element(By.XPATH, "following-sibling::dd[1]")
                print(f"  {dt.text.strip()!r}  →  {dd.text.strip()[:100]!r}")
            except Exception:
                print(f"  {dt.text.strip()!r}  →  (no dd sibling)")
    except Exception as e:
        print(f"  Error: {e}")


def main():
    options = webdriver.ChromeOptions()
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    driver.get("https://northeastern-csm.symplicity.com/students/index.php?signin_tab=0")

    print(Fore.YELLOW + "Step 1: Log in to the CSM portal." + Style.RESET_ALL)

    # Wait for login
    wait = WebDriverWait(driver, 300)
    wait.until(EC.url_contains("/students/app/"))
    print(Fore.GREEN + "Login detected! Now navigate to any employer page." + Style.RESET_ALL)

    # Wait until the user navigates to a specific employer page
    print(Fore.YELLOW + "Waiting for you to click on an employer... (timeout: 5 min)" + Style.RESET_ALL)
    wait.until(EC.url_matches(r".*/students/app/employers/[^/]+/.*"))
    time.sleep(2)  # let the page finish rendering

    print(Fore.GREEN + f"\nEmployer page detected: {driver.current_url}" + Style.RESET_ALL)
    print("\n=== Dumping key element IDs ===")
    dump_element(driver, "overview-who-we-are")
    dump_element(driver, "sidebar-additional-details-title")
    dump_element(driver, "sidebar-location-title")
    dump_element(driver, "sidebar-links-title")
    dump_dts(driver)

    print("\n=== External links on page ===")
    try:
        anchors = driver.find_elements(By.TAG_NAME, "a")
        count = 0
        for a in anchors:
            href = a.get_attribute("href") or ""
            if href.startswith("http") and "symplicity.com" not in href:
                print(f"  {a.text.strip()!r}  →  {href}")
                count += 1
                if count >= 10:
                    break
        if count == 0:
            print("  None found")
    except Exception as e:
        print(f"  Error: {e}")

    print("\n=== First 10 <img> tags ===")
    try:
        imgs = driver.find_elements(By.TAG_NAME, "img")
        for img in imgs[:10]:
            print(f"  src={img.get_attribute('src') or ''!r}  "
                  f"alt={img.get_attribute('alt') or ''!r}  "
                  f"class={img.get_attribute('class') or ''!r}")
    except Exception as e:
        print(f"  Error: {e}")

    print(Fore.GREEN + "\n=== Done. Close the browser when finished. ===" + Style.RESET_ALL)
    time.sleep(60)  # keep browser open so you can inspect
    driver.quit()


if __name__ == "__main__":
    main()
