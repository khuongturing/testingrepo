from django.db import connections

from apps.users.models import Customer


def user_or_customer(user):
    """
    :param user:
    :return: tuple (True, customer) if user is a customer
    otherwise tuple (False, user)
    """
    try:
        customer = user.customer
        return True, customer
    except Customer.DoesNotExist:
        return False, user


def execute_raw_sql(sql, db='default', params=None):
    with connections[db].cursor() as cursor:
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        if rows:
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in rows]

    return []
