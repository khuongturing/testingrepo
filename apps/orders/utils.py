from random import choice
from string import digits, ascii_lowercase, ascii_uppercase

from apps.orders.models import ShoppingCart, SHOPPING_CART_ID_LENGTH


def generate_cart_id():
    length = SHOPPING_CART_ID_LENGTH
    chars = digits + ascii_lowercase + ascii_uppercase

    def generate():
        return ''.join([choice(chars) for i in range(length)])

    id_ = generate()
    while ShoppingCart.objects.filter(cart_id=id_).first():
        id_ = generate()

    return id_
