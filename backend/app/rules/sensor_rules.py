"""
Automated Sensor Threshold Rule Engine (No AI).
Evaluates incoming IoT sensor readings against defined warning & critical thresholds.
"""

from typing import Dict, Any, Tuple

def evaluate_sensor_threshold(
    sensor_type: str,
    location_name: str,
    current_value: float,
    unit: str,
    warning_threshold: float,
    critical_threshold: float
) -> Tuple[str, bool, bool, str]:
    """
    Returns: (new_status, is_warning_crossed, is_critical_crossed, alert_message)
    """
    if current_value >= critical_threshold:
        msg = f"CRITICAL THRESHOLD EXCEEDED on {sensor_type} ({location_name}): {current_value} {unit} (Critical Threshold: {critical_threshold} {unit})"
        return "CRITICAL", False, True, msg
    elif current_value >= warning_threshold:
        msg = f"WARNING THRESHOLD EXCEEDED on {sensor_type} ({location_name}): {current_value} {unit} (Warning Threshold: {warning_threshold} {unit})"
        return "WARNING", True, False, msg
    else:
        msg = f"{sensor_type} ({location_name}) value normal: {current_value} {unit}"
        return "NORMAL", False, False, msg
