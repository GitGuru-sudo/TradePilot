from supabase import create_client, Client
from config.settings import settings
from utils.logger import logger

def _get_supabase_key() -> str:
    if settings.SUPABASE_SERVICE_ROLE_KEY:
        return settings.SUPABASE_SERVICE_ROLE_KEY

    if settings.SUPABASE_KEY:
        logger.warning(
            "Using legacy SUPABASE_KEY for backend database access. "
            "If this is the anon key, Supabase RLS will block inserts. "
            "Set SUPABASE_SERVICE_ROLE_KEY in backend/.env for server-side writes."
        )
        return settings.SUPABASE_KEY

    raise RuntimeError(
        "Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY in backend/.env."
    )

def get_supabase_client() -> Client:
    try:
        url: str = settings.SUPABASE_URL
        key: str = _get_supabase_key()
        return create_client(url, key)
    except Exception as e:
        logger.error(f"Error initializing Supabase client: {e}")
        raise e

supabase = get_supabase_client()
