from django.urls import path, include
from rest_auth import views as auth_views

from .views import (CustomerViewSet, CustomerAddressView, CustomerCreditCardView, DepartmentViewSet,
                    CategoryViewSet, ProductCategoryViewSet, DepartmentCategoriesViewSet, AttributeViewSet,
                    AttributeValueViewSet, ProductAttributesViewSet, ShippingRegionViewSet, RegionShippingViewSet,
                    TaxViewSet, CartIDView, CartItemViewSet, CartViewSet, OrderViewSet, CustomerOrderViewSet,
                    ShortOrderViewSet, ProductListViewSet, ProductViewSet, ReviewViewSet, StripePaymentView)

app_name = 'api'

customer_urls = [
    path('login/', auth_views.LoginView.as_view(), name='customers-login'),
    path('logout/', auth_views.LogoutView.as_view(), name='customers-logout'),
    path('address/', CustomerAddressView.as_view({'put': 'update'}), name='customers-address'),
    path('creditCard/', CustomerCreditCardView.as_view({'put': 'update'}), name='customers-credit-card'),
    path('', CustomerViewSet.as_view({
        'post': 'create',
        'get': 'retrieve',
        'put': 'update',
    }), name='customers')
]

department_urls = [
    path('<int:pk>/', DepartmentViewSet.as_view({'get': 'retrieve'}), name='departments'),
    path('', DepartmentViewSet.as_view({'get': 'list'}), name='departments'),
]

category_urls = [
    path('inProduct/<int:pk>/', ProductCategoryViewSet.as_view({'get': 'retrieve'}), name='product-category'),
    path('inDepartment/<int:pk>/', DepartmentCategoriesViewSet.as_view({'get': 'list'}), name='department-categories'),
    path('<int:pk>/', CategoryViewSet.as_view({'get': 'retrieve'}), name='categories'),
    path('', CategoryViewSet.as_view({'get': 'list'}), name='categories'),
]

attribute_urls = [
    path('values/<int:pk>/', AttributeValueViewSet.as_view({'get': 'list'}), name='attribute-values'),
    path('inProduct/<int:pk>/', ProductAttributesViewSet.as_view({'get': 'list'}), name='product-attributes'),
    path('<int:pk>/', AttributeViewSet.as_view({'get': 'retrieve'}), name='attributes'),
    path('', AttributeViewSet.as_view({'get': 'list'}), name='attributes'),
]

shipping_urls = [
    path('regions/<int:pk>/', RegionShippingViewSet.as_view({'get': 'list'}), name='region-shippings'),
    path('regions/', ShippingRegionViewSet.as_view({'get': 'list'}), name='shipping-regions'),
]

tax_urls = [
    path('<int:pk>/', TaxViewSet.as_view({'get': 'retrieve'}), name='taxes'),
    path('', TaxViewSet.as_view({'get': 'list'}), name='taxes'),
]

cart_urls = [
    path('generateUniqueId/', CartIDView.as_view({'get': 'retrieve'}), name='cart-unique-id'),
    path('add/', CartItemViewSet.as_view({'post': 'create'}), name='cart-items'),
    path('update/<int:pk>/', CartItemViewSet.as_view({'put': 'update'}), name='cart-items'),
    path('removeProduct/<int:pk>/', CartItemViewSet.as_view({'delete': 'destroy'}), name='cart-items-remove'),
    path('<str:cart_id>/', CartViewSet.as_view({'get': 'list'}), name='cart'),
    path('empty/<str:cart_id>/', CartViewSet.as_view({'delete': 'destroy'}), name='cart-empty'),
]

order_urls = [
    path('inCustomer/', CustomerOrderViewSet.as_view({'get': 'list'}), name='customer-orders'),
    path('shortDetail/<int:pk>/', ShortOrderViewSet.as_view({'get': 'retrieve'}), name='short-order'),
    path('<int:pk>/', OrderViewSet.as_view({'get': 'retrieve'}), name='orders'),
    path('', OrderViewSet.as_view({'post': 'create'}), name='orders'),
]

product_urls = [
    path('<int:product_id>/reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='products-reviews'),
    path('<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='products'),
    path('inCategory/<int:category_id>/', ProductListViewSet.as_view({'get': 'list'}), name='category-products'),
    path('inDepartment/<int:department_id>/', ProductListViewSet.as_view({'get': 'list'}), name='department-products'),
    path('search/', ProductListViewSet.as_view({'get': 'list'}), name='search-products'),
    path('', ProductListViewSet.as_view({'get': 'list'}), name='products'),
]

stripe_urls = [
    path('charge/', StripePaymentView.as_view(), name='payment-stripe'),
]

urlpatterns = [
    path('customers/', include(customer_urls)),
    path('departments/', include(department_urls)),
    path('categories/', include(category_urls)),
    path('attributes/', include(attribute_urls)),
    path('shipping/', include(shipping_urls)),
    path('tax/', include(tax_urls)),
    path('shoppingcart/', include(cart_urls)),
    path('orders/', include(order_urls)),
    path('products/', include(product_urls)),
    path('stripe/', include(stripe_urls)),
]