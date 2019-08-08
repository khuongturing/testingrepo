# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'tshirtshop',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'db',
        'PORT': '3306',
        'OPTIONS': {'charset': 'utf8mb4'},
    }
}

# setting this in options gives "Specified key was too long; max key length is 1000 bytes'" error on users
# initial migrations
# , 'init_command': 'SET default_storage_engine=MYISAM'
