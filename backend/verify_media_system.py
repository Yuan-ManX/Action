#!/usr/bin/env python3
"""
Media System Verification - Verify code structure and basic functionality
without requiring external dependencies
"""

import sys
import os
import ast
from pathlib import Path


def verify_file_structure():
    """Verify that all required files exist"""
    print("=== Verifying File Structure ===")
    
    required_files = [
        "backend/app/core/media.py",
        "backend/app/api/media.py",
        "backend/app/core/config.py",
        "backend/app/api/v1.py",
        "backend/requirements.txt",
        "backend/examples/media_usage_example.py"
    ]
    
    base_path = Path("/Users/yuanman/Desktop/Dreamix")
    
    all_exist = True
    for file_path in required_files:
        full_path = base_path / file_path
        if full_path.exists():
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} - MISSING")
            all_exist = False
    
    storage_dir = base_path / "backend/storage/media"
    if storage_dir.exists():
        print(f"✓ backend/storage/media")
    else:
        print(f"✗ backend/storage/media - MISSING")
        all_exist = False
    
    return all_exist


def check_syntax(file_path):
    """Check Python syntax of a file"""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        ast.parse(content)
        return True
    except SyntaxError as e:
        print(f"  Syntax error in {file_path}: {e}")
        return False
    except Exception as e:
        print(f"  Error reading {file_path}: {e}")
        return False


def verify_code_syntax():
    """Verify syntax of all created Python files"""
    print("\n=== Verifying Code Syntax ===")
    
    files_to_check = [
        "/Users/yuanman/Desktop/Dreamix/backend/app/core/media.py",
        "/Users/yuanman/Desktop/Dreamix/backend/app/api/media.py",
        "/Users/yuanman/Desktop/Dreamix/backend/examples/media_usage_example.py"
    ]
    
    all_valid = True
    for file_path in files_to_check:
        if check_syntax(file_path):
            print(f"✓ {os.path.basename(file_path)} - Syntax OK")
        else:
            print(f"✗ {os.path.basename(file_path)} - Invalid syntax")
            all_valid = False
    
    return all_valid


def verify_requirements():
    """Verify required dependencies are listed"""
    print("\n=== Verifying Requirements ===")
    
    req_path = "/Users/yuanman/Desktop/Dreamix/backend/requirements.txt"
    required_deps = ["moviepy", "Pillow", "ffmpeg-python", "aiofiles"]
    
    try:
        with open(req_path, 'r') as f:
            content = f.read()
        
        all_found = True
        for dep in required_deps:
            if dep.lower() in content.lower():
                print(f"✓ {dep}")
            else:
                print(f"✗ {dep} - NOT FOUND")
                all_found = False
        
        return all_found
    except Exception as e:
        print(f"Error checking requirements: {e}")
        return False


def verify_api_routes():
    """Verify media routes are registered in v1.py"""
    print("\n=== Verifying API Routes ===")
    
    v1_path = "/Users/yuanman/Desktop/Dreamix/backend/app/api/v1.py"
    try:
        with open(v1_path, 'r') as f:
            content = f.read()
        
        checks = [
            ("media_router import", "from app.api.media import router as media_router"),
            ("media_router included", "api_router.include_router(media_router")
        ]
        
        all_ok = True
        for desc, check_str in checks:
            if check_str in content:
                print(f"✓ {desc}")
            else:
                print(f"✗ {desc}")
                all_ok = False
        
        return all_ok
    except Exception as e:
        print(f"Error checking API routes: {e}")
        return False


def verify_config():
    """Verify config has media settings"""
    print("\n=== Verifying Configuration ===")
    
    config_path = "/Users/yuanman/Desktop/Dreamix/backend/app/core/config.py"
    try:
        with open(config_path, 'r') as f:
            content = f.read()
        
        settings = ["MEDIA_STORAGE_PATH", "MEDIA_MAX_FILE_SIZE", "MEDIA_ALLOWED_TYPES"]
        
        all_ok = True
        for setting in settings:
            if setting in content:
                print(f"✓ {setting}")
            else:
                print(f"✗ {setting}")
                all_ok = False
        
        return all_ok
    except Exception as e:
        print(f"Error checking config: {e}")
        return False


def main():
    print("="*60)
    print("Dreamix Media System - Verification")
    print("="*60)
    
    results = []
    results.append(verify_file_structure())
    results.append(verify_code_syntax())
    results.append(verify_requirements())
    results.append(verify_api_routes())
    results.append(verify_config())
    
    print("\n" + "="*60)
    if all(results):
        print("✅ All verifications passed!")
        print("\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Install FFmpeg (required for video processing)")
        print("3. Run the example: python examples/media_usage_example.py")
        print("4. Start the server: python -m app.main")
    else:
        print("❌ Some verifications failed!")
    print("="*60)
    
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main())
