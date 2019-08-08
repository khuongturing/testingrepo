def set_authorization_header(client, token):
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
