import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from colorama import Fore, Style

def main():
    print(Fore.GREEN + "Starting ChromeDriver..." + Style.RESET_ALL)

    options = webdriver.ChromeOptions()
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    url = "https://northeastern-csm.symplicity.com/students/index.php?signin_tab=0&signin_tab=0"
    print(f"Opening URL: {url}")
    driver.get(url)

    print(Fore.YELLOW + "Please log in manually." + Style.RESET_ALL)
    print("Waiting for login (timeout: 5 minutes)...")

    try:
        wait = WebDriverWait(driver, 300)

        # wait until the URL changes to the logged-in app area
        wait.until(
            EC.url_contains("/students/app/")
        )

        print(Fore.GREEN + "Login detected!" + Style.RESET_ALL)

        # go directly to employers page (more reliable than clicking)
        driver.get("https://northeastern-csm.symplicity.com/students/app/employers")

        wait = WebDriverWait(driver, 300)

        companies = []
        seen = set()
        MAX_COMPANIES = 100

        while len(companies) < MAX_COMPANIES:
            # wait for employer cards
            wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')
                )
            )

            cards = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')

            for card in cards:
                try:
                    name = card.get_attribute("aria-label")
                    link = card.get_attribute("href")

                    if name and link and link not in seen:
                        seen.add(link)
                        companies.append((name, link))

                        print(f"{len(companies)}. {name} → {link}")

                    if len(companies) >= MAX_COMPANIES:
                        break

                except Exception:
                    continue

            if len(companies) >= MAX_COMPANIES:
                break

            # click next page
            try:
                next_button = wait.until(
                    EC.element_to_be_clickable(
                        (By.XPATH, "//button[.//span[text()='Next']]")
                    )
                )

                # click via JS (safer for React)
                driver.execute_script("arguments[0].click();", next_button)

                # wait for page to refresh
                time.sleep(2)

            except Exception:
                print("No more pages or failed to click next.")
                break

        print(Fore.GREEN + f"\nScraped {len(companies)} companies." + Style.RESET_ALL)

        # keep browser open briefly
        time.sleep(5)

    except Exception as e:
        print(Fore.RED + f"Error: {type(e).__name__} - {e}" + Style.RESET_ALL)
        print(Fore.RED + f"Current URL: {driver.current_url}" + Style.RESET_ALL)
        sys.exit(1)

    finally:
        print("Closing browser.")
        driver.quit()

if __name__ == "__main__":
    main()