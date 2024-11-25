from django.contrib import admin

from store.models import Product, Category, Gallery, Specification, Size, Color

#Instead of navigating to a separate admin page for Gallery, you’ll have an inline section within the Product admin page where you can manage the Gallery images
class GalleryInline(admin.TabularInline):
    model = Gallery

class Specification_Inline(admin.TabularInline):
    model = Specification

class Size_Inline(admin.TabularInline):
    model = Size

class Color_Inline(admin.TabularInline):
    model = Color

class ProductAdmin(admin.ModelAdmin):
    list_display = ['category','title', 'price', 'shipping_amount', 'stock_quantity', 'in_stock', 'vendor', 'featured']
    list_editable = ['featured', ]
    list_filter = ['date']
    search_fields = ['title']
    inlines = [GalleryInline, Specification_Inline, Size_Inline, Color_Inline]# configuring gallery for each products to manage,edit,add or remove gallery of that product.
    
    


admin.site.register(Product, ProductAdmin)
admin.site.register(Category)
# Register your models here.
