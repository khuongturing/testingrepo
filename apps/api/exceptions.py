from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)

    if response is not None:

        if isinstance(exc.detail, dict):
            details = []
            for field, errors in exc.get_full_details().items():
                if isinstance(errors, dict):
                    errors = [errors]
                for error in errors:
                    details.append({
                        'status': response.status_code, 'code': error['code'], 'message': error['message'],
                        'field': field
                    })
        else:
            details = [exc.get_full_details()]
            details[0]['status'] = response.status_code

        response.data = {'error': details}

    return response
