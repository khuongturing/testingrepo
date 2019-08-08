import stripe
from django.conf import settings
from stripe import error

stripe.api_key = settings.STRIPE_SECRET_KEY


def charge(source, amount, order, email):

    response = {'status': False, 'msg': 'Payment was not successful'}
    charge_ = None

    try:
        charge_ = stripe.Charge.create(
            amount=int(amount * 100),
            currency='usd',
            source=source,
            description='Order from {}'.format(email),
            metadata={'order_id': order.pk},
        )

    except error.StripeError as e:
        response['msg'] = e.json_body.get('error', {}).get('message')

    except Exception as e:
        # Something else happened, completely unrelated to Stripe
        response['msg'] = 'Payment Failed'

    if charge_ is not None and charge_['status'] == 'succeeded':
        response['status'] = True
        response['msg'] = 'Payment Successful!'
        response['data'] = charge_

    return response
