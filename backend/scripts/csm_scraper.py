import time
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from colorama import Fore, Style
from seed_db import seed_companies

def safe_get(driver, element_id):
    try:
        el = driver.find_element(By.ID, element_id)
        return el.text.strip()
    except Exception:
        return None

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
        MAX_COMPANIES = 10

        while len(companies) < MAX_COMPANIES:
            # wait for employer cards
            wait.until(
                EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')
                )
            )

            cards = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')
            links = [(c.get_attribute("aria-label"), c.get_attribute("href")) for c in cards]
            for name, link in links:
                try:
                    if name and link and link not in seen:
                        seen.add(link)
                        driver.get(link)
                        time.sleep(2)
                    
                                
                        overview = safe_get(driver, "overview-who-we-are")
                        details_text = safe_get(driver, "sidebar-additional-details-title")
                        industry = details_text.split( "Industry\n")[-1].split("\n")[0].strip() if details_text and "Industry" in details_text else None
                        loc_text = safe_get(driver, "sidebar-location-title")
                        headquarters_location = loc_text.replace("Location\n", "").strip() if loc_text else None
                        driver.back()
                        time.sleep(2)

                        companies.append((name, link, overview, industry, headquarters_location))

                        print(f"{len(companies)}. {name} → {link}")
                        print(f"   overview: {overview}")
                        print(f"   industry: {industry}")
                        print(f"   location: {headquarters_location}")

                    if len(companies) >= MAX_COMPANIES:
                        break
                        
                except Exception as e: 
                       print(Fore.RED + f"Error on {name}: {e}" + Style.RESET_ALL)

            if len(companies) >= MAX_COMPANIES:
                break

            try:
                next_buttons = driver.find_elements(By.XPATH, "//button[.//span[text()='Next']]")
                if not next_buttons:
                    print("No more pages.")
                    break
                driver.execute_script("arguments[0].click();", next_buttons[0])
                time.sleep(2)

            except Exception:
                print("No more pages or failed to click next.")
                break

        print(Fore.GREEN + f"\nScraped {len(companies)} companies." + Style.RESET_ALL)
        seed_companies(companies)



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