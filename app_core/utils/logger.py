import logging

app_logger = logging.getLogger("app_core")
audit_logger = logging.getLogger("audit")


def log_info(message, **kwargs):
    app_logger.info(message, extra=kwargs)


def log_error(message, **kwargs):
    app_logger.error(message, extra=kwargs)


def log_debug(message, **kwargs):
    app_logger.debug(message, extra=kwargs)

def log_warning(message, **kwargs):
    app_logger.warning(message, extra=kwargs)

def log_audit(message, **kwargs):
    audit_logger.info(message, extra=kwargs)

