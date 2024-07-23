@echo off
node .\Warch_scrape.js
python .\generate_data.py
python .\prediction.py
pause