from rest_framework import serializers

from store.models import  Product, Category ,Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Wishlist, ProductFaq, Review, Notification, Coupon
from vendor.models import Vendor

class CategorySerializers(serializers.ModelSerializer):
    #Specifies the model that should be serialized
    class Meta:
        model = Category
        fields = "__all__" #"__all__" means all fields in the Category model will be included.

class GallerySerializers(serializers.ModelSerializer):

    class Meta:
        model = Gallery
        fields = "__all__"

class SpecificationSerializers(serializers.ModelSerializer):

    class Meta:
        model = Specification
        fields = "__all__"

class SizeSerializers(serializers.ModelSerializer):

    class Meta:
        model = Size
        fields = "__all__"

class ColorSerializers(serializers.ModelSerializer):

    class Meta:
        model = Color
        fields = "__all__"

class ProductSerializers(serializers.ModelSerializer):
#Color,Size,Specification,Gallery,Category are inline to product model so we need append all this model in productserializer when sending the data back to frontend.
    gallery = GallerySerializers(many=True, read_only=True)
    specification = SpecificationSerializers(many=True, read_only=True)
    size = SizeSerializers(many=True, read_only=True)
    color = ColorSerializers(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'product_id',
            'title',
            'image',
            'description',
            'category',
            'price',
            'old_price',
            'shipping_amount',
            'stock_quantity',
            'in_stock',
            'status',
            'featured',
            'views',
            'rating',
            'vendor',            
            'slug',
            'date',
            # these are class methods in Product model to get gallery,size,sprecification and color that particular product
            # NOTE: method name and this must be same eg: def gallery so here also should speacify same name gallery.
            'gallery',
            'specification',
            'size',
            'color',
            #class methods in Product Model fot rating and rating count
            'product_rating',
            'rating_count',
                   
        ]
    #sets up the object with any initial state or values
    def __init__(self, *args, **kwargs):
        super(ProductSerializers, self).__init__(*args, **kwargs)
    # if we wanna get any info related to foreinkey that is linked in model then use depth
        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0 # Only the primary fields of the Product model will be serialized
        else:
            self.Meta.depth = 3 # serializer will include related objects up to 3 levels deep.
        

class CartSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Cart
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CartOrderSerializers(serializers.ModelSerializer):
    
    class Meta:
        model = CartOrder
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class CartOrderItemSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = CartOrderItem
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CartOrderItemSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


class ProductFaqSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = ProductFaq
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ProductFaqSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class VendorSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Vendor
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(VendorSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3



class ReviewSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Review
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(ReviewSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

        
class WishlistSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Wishlist
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(WishlistSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3

class NotificationSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Notification
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(NotificationSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
  
    
class CouponSerializers(serializers.ModelSerializer):
   
    class Meta:
        model = Coupon
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super(CouponSerializers, self).__init__() 

        request = self.context.get("request")
        if request and request.method == "POST":
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
  