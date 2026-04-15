from middleware.request_context import get_request_id

class RequestIDFilter:
    def filter(self, record):
        record.request_id = get_request_id()
        return True