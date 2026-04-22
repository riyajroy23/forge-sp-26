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


# ── Extraction helpers ────────────────────────────────────────────────────────

def get_overview(driver):
    """
    The #overview-who-we-are element is just a heading anchor with 0 children.
    Walk up the DOM with JS until we find a sibling/ancestor container that
    holds the actual paragraph text.
    """
    script = """
    var heading = document.getElementById('overview-who-we-are');
    if (!heading) return null;

    // Walk up at most 6 levels looking for meaningful sibling content
    var node = heading;
    for (var depth = 0; depth < 6; depth++) {
        // Try next siblings at this level
        var sib = node.nextElementSibling;
        while (sib) {
            var t = sib.innerText.trim();
            if (t && t.toLowerCase() !== 'who we are') return t;
            sib = sib.nextElementSibling;
        }
        // Try <p> descendants of the current node's parent
        var parent = node.parentElement;
        if (!parent) break;
        var ps = parent.querySelectorAll('p');
        var ptexts = Array.from(ps).map(function(p){ return p.innerText.trim(); })
                         .filter(function(t){ return t && t.toLowerCase() !== 'who we are'; });
        if (ptexts.length) return ptexts.join(' ');
        node = parent;
    }
    return null;
    """
    try:
        result = driver.execute_script(script)
        if result and result.strip():
            return result.strip()
    except Exception:
        pass
    return None


def get_page_lines(driver):
    """Return the full rendered page text as a list of non-empty lines."""
    try:
        text = driver.execute_script("return document.body.innerText;")
        return [l.strip() for l in (text or "").split("\n") if l.strip()]
    except Exception:
        return []


def parse_field_after_label(lines, label, stop_labels=None):
    """
    Find `label` in the line list and return the next non-empty line as its
    value, stopping if we hit one of `stop_labels`.
    """
    stop_labels = stop_labels or set()
    for i, line in enumerate(lines):
        if line == label:
            if i + 1 < len(lines):
                val = lines[i + 1]
                if val not in stop_labels:
                    return val
    return None


SIDEBAR_STOPS = {
    "Who We Are", "Additional Details", "Industry", "Size", "Employer Size",
    "Location", "Links", "Website", "Overview", "People", "Interviews",
    "Jobs", "Events", "Back",
}

def get_industry(lines):
    return parse_field_after_label(lines, "Industry", SIDEBAR_STOPS)

def get_location(lines):
    return parse_field_after_label(lines, "Location", SIDEBAR_STOPS)

def get_website_url(driver, lines):
    """
    First try to find a line that looks like a URL after 'Links',
    then fall back to the first external <a href> on the page.
    """
    # Try parsing from body text
    for i, line in enumerate(lines):
        if line == "Links" and i + 1 < len(lines):
            candidate = lines[i + 1]
            if candidate.startswith("http"):
                return candidate

    # Fall back: first external anchor href
    try:
        anchors = driver.find_elements(By.TAG_NAME, "a")
        for a in anchors:
            href = a.get_attribute("href") or ""
            if (href.startswith("http")
                    and "symplicity.com" not in href
                    and "northeastern.edu" not in href):
                return href
    except Exception:
        pass
    return None


def get_logo_url(driver):
    """
    The company logo is the first S3-hosted image that is NOT the
    site logo (NUworks) and NOT the user avatar (class contains 'avatar').
    """
    try:
        imgs = driver.find_elements(By.TAG_NAME, "img")
        for img in imgs:
            src = img.get_attribute("src") or ""
            alt = img.get_attribute("alt") or ""
            cls = img.get_attribute("class") or ""
            if (src
                    and "s3.amazonaws.com" in src
                    and "avatar" not in cls
                    and "NUworks" not in alt
                    and "Home" not in alt
                    and "Powered" not in alt):
                return src
    except Exception:
        pass
    return None


# ── Active filter ─────────────────────────────────────────────────────────────

