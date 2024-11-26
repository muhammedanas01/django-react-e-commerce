from django.contrib import admin

from store.models import Product, Category, Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem

#Instead of navigating to a separate admin page for Gallery, you’ll have an inline section within the Product admin page where you can manage the Gallery images
class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1 #number of additional empty forms displayed in the admin interface 

class Specification_Inline(admin.TabularInline):
    model = Specification
    extra = 1 #number of additional empty forms displayed in the admin interface 

class Size_Inline(admin.TabularInline):
    model = Size
    extra = 1 #number of additional empty forms displayed in the admin interface 

class Color_Inline(admin.TabularInline):
    model = Color
    extra = 1 #number of additional empty forms displayed in the admin interface 


class ProductAdmin(admin.ModelAdmin):
    list_display = ['category','title', 'price', 'shipping_amount', 'stock_quantity', 'in_stock', 'vendor', 'featured']
    list_editable = ['featured', ]
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, Specification_Inline, Size_Inline, Color_Inline]# configuring gallery for each products to manage,edit,add or remove gallery of that product.
    
admin.site.register(Product, ProductAdmin)
admin.site.register(Category)


from django.contrib import admin
from .models import Cart

class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'item_quantity', 'price', 'sub_total', 'total', 'date']
    search_fields = ['Product', 'cart_id']
    list_filter = ['date', 'product']
    ordering = ['-date']

admin.site.register(Cart, CartAdmin)


class CartOrderItemInline(admin.TabularInline): 
    model = CartOrderItem 
    extra = 1 #number of additional empty forms displayed in the admin interface 

class CartOrderAdmin(admin.ModelAdmin):
    list_display = ['buyer', 'country','mobile','total']
    list_filter = ['date']
    search_fields = ['country']
    inlines = [CartOrderItemInline]
    
admin.site.register(CartOrderItem)
admin.site.register(CartOrder, CartOrderAdmin)




