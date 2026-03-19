from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import json
import time

def scrape_ukrant_category(url, category):
    """
    Scrape headlines from a Ukrant category page.
    
    Args:
        url (str): The Ukrant category page URL
        category (str): Category name to assign to each headline
    
    Returns:
        list: List of headline dictionaries with title, url, and category
    """
    # Set up Selenium WebDriver and navigate
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)
    time.sleep(3)
    
    # Click "Load More" until all articles are loaded
    while True:
        try:
            load_more = WebDriverWait(driver, 5).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "td_ajax_load_more"))
            )
            driver.execute_script("arguments[0].scrollIntoView();", load_more)
            load_more.click()
            print(f"Clicked Load More... ({category})")
            time.sleep(2)
        except:
            print(f"No more pages. ({category})")
            break
    
    # Parse and extract headlines
    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()
    
    all_headlines = []
    for h3 in soup.find_all("h3", class_="entry-title"):
        a = h3.find("a")
        if a:
            all_headlines.append({
                "title": a.get_text(strip=True),
                "url": a.get("href", ""),
                "category": category
            })
    
    return all_headlines