def apply_active_filter(driver, wait):
    """Click More Filters → Employer Status → Active and apply."""
    try:
        more_btn = wait.until(EC.element_to_be_clickable((By.XPATH,
            "//button[contains(.,'More Filters') or contains(.,'Filters')]"
        )))
        driver.execute_script("arguments[0].click();", more_btn)
        time.sleep(1.5)
        print("  Opened More Filters panel.")
    except Exception as e:
        print(Fore.YELLOW + f"  Warning: Could not open More Filters: {e}" + Style.RESET_ALL)
        return

    try:
        active = wait.until(EC.element_to_be_clickable((By.XPATH,
            "//label[normalize-space(text())='Active']"
            " | //input[@value='Active' or @value='active']"
            " | //*[contains(@id,'status')]//*[contains(text(),'Active')]"
        )))
        driver.execute_script("arguments[0].click();", active)
        time.sleep(1)
        print("  Selected 'Active' employer status.")
    except Exception as e:
        print(Fore.YELLOW + f"  Warning: Could not select Active status: {e}" + Style.RESET_ALL)

    try:
        apply = driver.find_element(By.XPATH,
            "//button[contains(text(),'Apply') or contains(text(),'Done')"
            " or contains(text(),'Search') or contains(text(),'Filter')]"
        )
        driver.execute_script("arguments[0].click();", apply)
        time.sleep(2)
        print("  Applied filter.")
    except Exception as e:
        print(Fore.YELLOW + f"  Warning: Could not click Apply: {e}" + Style.RESET_ALL)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(Fore.GREEN + "Starting ChromeDriver..." + Style.RESET_ALL)
    options = webdriver.ChromeOptions()
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    driver.get("https://northeastern-csm.symplicity.com/students/index.php?signin_tab=0")
    print(Fore.YELLOW + "Please log in manually. Waiting up to 5 minutes..." + Style.RESET_ALL)

    try:
        wait = WebDriverWait(driver, 300)
        wait.until(EC.url_contains("/students/app/"))
        print(Fore.GREEN + "Login detected!" + Style.RESET_ALL)

        driver.get("https://northeastern-csm.symplicity.com/students/app/employers")
        time.sleep(2)

        print("Applying 'Active' employer filter...")
        apply_active_filter(driver, wait)

        list_wait = WebDriverWait(driver, 30)
        companies = []
        seen = set()

        while True:
            list_wait.until(EC.presence_of_all_elements_located(
                (By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')
            ))

            cards = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/students/app/employers/"]')
            links = [(c.get_attribute("aria-label"), c.get_attribute("href")) for c in cards]

            for name, link in links:
                try:
                    if not name or not link or link in seen:
                        continue
                    seen.add(link)

                    driver.get(link)
                    time.sleep(2)

                    lines                 = get_page_lines(driver)
                    overview              = get_overview(driver)
                    industry              = get_industry(lines)
                    headquarters_location = get_location(lines)
                    logo_url              = get_logo_url(driver)
                    website_url           = get_website_url(driver, lines)
                    careers_page_url      = link

                    driver.back()
                    time.sleep(2)

                    companies.append((name, careers_page_url, overview, industry,
                                      headquarters_location, logo_url, website_url))

                    print(f"{len(companies)}. {name}")
                    print(f"   overview:  {(overview or '')[:80]}...")
                    print(f"   industry:  {industry}")
                    print(f"   location:  {headquarters_location}")
                    print(f"   logo_url:  {(logo_url or '')[:60]}...")
                    print(f"   website:   {website_url}")

                except Exception as e:
                    print(Fore.RED + f"Error on {name}: {e}" + Style.RESET_ALL)

            # Next page
            try:
                next_btns = driver.find_elements(By.XPATH, "//button[.//span[text()='Next']]")
                if not next_btns:
                    print("No more pages.")
                    break
                driver.execute_script("arguments[0].click();", next_btns[0])
                time.sleep(2)
            except Exception:
                print("No more pages or failed to click next.")
                break

        print(Fore.GREEN + f"\nScraped {len(companies)} companies." + Style.RESET_ALL)
        seed_companies(companies)
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
