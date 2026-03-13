import argparse


def trading_symbol(value: str) -> str:
    normalized = value.strip().upper()
    if not normalized.isalnum():
        raise argparse.ArgumentTypeError("symbol must contain only letters and numbers")
    if len(normalized) < 6:
        raise argparse.ArgumentTypeError("symbol must be at least 6 characters long")
    return normalized


def positive_float(value: str) -> float:
    try:
        numeric = float(value)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("value must be a number") from exc

    if numeric <= 0:
        raise argparse.ArgumentTypeError("value must be greater than 0")
    return numeric
