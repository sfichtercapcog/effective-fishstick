import csv
import json
import os
from datetime import datetime

# Input and output file paths (use raw strings for Windows paths)
input_csv = r"C:\Users\sfichter\moving-central-texas\public\data\cleaned_combined_crashes.csv"
output_json = r"C:\Users\sfichter\moving-central-texas\public\data\crashes.json"

# Initialize data list
data = []
skipped = 0

# Ensure output directory exists
os.makedirs(os.path.dirname(output_json), exist_ok=True)

# Read CSV and process
try:
    with open(input_csv, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        # Validate headers
        required_headers = ['Latitude', 'Longitude', 'Rpt_City_ID', 'Rpt_CRIS_Cnty_ID', 'Crash_Date']
        if not all(header in csv_reader.fieldnames for header in required_headers):
            missing = [h for h in required_headers if h not in csv_reader.fieldnames]
            raise ValueError(f"Missing required headers: {missing}")

        # Process rows
        for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 to account for header
            try:
                # Extract year from Crash_Date (MM/DD/YYYY)
                crash_date = row['Crash_Date']
                year = int(datetime.strptime(crash_date, '%m/%d/%Y').year)
                
                # Convert lat/lng to float
                lat = float(row['Latitude'])
                lng = float(row['Longitude'])
                
                # Skip invalid coordinates
                if lat == 0 or lng == 0:
                    print(f"Skipped row {row_num}: Zero coordinates (Latitude={row['Latitude']}, Longitude={row['Longitude']})")
                    skipped += 1
                    continue
                
                # Get city and county IDs (handle empty or null values)
                city_id = row['Rpt_City_ID'] if row['Rpt_City_ID'] else 'Unknown'
                county_id = row['Rpt_CRIS_Cnty_ID'] if row['Rpt_CRIS_Cnty_ID'] else 'Unknown'
                
                data.append({
                    "lat": lat,
                    "lng": lng,
                    "city_id": city_id,
                    "county_id": county_id,
                    "year": year
                })
            except ValueError as e:
                print(f"Skipped row {row_num}: Invalid data (Error: {e}, Row: {row})")
                skipped += 1
            except KeyError as e:
                print(f"Skipped row {row_num}: Missing column (Error: {e})")
                skipped += 1

    # Write to JSON
    with open(output_json, 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=2)

    print(f"✅ Converted {len(data)} points to JSON ({skipped} rows skipped)")
    print(f"Output saved to {output_json}")

except FileNotFoundError:
    print(f"❌ Error: Input file {input_csv} not found")
except ValueError as e:
    print(f"❌ Error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")