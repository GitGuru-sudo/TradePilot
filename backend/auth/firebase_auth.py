import firebase_admin
from firebase_admin import credentials, auth
from config.settings import settings
from utils.logger import logger
import os
import json
import re


def _strip_wrapping_quotes(value: str) -> str:
    cleaned = value.strip()
    if (cleaned.startswith("'") and cleaned.endswith("'")) or (cleaned.startswith('"') and cleaned.endswith('"')):
        return cleaned[1:-1]
    return cleaned


def _load_service_account_info(raw_value: str) -> dict | None:
    config_str = _strip_wrapping_quotes(raw_value)
    if not config_str.startswith("{"):
        return None

    try:
        return json.loads(config_str)
    except json.JSONDecodeError:
        # Some `.env` loaders preserve malformed escape sequences from PEM blocks.
        normalized = re.sub(r'\\(?!["\\/bfnrtu])', r'\\n', config_str)
        return json.loads(normalized)

def initialize_firebase():
    try:
        if not firebase_admin._apps:
            service_account_info = _load_service_account_info(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
            if service_account_info is not None:
                cred = credentials.Certificate(service_account_info)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase Admin SDK initialized successfully from JSON string.")
                return

            credential_path = _strip_wrapping_quotes(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
            if not os.path.exists(credential_path):
                logger.warning("Firebase credentials file was not found; authenticated routes will reject requests.")
                return

            cred = credentials.Certificate(credential_path)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully from file path.")
    except Exception as e:
        logger.error(f"Error initializing Firebase Admin SDK: {e}")

def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying Firebase token: {e}")
        return None

initialize_firebase()
