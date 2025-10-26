#!/usr/bin/env python3
"""
Script to iterate over files in daily/ directory and
create a daily.json file with metadata about JPG files and their descriptions.
"""

import os
import json
from pathlib import Path
from collections import defaultdict

# Path to the directory containing the files
DATA_DIR = Path(__file__).parent / "daily"
OUTPUT_FILE = Path(__file__).parent / "daily.json"


def parse_filename(filename):
    """
    Extract the base timestamp from a filename.
    Examples:
        2022-10-25_05-06-01_UTC.jpg -> 2022-10-25_05-06-01_UTC
        2022-12-25_05-00-26_UTC_1.jpg -> 2022-12-25_05-00-26_UTC
    """
    # Remove file extension
    name = filename.rsplit('.', 1)[0]
    
    # Check if it ends with _N (for multiple images)
    if name.endswith('_1') or name.endswith('_2') or name.endswith('_3'):
        # Remove the _N suffix
        name = name.rsplit('_', 1)[0]
    
    return name


def group_files_by_timestamp():
    """
    Group all .jpg and .txt files by their timestamp prefix.
    Returns a dictionary where keys are timestamps and values are dicts
    containing 'jpg_files' and 'txt_file'.
    """
    grouped = defaultdict(lambda: {'jpg_files': [], 'txt_file': None})
    
    # Iterate through all files in the directory
    for file in DATA_DIR.iterdir():
        if not file.is_file():
            continue
        
        filename = file.name
        
        # Skip profile pics and other non-post files
        if 'profile_pic' in filename:
            continue
        
        # Process .jpg files
        if filename.endswith('.jpg'):
            timestamp = parse_filename(filename)
            grouped[timestamp]['jpg_files'].append(filename)
        
        # Process .txt files
        elif filename.endswith('.txt'):
            timestamp = parse_filename(filename)
            grouped[timestamp]['txt_file'] = filename
    
    return grouped


def read_description(txt_filename):
    """Read the description from a .txt file."""
    if txt_filename is None:
        return ""
    
    txt_path = DATA_DIR / txt_filename
    try:
        with open(txt_path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading {txt_filename}: {e}")
        return ""


def load_existing_json():
    """
    Load the existing daily.json file if it exists.
    Returns a dictionary keyed by timestamp (derived from files).
    """
    if not OUTPUT_FILE.exists():
        return {}
    
    try:
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Convert days list to dict keyed by timestamp
        existing = {}
        for day in data.get('days', []):
            # Extract timestamp from first file in the entry
            if day.get('files'):
                timestamp = parse_filename(day['files'][0])
                existing[timestamp] = day
            elif day.get('description'):
                # Entry with no files but has description - keep it with a unique key
                # We'll use description as fallback identifier
                existing[f"_no_files_{len(existing)}"] = day
        
        return existing
    except Exception as e:
        print(f"Error loading existing JSON: {e}")
        return {}


def create_daily_json():
    """
    Create the daily.json file with metadata about all days.
    Merges with existing data and deduplicates by timestamp.
    """
    # Load existing data
    existing_data = load_existing_json()
    
    # Parse new data from files
    grouped = group_files_by_timestamp()
    
    # Merge new data with existing
    for timestamp in grouped.keys():
        data = grouped[timestamp]
        
        # Sort jpg files to ensure consistent ordering
        jpg_files = sorted(data['jpg_files'])
        
        # Read description from txt file
        description = read_description(data['txt_file'])
        
        if timestamp in existing_data:
            # Merge with existing entry
            existing_files = set(existing_data[timestamp].get('files', []))
            new_files = set(jpg_files)
            
            # Combine and deduplicate files
            combined_files = sorted(existing_files | new_files)
            
            # Prefer non-empty description, otherwise keep existing
            if description:
                final_description = description
            else:
                final_description = existing_data[timestamp].get('description', '')
            
            existing_data[timestamp] = {
                'files': combined_files,
                'description': final_description
            }
        else:
            print(f"Added day: {timestamp[0:10]}")

            # Add new entry
            existing_data[timestamp] = {
                'files': jpg_files,
                'description': description
            }
    
    # Convert back to list, sorted by timestamp
    days = []
    for timestamp in sorted(existing_data.keys()):
        days.append(existing_data[timestamp])
    
    # Create the final JSON structure
    output_data = {
        'days': days
    }

    # Drop days with no files
    output_data['days'] = [day for day in output_data['days'] if day.get('files')]
    
    # Write to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=None, ensure_ascii=False)
    
    print(f"Created daily.json with {len(days)} days")
    return output_data


if __name__ == "__main__":
    create_daily_json()

