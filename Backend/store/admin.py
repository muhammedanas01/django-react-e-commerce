from django.contrib import admin

from store.models import Product, Category, Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Wishlist, ProductFaq, Review, Notification, Coupon, Tax

#Instead of navigating to a separate admin page for Gallery, you’ll have an inline section within the Product admin page where you can manage the Gallery images
class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1 #number of additional empty forms displayed in the admin interface 

class Specification_Inline(admin.TabularInline):
    model = Specification
    extra = 1 

class Size_Inline(admin.TabularInline):
    model = Size
    extra = 1 

class Color_Inline(admin.TabularInline):
    model = Color
    extra = 1 

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title','category','price', 'shipping_amount', 'stock_quantity', 'in_stock', 'vendor', 'featured']
    list_editable = ['featured']
    list_filter = ['date']
    search_fields = ['title']
    #configuring inline tabular
    inlines = [GalleryInline, Specification_Inline, Size_Inline, Color_Inline]# configuring gallery for each products to manage,edit,add or remove gallery of that product.
    
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'cart_id', 'product', 'item_quantity', 'total']
    search_fields = ['Product', 'cart_id']
    list_filter = ['date', 'product']
    ordering = ['-date']

class CartOrderItemInline(admin.TabularInline): 
    model = CartOrderItem 
    extra = 1 #number of additional empty forms displayed in the admin interface 

class CartOrderAdmin(admin.ModelAdmin):
    list_display = ['buyer', 'country', 'payment_status', 'total', 'order_id']
    list_filter = ['date']
    search_fields = ['country']
    inlines = [CartOrderItemInline]
    
class WishlistAdmin(admin.ModelAdmin):
     list_display = ['user', 'product','date']
     search_fields = ['product']

class ProductFaqAdmin(admin.ModelAdmin):
     list_display = ['user', 'product','email', 'date', 'active']
     search_fields = ['product']
     list_filter = ['date']

class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'rating', 'active', 'date']

class CouponAdmin(admin.ModelAdmin):
     list_display = ['vendor','code', 'discount', 'date']
     search_fields = ['vendor']
     list_filter = ['date']

class NotificationAdmin(admin.ModelAdmin):
     list_display = ['user', 'vendor','order', 'order_item', 'date']
     search_fields = ['vendor']
     list_filter = ['date']

admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
admin.site.register(Cart, CartAdmin)
admin.site.register(CartOrder, CartOrderAdmin)
admin.site.register(CartOrderItem)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Coupon, CouponAdmin)
admin.site.register(Review, ReviewAdmin)
admin.site.register(ProductFaq, ProductFaqAdmin)
admin.site.register(Wishlist, WishlistAdmin)

##
admin.site.register(Tax)




