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


def _normalize_private_key(private_key: str) -> str:
    normalized = _strip_wrapping_quotes(private_key)
    normalized = normalized.replace("\\r\\n", "\n").replace("\\n", "\n")
    normalized = normalized.replace("\r\n", "\n").strip()
    return normalized


def _normalize_service_account_info(service_account_info: dict) -> dict:
    normalized_info = dict(service_account_info)
    private_key = normalized_info.get("private_key")

    if isinstance(private_key, str):
        normalized_info["private_key"] = _normalize_private_key(private_key)

    return normalized_info


def _load_service_account_info(raw_value: str) -> dict | None:
    config_str = _strip_wrapping_quotes(raw_value)
    if not config_str.startswith("{"):
        return None

    try:
        return _normalize_service_account_info(json.loads(config_str))
    except json.JSONDecodeError:
        # Some `.env` loaders preserve malformed escape sequences from PEM blocks.
        normalized = re.sub(r'\\(?!["\\/bfnrtu])', r'\\n', config_str)
        return _normalize_service_account_info(json.loads(normalized))

def initialize_firebase() -> bool:
    try:
        if firebase_admin._apps:
            return True

        service_account_info = _load_service_account_info(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
        if service_account_info is not None:
            cred = credentials.Certificate(service_account_info)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully from JSON string.")
            return True

        credential_path = _strip_wrapping_quotes(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
        if not os.path.exists(credential_path):
            logger.warning("Firebase credentials file was not found; authenticated routes will reject requests.")
            return False

        cred = credentials.Certificate(credential_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully from file path.")
        return True
    except Exception as e:
        logger.error(
            "Error initializing Firebase Admin SDK: "
            f"{e}. If this is running on Render, confirm that "
            "FIREBASE_SERVICE_ACCOUNT_JSON contains valid JSON and that "
            "the private_key preserves newline characters."
        )
        return False

def verify_token(id_token: str):
    try:
        if not firebase_admin._apps and not initialize_firebase():
            logger.warning("Firebase Admin SDK is not initialized; token verification cannot proceed.")
            return None

        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying Firebase token: {e}")
        return None
